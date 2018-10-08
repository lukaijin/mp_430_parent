const fetch = require('./fetch.js').fetch

exports.sendAuthCode = params => fetch(`/AuthorizeManager/sendAuthCode`, 'GET', params)

exports.bindPhone = params => fetch(`/AuthorizeManager/bindPhone`, 'GET', params)

exports.getParentInfo = () => fetch('/ParentManager/getParentInfo')

exports.getChildInfo = () => fetch('/ParentManager/getChildInfo')

exports.updateChildInfo = params => fetch('/ParentManager/updateChildInfo', 'POST', params)

exports.updateParentCommonInfo = params => fetch('/ParentManager/updateParentCommonInfo', 'POST', params)

exports.updateParentWxInfo = params => fetch('/ParentManager/updateParentWxInfo', 'POST', params)

exports.bindGroup = params => fetch('/ParentManager/bindGroup', 'POST', params)

exports.getTeacherInfoByPhone = phone => fetch('/TeacherManager/getTeacherInfoByPhone', 'GET', { phone: phone })
