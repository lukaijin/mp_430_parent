const login = require('./login.js')
const user = require('./user.js')
const school = require('./school.js')
const swiper = require('./swiper.js')
const discount = require('./discount.js')
const message = require('./message.js')
const course = require('./course.js')

module.exports = {
   ...login,
   ...user,
   ...school,
   ...swiper,
   ...discount,
   ...message,
   ...course
}