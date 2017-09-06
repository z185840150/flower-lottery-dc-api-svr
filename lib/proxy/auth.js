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

/**
 * 获取 管理员用户 Token
 *
 * @param {any} admin - 管理员用户对象
 * @param {string} password - 管理员用户密码
 * @param {any} [options={ life: 1, payload: {} }] - Token 选项
 * @param {number} options.life - Token 生命周期 小时 默认：1
 * @param {any} options.payload - Token 自定义Payload
 * @returns
 */
function getAdminToken (admin, password, options = { life: 1, payload: {} }) {
  return new Promise((resolve, reject) => {
    try {
      password =
        tools.crypto.base64(
          tools.crypto.sha1(
            tools.crypto.hMacSha1(password + admin.credentials.salt, admin.credentials.storedKey)))
      if (password === admin.credentials.serverKey) {
        let payload = Object.assign({
          iss: 'lottery.dc.api.v1.0',
          sub: admin.id,
          iat: moment().valueOf(),
          exp: moment().add(options.life, 'h').valueOf()
        }, options.payload)

        let token = jwt.sign(payload, config.auth.secret)

        let key = tools.crypto.base64(tools.crypto.sha1(token))
        let value = JSON.stringify(Object.assign(payload, { left: options.life }))

        redis.set(key, value, 'EX', options.life * 60 * 60, () => {
          resolve(token)
        })
      } else resolve()
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 根据 自定义查询条件 获取 管理员用户 Token
 *
 * @param {any} condition - 自定义查询条件
 * @param {string} password - 管理员密码
 * @param {any} [options={ life: 1, payload: {} }] - Token 选项
 * @param {number} options.life - Token 生命周期 小时 默认：1
 * @param {any} options.payload - Token 自定义Payload
 */
function getAdminTokenByCustom (condition, password, options = { life: 1, payload: {} }) {
  return new Promise((resolve, reject) => {
    user.getAdmin(condition)
    .then(admin => {
      getAdminToken(admin, password, options).then(token => {
        resolve(token)
      }).catch(err => {
        reject(err)
      })
    })
    .catch(err => { reject(err) })
  })
}
/**
 * 根据 管理员绑定邮箱 获取 管理员用户 Token
 *
 * @param {any} email - 管理员绑定邮箱
 * @param {string} password - 管理员密码
 * @param {any} [options={ life: 1, payload: {} }] - Token 选项
 * @param {number} options.life - Token 生命周期 小时 默认：1
 * @param {any} options.payload - Token 自定义Payload
 */
function getAdminTokenByEmail (email, password, options = { life: 1, payload: {} }) {
  return new Promise((resolve, reject) => {
    user.getUserByEmail(email)
    .then(admin => {
      getAdminToken(admin, password, options).then(token => {
        resolve(token)
      }).catch(err => {
        reject(err)
      })
    })
    .catch(err => { reject(err) })
  })
}
/**
 * 根据 管理员绑定手机号码 获取 管理员用户 Token
 *
 * @param {any} email - 管理员绑定邮箱
 * @param {string} password - 管理员密码
 * @param {any} [options={ life: 1, payload: {} }] - Token 选项
 * @param {number} options.life - Token 生命周期 小时 默认：1
 * @param {any} options.payload - Token 自定义Payload
 */
function getAdminTokenByMobile (mobile, password, options = { life: 1, payload: {} }) {
  return new Promise((resolve, reject) => {
    user.getUserByMobile(mobile)
    .then(admin => {
      getAdminToken(admin, password, options).then(token => {
        resolve(token)
      }).catch(err => {
        reject(err)
      })
    })
    .catch(err => { reject(err) })
  })
}
/**
 * 根据 管理员用户名 获取 管理员用户 Token
 *
 * @param {any} username - 管理员用户名
 * @param {string} password - 管理员密码
 * @param {any} [options={ life: 1, payload: {} }] - Token 选项
 * @param {number} options.life - Token 生命周期 小时 默认：1
 * @param {any} options.payload - Token 自定义Payload
 * @returns
 */
function getAdminTokenByUsername (username, password, options = { life: 1, payload: {} }) {
  return new Promise((resolve, reject) => {
    user.getUserByUsername(username)
    .then(admin => {
      getAdminToken(admin, password, options).then(token => {
        resolve(token)
      }).catch(err => {
        reject(err)
      })
    })
    .catch(err => { reject(err) })
  })
}
/**
 * 更新 管理员用户 Token 生命周期
 *
 * @param {string} key - 管理员用户 Token Key
 * @param {string} token - 管理员用户 Token
 */
function refreshAdminToken (key, token) {
  return new Promise((resolve, reject) => {
    redis.get(key, value => {
      if (value) {
        value = JSON.parse(value)
        if (value.exp - moment.valueOf() < value.life * 60 * 60 * 1000) {
          value.exp = moment().add(value.life, 'h').valueOf()
          redis.set(key, JSON.stringify(value), 'EX', value.life * 60 * 60, () => {
            callback()
          })
        } else callback()
      } else callback(new Error('NOFOUND'))
    })
  })
}

module.exports = {
  computeServerKey () {

  },
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
  },
  getAdminToken,
  getAdminTokenByCustom,
  getAdminTokenByEmail,
  getAdminTokenByMobile,
  getAdminTokenByUsername
}
