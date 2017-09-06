const [fs, http, path, request] = [
  require('fs'),
  require('http'),
  require('path'),
  require('request')
]

const [logger, mongo] = [
  require('./../../common/logger'),
  require('./../../model/mongo')
]

logger.info('正在加载 竞彩足球 数据爬虫...')

class FootBall {
  /**
   * Creates an instance of FootBall.
   * @param {any} [options={
   *     teams: {
   *       counts: 3000,
   *       threads: 10
   *     }
   *   }]
   * @memberof FootBall
   */
  constructor (options = {
    teams: {
      counts: 3000,
      threads: 10
    }
  }) {
    this.options = options
  }
  /**
   * 爬取 球队
   *
   * @memberof FootBall
   */
  crawlingTeams (onFinal) {
    logger.info('竞彩足球 俱乐部、球队 数据爬取中...')

    this.options.teams.started = new Date()
    this.options.teams.tids = []
    this.options.teams.errTids = []
    this.options.teams.progress = 0
    for (let i = 0; i < this.options.teams.threads; i++) {
      this.options.teams.tids.push(0)
      for (let i = 0; i < this.options.teams.tids.length; i++) {
        this.getTeams(i, onFinal)
      }
    }
  }
  /**
   * 爬取比赛
   *
   * @memberof FootBall
   */
  crawlingMatch () {

  }
  /**
   * 获取所有球队信息
   *
   * @param {any} i 线程索引
   * @memberof FootBall
   */
  getTeams (i, onFinal) {
    this.options.teams.tids[i] = this.options.teams.tids[i] + 1
    this.getTeam(this.options.teams.tids[i] + i * this.options.teams.counts, body => {
      this.options.teams.progress++
      if (typeof body === 'object' && body.result && body.result.club_name) {
        let newDoc = {
          team_id: body.result.team_id,
          type: body.result.type,
          club_name: body.result.club_name,
          club_abbr_name: body.result.club_abbr_name,
          team_pic_format: body.result.team_pic ? path.extname(body.result.team_pic) : '',
          team_city: body.result.team_city,
          team_founded: body.result.team_founded,
          competition_name: body.result.competition_name,
          competition_abbr_name: body.result.competition_abbr_name,
          rank: Number(body.result.rank),
          win: Number(body.result.win),
          draw: Number(body.result.draw),
          lose: Number(body.result.lose),
          coach: body.result.team_id
        }
        // 检测数据空中是否存在
        mongo.dcFootballTeam.findOne({ team_id: body.result.team_id }).then(doc => {
          if (doc) {
            doc.team_id = body.result.team_id
            doc.type = body.result.type
            doc.club_name = body.result.club_name
            doc.club_abbr_name = body.result.club_abbr_name
            doc.team_city = body.result.team_city
            doc.team_founded = body.result.team_founded
            doc.competition_name = body.result.competition_name
            doc.competition_abbr_name = body.result.competition_abbr_name
            doc.rank = Number(body.result.rank)
            doc.win = Number(body.result.win)
            doc.draw = Number(body.result.draw)
            doc.lose = Number(body.result.lose)
            doc.coach = body.result.coach

            doc.save()
          } else {
            mongo.dcFootballTeam.create(newDoc).then(doc => {
              //
            }).catch(e => {
              logger.error(new Error(e))
            })
          }
        })
        .catch(e => { logger.error(new Error(e)) })
        // 检测静态资源（图标）
        if (body.result.team_pic) {
          fs.exists(path.join(__dirname, `./../../../files/football/team_pic/${body.result.team_id}`), exists => {
            if (!exists) {
              // 获取球队图标
              try {
                http.get(body.result.team_pic, res => {
                  let imgData = ''

                  res.setEncoding('binary')
                  res.on('data', chunk => { imgData += chunk })
                  res.on('end', () => {
                    fs.writeFile(path.join(__dirname, `./../../../files/football/team_pic/${body.result.team_id}`), imgData, 'binary', err => {
                      if (err) logger.error(new Error(err))
                    })
                  })
                })
              } catch (e) {
                logger.error(new Error(e))
              }
            }
          })
        }
      }
      this.options.teams.tids[i] < this.options.teams.counts && this.getTeams(i, onFinal)

      if (this.options.teams.progress === this.options.teams.counts * this.options.teams.threads) {
        onFinal && onFinal(
          this.options.teams.progress - this.options.teams.errTids.length,
          this.options.teams.errTids.length,
          this.options.teams.progress,
          this.options.teams.started,
          new Date())
        logger.info(`爬取完毕,共爬取 ${this.options.teams.progress} 个，成功 ${this.options.teams.progress - this.options.teams.errTids.length} 个，失败 ${this.options.teams.errTids.length} 个。`)
      }
    })
  }

  getTeam (tid, callback) {
    request({
      method: 'GET',
      url: `http://i.sporttery.cn/api/fb_match_info/get_team_data/?tid=${tid}`,
      timeout: 8000,
      encoding: null
    }, (error, response, body) => {
      try {
        if (error) { throw error }
        callback(JSON.parse(body))
      } catch (err) {
        callback()
        logger.error(new Error(err), tid)
        this.options.teams.errTids.push(tid)
      }
    })
  }
}

const football = new FootBall()

/*
football.crawlingTeams((success, failed, total, startedTime, finishedTime) => {
  mongo.dcCrawlingRecord.create({
    name: 'football teams',
    startedTime,
    finishedTime,
    count: {
      total, success, failed
    }
  }).then(doc => {

  }).catch(e => {
    logger.error(new Error(e))
  })
})
*/

/**
 * 爬虫基本类
 *
 * @class Crawler
 */
class Crawler {
  constructor (proxyList) {
    this.proxyList = proxyList // 代理URL列表
  }
  request (url, callback = () => {}, options = {
    encoding: null,
    method: 'GET',
    timeout: 8000
  }) {
    options.url = url
    request(options, (err, response, body) => {
      try {
        if (err) throw err
        else callback(body)
      } catch (err) { callback() }
    })
  }
}

/**
 * 足球队 爬虫
 *
 * @class CrawlerFootBallTeams
 * @extends {Crawler}
 */
class CrawlerFootBallTeams extends Crawler {

}

logger.info('竞彩足球 球队 数据爬虫任务正在启动...')
