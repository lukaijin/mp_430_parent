const login = require('./login.js')
const user = require('./user.js')
const school = require('./school.js')
const swiper = require('./swiper.js')
const discount = require('./discount.js')
const message = require('./message.js')
const course = require('./course.js')
const comment = require('./comment.js')
const teacher = require('./teacher.js')
const order = require('./order.js')
const poster = require('./poster.js')
const growth = require('./growth.js')
const wish = require('./wish.js')


module.exports = {
   ...login,
   ...user,
   ...school,
   ...swiper,
   ...course,
   ...comment,
   ...teacher,
   ...order,
   ...poster,
   ...discount,
   ...message,
   ...growth,
   ...wish
}