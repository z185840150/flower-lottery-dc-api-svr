const [jwt, moment] = [
  require('jsonwebtoken'),
  require('moment')
]
const [config, redis, tools] = [
  require('./../../config'),
  require('./../model/redis'),
  require('./../tools')
]

const user = require('./user')

module.exports = {
  getToken (user, password, { life = 1, payload = {} } = {}) {
    const _password = tools.crypto.base64(
      tools.crypto.sha1(tools.crypto.hMacSha1(
        password + user.credentials.salt, user.credentials.storedKey)))
    if (user && _password === user.credentials.serverKey) {
      const iss = 'flower.center.api.v1.0'
      const sub = user.id // (Subject)
      const iat = moment().valueOf()
      const exp = moment().add(life, 'h').valueOf()

      const _payload = Object.assign({ iss, sub, iat, exp }, payload)

      const token = jwt.sign(_payload, config.auth.secret)

      const _key = tools.crypto.base64(tools.crypto.sha1(token))
      const _value = JSON.stringify(Object.assign(_payload, { life }))

      redis.set(_key, _value, 'EX', life * 60 * 60, () => token)
    } else return null
  },
  getTokenByCondition (condition, password, { life = 1, payload = {} } = {}) {
    user.getUser(condition)
    .then(user => user
      ? this.getToken(user, password, { life, payload })
      : null)
    .catch(e => null)
  },
  getTokenByUsername (username, password, { life = 1, payload = {} } = {}) {
    user.getUserByUsername(username)
    .then(user => user
      ? this.getToken(user, password, { life, payload })
      : null)
    .catch(e => null)
  },
  getTokenByEmail (email, password, { life = 1, payload = {} } = {}) {
    user.getUserByEmail(email)
    .then(user => user
      ? this.getToken(user, password, { life, payload })
      : null)
    .catch(e => null)
  },
  getTokenByMobile (mobile, password, { life = 1, payload = {} } = {}) {
    user.getUserByMobile(mobile)
    .then(user => user
      ? this.getToken(user, password, { life, payload })
      : null)
    .catch(e => null)
  },
  /**
   * refresh the user token
   *
   * @param {string} tokenKey
   * @param {string} token
   * @param {function(e)} [callback=(e) => {}]
   */
  refreshToken (tokenKey, token, callback = (e = new Error('NOFOUND')) => {}) {
    redis.get(tokenKey, value => {
      if (value) {
        value = JSON.parse(value)
        if (value.exp - moment.valueOf() < value.life * 60 * 60 * 1000) {
          value.exp = moment().add(value.life, 'h').valueOf()
          redis.set(tokenKey, JSON.stringify(value), 'EX', value.life * 60 * 60, () => {
            callback()
          })
        } else callback()
      } else callback(new Error('NOFOUND'))
    })
  },
  /**
   *
   *
   * @param {any} tokenKey
   * @param {any} [callback=(e, result) => {}]
   */
  removeToken (tokenKey, callback = (e, result) => {}) {
    redis.del(tokenKey, callback)
  }
}
