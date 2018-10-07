const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const options = require('../../utils/options.js')
const { uploadImg } = require('../../utils/common.js')
// import MpvueCropper from 'mpvue-cropper'

let wecropper = null
const device = wx.getSystemInfoSync()
const width = device.windowWidth
let height = 0
const statusBarHeight = wx.getStorageSync('statusBarHeight')
const titleBarHeight = wx.getStorageSync('titleBarHeight')
height = device.windowHeight - 50 - (statusBarHeight + titleBarHeight)

Page({

  data: {
    index: 0,
    genderIndex: -1,
    statusBarHeight: '',
    titleBarHeight: '',
    child: {
      child_name: '',
      child_birthday: '',
      child_sex: null
    },
    options: {
      gender: options.gender
    },
    iscropper: false,
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },

  onLoad: function (options) {

  },

  onReady: function () {
    // wecropper = this.$refs.cropper
    // console.log(wecropper, 'wecropper')
    this.getChildInfo()
    this.statusBarHeight = wx.getStorageSync('statusBarHeight')
    this.titleBarHeight = wx.getStorageSync('titleBarHeight')
  },

  onShow: function () {
    // if (wx.getStorageSync('childSrc')) {
    //   wecropper.pushOrigin(wx.getStorageSync('childSrc'))
    // }
  },

  /* methods start */
  cropperReady (...args) {
    console.log('cropper ready!')
  },
  cropperBeforeImageLoad (...args) {
    console.log('before image load')
  },
  cropperLoad (...args) {
    console.log('image loaded')
  },
  cropperBeforeDraw (...args) {
    // Todo: 绘制水印等等
  },
  _close () {
    this.setData({ iscropper: false })
  },
  uploadTap () {
    const _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        _this.setData({ iscropper: true })
        wx.setStorageSync('childSrc', src)
        // wecropper.pushOrigin(src)
      }
    })
  },
  getCropperImage () {
    const _this = this
    // wecropper
    //   .getCropperImage()
    //   .then(src => {
    //     if (src) {
    //       this.iscropper = false
    //       wx.showLoading({ title: '上传中' })
    //       uploadImg(src)
    //         .then((data) => {
    //           data.url = data.url + ''
    //           this.$set(_this.child, 'child_headimgurl', data.url)
    //           wx.hideLoading()
    //         })
    //         .catch((e) => {
    //           wx.hideLoading()
    //           wx.showToast({
    //             title: '上传失败，请重新上传',
    //             icon: 'none',
    //             duration: 1500,
    //             mask: true
    //           })
    //         })
    //     }
    //   })
    //   .catch(e => {
    //     console.error('获取图片失败')
    //   })
  },
  async getChildInfo () {
    let res = await api.getChildInfo()
    if (res) {
      this.setData({
        child: res,
        genderIndex: parseInt(res.child_sex) - 1
      })
    }
  },
  bindChildName (e) {
    this.setData({ ['child.child_name']: e.detail.value })
  },
  bindBirthdayChange (e) {
    this.setData({ ['child.child_birthday']: e.detail.value })
  },
  bindGenderChange (e) {
    this.setData({
      genderIndex: parseInt(e.detail.value),
      ['child.child_sex']: this.data.genderIndex + 1
    })
  },

  async formSubmit (e) {
    var obj = e.detail.value
    var params = {
      child_name: obj.child_name,
      child_birthday: obj.child_birthday,
      child_sex: this.data.child.child_sex,
      child_headimgurl: this.data.child.child_headimgurl
    }
    try {
      await api.updateChildInfo(params)
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      wx.showToast({
        title: '服务器异常',
        icon: 'none',
        duration: 2000
      })
    }
  }
/* methods end */

})