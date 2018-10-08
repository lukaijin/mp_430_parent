const fetch = require('./fetch.js').fetch

/**
 * 消息列表
 * @param {Object} params
 * @returns {Promise}
 */
exports.getLatestMessage = params => fetch('/ParentManager/getLatestMessage', 'GET', params)

/**
 * 查看是否有没读消息
 * @param {Object} params
 * @returns {Promise}
 */
exports.getLatestMessageCount = params => fetch('/ParentManager/getLatestMessageCount', 'GET')

/**
 * 查看是否有没读消息
 * @param {Object} params
 * @returns {Promise}
 */
exports.setMessageRead = params => fetch('/ParentManager/setMessageRead', 'POST', params)

exports.getHomeNotice = () => fetch('/ParentManager/getHomeNotice')