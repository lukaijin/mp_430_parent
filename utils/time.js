const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : '0' + n
 }
 
 const dateFormat = (time, pattern = 'YYYY/MM/DD') => {
   let date = new Date(Date.parse(time.replace(/-/g, '/')))
   let year = date.getFullYear()
   let month = date.getMonth() + 1
   let day = date.getDate()
 
   if (pattern === 'YYYY/MM/DD') {
     return [year, month, day].map(formatNumber).join('/')
   } else if (pattern === 'YYYY-MM-DD') {
     return [year, month, day].map(formatNumber).join('-')
   }
 }
 
 const getYearMonthDate = (time, pattern = 'YYYY-MM-DD') => {
   let date = new Date(Date.parse(time.replace(/-/g, '/')))
   let year = date.getFullYear()
   let month = date.getMonth() + 1
   let day = date.getDate()
   let result = [year, month, day].map(formatNumber)
   if (pattern === 'YYYY-MM-DD') {
     return result[0] + '年' + result[1] + '月' + result[2] + '日'
   } else if (pattern === 'YYYY-M-D') {
     return year + '年' + month + '月' + day + '日'
   }
 }
 
 const getYear = (time) => {
   let date = new Date(Date.parse(time.replace(/-/g, '/')))
   let year = date.getFullYear()
   return year
 }
 
 const getWeek = (time) => {
   let date = new Date(Date.parse(time.replace(/-/g, '/')))
   let week = { 0: '周末', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }
   return week[date.getDay()]
 }

 const getDayOfWeek = dayValue => {
   let day = new Date(Date.parse(dayValue.replace(/-/g, '/')))
   let today = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
   return today[day.getDay()] // day.getDay();根据Date返一个星期中的某一天，其中0为星期日
 }
 
 const getTime = (time) => {
   let date = new Date(Date.parse(time.replace(/-/g, '/')))
   let hour = date.getHours()
   let minute = date.getMinutes()
   return [hour, minute].map(formatNumber).join(':')
 }
 
 const getRangTime = (startTime, endTime) => {
   return getTime(startTime) + '-' + getTime(endTime)
 }
 
 const formatTime = date => {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const second = date.getSeconds()
 
   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
 }
 
 module.exports = {
   dateFormat,
   getYearMonthDate,
   getYear,
   getWeek,
   getDayOfWeek,
   getTime,
   getRangTime,
   formatTime
 }