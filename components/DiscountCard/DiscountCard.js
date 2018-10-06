// components/DiscountCard/DiscountCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenDetails (e) {
      let discountId = e.currentTarget.dataset.discountId
      wx.navigateTo({
        url: '/pages/discountDetail/discountDetail?discountId=' + discountId
      })
    }
  }
})
