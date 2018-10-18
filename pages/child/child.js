const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const options = require('../../utils/options.js')
const { uploadImg } = require('../../utils/common.js')

let WeCropper = require('we-cropper')

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

  onLoad () {
    let { cropperOpt } = this.data
    new WeCropper(cropperOpt)
    .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
    })
    .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context: ${ctx}`)
        wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
        })
    })
    .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
    })

    this.getChildInfo()
    this.setData({
      statusBarHeight: wx.getStorageSync('statusBarHeight'),
      titleBarHeight: wx.getStorageSync('titleBarHeight')
    })
    
  },

  // onReady () {
  //   this.getChildInfo()
  //   this.setData({
  //     statusBarHeight: wx.getStorageSync('statusBarHeight'),
  //     titleBarHeight: wx.getStorageSync('titleBarHeight')
  //   })
  // },

  onShow () {
    if (wx.getStorageSync('childSrc')) {
      this.wecropper.pushOrign(wx.getStorageSync('childSrc'))
    }
  },

  /* methods start */
  touchstart (e) {
    this.wecropper.touchStart(e)
  },
  touchmove (e) {
    this.wecropper.touchMove(e)
  },
  touchend (e) {
    this.wecropper.touchEnd(e)
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
        _this.wecropper.pushOrign(src)
      }
    })
  },
  getCropperImage () {
    const _this = this
    this.wecropper.getCropperImage((src) => {
      if (src) {
        _this.setData({ iscropper: false })
        wx.showLoading({ title: '上传中' })
        uploadImg(src)
          .then((data) => {
            data.url = data.url + ''
            _this.setData({ ['child.child_headimgurl']: data.url })
            wx.hideLoading()
          })
          .catch((e) => {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败，请重新上传',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
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