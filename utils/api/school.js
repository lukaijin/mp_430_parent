const fetch = require('./fetch.js').fetch

// 获取学校信息
const getSchoolInfo = groupId => fetch('/GroupManager/getGroupInfo', 'GET', {group_id: groupId})

// 获取机构详情
const getGroupInfo = groupId => fetch('/GroupManager/getGroupInfo', 'GET', {group_id: groupId})

// 获取学校机构列表
const getGroupList = (type = 'school') => {
  return new Promise((resolve, reject) => {
    fetch('/GroupManager/getGroupList', 'GET', {type})
      .then(res => resolve(res.group_list || []))
      .catch(error => reject(error))
  })
}

module.exports = {
  getSchoolInfo,
  getGroupInfo,
  getGroupList
}