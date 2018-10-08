const fetch = require('./fetch.js').fetch

exports.getPosterInfo = arrangeId => fetch('/CourseManager/getCoursePosterInfo', 'GET', {arrange_id: arrangeId})

exports.getReportPosterInfo = reportId => fetch('/ReportManager/getReportPosterInfo', 'GET', {report_id: reportId})
