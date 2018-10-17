const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const { getUserInfo, setUserInfo, wxLogin } = require('../../utils/common.js')

Page({

 data: {
  query: {},
  arrangeId: null,
  teacherId: null,
  userInfo: {},
  auth: false,
  type: 'homeCourse',
  schoolIndex: 0,
  isBindSchool: true,
  isBackHome: false,
  isInitCourse: false,
  course: {
    signup_status: 1,
    signup_desc: '',
    group_name: ''
  },
  options: {
    school: []
  }
 },
  
  onLoad (query) {
    console.log('courseDetail_onLoad', query)
    this.data.arrangeId = parseInt(query.arrangeId)
    if (query.isBackHome) this.setData({ isBackHome: true })
    this.setData({
      type: query.type || this.data.type,
      userInfo: getUserInfo(),
      query
    })
    this.init()
  },
  
  onReady () {
    this.setData({ isInitCourse: true })
  },
  
  /* methods start */
  async init () {
    // 获取学校列表
    let GroupList = await this.getGroupList()
    this.setData({ ['options.school']: GroupList })
  },
  getGroupList () {
    return api.getGroupList()
  },
  async onSignUp () {
    let groupId = parseInt(this.data.userInfo.group_id)
    if (this.data.course.signup_status !== 1) { // 已报名或报满
      console.log('已报名或报满')
      return false
    }
    if (!this.data.userInfo.nickName) { // 检测是否授权
      this.setData({ auth: true })
      return false
    }
    if (groupId < 0) { // 检测是否绑定学校
      console.log('检测是否绑定学校')
      this.setData({ isBindSchool: false })
      return false
    }
    if (groupId < 0 && !this.data.userInfo.parent_phone) { // 检测用户是否判定手机
      console.log('检测用户是否判定手机')
      this.goBindPhone()
      return false
    }
    let params = {
      arrange_id: this.data.arrangeId
    }
    try {
      let data = await api.createOrder(params)
      wx.navigateTo({
        url: `/pages/confirmOrder/confirmOrder?orderId=${data.order_id}`
      })
    } catch (err) {
      console.error('创建订单失败', err)
      wx.showModal({
        content: err.errmsg,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  getCode () {
    wx.login({
      success: res => {
        this.data.code = res.code
        // callback && callback(res.code)
      },
      fail: () => {
        this.getCode()
      }
    })
  },
  handleAuthLogin (info) {
    console.log('courseDetail_handleAuthLogin', info.detail)
    wxLogin({
      userInfo: info.detail.userInfo,
      encryptedData: info.detail.encryptedData,
      iv: info.detail.iv,
      code: this.data.code,
      callback: (updateUserInfo) => {
        this.setData({
          auth: false,
          userInfo: updateUserInfo
        })
      }
    })
  },
  async bindSchoolChange (e) {
    console.log('bindSchoolChange', e)
    this.data.schoolIndex = parseInt(e.detail.value)
    this.setData({ schoolIndex: parseInt(e.detail.value) })
    let groupId = +this.data.options.school[this.data.schoolIndex].group_id
    await api.bindGroup({ group_id: groupId })
    this.data.userInfo.group_id = groupId
    setUserInfo(this.data.userInfo)
    this.setData({ isBindSchool: true })
    wx.showToast({
      title: '学校绑定成功',
      icon: 'none',
      duration: 2000
    })
    if (!this.data.userInfo.parent_phone) { // 检测用户是否判定手机
      this.goBindPhone()
    }
  },
  goBindPhone () {
    let route = this.route
    console.log('route', route)
    wx.navigateTo({
      url: `/pages/phone/phone?arrangeId=${this.data.arrangeId}&pagePath=${encodeURIComponent(route)}`
    })
  },
  openPoster () {
    wx.navigateTo({
      url: `/pages/poster/poster?arrangeId=${this.data.arrangeId}&school=${encodeURIComponent(this.data.course.group_name)}`
    })
  },
  _sendSignupStatus (e) {
    console.log('_sendSignupStatus', e)
    this.setData({
      'course.signup_status': e.detail.signupStatus,
      'course.signup_desc': e.detail.signupDesc,
      'course.group_name': e.detail.groupName,
    })
  }
  /* methods end */
})