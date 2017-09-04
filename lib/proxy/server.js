const [mongo] = [
  require('./../model/mongo')
]

const model = mongo.server

module.exports = {
  model,
  getConfig (condition) {
    return model
    .findOne()
    .sort({ 'createdTime': -1 })
    .exec()
    .then(server => server)
    .catch(e => Promise.reject(new Error(e)))
  },
  getConfigList ({ skip = 0, limit = 50 } = {}) {
    return model.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
  }
}
