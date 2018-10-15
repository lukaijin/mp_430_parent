const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const { getYearMonthDate, getWeek, getRangTime } = require('../../utils/time.js')

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    orderId: {
      type: Number,
      value: 0
    },
    isPayment: { // 确认订单页面和订单支付页面
      type: Boolean,
      value: false
    },
    isOrderPayment: { // 订单支付页面
      type: Boolean,
      value: false
    },
    isOrderDetail: { // 订单详情页面
      type: Boolean,
      value: false
    }
  },

  lifetimes: {
    attached () {
    },
    ready () {
      if (this.data.orderId) {
        this.getOrderDetail(this.data.orderId)
      }
     },
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    order: {
      order_id: null,
      arrange_id: null,
      order_out_trade_no: '',
      order_status: null,
      arrange_image: '',
      course_name: '',
      arrange_discount_price: '',
      startdate: '',
      enddate: '',
      order_total_fee: '',
      order_time_start: ''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getOrderDetail (orderId) {
      var params = {
        order_id: orderId
      }
      try {
        let res = await api.getOrderDetail(params)
        this.data.order = res
        this.data.order.week = getWeek(res.startdate)
        this.data.order.rangTime = getRangTime(res.startdate, res.enddate)
        this.data.order.startdate = getYearMonthDate(res.startdate, 'YYYY-M-D')
        this.data.order.enddate = getYearMonthDate(res.enddate, 'YYYY-M-D')
        this.setData({ order: this.data.order })
      } catch (err) {
        console.warn(err)
      }
    },
    async onPayment () {
      var params = {
        order_id: this.data.orderId
      }
      try {
        let data = await api.payOrder(params)
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': res => {
            console.log('wx_requestPayment', res)
            wx.navigateTo({
              url: `/pages/success/success?arrangeId=${this.data.order.arrange_id}`
            })
          },
          'fail': () => {
            console.log('关闭支付')
            wx.navigateTo({
              url: `/pages/myOrder/myOrder`
            })
          }
        })
      } catch (err) {
        wx.showToast({ title: err.errmsg, icon: 'none' })
        console.warn('onPayment_err', err)
      }
    },
    delOrder (e) {
      let orderId = parent(e.currentTarget.dataset.orderId)
      wx.showModal({
        title: '删除提示',
        content: '你确定要删除该订单吗？删除后不可恢复!',
        success: async res => {
          // console.log('delOrder', res)
          if (res.confirm) {
            let params = {
              order_id: +orderId
            }
            await api.deleteOrder(params)
            wx.navigateBack({
              delta: 1
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
