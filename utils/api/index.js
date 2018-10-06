const login = require('./login.js')
const user = require('./user.js')
const course = require('./course.js')

module.exports = {
   ...login,
   ...user,
   ...course
}