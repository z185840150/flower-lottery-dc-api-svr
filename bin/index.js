const [cluster] = [require('cluster')]

Object.assign(global, { __dev: process.env.NODE_ENV.toLowerCase() === 'dev' })
global.console = __dev
  ? console
  : {
    info () {},
    log () {},
    warn () {},
    error () {},
    dir () {},
    time () {},
    timeEnd () {},
    trace () {},
    assert () {}
  }

cluster.isMaster ? require('./master') : require('./worker')

// sudo
// mongod --auth -f /data/mongodb/mongod.conf
// cd /data/redis
// redis-server redis.conf
