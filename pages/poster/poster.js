const api = require('../../utils/api/index.js')
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const { getUserInfo, uploadImg } = require('../../utils/common.js')
const { baseUrl } = require('../../config.js')

let WeCropper = require('we-cropper')

const device = wx.getSystemInfoSync()
const width = device.windowWidth
let height = 0
const statusBarHeight = wx.getStorageSync('statusBarHeight')
const titleBarHeight = wx.getStorageSync('titleBarHeight')
height = device.windowHeight - 50 - (statusBarHeight + titleBarHeight)

Page({

  data: {
    id: 1,
    width: '',
    height: '',
    imagePath: '',
    school: '',
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
    isHideUpload: false,
    courseInfo: {
      course_name: '',
      poster_desc1: '',
      poster_desc2: ''
    },
    pageShowImgList: {
      bigBj: 'https://oss.xinjijiaoyu.com/430/uedu_weapp/photo/wx0e886225c0f71b79.o6zAJs7vusIvMVoTy9iBiRslQY9I.WgxKJcbyinwGb0646f98920f81528b6f833e6022d5da.png?x-oss-process=image/resize,m_fill,w_750,h_1206',
      wxacodeunlimit: '',
      address: 'https://oss.xinjijiaoyu.com/430/uedu_weapp/photo/wx0e886225c0f71b79.o6zAJs7vusIvMVoTy9iBiRslQY9I.CrQH8M1q6nCE477c37fa9fdd295375cc929aa65d71eb.png',
      arrowTip: 'https://oss.xinjijiaoyu.com/430/uedu_weapp/photo/wx0e886225c0f71b79.o6zAJs7vusIvMVoTy9iBiRslQY9I.ktcTNyjy6GjS851a16719df8d86b6e51df0844d6cd58.png'
    },
    drawLocalPathLike: {
      bigBj: '',
      address: '',
      arrowTip: '',
      wxacodeunlimit: ''
    },
    statusBarHeight: '',
    titleBarHeight: '',
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

  // computed: {
  //   courseName () {
  //     // return '科学实验课棒啊'.slice(0, 6)
  //     return this.courseInfo.course_name.slice(0, 6)
  //   }
  // },
  
  onLoad (query) {
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

    this.init(query)
    
  },
  
  onShow () {
    this.setData({
      isHideUpload: false,
      imagePath: '',
      ['pageShowImgList.bigBj']: 'https://oss.xinjijiaoyu.com/430/uedu_weapp/photo/wx0e886225c0f71b79.o6zAJs7vusIvMVoTy9iBiRslQY9I.WgxKJcbyinwGb0646f98920f81528b6f833e6022d5da.png?x-oss-process=image/resize,m_fill,w_750,h_1206'
    })
    if (wx.getStorageSync('posterSrc')) {
      this.wecropper.pushOrign(wx.getStorageSync('posterSrc'))
    }
  },

  /* methods start */
  init (query) {
    this.setData({
      statusBarHeight: wx.getStorageSync('statusBarHeight'),
      titleBarHeight: wx.getStorageSync('titleBarHeight'),
      school: '地球中国广州番禺洛溪新诚小学'.slice(0, 10)
    })
    this.data.arrangeId = parseInt(query.arrangeId)
    console.log('arrangeId', query.arrangeId)
    this.getPosterInfo(this.data.arrangeId)
  },
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
        _this.wecropper.pushOrign(src)
        wx.setStorageSync('posterSrc', src)
      },
      fail: error => {
        console.log('_chooseImage_', error)
        if (error.errMsg === 'chooseImage:fail') {
          wx.showModal({
            content: '上传失败，请重新上传'
          })
        }
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
            let url = data.url + '?x-oss-process=image/resize,m_fill,w_750,h_1206'
            console.log('url', url)
            _this.setData({ ['pageShowImgList.bigBj']: url })
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
  async getPosterInfo (arrangeId) {
    wx.showLoading({title: '渲染中...'})
    try {
      let res = await api.getPosterInfo(arrangeId)
      this.setData({ courseInfo: res })
    } catch (err) {
      console.info(err)
    }
    let args = {
      scene: `id=${arrangeId}`,
      page: 'pages/discountDetail/discountDetail',
      width: 112
    }
    let openId = getUserInfo().open_id
    let parentId = parseInt(getUserInfo().parent_id)
    let url = `${baseUrl}/parent/CommonManager/getShareWXACode?open_id=${openId}&parent_id=${parentId}&scene=${args.scene}&page=${args.page}&width=${args.width}`
    this.setData({ 'pageShowImgList.wxacodeunlimit': url })
    console.log('wxacodeunlimit', this.data.pageShowImgList.wxacodeunlimit)
    wx.hideLoading()
  },
  _getHeightscroll () { // 动态获取高度
    wx.showLoading({
      title: '生成中',
      mask: true
    })
    // 创建节点选择器
    var query = wx.createSelectorQuery()
    // 选择id
    query.select('#mjltest').boundingClientRect()
    query.exec(res => {
      // res就是 所有标签为mjltest的元素的信息 的数组
      // 取高度
      this.setData({
        width: res[0].width,
        height: res[0].height
      })
      console.log('_select_', res)
      if (this.data.drawLocalPathLike.bigBj !== '' && this.data.drawLocalPathLike.wxacodeunlimit !== '' && this.data.drawLocalPathLike.address !== '' && this.data.drawLocalPathLike.arrowTip !== '') {
        this._createNewImg()
        return
      }
      // 创建初始化图片
      for (let key in this.data.pageShowImgList) {
        this._getLocalImg(key, this.data.pageShowImgList[key])
      }
    })
  },
  _getLocalImg (key, path) { // 所有要绘制的图片都先转化为本地图片
    wx.getImageInfo({
      src: path,
      success: res => {
        this.data.drawLocalPathLike[key] = res.path
        if (this.data.drawLocalPathLike.bigBj !== '' && this.data.drawLocalPathLike.wxacodeunlimit !== '' && this.data.drawLocalPathLike.address !== '' && this.data.drawLocalPathLike.arrowTip !== '') {
          this._createNewImg()
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showModal({
          content: '请重新生成！',
          showCancel: false,
          confirmColor: '#ED4545',
          success: res => {
            if (res.confirm) {
              this.data.drawLocalPathLike.bigBj = ''
              this.data.drawLocalPathLike.address = ''
              this.data.drawLocalPathLike.arrowTip = ''
              this.data.drawLocalPathLike.wxacodeunlimit = ''
              for (let key in this.data.pageShowImgList) {
                this._getLocalImg(key, this.data.pageShowImgList[key])
              }
            }
          }
        })
      }
    })
  },
  _createNewImg () {
    var context = wx.createCanvasContext('mycanvas')
    let drawLocalPathLike = this.data.drawLocalPathLike
    /* 大海 start */
    // 绘制背景图
    context.drawImage(drawLocalPathLike.bigBj, 0, 0, this.data.width, this.data.height)

    // 绘制大海背景色
    context.save()
    context.lineJoin = 'round'
    context.lineWidth = 20 * this.data.width / 750
    context.setStrokeStyle('white')
    context.strokeRect(61 * this.data.width / 750, 510 * this.data.height / 1206, 628 * this.data.width / 750, 252 * this.data.height / 1206)
    context.setFillStyle('white')
    context.fillRect(61 * this.data.width / 750, 510 * this.data.height / 1206, 628 * this.data.width / 750, 252 * this.data.height / 1206)

    // 绘制大海标题
    context.setFontSize(34 * this.data.width / 750)
    context.setFillStyle('#000000')
    if (this.data.courseInfo.course_name.length >= 6) { // 绘制三遍就是要加粗
      context.fillText(this.data.courseName + '...', 126 * this.data.width / 750, ((570 + 34 * this.data.width / 750) * this.data.height / 1206))
    } else {
      context.fillText(this.data.courseInfo.course_name, 126 * this.data.width / 750, ((570 + 34 * this.data.width / 750) * this.data.height / 1206))
    }

    // 绘制地址图标
    context.drawImage(drawLocalPathLike.address, 388 * this.data.width / 750, 570 * this.data.height / 1206, 18 * this.data.width / 750, 24 * this.data.width / 750)

    // 绘制学校
    context.setFontSize(22 * this.data.width / 750)
    context.setFillStyle('#999999')
    if (this.data.school.length >= 10) {
      context.fillText(this.data.school + '...', 422 * this.data.width / 750, ((578 + 22 * this.data.width / 750) * this.data.height / 1206))
    } else {
      context.fillText(this.data.school, 422 * this.data.width / 750, ((578 + 22 * this.data.width / 750) * this.data.height / 1206))
    }

    // 绘制内容1
    context.setFontSize(28 * this.data.width / 750)
    context.setFillStyle('#000000')
    context.fillText(this.data.courseInfo.poster_desc1, 126 * this.data.width / 750, ((648 + 28 * this.data.width / 750) * this.data.height / 1206))
    // 绘制内容2
    context.setFontSize(28 * this.data.width / 750)
    context.setFillStyle('#000000')
    context.fillText(this.data.courseInfo.poster_desc2, 126 * this.data.width / 750, ((706 + 28 * this.data.width / 750) * this.data.height / 1206))
    context.restore()

    /* 大海 end */

    /* 宝贝 start */
    // 绘制宝贝背景色
    context.save()
    context.lineJoin = 'round'
    context.lineWidth = 20 * this.data.width / 750
    context.setStrokeStyle('white')
    context.strokeRect(61 * this.data.width / 750, 811 * this.data.height / 1206, 628 * this.data.width / 750, 172 * this.data.height / 1206)
    context.setFillStyle('white')
    context.fillRect(61 * this.data.width / 750, 811 * this.data.height / 1206, 628 * this.data.width / 750, 172 * this.data.height / 1206)

    // 绘制内容1
    context.setFontSize(26 * this.data.width / 750)
    context.setFillStyle('#333333')
    context.fillText('我家宝贝已经报名了，', 126 * this.data.width / 750, ((862 + 26 * this.data.width / 750) * this.data.height / 1206))
    // 绘制内容2
    context.setFontSize(26 * this.data.width / 750)
    context.setFillStyle('#333333')
    context.fillText('你也赶快来吧！', 126 * this.data.width / 750, ((915 + 26 * this.data.width / 750) * this.data.height / 1206))

    // 绘制箭头提示
    context.drawImage(drawLocalPathLike.arrowTip, 309 * this.data.width / 750, 903 * this.data.height / 1206, 74 * this.data.width / 750, 32 * this.data.width / 750)

    // 绘制小程序码
    context.drawImage(drawLocalPathLike.wxacodeunlimit, 525 * this.data.width / 750, 839 * this.data.height / 1206, 112 * this.data.width / 750, 112 * this.data.width / 750)

    context.restore()

    context.draw(true, () => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        quality: 1,
        success: res => {
          var tempFilePath = res.tempFilePath
          console.log('tempFilePath', tempFilePath)
          this.setData({
            imagePath: tempFilePath,
            isHideUpload: true
          })
          wx.hideLoading()
          wx.showToast({
            title: '生成成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: () => {
          wx.showToast({
            title: '生成失败',
            icon: 'success',
            duration: 2000
          })
        }
      })
    })
  },
  _onCreate () { // 开始绘制
    this._getHeightscroll()
  },
  _onDown () {
    // 获取相册授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log('getSetting_saveImageToPhotosAlbum', res)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success () { // 这里是用户同意授权后的回调
              this.savaImageToPhoto()
            },
            fail () { // 这里是用户拒绝授权后的回调
              this.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            }
          })
        } else { // 用户已经授权过了
          this.savaImageToPhoto()
        }
      }
    })
  },
  handleSetting (e) {
    console.log('handleSetting', e)
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      this.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      this.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  },
  savaImageToPhoto () {
    wx.showLoading({
      title: '下载中',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success (result) {
        wx.hideLoading()
        wx.showToast({
          title: '已下载',
          icon: 'success',
          duration: 2000
        })
      },
      fail: () => {
        wx.showToast({
          title: '下载失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }

  /* methods end */
})