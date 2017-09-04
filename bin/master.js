const [cluster, mongoose, os, redis] = [
  require('cluster'),
  require('mongoose'),
  require('os'),
  require('redis')
]
const [config, logger] = [
  require('./../config'),
  require('./../lib/common/logger')
]
const threads = Math.min(Math.max(1, config.server.maxThreads), os.cpus().length)

logger.info('sport api server will running...')
logger.info('mongdb connection test...')

mongoose.Promise = global.Promise

mongoose.connect(config.mongodb.url, { useMongoClient: true })
.then(db => {
  logger.info('mongdb connection test was successful')
  logger.info('redis connection test...')

  let client = redis.createClient(config.redis.port, config.redis.host)

  typeof config.redis.password === 'string' &&
  config.redis.password !== '' &&
  client.auth(config.redis.password, () => logger.info('redis authorization succeeds'))

  client.on('error', e => {
    switch (e.code) {
      case 'NOAUTH':
        logger.error(new Error('redis authorization failed'))
        process.exit(1)
      default:
        logger.error(new Error(`redis connection failed, error: ${e}`))
        process.exit(1)
    }
  })

  client.on('ready', () => {
    client.quit()
    logger.info(`redis connection test was successful`)
    logger.info(`creating a cluster's worker... (count: ${threads})`)
    createWorker()
  })
}).catch(e => {
  logger.error(new Error(`redis connection failed, error: ${e}`))
})

/**
 * create server worker thread.
 *
 */
function createWorker () {
  if (Object.keys(cluster.workers).length < threads) {
    let worker = cluster.fork()

    worker.on('online', function () {
      logger.info(`worker ${this.id} online`)
    })
    worker.on('listening', function (arg0) {
      logger.info(`worker ${this.id} is listening on ${arg0.address || 'localhost'}:${arg0.port}`)
    })
    worker.on('disconnect', function () {
      logger.warn(`worker ${this.id} disconnect`)
    })
    worker.on('exit', function (code, signal) {
      if (signal) logger.warn(`worker ${this.id} killed by ${signal}`)
      else if (code !== 0) logger.error(`worker ${this.id} exit, code: ${code}`)
      else logger.info(`worker ${this.id} exit`)
    })
    worker.on('message', function (msg) {
      if (msg.cmd) {
        switch (msg.cmd) {
          case 'serverIsRunning':
            logger.info(`worker ${this.id} was running`)
            createWorker()
            break
          default:
        }
      }
    })
  }
}
