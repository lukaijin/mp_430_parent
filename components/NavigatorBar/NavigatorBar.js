Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    titleColor: {
      type: String,
      value: '#333333'
    },
    arrowColor: {
      type: String,
      value: '#333333'
    },
    type: {
      type: Number,
      value: 0
    },
    headerBgColor: {
      type: String,
      value: '#ffffff'
    },
    bgColor: {
      type: String,
      value: '#ffffff'
    },
    totalCount: {
      type: Number,
      value: 0
    }
},

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: '',
    titleBarHeight: ''
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached () {
      this.setData({
        statusBarHeight: wx.getStorageSync('statusBarHeight'),
        titleBarHeight: wx.getStorageSync('titleBarHeight')
      })
      console.log('statusBarHeight', this.data.statusBarHeight)
      console.log('titleBarHeight', this.data.titleBarHeight)
    },
    moved: function () { },
    detached: function () { },
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    _toMessage () {
      wx.navigateTo({
        url: '/pages/message/message'
      })
    }
  }
})
