const fetch = require('./fetch.js').fetch

// 获取学校信息
exports.getSchoolInfo = groupId => fetch('/GroupManager/getGroupInfo', 'GET', {group_id: groupId})

// 获取机构详情
exports.getGroupInfo = groupId => fetch('/GroupManager/getGroupInfo', 'GET', {group_id: groupId})

// 获取学校机构列表
exports.getGroupList = (type = 'school') => {
  return new Promise((resolve, reject) => {
    fetch('/GroupManager/getGroupList', 'GET', {type})
      .then(res => resolve(res.group_list || []))
      .catch(error => reject(error))
  })
}