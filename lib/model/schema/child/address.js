const [mongoose] = [
  require('mongoose')
]
const Schema = mongoose.Schema

const Address = new Schema({
  country: { type: String, default: '' },
  province: { type: String, default: '' },
  city: { type: String, default: '' },
  district: { type: String, default: '' },
  street: { type: String, default: '' },
  detail: { type: String, default: '' }
})

module.exports = Address
