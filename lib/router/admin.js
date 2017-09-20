const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  auth: require('./../controllers/auth.controller')
}

let router = express.Router()

router.route('/token').get(validate(ctrl.auth.valid.adminToken.get), ctrl.auth.adminToken, sender)
router.route('/token')
.post( // 请求 Token
  validate(ctrl.auth.valid.adminToken.post),
  ctrl.auth.adminToken)

module.exports = {
  path: 'admin',
  router
}
