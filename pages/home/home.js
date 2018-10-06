const api = require('../../utils/api/index.js')
const { getUserInfo, setUserInfo, superNavigation } = require('../../utils/common.js')

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperList: [],
    swiperShow: true,
    current: 0,
    preIndex: 0,
    discountList: [],
    courseList: [],
    newMessageList: [],
    userInfo: {},
    schoolName: '成长优选',
    schoolList: [],
    schoolId: 0,
    titleColor: '#ffffff'
  },

  // 生命周期
  onLoad: function() {
    this.init()
  },

  onPullDownRefresh () {
    this.init()
    wx.stopPullDownRefresh()
  },
  onPageScroll (obj) {
    // console.log('onPageScroll', obj)
    if (obj.scrollTop <= 50) {
      this.setData({ titleColor:  '#ffffff'})
    } else if (obj.scrollTop > 50) {
      this.setData({ titleColor:  '#333333'})
    }
  },
  /* methods start */
  init () {
    this.setData({ userInfo: getUserInfo() })
    this.getHomeNotice()
    this.getSwiperList()
    this.getDiscountList(this.data.userInfo.group_id)
    this.getSchoolInfo(this.data.userInfo.group_id)
    if (this.data.userInfo.open_id) {
      this.getCourseList()
    } else {
      // this.getCode()
    }
  },
  // getCode () {
  //   const _this = this
  //   wx.login({
  //     success: res => {
  //       this.setData({ userInfo: res })
  //       this.userInfo = res
  //       setUserInfo(res)
  //       this.getCourseList()
  //     },
  //     fail: () => {
  //       _this.getCode()
  //     }
  //   })
  // },
  getHomeNotice () {
    api.getHomeNotice().then(res => {
      this.setData({ newMessageList: res.message_list })
    })
  },
  // 获取轮播图
  getSwiperList () {
    api.getSwiper()
      .then((list = []) => {
        this.setData({ swiperList: list })
      })
      .catch(() => {
        this.setData({ swiperShow: false })
      })
  },
  // 获取学校信息
  getSchoolInfo (groupId) {
    api.getSchoolInfo(groupId)
      .then((res) => {
        console.log(res)
        this.setData({ schoolName: res.group_name })
      })
      .catch(error => {
        console.warn(`获取学校信息失败：${error}`)
      })
  },
  // 获取活动列表
  getDiscountList (groupId) {
    api.getDiscountList(groupId)
      .then((res = []) => {
        this.setData({ discountList: res })
      })
      .catch(error => {
        console.warn(`获取活动列表：${error}`)
      })
  },
  // 获取课程列表
  getCourseList () {
    const params = {
      type: 'home',
      group_id: this.data.userInfo.group_id
    }
    api.getCourseList(params)
      .then((list = []) => {
        console.log(list, 'getCourseList')
        this.setData({ courseList: list })
      })
      .catch(error => {
        console.warn(`获取课程列表：${error}`)
        // this.getDiscountList()
      })
  },
  // 更多活动跳转
  moreDiscount () {
    wx.navigateTo({
      url: '/pages/discountList/discountList'
    })
  },
  // 更多课程跳转
  moreCourse () {
    wx.switchTab({
      url: '/pages/courseList/courseList'
    })
  },
  // 跳转
  jump (e) {
    console.log('jump', e)
    let item = e.currentTarget.dataset.item
    switch (item.msg_type) {
      case '2':
        wx.navigateTo({
          url: `/pages/courseSpace/courseSpace?arrangeId=${item.arrange_id}&teacherId=${item.teacher_id}`
        })
        break
      case '3':
        wx.navigateTo({
          url: '/pages/myCourseList/myCourseList'
        })
        break
    }
  },
  // 跳转banner详情页面
  toBanner (event) {
    let url = event.currentTarget.dataset.url
    // if (url.indexOf('https://') > -1) {
    //   let toUrl = encodeURIComponent(url)
    //   console.log(toUrl, 'toUrl')
    //   wx.navigateTo({
    //     url: '/pages/webView/main?url=' + toUrl
    //   })
    // } else {
    //   superNavigation(url)
    // }
  },

  // swiper防抖
  swiperChange (e) {
    if (e.target.source !== 'touch') {
      return
    }
    if (this.data.current === 0 && this.data.preIndex > 1) {
      this.data.current = this.data.preIndex
    } else {
      this.data.preIndex = this.data.current
    }
  }
  /* methods end */

})
