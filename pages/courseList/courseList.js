const  api = require('../../utils/api/index.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    groupId: null
  },

  onLoad () {
    this.init()
  },

  onPullDownRefresh () {
    this.init()
  },

  init () {
    this.data.groupId = app.globalData.userInfo.group_id
    this.getCourseList()
  },
  getCourseList () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const params = {
      type: 'group',
      group_id: this.data.groupId
    }
    api.getCourseList(params)
      .then((list = []) => {
        this.setData({
          courseList: list
        })
        wx.stopPullDownRefresh()
        // wx.hideLoading()
      })
      .catch(error => {
        console.warn(`获取课程列表：${error}`)
      })
      .finally(() => {
        wx.hideLoading()
      })
  }

})