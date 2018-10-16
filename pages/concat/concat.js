// pages/concat/concat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '181-2677-8040',
    wechat: 'czyxgfkf'
  },

  /* methods start */
  callPhone () {
    const phone = this.data.phone.replace(/-/g, '')
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        wx.showToast({
          title: '拉起拨号成功',
          icon: 'none'
        })
      },
      fail: () => {
        wx.showToast({
          title: '拉起拨号失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.showToast({
          title: '拉起拨号成功',
          icon: 'none'
        })
      }
    })
  },
  setClipboardData () {
    wx.setClipboardData({
      data: this.data.wechat,
      success: res => {
        wx.getClipboardData({
          success: res => {
          }
        })
      },
      fail: () => {
        wx.showToast({
          title: '客服微信复制失败',
          icon: 'none'
        })
      }
    })
  }
  /* methods end */
})