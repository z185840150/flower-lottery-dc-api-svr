const [mongoose] = [
  require('mongoose')
]

const [Schema] = [
  mongoose.Schema
]

const server = new Schema({
  createdAt: { type: Date, required: true, default: Date.now(), require: true },
  creator: { type: Schema.Types.ObjectId, require: true },
  config: {
    port: { type: Number, default: 8080 }
  },
  common: {
    gps: {
      baidu: {
        ak: { type: String, default: '' }
      }
    },
    sms: {
      rate: { type: Number, default: 2 * 60 * 1000 },
      api: {
        ali: {
          priority: { type: Number, default: '-1' },
          signName: { type: String, default: '' },
          templateCode: { type: String, default: '' },
          accessKeyId: { type: String, default: '' },
          secretAccessKey: { type: String, default: '' }
        },
        kingtto: {
          priority: { type: Number, default: '-1' },
          apiKey: { type: String, default: '' }
        },
        sms_net: {
          priority: { type: Number, default: '-1' },
          apiKey: { type: String, default: '' }
        },
        tencent: {
          priority: { type: Number, default: '-1' },
          appId: { type: String, default: '' },
          appKey: { type: String, default: '' }
        }
      }
    }
  },
  rate: {
    base: {
      max: { type: Number, default: 60, require: true },
      windowsMS: { type: Number, default: 60 * 1000, require: true },
      delayAfter: { type: Number, default: 30, require: true },
      delayMS: { type: Number, default: 2 * 1000, require: true }
    },
    custom: [{
      uri: { type: String, default: '' },
      max: { type: Number, default: 60, require: true },
      windowsMS: { type: Number, default: 60 * 1000, require: true },
      delayAfter: { type: Number, default: 30, require: true },
      delayMS: { type: Number, default: 2 * 1000, require: true }
    }]
  }
}, { versionKey: false })

module.exports = server
