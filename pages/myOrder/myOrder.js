const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const { getYearMonthDate, getWeek, getRangTime } = require('../../utils/time.js')

// pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'unfinished',
    unfinishedList: [],
    finishedList: [],
    isHasFinished: false,
    statusBarHeight: '',
    titleBarHeight: ''
  },

  onLoad () {
    this.setData({
      statusBarHeight: wx.getStorageSync('statusBarHeight'),
      titleBarHeight: wx.getStorageSync('titleBarHeight')
    })
    this._initOrderList('unfinished')
    this._initOrderList('finished')
  },

  /* methods start */
    async tabOrderList (e) {
      console.log(e)
      let type = e.currentTarget.dataset.type
      if (this.data.type === type) {
        return
      }
      this.setData({ type })
    },
    async _initOrderList (type) {
      wx.showLoading({
        title: '加载中...'
      })
      let params = {
        type
      }
      let res = await api.getOrderList(params)
      console.log('res', res)
      res.forEach(item => {
        item.week = getWeek(item.startdate)
        item.rangTime = getRangTime(item.startdate, item.enddate)
        item.startdate = getYearMonthDate(item.startdate, 'YYYY-M-D')
        item.enddate = getYearMonthDate(item.enddate, 'YYYY-M-D')
      })
      if (type === 'unfinished') {
        this.setData({ unfinishedList: res })
      } else {
        this.setData({ finishedList: res })
      }
      wx.hideLoading()
    }
  /* methods end */
})