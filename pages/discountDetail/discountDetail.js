const api = require('../../utils/api/index.js')
// import wxParse from 'mpvue-wxparse'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discount: {
      discount_title: '',
      discount_desc: '',
      update_time: '',
      discount_content: ''
    },
    isBackHome: false,
    imageProp: {
      mode: 'widthFix'
    }
  },

  onLoad (query) {
    if (query.isBackHome) this.setData({ isBackHome: true })
    this.data.discountId = query.discountId
    this.getDiscountDetail(this.data.discountId)
  },

  onShareAppMessage (res) {
    return {
      title: this.data.discount.discount_title,
      imageUrl: this.data.discount.discount_image,
      path: `/pages/discountDetail/discountDetail?discountId=${this.data.discountId}&isBackHome=${true}`
    }
  },
  
  /* methods start */
  getDiscountDetail (discountId) {
    wx.showLoading()
    api.getDiscountDetail(discountId)
      .then(res => {
        res.discount_content = res.discount_content.replace(/<p><br><\/p>/g, '')
        this.setData({ discount: res })
        wx.hideLoading()
      })
      .catch(error => {
        console.log(error)
      })
  }
  /* methods end */
  
})