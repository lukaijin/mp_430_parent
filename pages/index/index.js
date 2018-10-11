const api = require('../../utils/api/index.js')
const { getUserInfo, setUserInfo } = require('../../utils/common.js')

Page({
  data: {
    redirectUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log('_indedx_onLoad_', options)
    let redirectUrl = options.redirectUrl ? decodeURIComponent(options.redirectUrl) : ''
    this.setData({ redirectUrl: redirectUrl})
    this.data.userInfo = getUserInfo()
    this.getCode()
  },

  /* methods start */
  getCode () {
    const _this = this
    wx.login({
      success: res => {
        _this.login(res.code)
      },
      fail: () => {
        _this.getCode()
      }
    })
  },

  login (code) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let params = {
      scode: code,
      group_id: getUserInfo().group_id || null
    }
    api.login(params)
      .then(res => {
        setUserInfo(Object.assign(this.data.userInfo, res))
        wx.hideLoading()
        // 登录成功，可以回到原来页面
        if (this.data.redirectUrl) {
          // debugger
          // 此处可以根据来源做出不同的路由操作
          wx.reLaunch({
            url: this.data.redirectUrl
          })
        } else {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      })
      .catch(error => {
        console.warn(`获取服务器用户信息失败：${error}`)
      })
  }
  /* methods end */
})