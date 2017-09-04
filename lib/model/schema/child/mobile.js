const [mongoose] = [
  require('mongoose')
]
const Schema = mongoose.Schema

const Mobile = new Schema({
  area: { type: String, default: '' },
  code: { type: String, default: '' },
  ext: { type: String, default: '' }
})

module.exports = Mobile
