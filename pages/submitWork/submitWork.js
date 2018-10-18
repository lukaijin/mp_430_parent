const api = require('../../utils/api/index.js')
const { uploadImg } = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: [],
    isShow: false
  },

  onLoad (option) {
    this.data.id = option.id
    this.setData({ isShow: true })
  },

  /* methods start */
  _chooseImage () { // 上传图片
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
      confirmColor: '#ED4545',
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
    wx.previewImage({
      current: this.data.file[index], // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },
  _submit () {
    if (this.data.file.length === 0) {
      wx.showToast({
        title: '请先上传作业',
        icon: 'none'
      })
      return
    }
    let parmes = {
      report_id: this.data.id,
      homework_images: this.data.file
    }
    api.updateReporthomework(parmes)
      .then(res => {
        wx.showToast({
          title: '成功提交作业'
        })
        // eslint-disable-next-line
        let pages = getCurrentPages()// 当前页面
        let prevPage = pages[pages.length - 2]// 上一页面
        prevPage.setData({// 直接给上移页面赋值
          item: this.data.id,
          selAddress: 'yes'
        })
        wx.navigateBack({
          detail: 1
        })
      })
  }
  /* methods end */
  
})