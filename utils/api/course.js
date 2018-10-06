const fetch = require('./fetch.js').fetch
let { dateFormat, getDayOfWeek } = require('../time.js')

/**
 * 获取课程列表
 * @param {Object} params
 * @returns {Promise}
 */
const getCourseList = (params) => {
  return new Promise((resolve, reject) => {
    fetch(`/CourseManager/getcourselist`, 'GET', params)
      .then((list = []) => {
        let courseList = []
        list.forEach(item => {
          let date = `${dateFormat(item.start_date)}-${dateFormat(item.end_date)}`
          let time = ''
          let week = ''
          if (item.nextcoursestarttime) {
            week = `${getDayOfWeek(item.nextcoursestarttime.substr(0, 10))}`
          }
          if (item.nextcourseendtime && item.nextcoursestarttime) {
            time = `${item.nextcoursestarttime.substr(0, 10)} ，${item.nextcoursestarttime.substr(11, 9)}-${item.nextcourseendtime.substr(11, 9)}`
          }
          courseList.push({
            arrangeId: item.arrange_id,
            name: item.course_name,
            date: date,
            arrange_image: item.arrange_image,
            signup_desc: item.signup_desc,
            signup_status: item.signup_status,
            abilityTag: item.abilityinfo,
            remainingQuota: item.remain_signup_num,
            location: item.location,
            course_id: item.course_id,
            coursefinishcount: item.coursefinishcount,
            coursetotalcount: item.coursetotalcount,
            week: week,
            time: time,
            teacher_name: item.teacher_name,
            teacher_id: item.teacher_id,
            arrange_original_price: item.arrange_original_price,
            arrange_discount_price: item.arrange_discount_price
          })
        })
        resolve(courseList)
      })
      .catch(error => reject(error))
  })
}

// 获取课程详情
const getCourseDetail = arrangeId => fetch('/CourseManager/getcoursedetail', 'GET', {arrange_id: arrangeId})
// 获取课程大纲
const getCourseOutline = arrangeId => fetch('/CourseManager/getCourseOutline', 'GET', {arrange_id: arrangeId})

// 课程报名
const courseSignup = (params) => fetch('/CourseManager/coursesignup', 'GET', params)

// 最新课程
const newReportList = (params) => fetch('/ReportManager/getReportList', 'GET', params)

// 点赞列表
const getReportZanList = (params) => fetch('/ReportManager/getReportZanList', 'GET', params)

// 点赞
const updateReportZan = (params) => fetch('/ReportManager/updateReportLike', 'POST', params)

// 提交评论
const submitReply = (params) => fetch('/ReportManager/updateReportReply', 'POST', params)

// 删除评论
const deleteReportReply = (params) => fetch('/ReportManager/deleteReportReply', 'POST', params)

// 报告详情
const getReportDetail = (params) => fetch('/ReportManager/getReportDetail', 'GET', params)

// 提交作业
const updateReporthomework = (params) => fetch('/ReportManager/updateReporthomework', 'POST', params)

module.exports = {
   getCourseList,
   getCourseDetail,
   getCourseOutline,
   courseSignup,
   newReportList,
   getReportZanList,
   updateReportZan,
   submitReply,
   deleteReportReply,
   getReportDetail,
   updateReporthomework
}