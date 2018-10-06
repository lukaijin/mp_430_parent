const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')

const api = require('../../utils/api/index.js')
let { wxLogin, getUserInfo, setNavigationBarColorAndTabBarStyle } = require('../../utils/common.js')

const app = getApp()

Page({

  data: {
    userInfo: {},
    auth: false,
    isTeacherMpInfo: false,
    remote_app_id: '', // 'wxfdd778f2a9a0c054
    remote_app_page: '' // /pages/home/main
  },

  onShow () {
    this.setData({
      userInfo: app.globalData.userInfo,
      isTeacherMpInfo: wx.getStorageSync('isTeacherMpInfo')
    })
    console.log('getStorageSync_isTeacherMpInfo', this.data.isTeacherMpInfo)
    this.getCode()
    this.getTeacherInfoByPhone()
    // this._getLatestMessageCount()
  },

  //methods方法 start
  _getLatestMessageCount () {
    api.getLatestMessageCount()
      .then(res => {
        this.totalCount = Number(res.totalCount)
      })
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
  onToLogin () {
    console.log('onToLogin')
    if (!this.data.userInfo.nickName) {
      this.setData({ auth: true })
    } else if (!this.data.userInfo.parent_phone) {
      this.onAddPhone()
    }
  },
  onAddPhone () {
    let route = this.route
    wx.navigateTo({
      url: `/pages/phone/main?pagePath=${encodeURIComponent(route)}`
    })
  },

  handleAuthLogin (info) {
    console.log('handleAuthLogin', info)
    // let tempInfo = info
    // console.log(info, 'info')
    // if (!this.data.code) {
    //   this.getCode(() => {
    //     this.handleAuthLogin(tempInfo)
    //   })
    //   return
    // }
    wxLogin({
      userInfo: info.detail,
      code: this.data.code,
      callback: () => {
        setNavigationBarColorAndTabBarStyle('#ffffff')
        this.setData({
          auth: false,
          userInfo: getUserInfo()
        })
      }
    })
  },
  openPage (type) {
    if (!this.data.userInfo.nickName) {
      this.setData({ auth: true })
    } else {
      wx.navigateTo({
        url: `/pages/${type}/main`
      })
    }
  },
  onToTeacherMp () {
    console.log('onToTeacherMp')
    if (!this.data.userInfo.nickName) this.setData({ auth: true })
  },
  async getTeacherInfoByPhone () {
    let res = await api.getTeacherInfoByPhone(this.data.userInfo.parent_phone)
    console.log('api_getTeacherInfoByPhone', res)
    if (res) {
      this.setData({
        remote_app_id: res.remote_app_id,
        remote_app_page: res.remote_app_page
      })
      if (!this.data.isTeacherMpInfo) {
        wx.setStorageSync('isTeacherMpInfo', true)
        this.setData({ isTeacherMpInfo: true })
        console.log('isTeacherMpInfo', this.data.isTeacherMpInfo)
      }
    }
  }
  //methods方法 end

})