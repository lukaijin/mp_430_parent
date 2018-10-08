const fetch = require('./fetch.js').fetch

/**
 * 成长记录列表
 * @param {Object} params
 * @returns {Promise}
 */
exports.getGrowthList = (params) => {
  return new Promise((resolve, reject) => {
    fetch(`/ReportManager/getGrowthList`, 'GET', params)
      .then((list = []) => {
        list.growth_list.forEach(item => {
          item.day = item.create_time.substr(8, 2)
          item.month = item.create_time.substr(5, 2).replace(/0/g, ' ')
        })
        resolve(list)
      })
      .catch(error => reject(error))
  })
}

/**
 * 提交成长记录
 * @param {Object} params
 * @returns {Promise}
 */

exports.updateParentMoment = (params) => {
  return new Promise((resolve, reject) => {
    console.log(params, 'params')
    fetch(`/ParentManager/updateParentMoment`, 'POST', params)
      .then((wish = []) => {
        resolve(wish)
      })
      .catch(error => reject(error))
  })
}
