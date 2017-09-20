const [fs, http, moment, path, request, schedule] = [
  require('fs'),
  require('http'),
  require('moment'),
  require('path'),
  require('request').defaults({maxRedirects: 20}),
  require('node-schedule')
]

const [logger, mongo] = [
  require('./../../common/logger'),
  require('./../../model/mongo')
]

logger.info('正在加载 竞彩足球 数据爬虫...')

/**
 * 爬虫基本类
 *
 * @class Crawler
 */
class Crawler {
  constructor (proxyList) {
    this.proxyList = proxyList // 代理URL列表
  }
  request (url) {
    return new Promise((resolve, reject) => {
      try {
        request({
          host: '117.78.35.194',
          port: '3128',
          url,
          encoding: null,
          method: 'GET',
          timeout: 8000
        }, (e, res, body) => {
          if (e) throw e
          else resolve(body)
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

class CrawlerFootBall extends Crawler {
  odds (code) {
    return new Promise((resolve, reject) => {
      switch (code) {
        case 'ttg':
          this.request(`http://i.sporttery.cn/odds_calculator/get_odds?poolcode[]=ttg&_=${moment().valueOf()}`)
          .then(body => JSON.parse(body))
          .then(json => {
            if (json && json.data && Object.keys(json.data)) {
              Object.keys(json.data).map((id, index) => {
                let newDoc = {
                  match_id: parseInt(json.data[id].id),
                  num: json.data[id].num,
                  data: moment(json.data[id].date + ' ' + json.data[id].time).format(),
                  status: json.data[id].status,
                  ttg: {
                    s0: parseInt(json.data[id].ttg.s0 || '-1'),
                    s1: parseInt(json.data[id].ttg.s1 || '-1'),
                    s2: parseInt(json.data[id].ttg.s2 || '-1'),
                    s3: parseInt(json.data[id].ttg.s3 || '-1'),
                    s4: parseInt(json.data[id].ttg.s4 || '-1'),
                    s5: parseInt(json.data[id].ttg.s5 || '-1'),
                    s6: parseInt(json.data[id].ttg.s6 || '-1'),
                    s7: parseInt(json.data[id].ttg.s7 || '-1')
                  }
                }
                mongo.dcFootballOddsTtg
                .findOneAndUpdate({ match_id: parseInt(json.data[id].id) }, newDoc, { upsert: true })
                .then(doc => {
                  if (index === Object.keys(json.data).length - 1) resolve()
                })
                .catch(e => reject(e))
              })
            } else reject(new Error('error json'))
          })
          .catch(e => reject(e))
          break
        case 'had':
          reject(new Error('no method'))
          break
        case 'hhad':
          reject(new Error('no method'))
          break
        default:
          reject(new Error('no method'))
      }
    })
  }
}

let crawlerFootBall = new CrawlerFootBall()

logger.info('爬虫任务 竞彩足球-赔率-总进球 启动中...')
crawlerFootBall.odds('ttg').then(() => {
  logger.info('爬虫任务 竞彩足球-赔率-总进球 数据爬取成功')
  logger.info('爬虫任务 竞彩足球-赔率-总进球 运行成功（频率: 30秒/次）')
  schedule.scheduleJob('0,30 * * * * *', () => {
    crawlerFootBall.odds('ttg').then(() => {
      logger.info('爬虫任务 竞彩足球-赔率-总进球 数据爬取完毕')
    })
  })
})
/**
 * http://i.sporttery.cn/odds_calculator/get_odds?poolcode[]=had
 *
 * poolcode: had, hhad, ttg, crs, hafu, wnm, mnl, hilo
 */
