const api = require('../../utils/api/index.js')
const { dateFormat } = require('../../utils/time.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 5,
    pageIndex: 1,
    messageList: [],
    loadMore: false,
    typeList: ['家长动态', '每节一报', '每课一报']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getLatestMessage()
  },

  onReachBottom () {
    if (this.data.loadMore) {
      this._getLatestMessage()
    }
  },
  
  /* methods start */
  _getLatestMessage () {
    let parmes = {
      page_index: Number(this.data.pageIndex),
      page_size: Number(this.data.limit)
    }
    api.getLatestMessage(parmes)
      .then(res => {
        this._setMessageRead(res.message_list)
        if (res.total_count > Number(res.message_list.length) + Number(this.data.messageList.length)) {
          this.setData({ loadMore: true })
        } else {
          this.setData({ loadMore: false })
        }
        console.log('this.data.pageIndex_old', this.data.pageIndex)
        this.data.pageIndex++
        console.log('this.data.pageIndex ++', this.data.pageIndex)
        res.message_list.forEach(res => {
          let time = res.create_time.substr(0, 10).replace(/-/g, '/')
          let now = dateFormat(new Date(), 'YYYY/MM/DD')
          if (time === now) {
            res.time = `今天${res.create_time.substr(10, 6)}`
          } else {
            res.time = res.create_time.substr(0, 10)
          }
        })
        this.setData({
          messageList: this.data.messageList.concat(res.message_list)
        })
      })
  },
  _toReportDetail (e) {
    console.log('_toReportDetail', e)
    let reportId = e.currentTarget.dataset.reportId
    wx.navigateTo({
      url: `/pages/reportDetail/reportDetail?id=${reportId}`
    })
  },
  _toCourseSpace (e) {
    console.log('_toCourseSpace', e)
    let teacherId = e.currentTarget.dataset.teacherId
    let arrangeId = e.currentTarget.dataset.arrangeId
    if (teacherId && arrangeId) {
      wx.navigateTo({
        url: `/pages/courseSpace/courseSpace?&teacherId=${teacherId}&arrangeId=${arrangeId}`
      })
    }
  },
  _setMessageRead (messageList) {
    let arr = []
    messageList.forEach(res => {
      if (!Number(res.had_read)) {
        arr.push(res.message_id)
      }
    })
    if (arr.length !== 0) {
      let parmes = {
        message_ids: arr
      }
      api.setMessageRead(parmes)
        .then(res => {
        })
    }
  }
/* methods end */
})