// pages/teacher/teacher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {},
    isInitTeacher: false
  },
  
  onLoad (query) {
    this.setData({ query })
  },

  onReady () {
    this.setData({ isInitTeacher: true })
  },

})