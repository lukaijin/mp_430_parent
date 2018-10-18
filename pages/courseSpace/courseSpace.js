 const api = require('../../utils/api/index.js')
 const dayjs = require('../../utils/dayjs/dayjs.min.js')
 const { getSystemConfig } = require('../../utils/common.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: ['最新报告', '课程介绍', '老师介绍'],
    today: '',
    currentTab: 0,
    myWish: {},
    next: false,
    wishList: [],
    type: 1,
    showCalendar: false,
    newReportList: [],
    arrangeId: 0,
    offset: 0,
    limit: 3,
    loadMore: false,
    like: false,
    typeList: ['家长动态', '每节一报', '每课一报'],
    statusBarHeight: '',
    titleBarHeight: '',
    value: '',
    orShowTime: true,
    courseTotalScore: 0,
    headerBgColor: '#fff',
    titleColor: '#333',
    arrowColor: '#333',
    orShowPopul: false,
    messageId: '',
    orShowPopul_1: false,
    isShow: false,
    isPreviewImage: false,
    heights: 0,
    query: {},
    isInitCourse: false,
    isInitTeacher: false,
    teacherCurrentTabIndex: 0,
    allowComment: 0,
    guanzhuCourse: -1,
    guanzhuTeacher: -1
  },

  onLoad (option) {
    const device = wx.getSystemInfoSync()
    const statusBarHeight = wx.getStorageSync('statusBarHeight')
    const titleBarHeight = wx.getStorageSync('titleBarHeight')
    this.data.heights = device.windowHeight - (statusBarHeight + titleBarHeight)
    this.data.arrangeId = option.arrangeId
    this.setData({ query: option })
  },

  onShow (option) {
    // eslint-disable-next-line
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]// 上一页面
    if (currentPage.data.flagCurrentTab) {
      this.setData({
        currentTab: currentPage.data.spaceCurrentTabIndex,
        teacherCurrentTabIndex: currentPage.data.teacherCurrentTabIndex
      })
    } else {
      this.setData({ currentTab: 0 })
    }

    if (this.data.isPreviewImage) {
      this.setData({ isPreviewImage: false })
      return
    }
    this.setData({ 
      newReportList: [],
      statusBarHeight: wx.getStorageSync('statusBarHeight'),
      titleBarHeight: wx.getStorageSync('titleBarHeight')
    })
    this._init()
    // this._getWishList()
    this._newReportList()
    this._getSystemConfig()
  },

  onReachBottom () {
    if (this.data.currentTab === 0 && this.data.loadMore) {
      // 最新报告
      this._newReportList()
    }
  },

  /* methods start */
  _getSystemConfig () { // 是否开启评论功能
    getSystemConfig()
      .then(res => {
        this.setData({ allowComment: Number(res) })
      })
  },
  _extract () {
    this.setData({ orShowPopul_1: true })
  },
  _close1 () {
    this.setData({ orShowPopul_1: false })
  },
  _init () {
    this.data.offset = 0
    this.data.limit = 3
    this.setData({ newReportList: [] })
  },
  _close () {
    this.setData({ orShowPopul: false })
  },
  _open () {
    this.setData({ orShowPopul: true })
  },
  _setTime () {
    this.setData({ orShowTime: true })
    let timer = setTimeout(() => {
      this.setData({ orShowTime: false })
      clearInterval(timer)
    }, 1000)
  },
  _currentTab (e) {
    var cur = e.currentTarget.dataset.current
    if (this.data.currentTab === cur) {
      return false
    } else {
      this.setData({ currentTab: cur })
      switch (cur) {
        case 1:
          if (!this.data.isInitCourse) this.setData({ isInitCourse: true })
          break
        case 2:
          if (!this.data.isInitTeacher) this.setData({ isInitTeacher: true })
          break
      }
    }
  },
  _next () {
    this.setData({ next: true })
  },
  _formSubmit (e) {
    if (!this.data.value) {
      wx.showToast({
        url: '请先填写心愿'
      })
    }
    if (!e.detail.value.scroll) {
      wx.showToast({
        url: '请先填写心愿积分且不为0'
      })
    }
    let parmes = {
      wish_score: e.detail.value.scroll,
      wish_desc: this.data.value,
      arrange_id: this.data.arrangeId
    }
    this.setData({ next: true })
    this._setWish(parmes)
  },
  _inputValue (e) {
    this.setData({ value: e.detail.value })
  },
  _setWish (parmes) {
    wx.showLoading({
      text: '加载中...'
    })
    api.setWish(parmes).then(res => {
      wx.hideLoading()
      this._getWishList()
    })
  },
  _getWishList (e) {
    let parmes = {
      arrange_id: this.data.arrangeId
    }
    api.getWishList(parmes).then(res => {
      this.setData({
        wishList: res.classmate_wish,
        myWish: res.my_wish,
        courseTotalScore: res.course_total_score
       })
    })
  },
  _newReportList () {
    let parmes = {
      arrange_id: this.data.arrangeId,
      page_count: this.data.limit,
      page_index: this.data.offset
    }
    api.newReportList(parmes).then(res => {
      if (res.total_count > Number(res.report_list.length) + Number(this.data.newReportList.length)) {
        this.data.loadMore = true
      } else {
        this.data.loadMore = false
      }
      this.data.offset = this.data.limit + this.data.offset
      this.setData({
        isShow: true,
        newReportList: this.data.newReportList.concat(res.report_list)
      })
    })
  },
  _like (val) {
    // api.updateReportZan(val).then(res => {
    //   this.$set(this.newReportList[val.index], 'is_like', val.like)
    //   let userInfo = wx.getStorageSync('userInfo')
    //   if (val.like) {
    //     let userLike = [
    //       {
    //         parent_id: userInfo.parent_id,
    //         wx_headimgurl: userInfo.avatarUrl + '?x-oss-process=image/resize,m_fill,h_140,w_140',
    //         wx_nickname: userInfo.nickName
    //       }
    //     ]
    //     let likeList = this.newReportList[val.index].like_list.concat(
    //       userLike
    //     )
    //     this.$set(this.newReportList[val.index], 'like_list', likeList)
    //     this.$set(this.newReportList[val.index], 'show', 1)
    //     this._setTime()
    //     wx.showToast({
    //       title: '点赞成功'
    //     })
    //   } else {
    //     wx.showToast({
    //       title: '取消点赞'
    //     })
    //     let likeList = this.newReportList[val.index].like_list
    //     this.$set(this.newReportList[val.index], 'show', 0)
    //     likeList.forEach((res, index) => {
    //       if (res.parent_id === userInfo.parent_id) {
    //         this.newReportList[val.index].like_list.splice(index, 1)
    //         this.$set(this.newReportList[val.index], 'like_list', likeList)
    //         return false
    //       }
    //     })
    //   }
    // })
  },
  _deteilComment (val) {
    console.log(val, 'val')
    val.from_user_type = Number(val.from_user_type)
    if (
      val.from_user_id === wx.getStorageSync('userInfo').parent_id &&
      val.from_user_type === 2
    ) {
      let parmes = {
        report_reply_id: val.report_reply_id,
        from_user_id: val.from_user_id,
        from_user_type: val.from_user_type
      }
      wx.showModal({
        title: '提示',
        content: '是否删除评论？',
        success: res => {
          if (res.confirm) {
            api.deleteReportReply(parmes).then(res => {
              // if (val.contentIndex === 0 || val.contentIndex) {
              //   // contentIndex :删除二级评论
              //   let repyList = this.newReportList[val.index].first_reply_list
              //   this.newReportList[val.index].first_reply_list[val.repyIndex].send_reply_list.splice(val.contentIndex, 1)
              //   this.$set(
              //     this.newReportList[val.index],
              //     'first_reply_list',
              //     repyList
              //   )
              //   this.$forceUpdate()
              // } else {
              //   // contentIndex :删除一级评论
              //   let repyList = this.newReportList[val.index].first_reply_list
              //   this.newReportList[val.index].first_reply_list.splice(val.repyIndex, 1)
              //   this.$set(
              //     this.newReportList[val.index],
              //     'first_reply_list',
              //     repyList
              //   )
              //   this.$forceUpdate()
              // }

              wx.showToast({
                title: '已删除'
              })
            })
          }
        }
      })
    }
  },
  _previewImage (imagesIndex, index, repyIndex, contentIndex) {
    // this.isPreviewImage = true
    // if (contentIndex === 0 || contentIndex) {
    //   let url = this.newReportList[index].first_reply_list[repyIndex].send_reply_list[imagesIndex].reply_images
    //   wx.previewImage({
    //     urls: url,
    //     current: url[contentIndex]
    //   })
    // } else {
    //   let url = this.newReportList[index].first_reply_list[repyIndex].reply_images
    //   wx.previewImage({
    //     urls: url,
    //     current: url[imagesIndex]
    //   })
    // }
  },
  _sendGuanzhuCourse (e) {
    let num = e.detail
    console.log('_sendGuanzhuCourse', num)
    this.setData({ guanzhuCourse: num })
  },
  _sendGuanzhuTacher (e) {
    let num = e.detail
    console.log('_sendGuanzhuTacher', num)
    this.setData({ guanzhuTeacher: num })
  }
  /* methods end */
  
})