const [http] = [require('http')]
const [app, logger] = [require('./app'), require('./common/logger')]

Object.assign(global, { __sockets: {} })

app.set('port', __conf.server.port)

const server = http.createServer(app)

// app.ioReady.forEach(socket => { socket(server) })

// server.listen(app.get('port'))
server.listen(8089)

server.on('listening', () => {
  logger.info(`server is listening on port ${app.get('port')}`)
  process.send({cmd: 'serverIsRunning'})
})

server.on('error', err => {
  if (err.syscall !== 'listen') throw err

  let bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} port`

  switch (err.code) {
    case 'EACCES':
      logger.error(new Error(`${bind} requires elevated privileges`))
      process.exit(1)
    case 'EADDRINUSE':
      logger.error(new Error(`${bind} is already in use`))
      process.exit(1)
    default: throw err
  }
})
