const [cluster, log4js, path] = [
  require('cluster'),
  require('log4js'),
  require('path')]

log4js.configure(path.join(__dirname, `./../../config/log4js/log4js${__dev ? '.dev' : '.pro'}.json`))

module.exports = log4js.getLogger(cluster.isMaster ? '[MASTER]' : `[WORKER-${cluster.worker.id}]`)
