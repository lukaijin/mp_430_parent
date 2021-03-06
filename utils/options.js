// 职业
const occupation = ['企业白领', '机关单位员工', '自由工作者', '居家', '退休', '其他']
// 年龄
const age = [
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100
]
// 我与孩子的关系
const relation = ['爸爸', '妈妈', '其他亲人']
// 性别
const gender = ['男', '女']

/**
 * 课程状态
 */
const statusMaps = {
  1: '查看详情',
  2: '已报名',
  3: '已报满'
}
const sginUpStatus = {
  1: '立即报名',
  2: '已报名',
  3: '已报满'
}
const outlineStatus = {
  0: '未开始',
  1: '已结课',
  2: '已取消',
  3: '已改期'
}

const orderStatus = {
  1: '待支付',
  2: '已完成',
  3: '已取消'
}

module.exports = {
  occupation,
  age,
  relation,
  gender,
  statusMaps,
  sginUpStatus,
  outlineStatus,
  orderStatus
}
