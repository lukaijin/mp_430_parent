
const config = require('../../config.js')
// let getUserInfo = null
// setTimeout(() => {
// 	getUserInfo = require('../common.js').getUserInfo	
// 	console.log('getUserInfo', getUserInfo)
// })
const getUserInfo = () => wx.getStorageSync('userInfo') || {}

module.exports.fetch = (path = '', requestType = 'GET', params = {}, contentType = 'application/x-www-form-urlencoded') => {
	const openId = getUserInfo().open_id
	const parentId = parseInt(getUserInfo().parent_id)
	let url = config.baseUrl + '/parent'
	if (openId && parentId) {
		url += path + `?open_id=${openId}&parent_id=${parentId}` 
	} else {
		url += path
	}
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: params,
			method: requestType,
			header: {
				'content-type': contentType
			},
			success: function (response) {
				// console.log('_wx.request_success', response)
				if (response.data.errcode === 0) {
					resolve(response.data.data, response.data.errmsg)
				 } else {
					let error = new Error(response.data.errmsg)
					error.errcode = response.data.errcode
					error.errmsg = response.data.errmsg
					reject(error)
				 }
				// if (res.statusCode === 502 || res.statusCode === 400) {
				// 	wx.hideLoading()
				// 	reject('访问失败，请重试！')
				// 	return
				// }
				// resolve(res.data);
			},
			fail: function (error) {
				// console.log('_wx.request_fails', error)
				wx.hideLoading()
				wx.showModal({
					content: '网络异常，请检查网络是否通畅'
				})
				reject(error)
			},
			complete: function (res) {}
		})
		Promise.prototype.finally = function (callback) {
			let P = this.constructor
			return this.then(
				value => P.resolve(callback()).then(() => value),
				reason => P.resolve(callback()).then(() => { throw reason })
			)
		}
	})
}
