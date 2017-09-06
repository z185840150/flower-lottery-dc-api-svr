const [mongoose] = [
  require('mongoose')
]

const [Schema] = [
  mongoose.Schema
]

const dcFootballTeam = new Schema({
  team_id: { type: Number, required: true, unique: true },
  type: { type: String, required: true, default: 'club' },
  club_name: { type: String, required: true },
  club_abbr_name: { type: String, required: true },
  team_pic_format: { type: String },
  team_city: { type: String },
  team_founded: { type: String },
  competition_name: { type: String },
  competition_abbr_name: { type: String },
  rank: { type: Number },
  win: { type: Number },
  draw: { type: Number },
  lose: { type: Number },
  coach: { type: String } // 教练
}, { versionKey: false })

module.exports = dcFootballTeam
