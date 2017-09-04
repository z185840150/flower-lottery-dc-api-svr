const [express, validate] = [
  require('express'),
  require('express-validation')
]

const footballCtrl = require('./../controllers/football.controller')

let router = express.Router()

router.route('/teams')
.get(validate(footballCtrl.valid.teams.get), footballCtrl.methods.teams)

router.route('/team')
.get(validate(footballCtrl.valid.team.get), footballCtrl.methods.team)

module.exports = {
  path: 'sport',
  router
}
