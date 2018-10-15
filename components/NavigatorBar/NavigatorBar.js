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
    statusBarHeight: '20',
    titleBarHeight: '44',
    navigatorHidden: false,
    show: false
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached () {
      const pages = getCurrentPages()
      console.log('pages', pages, pages.length - 1 === 0)
      this.setData({
        statusBarHeight: wx.getStorageSync('statusBarHeight'),
        titleBarHeight: wx.getStorageSync('titleBarHeight'),
        navigatorHidden: pages.length - 1 === 0
      })
      console.log('statusBarHeight', this.data.statusBarHeight)
      console.log('titleBarHeight', this.data.titleBarHeight)
    },
    moved: function () { },
    detached: function () { },
    ready () {
      console.log('navigatorHidden', this.data.navigatorHidden)
      this.setData({ show: true })
    },
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
