const fetch = require('./fetch.js').fetch

/**
 * 心愿列表
 * @param {Object} params
 * @returns {Promise}
 */
exports.getWishList = (params) => {
  return new Promise((resolve, reject) => {
    fetch(`/CourseManager/getCourseWishList`, 'GET', params)
      .then((list = []) => {
        resolve(list)
      })
      .catch(error => reject(error))
  })
}

/**
 * 提交心愿
 * @param {Object} params
 * @returns {Promise}
 */
exports.setWish = (params) => {
  return new Promise((resolve, reject) => {
    fetch(`/CourseManager/addCourseWish`, 'POST', params)
      .then((wish = []) => {
        resolve(wish)
      })
      .catch(error => reject(error))
  })
}
