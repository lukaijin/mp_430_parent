const api = require('../../utils/api/index.js')
const { getUserInfo, setUserInfo } = require('../../utils/common.js')

Page({

  data: {
    phone: '',
    authCode: '',
    time: 0,
    userInfo: {},
    active: false,
  },
  
  onLoad (options) {
    this.data.phoneReady = false
    this.data.timeReady = true
    this.data.timer = null
    this.data.pagePath = decodeURIComponent(options.pagePath)
    this.data.arrangeId = options.arrangeId
    this.setData({
      userInfo: getUserInfo()
    })
    console.log('_route_', `/${this.data.pagePath}?type=homeCourse&arrangeId=${this.data.arrangeId}`)
  },

  onUnload () {
    clearInterval(this.data.timer)
  },

  /* methods start */
  checkPhone () {
    if (!this.data.phone.match(/^1[345789]\d{9}$/) || (this.data.phone.length !== 11)) {
      wx.showToast({
        icon: 'none',
        title: '手机号码格式不正确'
      })
      return false
    }
    return true
  },

  checkAuthCode () {
    if (!this.data.authCode.match(/^\d{6}$/) || (this.data.authCode.length !== 6)) {
      wx.showToast({
        icon: 'none',
        title: '验证码为六位数字'
      })
      return false
    }
    return true
  },

  getCode () {
    console.log(this.data.time, 'this.data.time')
    if (this.data.time) {
      return false
    }
    console.log(this.checkPhone(), 'this.checkPhone()')
    this.data.phoneReady = this.checkPhone()
    if (!this.data.phoneReady) {
      return false
    }
    const params = {
      phone: this.data.phone
    }
    api.sendAuthCode(params)
      .then(() => {
        wx.showToast({
          title: '验证码获取成功',
          icon: 'none'
        })
        this.setInterval()
      })
      .catch(error => {
        wx.showToast({
          title: error.errmsg,
          icon: 'none'
        })
      })
  },

  setInterval () {
    this.setData({ time: 60 })
    let time = this.data.time
    this.data.timer = setInterval(() => {
      time --
      this.setData({ time: time }, () => {  
        // console.log(this.data.time, 'this.data.time')
        if (this.data.time < 1) {
          clearInterval(this.data.timer)  
          this.data.timer = null
          this.setData({ time: 0 })
        }
      })
    }, 1000)
  },

  onPhoneInput (e) {
    this.setData({ phone: e.detail.value }, () => {
      if (this.data.phone && this.data.authCode) {
        this.setData({ active: true })
      } else  {
        this.setData({ active: false })
      }
    })
  },
  onAuthCodeInput (e) {
    this.setData({ authCode: e.detail.value }, () => {
      if (this.data.phone && this.data.authCode) {
        this.setData({ active: true })
      } else {
        this.setData({ active: false })
      }
    })
  },

  handleBindPhone () {
    if (!this.data.active) {
      return
    }
    this.data.phoneReady = this.checkPhone()
    this.data.codeReady = this.checkAuthCode()

    if (!(this.data.phoneReady && this.data.codeReady)) {
      return false
    }
    const params = {
      phone: this.data.phone,
      auth_code: this.data.authCode
    }
    api.bindPhone(params)
      .then(() => {
        this.setData({
          ['userInfo.parent_phone']: this.data.phone
        }, () => {
          setUserInfo(this.data.userInfo)
          wx.switchTab({
            url: `/${this.data.pagePath}`,
            fail: () => {
              wx.navigateTo({
                url: `/${this.data.pagePath}?type=homeCourse&arrangeId=${this.data.arrangeId}`
              })
            }
          })
        })
      })
      .catch(error => {
        console.log(error)
        wx.showToast({
          title: error.errmsg,
          icon: 'none'
        })
      })
  }
  /* methods end */
})