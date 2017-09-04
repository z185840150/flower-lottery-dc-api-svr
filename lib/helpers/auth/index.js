const [moment] = [
  require('moment')
]

const [maker, redis] = [
  require('./../../helpers/responser/maker'),
  require('./../../model/redis')
]

module.exports = {
  required: {
    /**
     * user privileges are required
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     */
    user (req, res, next) {
      if (req.headers['x-access-token'] && req.headers['x-access-key']) {
        const [token, tokenKey] = [
          req.headers['x-access-token'],
          req.headers['x-access-key']
        ]
        const key = `tk-${tokenKey}`

        redis.get(key, (e, value) => {
          if (e) maker.error(res, next, e)
          else if (value) {
            value = JSON.parse(value)
            if (value.token === token && value.ext > moment().valueOf() && value.admin) {
              req.auth = {
                id: value._id,
                token,
                tokenKey
              }
            } else maker.unautho(res, next)
          } maker.unautho(res, next)
        })
      } else maker.unautho(res, next)
    },
    /**
     * administrator privileges are required
     *
     * @param {any} req
     * @param {any} res
     * @param {any} next
     */
    admin (req, res, next) {
      if (req.headers['x-access-token'] && req.headers['x-access-key']) {
        const [token, tokenKey] = [
          req.headers['x-access-token'],
          req.headers['x-access-key']
        ]
        const key = `tk-${tokenKey}`

        redis.get(key, (e, value) => {
          if (e) maker.error(res, next, e)
          else if (value) {
            value = JSON.parse(value)
            if (value.token === token && value.ext > moment().valueOf() && value.admin) {
              req.auth = {
                id: value._id,
                token,
                tokenKey
              }
            } else maker.unautho(res, next)
          } maker.unautho(res, next)
        })
      } else maker.unautho(res, next)
    }
  }
}
