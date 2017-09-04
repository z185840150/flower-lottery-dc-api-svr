const [logger, mongo] = [
  require('./../common/logger'),
  require('./../model/mongo')
]

const model = mongo.user

module.exports = {
  model,
  getUser (condition) {
    this.findOne(condition)
    .exec()
    .then(user => user || Promise.reject(new Error('NOFOUND')))
    .catch(e => { logger.error(new Error(e)) })
  },
  getUserById (id) {
    this.getUser({ _id: id })
  },
  getUserByUsername (username) {
    this.getUser({ username })
  },
  getUserByEmail (email) {
    this.getUser({ 'bind.email': email })
  },
  getUserByMobile (mobile) {
    this.getUser({ 'bind.mobile': mobile })
  },
  getUserList ({ skip = 0, limit = 50 } = {}) {
    return this.User.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
  },
  createUser (user) {
    return this.creatOne(user).exec()
  }
}
