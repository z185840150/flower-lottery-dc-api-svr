const [mongoose] = [
  require('mongoose')
]

const [Schema] = [
  mongoose.Schema
]

const dcFootballOddsTtg = new Schema({
  match_id: { type: Number, unique: true }, // 赛事 ID
  num: { type: String }, // 场次
  data: { type: Date }, // 日期
  status: { type: String }, // 状态
  ttg: {
    s0: { type: Number },
    s1: { type: Number },
    s2: { type: Number },
    s3: { type: Number },
    s4: { type: Number },
    s5: { type: Number },
    s6: { type: Number },
    s7: { type: Number }
  }
}, { versionKey: false })

module.exports = dcFootballOddsTtg
