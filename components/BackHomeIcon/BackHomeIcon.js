// components/BackHomeIcon/BackHomeIcon.js
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    isBackHome: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onBackHome () {
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
  }
})
