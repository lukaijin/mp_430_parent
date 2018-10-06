let { setNavigationBarColorAndTabBarStyle } = require('../../utils/common.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    auth: {
      type: Boolean,
      value: false
    },
    userInfo: {
      type: Object,
      value: {}
    }
  },

  onLoad () {
    setNavigationBarColorAndTabBarStyle('#4c4c4c')
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
    onGetuserinfo (event) {
      console.log('onGetuserinfo', event)
      this.triggerEvent('login', event.detail.userInfo)
    }
  }
})
