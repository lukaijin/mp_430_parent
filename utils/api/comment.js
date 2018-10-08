const fetch = require('./fetch.js').fetch

/**
 * 阿里云
 * @param {Object} params
 * @returns {Promise}
 */
exports.getOossSignature = params => fetch('/CommonManager/getOssSignature', 'GET', params)

/* type = ability style attitude */
exports.getCommentTag = params => fetch('/CommentManager/getCommentTag', 'GET', params)

exports.getCourseCommentInfo = params => fetch('/CourseManager/getCourseCommentInfo', 'GET', params)
