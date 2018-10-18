const fetch = require('./fetch.js').fetch
const { dateFormat, getDayOfWeek } = require('../time.js')

/**
 * 获取课程列表
 * @param {Object} params
 * @returns {Promise}
 */
exports.getCourseList = (params) => {
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
            time = `${item.nextcoursestarttime.substr(0, 10)} ，${item.nextcoursestarttime.substr(11, 5)}-${item.nextcourseendtime.substr(11, 9)}`
          }
          courseList.push({
            arrangeId: item.arrange_id,
            arrange_id: item.arrange_id,
            name: item.course_name,
            date: date,
            arrange_image: item.arrange_image,
            signup_desc: item.signup_desc,
            signup_status: item.signup_status,
            abilityTag: item.abilityinfo,
            remainingQuota: item.remain_signup_num,
            location: item.arrange_loc,
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
exports.getCourseDetail = arrangeId => fetch('/CourseManager/getcoursedetail', 'GET', {arrange_id: arrangeId})
// 获取课程大纲
exports.getCourseOutline = arrangeId => fetch('/CourseManager/getCourseOutline', 'GET', {arrange_id: arrangeId})

// 课程报名
exports.courseSignup = (params) => fetch('/CourseManager/coursesignup', 'GET', params)

// 最新课程
exports.newReportList = (params) => fetch('/ReportManager/getReportList', 'GET', params)

// 点赞列表
exports.getReportZanList = (params) => fetch('/ReportManager/getReportZanList', 'GET', params)

// 点赞
exports.updateReportZan = (params) => fetch('/ReportManager/updateReportLike', 'POST', params)

// 提交评论
exports.submitReply = (params) => fetch('/ReportManager/updateReportReply', 'POST', params)

// 删除评论
exports.deleteReportReply = (params) => fetch('/ReportManager/deleteReportReply', 'POST', params)

// 报告详情
exports.getReportDetail = (params) => fetch('/ReportManager/getReportDetail', 'GET', params)

// 提交作业
exports.updateReporthomework = (params) => fetch('/ReportManager/updateReporthomework', 'POST', params)

// 是否开启评论接口
exports.getSystemConfig = () => fetch('/CommonManager/getSystemConfig', 'GET')
