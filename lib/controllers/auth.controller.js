const [Joi] = [
  require('joi')
]

const [captcha, maker] = [
  require('./../helpers/captcha'),
  require('./../helpers/responser/maker')
]
module.exports = {
  valid: {
    token: {
      post: {
        body: {
          username: Joi.string().required(),
          password: Joi.string().required()
        },
        params: {

        }
      },
      get: {

      }
    },
    adminToken: {
      get: {
        query: {
          limit: Joi.number().integer().min(1).max(100),
          page: Joi.number().integer().min(1)
        }
      },
      post: {
        body: {

        },
        params: {

        }
      }
    }
  },
  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   */
  token (req, res, next) {

  },
  /**
   * 获取 管理员 Token
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   */
  adminToken (req, res, next) {
    console.log(111)
    if (req.route.methods.get) {
      captcha().then((buffer, text) => {
        console.log('then')
        res.status(200).set({
          'Content-Type': 'image/png'
        })
        res.end(buffer)
      }).catch(e => {
        console.log(e)
      })
      // next()
    } else if (req.route.methods.post) {

    }
  }
}
