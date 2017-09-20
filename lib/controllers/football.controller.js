const [Joi, moment, request] = [
  require('joi'),
  require('moment'),
  require('request')
]

const [logger, maker] = [
  require('./../common/logger'),
  require('./../helpers/responser/maker')
]

module.exports = {
  valid: {
    teams: {
      get: {
        query: {
          limit: Joi.number().integer().min(1).max(100),
          page: Joi.number().integer().min(1)
        }
      }
    },
    team: {
      get: {
        query: {

        }
      }
    }
  },
  methods: {
    teams (req, res, next) {

    },
    teamsCount (req, res, next) {

    },
    team (req, res, next) {

    },
    hhadList (req, res, next) {
      if (req.route.methods.get) {
        request({
          method: 'GET',
          url: `http://i.sporttery.cn/odds_calculator/get_odds?poolcode[]=hhad&poolcode[]=had&_=${moment().valueOf()}`,
          timeout: 8000,
          encoding: null
        }, (error, response, body) => {
          if (error) { throw error } else {
            let json = JSON.parse(body)
            maker.result(res, next, 'json', json)
          }
        })
      }
    }
  }

}
