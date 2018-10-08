// components/Dialog/Dialog.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShowDialog: {
      type: Boolean,
      value: false
    },
    tagsInfo: {
      type: Array,
      value: []
    },
    closeOnClickModal: {
      type: Boolean,
      value: true
    }
},

  /**
   * 组件的初始数据
   */
  data: {
    hideModel: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose () {
      var eventDetail = { bool: false } // detail对象，提供给事件监听函数
      this.triggerEvent('close', eventDetail)
    }
  }
})
