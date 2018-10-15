const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const options = require('../../utils/options.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    options: {
      orderStatus: options.orderStatus
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openOrder (e) {
      let orderId = parseInt(e.currentTarget.dataset.orderId)
      let orderStatus = parseInt(e.currentTarget.dataset.orderStatus)
      if (orderStatus === 1) { // 1: '待支付',
        wx.navigateTo({
          url: `/pages/orderPayment/orderPayment?orderId=${orderId}`
        })
      } else if (orderStatus === 2) { // 2: '已完成'
        wx.navigateTo({
          url: `/pages/orderDetail/orderDetail?orderId=${orderId}`
        })
      }
    },
    delOrder (e) {
      let orderId = parseInt(e.currentTarget.dataset.orderId)
      let index = parseInt(e.currentTarget.dataset.index)
      wx.showModal({
        title: '删除提示',
        content: '你确定要删除该订单吗？删除后不可恢复!',
        success: async res => {
          if (res.confirm) {
            let params = {
              order_id: orderId
            }
            await api.deleteOrder(params)
            this.data.orderList.splice(index, 1)
            this.setData({ orderList: this.data.orderList })
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
          }
        },
        fail () {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      })
    }
  }
})
