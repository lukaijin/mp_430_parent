const fetch = require('./fetch.js').fetch

exports.getTeacherInfo = teacherId => fetch('/TeacherManager/getTeacherInfo', 'GET', {teacher_id: teacherId})

exports.getTeacherFollowInfo = teacherId => fetch('/TeacherManager/getTeacherFollowInfo', 'GET', {teacher_id: teacherId})

exports.updateTeacherFollowInfo = params => fetch('/TeacherManager/updateTeacherFollowInfo', 'POST', params)

exports.getTeacherStat = teacherId => fetch('/TeacherManager/getTeacherStat', 'GET', {teacher_id: teacherId})

exports.getTeacherCommentTag = teacherId => fetch('/TeacherManager/getTeacherCommentTag', 'GET', {teacher_id: teacherId})

exports.getTeacherIntroduce = teacherId => fetch('/TeacherManager/getTeacherIntroduce', 'GET', {teacher_id: teacherId})

exports.getTeacherCommentList = params => fetch('/TeacherManager/getTeacherCommentList', 'GET', params)

exports.addTeacherComment = params => fetch('/TeacherManager/addTeacherComment', 'POST', params)
