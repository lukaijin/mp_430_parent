let api = null
setTimeout(() => {
  api = require('./api/index.js')
  // console.log('common.js_api', api)
}, 100)
// 获取用户信息
const getUserInfo = () => wx.getStorageSync('userInfo') || {}

// 保存用户信息
const setUserInfo = (userInfo = {}) => wx.setStorageSync('userInfo', userInfo)

// 获取code
 const getCode = (callback) => {
   let code = null
   wx.login({
     success: res => {
       code = res.code
       callback && callback(code)
     },
     fail: () => {
       getCode()
     }
   })
   return code
 }
 
// 授权登录
 const wxLogin = object => {
  if (!wx.canIUse('button.open-type.getUserInfo')) {
    return wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法授权，请升级到最新微信版本后重试。',
      showCancel: false,
      confirmColor: '#ED4545'
    })
  }
  let tempObject = object
  console.log(tempObject, 'tempObject')
  if (!object.code) {
    getCode((code) => {
      tempObject.code = code
      wxLogin(tempObject)
    })
    return
  }
   wx.showLoading({
     title: '登录中...', // 提示的内容,
     mask: true // 显示透明蒙层，防止触摸穿透,
   })
   const params = {
     scode: object.code,
     group_id: getUserInfo().group_id || null
   }
   api.login(params)
     .then(res => {
       console.log(res, '51')
       const args = {
         open_id: res.open_id,
         wx_nickname: object.userInfo.nickName,
         wx_sex: object.userInfo.gender,
         wx_city: object.userInfo.city,
         wx_country: object.userInfo.country,
         wx_province: object.userInfo.province,
         wx_headimgurl: object.userInfo.avatarUrl
       }
       setUserInfo(Object.assign(res, object.userInfo))
       if (object.redirectUrl) {
         wx.switchTab({
           url: `${decodeURIComponent(object.redirectUrl)}`
         })
       }
       object.callback && object.callback()
       api.updateParentWxInfo(args)
       wx.hideLoading()
     })
    .catch(error => {
      console.log('login', error)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: error.errmsg,
        showCancel: false
      })
    })
 }
 
 /**
  * 超级导航
  * @param {string} url 需要跳转到的url地址
  */
 const superNavigation = url => {
   const defaultUrl = '/pages/home/home'
   wx.switchTab({
     url: url,
     fail: () => {
       wx.navigateTo({
         url: url,
         fail: () => {
           wx.reLaunch({
             url: defaultUrl
           })
         }
       })
     }
   })
 }
 
 /**
  * 授权登录的时候修改navigationbar的背景色，显示隐藏tabbar
  * @param {string} color 16进制颜色值
  */
 const setNavigationBarColorAndTabBarStyle = (color = '#ffffff') => {
   color = color === '#fff' ? '#ffffff' : color
   if (color === '#ffffff') {
     wx.showTabBar()
   } else {
     wx.hideTabBar()
   }
   wx.setNavigationBarColor({
     frontColor: '#000000',
     backgroundColor: color,
     animation: {}
   })
 }
 
const uploadImg = function (url) {
   return new Promise((resolve, reject) => {
     api.getOossSignature()
       .then((res) => {
         console.log('getOossSignature', res)
         var key = res.dir + url.replace('http://tmp', 'uedu_weapp/photo')
         res.host = res.host.replace('http://', 'https://')
         var backUrl = res.host + '/' + key
         wx.uploadFile({
           url: res.host,
           filePath: url,
           name: 'file',
           formData: {
             key: key,
             policy: res.policy,
             OSSAccessKeyId: res.accessid,
             signature: res.signature,
             success_action_status: '200'
           },
           success: function (rs) {
             resolve({ url: backUrl })
           },
           fail: function (err) {
             console.log('uploadImg_fail')
             reject(err)
             wx.hideLoading()
           }
         })
       })
   })
 } 

module.exports = {
   getUserInfo,
   setUserInfo,
   wxLogin,
   setNavigationBarColorAndTabBarStyle,
   uploadImg
}