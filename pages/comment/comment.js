// pages/comment/comment.js
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const { uploadImg } = require('../../utils/common.js')
const device = wx.getSystemInfoSync()
const width = device.windowWidth
let height = 0
const statusBarHeight = wx.getStorageSync('statusBarHeight')
const titleBarHeight = wx.getStorageSync('titleBarHeight')
height = device.windowHeight - 50 - (statusBarHeight + titleBarHeight)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 300,
    value: '',
    parmes: {
      reply_content: ''
    },
    file: [],
    showPreviewImage: false,
    loadMoreImg: false
  },

  onLoad(option) {
    this.data.parmes = {}
    if (option.to_user_id === 'undefined' || !option.to_user_id) {
      this.data.parmes.report_id = option.report_id
      this.data.parmes.from_user_id = option.from_user_id
      this.data.parmes.from_user_type = option.from_user_type
    } else {
      this.data.parmes = option
    }
  },

  onShow() {
    if (this.data.showPreviewImage) {
      this.data.showPreviewImage = false
      return
    }
    if (this.data.loadMoreImg) {
      this.data.loadMoreImg = false
      return
    }
    this.data.file = []
  },

  _chooseImage() { // 上传图片
    this.data.loadMoreImg = true
    if (this.data.file.length < 9) { // 只可以上传9张
      wx.chooseImage({
        count: 9 - this.data.file.length,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          let tempFilePaths = res.tempFilePaths
          wx.showLoading({
            title: '上传中',
            mask: true
          })
          for (let i = 0; i < tempFilePaths.length; i++) {
            uploadImg(tempFilePaths[i])
              .then(data => {
                this.data.file = this.data.file.concat(data.url)
                console.log(this.data.file)
                setTimeout(() => {
                  if (i === tempFilePaths.length - 1) {
                    wx.hideLoading()
                    this.setData({
                      file: this.data.file
                    })
                  }
                },1000)
              })
          }
        },
        fail: function (ress) {
          if (ress.errMsg === 'chooseImage:fail') {
            wx.showModal({
              content: '上传失败，请重新上传'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '不能添加了',
        icon: 'success',
        duration: 2000
      })
    }
  },
  _bindinput(event) {
    this.data.value = event.detail.value.replace(/(^\s*)|(\s*$)/g, '')
    this.setData({
      'parmes.reply_content': this.data.value,
        value: this.data.value
    })
  },
  _delImage(event) {
    let index = event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认删除该照片？',
      confirmColor: '#ED4545',
      success: res => {
        if (res.confirm) {
          this.data.file.splice(index, 1)
          this.setData({
            file: this.data.file
          })
        }
      }
    })
  },
  _previewImage(event) {
    this.showPreviewImage = true
    let index = event.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.file[index], // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },
  _submit() {
    this.data.parmes.from_user_type = 2
    this.data.parmes.from_user_id = wx.getStorageSync('userInfo').parent_id
    this.data.parmes.reply_images = this.data.file
    console.log(this.data.parmes, 'this.data.parmes')
    if (!this.data.parmes.reply_content) {
      wx.showToast({
        title: '请输入评语'
      })
      return
    }
    this._submitReply()
  },
  _submitReply() {
    api.submitReply(this.data.parmes)
      .then(res => {
        wx.navigateBack({
          delta: 1
        })
      })
  }

})