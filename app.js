const api = require('./utils/api/index.js')
let  { getUserInfo, setUserInfo } = require('./utils/common.js')
// require('./utils/wxPromise.js')
//app.js
App({
  onLaunch (path) {
    console.log('onLaunch', path)
    this.globalData = {
      userInfo: getUserInfo()
    }
    console.log('onLaunch_globalData', this.globalData)
    this.getCode()
    const redirectUrl = this._redirectUrlHandle(path)
    this._getSetting(redirectUrl)
  },

  _redirectUrlHandle (path) {
    let query = ''
    for (let i in path.query) {
      if (i) {
        query = query + `${i}=${path.query[i]}&`
      }
    }
    return query ? `${path.path}?${query}` : path.path
  },
  
  _getSetting(redirectUrl) { //查看是否授权过，更新授权状态
    console.log('redirectUrl', redirectUrl)
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
          _this.globalData.userInfo = userInfo
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
  },
  
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
    let params = {
      scode: code,
      group_id: getUserInfo().group_id || null
    }
    api.login(params)
      .then(res => {
        setUserInfo(Object.assign(this.globalData.userInfo, res))
        wx.hideLoading()
      })
      .catch(error => {
        console.warn(`获取用户信息失败：${error}`)
      })
  }

})
