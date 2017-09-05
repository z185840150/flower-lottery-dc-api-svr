const [request, schedule] = [
  require('request'),
  require('node-schedule')
]

const [logger] = [
  require('./../../common/logger')
]

logger.info('竞彩足球 数据爬虫启动')

logger.info('竞彩足球 俱乐部、球队 数据爬虫任务开启中...')

class Club {
  constructor (counts = 600, threads = 50) {
    this.counts = counts
    this.tids = []
    for (let i = 0; i < threads; i++) {
      this.tids.push(0)
    }
  }

  crawler () {
    for (let i = 0; i < this.tids.length; i++) {
      this.getClubs(i)
    }
  }

  getClubs (i) {
    this.tids[i] = this.tids[i] + 1
    this.getClub(this.tids[i] + i * this.counts, body => {
      if (body.result && body.result.club_name) {
        console.log(`${this.tids[i] + i * this.counts}: ${body.result.club_name}`)
      }
      this.tids[i] < this.counts && this.getClubs(i)
    })
  }

  getClub (tid, cb) {
    request({
      method: 'GET',
      url: `http://i.sporttery.cn/api/fb_match_info/get_team_data/?tid=${tid}`,
      timeout: 8000,
      encoding: null
    }, (error, response, body) => {
      try {
        if (error) { throw error }
        cb(JSON.parse(body))
      } catch (e) {
        logger.error(e)
      }
    })
  }
}

new Club().crawler()
