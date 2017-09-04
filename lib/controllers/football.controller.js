const [Joi] = [
  require('joi')
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

    }
  }

}
