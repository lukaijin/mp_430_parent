const fetch = require('./fetch.js').fetch

/**
 * 消息列表
 * @param {Object} params
 * @returns {Promise}
 */
const getLatestMessage = params => fetch('/ParentManager/getLatestMessage', 'GET', params)

/**
 * 查看是否有没读消息
 * @param {Object} params
 * @returns {Promise}
 */
const getLatestMessageCount = params => fetch('/ParentManager/getLatestMessageCount', 'GET')

/**
 * 查看是否有没读消息
 * @param {Object} params
 * @returns {Promise}
 */
const setMessageRead = params => fetch('/ParentManager/setMessageRead', 'POST', params)

const getHomeNotice = () => fetch('/ParentManager/getHomeNotice')

module.exports = {
   getLatestMessage,
   getLatestMessageCount,
   setMessageRead,
   getHomeNotice
}