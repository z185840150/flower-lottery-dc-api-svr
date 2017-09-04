const [Joi] = [
  require('joi')
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

  }
}
