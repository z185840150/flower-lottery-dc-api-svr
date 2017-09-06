const [mongoose] = [
  require('mongoose')
]

const [Schema] = [
  mongoose.Schema
]

const dcFootballTeam = new Schema({
  name: { type: String, required: true },
  startedTime: { type: Date, required: true },
  finishedTime: { type: Date, required: true },
  count: {
    total: { type: Number, required: true, default: 0 },
    success: { type: Number, required: true, default: 0 },
    failed: { type: Number, required: true, default: 0 }
  }
}, { versionKey: false })

module.exports = dcFootballTeam
