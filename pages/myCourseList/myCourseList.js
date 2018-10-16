const api = require('../../utils/api/index.js')
const { getUserInfo } = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: ['待上课', '上课中', '已完成'],
    currentTab: 0,
    courseList: [],
    completedCourseList: [],
    inClassCourseList: [],
    height: 0,
    top: 0
  },

  onLoad () {
    this.init()
  },

  /* methods start */
  init () {
    this.data.userInfo = getUserInfo()
    const statusBarHeight = wx.getStorageSync('statusBarHeight')
    const titleBarHeight = wx.getStorageSync('titleBarHeight')
    this.setData({ top: statusBarHeight + titleBarHeight })
    this._getTabList()
    this._getHeightscroll()
  },
  _getTabList () {
    this.data.items.forEach((item, index) => {
      const params = {
        type: 'my',
        status: Number(index) + 1
      }
      this._getCourseList(params, index)
    })
  },

  // 点击标题切换当前页时改变样式
  _currentTab (e) {
    var cur = e.currentTarget.dataset.current
    if (this.data.currentTab === cur) {
      return false
    } else {
      this._nextTab(cur)
    }
  },

  _nextTab (cur) {
    this.setData({ currentTab: cur })
  },

  _getHeightscroll () {
    const _this = this
    // 创建节点选择器
    var query = wx.createSelectorQuery()
    // 选择id
    query.select('#tab').boundingClientRect()
    query.exec(function (height) {
      // res就是 所有标签为mjltest的元素的信息 的数组
      // 取高度
      console.log(height, 'height')
      wx.getSystemInfo({
        success: res => {
          _this.setData({ height: res.windowHeight - height[0].height })
        }
      })
    })
  },

  _getCourseList (params, index) {
    wx.showLoading({
      title: '加载中'
    })
    api.getCourseList(params)
      .then(res => {
        switch (index) {
          case 0:
            this.setData({ courseList: res })
            break
          case 1:
            this.setData({ inClassCourseList: res })
            break
          case 2:
            this.setData({ completedCourseList: res })
            break
        }
      })
      .catch(error => {
        console.warn(`获取课程列表：${error}`)
      })
      .finally(() => {
        wx.hideLoading()
      })
  },

  _scrolltolowerExer (e) {
    if (!this.data.loading[this.data.currentTab].loadMore) {
      return
    }
    let obj = {
      limit: this.data.limit,
      parent_id: wx.getStorageSync('userInfo').id,
      status: Number(this.data.currentTab) + 1
    }
    switch (Number(this.data.currentTab)) {
      case 0:
        obj.offset = this.data.courseList.length
        break
      case 1:
        obj.offset = this.data.completedCourseList.length
        break
      case 2:
        obj.offset = this.data.cancelCourseList.length
        break
    }
    this._getCourseList(obj, this.data.currentTab)
  }
  /* methods end */
  
})