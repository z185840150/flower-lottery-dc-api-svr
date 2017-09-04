const [mongoose, moment] = [
  require('mongoose'),
  require('moment')
]
const [config, logger] = [
  require('./../config'),
  require('./../lib/common/logger')
]

logger.info('connect to the mongodb...')

mongoose.Promise = global.Promise

mongoose.connect(config.mongodb.url, { useMongoClient: true })
.then(db => {
  logger.info('successful mongodb connection, register the mongoose module...')

  logger.info('the registered mongoose module is successful')
  logger.info('read the server configuration data...')

  const proxy = require('./../lib/proxy')

  proxy.server.getConfig()
  .then(doc => {
    if (doc) {
      const createdTime = moment(doc.createdAt).format('LLLL')
      Object.assign(global, {
        __conf: {
          server: doc
        }
      })
      logger.info(`read the server config successful, created at: ${createdTime}`)
      require('./../lib/server')
    } else {
      logger.error(new Error('server configuration data no found'))
      process.exit(1)
    }
  })
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })
})
.catch(e => {
  logger.error(`the mongodb connection failed. error: ${e}`)
  process.exit(1)
})
