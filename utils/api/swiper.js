const fetch = require('./fetch.js').fetch

/**
 * 获取首页轮播信息
 * @returns {Promise}
 * @returns {Promise}
 */
module.exports.getSwiper = () => fetch(`/SwiperManager/getswiper`)
