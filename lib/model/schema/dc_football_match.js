const [mongoose] = [
  require('mongoose')
]

const [Schema] = [
  mongoose.Schema
]

const dcFootballMatch = new Schema({
  match_id: { type: Number },
  sporttery_matchid: { type: Number },
  date_cn: { type: Date }, // 日期
  gameweek: { type: Date },
  flag_reverse: { type: String },
  s_num: { type: String }, // 赛事编号
  l_id_dc: { type: String },
  s_id_dc: { type: String },
  r_id_dc: { type: String },
  g_id_dc: { type: String },
  h_id_dc: { type: String }, // 主场 球队 ID
  a_id_dc: { type: String }, // 客场 球队 ID
  l_cn: { type: String }, // 赛事名称
  l_cn_abbr: { type: String }, // 赛事名称缩写
  l_color: { type: String }, // 赛事代表色
  s_cn: { type: String }, // 赛事年份
  r_cn: { type: String }, // 赛事类别
  h_cn: { type: String }, // 主场 中文名
  h_cn_abbr: { type: String }, // 主场 中文名 缩写
  a_cn: { type: String }, // 客场 中文名
  a_cn_abbr: { type: String }, // 客场 中文名 缩写
  weather: { type: String }, // 天气
  h_pic: { type: String }, // 主场 标志
  a_pic: { type: String }, // 客场 标志
  table_h: { type: Number } // 主场 积分榜 排名
}, { versionKey: false })

module.exports = dcFootballMatch
