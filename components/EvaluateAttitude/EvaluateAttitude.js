// components/EvaluateAttitude/EvaluateAttitude.js
Component({
  optopns: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  methods: {
    onPreviewImage (e) {
      let img = e.currentTarget.dataset.img
      let imgs = e.currentTarget.dataset.imgs
      this.triggerEvent('previewImage', {img, imgs})
    }
  }

})
