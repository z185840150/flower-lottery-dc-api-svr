const [bodyParser, cookieParser, cors, express, fs, path, RateLimit, RedisStore] = [
  require('body-parser'),
  require('cookie-parser'),
  require('cors'),
  require('express'),
  require('fs'),
  require('path'),
  require('express-rate-limit'),
  require('rate-limit-redis')
]
const [logger, redis] = [
  require('./common/logger'),
  require('./model/redis')
]

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, x-access-token, Cross-Origin')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('X-Powered-By', '1.0.0.1')
  next()
})

app.use(new RateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: __conf.server.rate.base.windowMs,
  delayAfter: __conf.server.rate.base.delayAfter,
  delayMs: __conf.server.rate.base.delayMs,
  max: __conf.server.rate.base.max,
  message: '429',
  onLimitReached: (req, res, options) => {
    logger.warn(`ip ${req.ip} client access the ${req.route.path} interface in a short time`)
  }
}))

fs.readdirSync(path.join(__dirname, './router')).forEach(file => {
  if (['.DS_Store', '.git', '.svn', '.hg'].indexOf(file) === -1 &&
    path.extname(file).toString().toLocaleLowerCase() === '.js') {
    let route = require('./router/' + file)
    // route.router.prepareSocketIO && app.ioReady.push(route.router.prepareSocketIO)
    app.use(`/api/${route.path}`, route.router)
  }
})

app.use((req, res, next) => {
  let err = new Error('404 Not Found')
  res.status = 404
  next(err)
})

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)

  console.log(err)
  res.end('error')
})

module.exports = app
