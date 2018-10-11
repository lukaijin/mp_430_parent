const { getUserInfo, setUserInfo } = require('./utils/common.js')
// const api = require('./utils/api/index.js')
require('./utils/wxPromise.js')
//app.js
App({
  onLaunch (options) {
    console.log('onLaunch', options)
    this.globalData = {
      userInfo: getUserInfo()
    }
    console.log('onLaunch_globalData', this.globalData)
    this._getSystemInfo()
    const redirectUrl = this._redirectUrlHandle(options)
    const notIndex = options.path.indexOf('pages/index/index') === -1
    console.log('notIndex', notIndex)
    if (notIndex && !this.globalData.userInfo.open_id) { // 判断有木有open_id
      console.log('没有open_id噢！！！')
      wx.reLaunch({
       url: '/pages/index/index?redirectUrl=' + encodeURIComponent(`/${redirectUrl}`)
     })
     return
   }
  },
  
  _getSystemInfo () {
    wx.getSystemInfo({
      success (res) {
        console.log('getSystemInfo', res)
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        wx.setStorageSync('statusBarHeight', res.statusBarHeight)
        wx.setStorageSync('titleBarHeight', totalTopHeight - res.statusBarHeight)
      },
      fail () {
        wx.setStorageSync('statusBarHeight', 0)
        wx.setStorageSync('titleBarHeight', 0)
      }
    })
  },

  _redirectUrlHandle (options) {
    let query = ''
    for (let i in options.query) {
      if (i) {
        query = query + `${i}=${options.query[i]}&`
      }
    }
    return query ? `${options.path}?${query}` : options.path
  },
  
  _getSetting(redirectUrl) { //查看是否授权过，更新授权状态
    // console.log('redirectUrl', redirectUrl)
    const _this = this;
    if (this.globalData.userInfo.nickName && JSON.stringify(this.globalData.userInfo) !== '{}') {
      // 已经授权过，可以直接调用 getUserInfo 获取头像昵称
      wx.getUserInfo({ //更新用户资料
        success: function (obj) {
          let info = obj.userInfo
          let userInfo = {}
          userInfo = _this.globalData.userInfo
          userInfo.headimgurl = info.avatarUrl
          userInfo.city = info.city
          userInfo.country = info.country
          userInfo.gender = info.gender
          userInfo.nickname = info.nickName
          userInfo.province = info.province
          setUserInfo(Object.assign(_this.globalData.userInfo, userInfo))
          if (_this.userInfoReadyCallback) {
            _this.userInfoReadyCallback(res)
          }
        }
      })
    } else { //没有授权过
      // wx.reLaunch({
      //   url: '/pages/login/login?redirect_url=' + encodeURIComponent(`/${redirectUrl}`)
      // })
    }
  }

})
