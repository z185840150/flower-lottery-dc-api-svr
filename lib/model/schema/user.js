const [mongoose] = [
  require('mongoose')
]

const [Address, Mobile, Phone, Schema] = [
  require('./child/address'),
  require('./child/mobile'),
  require('./child/phone'),
  mongoose.Schema
]

const user = new Schema({
  username: { type: String, required: true, unique: true },
  bind: {
    email: { type: String, default: '' },
    google: { type: String, default: '' },
    mobile: Mobile,
    qq: { type: String, default: '' },
    weibo: { type: String, default: '' },
    weixin: { type: String, default: '' }
  },
  credentials: {
    salt: { type: String, required: true },
    storedKey: { type: String, required: true },
    /** sha1(h-mac-sha1((md5(password)+salt), storedKey)) */
    serverKey: { type: String, required: true }
  },
  baseinfo: {
    nickname: {
      type: String,
      default: ''
    },
    signature: {
      type: String,
      default: ''
    },
    avatar: {
      file: { type: Schema.Types.ObjectId },
      type: {
        type: String,
        default: 'jpg',
        enum: ['jpg', 'png', 'gif', 'bmp']
      }
    },
    sex: {
      type: String,
      default: 'none',
      enum: ['human', 'woman', 'none']
    },
    email: {
      type: String,
      default: ''
    },
    mobile: Mobile,
    birthday: { type: Date },
    address: Address,
    hometown: Address
  },
  deliver: {
    def: {
      type: Number,
      default: -1
    },
    addresses: [{
      client: {type: String, default: ''},
      postcode: {type: String, default: ''},
      mobile: Mobile,
      phone: Phone,
      address: Address
    }]
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now
  }
}, { versionKey: false })

module.exports = user
