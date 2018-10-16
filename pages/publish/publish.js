const { uploadImg } = require('../../utils/common.js')
const api = require('../../utils/api/index.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: [],
    currentInput: '',
    isShow: false,
    id: '',
    showPreviewImage: false,
    loadMoreImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (opacity) {
    this.id = opacity.id
    this.setData({ isShow: true })
  },

  onShow () {
    if (this.data.showPreviewImage) {
      this.data.showPreviewImage = false
      return
    }
    if (this.data.loadMoreImg) {
      this.data.loadMoreImg = false
      return
    }
    this.setData({
      file: [],
      currentInput: ''
    })
  },

  /* methods start */
  _getInput (e) {
    this.setData({ currentInput: e.detail.value.replace(/(^\s*)|(\s*$)/g, '') })
  },
  _chooseImage () { // 上传图片
    this.data.showPreviewImage = true
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
                this.setData({ file: this.data.file.concat(data.url) })
                setTimeout(() => {
                  if (i === tempFilePaths.length - 1) {
                    wx.hideLoading()
                  }
                })
              })
          }
        },
        fail: error => {
          if (error.errMsg === 'chooseImage:fail') {
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
  _delImage (e) {
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认删除该照片？',
      confirmColor: '#40BF6A',
      success: res => {
        if (res.confirm) {
          this.data.file.splice(index, 1)
          this.setData({ file: this.data.file })
        }
      }
    })
  },
  _previewImage (e) {
    let index = e.currentTarget.dataset.index
    this.data.showPreviewImage = true
    wx.previewImage({
      current: this.data.file[index], // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },
  _submit () {
    if (!this.data.currentInput && this.data.file.length === 0) {
      return
    }
    let args = {
      moment_content: this.data.currentInput,
      moment_images: this.data.file
    }
    api.updateParentMoment(args)
      .then(res => {
        wx.navigateBack({
          detail: 1
        })
      })
  }
  /* methods end */
  
})