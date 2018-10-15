// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrangeId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (query) {
    let arrangeId = query.arrangeId
    this.setData({ arrangeId })
  },

})