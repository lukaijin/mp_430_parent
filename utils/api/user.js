const fetch = require('./fetch.js').fetch

const sendAuthCode = params => fetch(`/AuthorizeManager/sendAuthCode`, 'GET', params)

const bindPhone = params => fetch(`/AuthorizeManager/bindPhone`, 'GET', params)

const getParentInfo = () => fetch('/ParentManager/getParentInfo')

const getChildInfo = () => fetch('/ParentManager/getChildInfo')

const updateChildInfo = params => fetch('/ParentManager/updateChildInfo', 'POST', params)

const updateParentCommonInfo = params => fetch('/ParentManager/updateParentCommonInfo', 'POST', params)

const updateParentWxInfo = params => fetch('/ParentManager/updateParentWxInfo', 'POST', params)

const bindGroup = params => fetch('/ParentManager/bindGroup', 'POST', params)

const getTeacherInfoByPhone = phone => fetch('/TeacherManager/getTeacherInfoByPhone', 'GET', { phone: phone })

module.exports = {
   sendAuthCode,
   bindPhone,
   getParentInfo,
   getChildInfo,
   updateChildInfo,
   updateParentCommonInfo,
   updateParentWxInfo,
   bindGroup,
   getTeacherInfoByPhone
}