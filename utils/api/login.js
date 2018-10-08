const fetch = require('./fetch.js').fetch

/**
 * 获取用户信息(openid等)
 * @param {Object} params
 * @returns {Promise}
 */
exports.login = params => {
  return fetch('/AuthorizeManager/getuserinfo', 'GET', params)
  // return new Promise((resolve, reject) => {
  //  fetch('/AuthorizeManager/getuserinfo', 'GET', params)
  //     .then(res => {
  //       if (!res) {
  //         // eslint-disable-next-line
  //         reject('授权失败')
  //       } else {
  //         resolve(res)
  //       }
  //     })
  //     .catch(error => {
  //       console.log('_login_', error)
  //       reject(error)
  //     })
  // })
}