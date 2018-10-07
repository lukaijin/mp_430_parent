const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
let { wxLogin, getUserInfo, setNavigationBarColorAndTabBarStyle } = require('../../utils/common.js')

Page({

  data: {
    userInfo: {},
    auth: false,
    parentInfo: {parent_name: ''},
    remote_app_id: '', // 'wxfdd778f2a9a0c054
    remote_app_page: '', // /pages/home/main
    totalCount: 0
  },

  onShow () {
    this.setData({
      userInfo: getUserInfo()
    })
    // 查看是否授权
    if (this.data.userInfo.nickName) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              lang: 'zh_CN',
              success: () => {
                this.getParentInfo()
              }
            })
          }
        }
      })
    }
    this.getCode()
    this.getTeacherInfoByPhone()
    this._getLatestMessageCount()
  },

  //methods方法 start
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
  _getLatestMessageCount () {
    api.getLatestMessageCount()
      .then(res => {
        this.setData({ totalCount: Number(res.totalCount) })
      })
  },
  getParentInfo () {
    api.getParentInfo()
      .then(res => {
        this.setData({ parentInfo: res })
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
      url: `/pages/phone/phone?pagePath=${encodeURIComponent(route)}`
    })
  },

  openPage (e) {
    // console.log(e)
    let type = e.currentTarget.dataset.type
    if (!this.data.userInfo.nickName) {
      this.setData({ auth: true })
    } else {
      wx.navigateTo({
        url: `/pages/${type}/${type}`
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
    }
  }
  //methods方法 end

})