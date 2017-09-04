const [auth, mongodb, redis, server] = [
  require('./auth'),
  require('./mongodb'),
  require('./redis'),
  require('./server')
]

module.exports = {
  auth,
  mongodb,
  redis,
  server
}
