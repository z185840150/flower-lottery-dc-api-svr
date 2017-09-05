const [mongoose] = [
  require('mongoose')
]

const [config, schemas] = [
  require('./../../../config/mongodb'),
  require('./../schema')
]

mongoose.model('user', schemas.user, `${config.pr}user`)

mongoose.model('server', schemas.server, `${config.pr}server`)

module.exports = {
  user: mongoose.model('user'),
  server: mongoose.model('server')
}
