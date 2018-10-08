const fetch = require('./fetch.js').fetch

/**
 * 获取活动列表
 * @returns {Promise}
 * @returns {Promise}
 */
exports.getDiscountList = groupId => fetch(`/DiscountManager/getdiscountlist`, 'GET', { group_id: groupId })

/**
 * 获取活动详情
 * @param {number} id
 * @returns {Promise}
 */
exports.getDiscountDetail = id => fetch(`/DiscountManager/getdiscountdetail`, 'GET', {discount_id: id})
