const [mongoose] = [
  require('mongoose')
]
const Schema = mongoose.Schema

const Phone = new Schema({
  area: {type: String, default: ''},
  section: {type: String, default: ''},
  code: {type: String, default: ''},
  ext: {type: String, default: ''}
})

module.exports = Phone
