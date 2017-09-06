const [mongoose] = [
  require('mongoose')
]

const [config, schemas] = [
  require('./../../../config/mongodb'),
  require('./../schema')
]
mongoose.model('dcCrawlingRecord', schemas.dc_crawling_record, `${config.pr}dc_crawling_record`)
mongoose.model('dcFootballTeam', schemas.dc_football_team, `${config.pr}dc_football_team`)
mongoose.model('user', schemas.user, `${config.pr}user`)
mongoose.model('server', schemas.server, `${config.pr}server`)

module.exports = {
  dcCrawlingRecord: mongoose.model('dcCrawlingRecord'),
  dcFootballTeam: mongoose.model('dcFootballTeam'),
  user: mongoose.model('user'),
  server: mongoose.model('server')
}
