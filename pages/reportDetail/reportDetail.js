const api = require('../../utils/api/index.js')
const { uploadImg } = require('../../utils/common.js')
const { getDayOfWeek } = require('../../utils/time.js')

Page({

  data: {
    file: [],
    repotDetail: {},
    isShow: false,
    id: '',
    timeLong: 0,
    timeLongPosition: 0
  },

  onLoad (option) {
    this._getReportDetail(option.id)
    // this._setMessageRead(option.messageId)
  },

  onShow () {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    console.log(currPage.data.selAddress, 'currPage.data.selAddress')
    if (currPage.data.selAddress === 'yes') {
      this.data.id = currPage.data.item
      this._getReportDetail(this.data.id)
    }
  },

  onShareAppMessage () { // 分享 区分点击分享的按钮
    return {
      title: `课程报告详情分享`,
      path: `/pages/reportDetail/reportDetail?teacherId=${this.data.repotDetail.reportDetail.teacher_id}`,
      imageUrl: 'https://xinjijiaoyu.oss-cn-shenzhen.aliyuncs.com/fenxiangtu.png'
    }
  },

  /* methods start */
  _getReportDetail (id) {
    console.log(id, 'id')
    let parmes = {
      report_id: id
    }
    api.getReportDetail(parmes)
      .then(res => {
        res.reportDetail.day = res.reportDetail.outline_start_time.substr(0, 10)
        res.reportDetail.week = `${getDayOfWeek(res.reportDetail.day)}`
        res.reportDetail.time = `${res.reportDetail.outline_start_time.substr(11, 9)}-${res.reportDetail.outline_end_time.substr(11, 9)}`
        res.reportDetail.red_flower = Number(res.reportDetail.red_flower)
        res.reportDetail.homework = res.reportDetail.homework.replace(/<br\/>/g, '\n')
        res.reportDetail.course_know_point = res.reportDetail.course_know_point.replace(/<br\/>/g, '\n')
        this.data.repotDetail = res
        this.setData({
          repotDetail: this.data.repotDetail,
          isShow: true
        })
        this.setData({
          timeLong: this.computedTimeLong()
        }, () => {
          this.setData({ timeLongPosition: this.computedTimeLongPosition() })
        })
      })
  },

  computedTimeLong () {
    let _time = 0
    if (this.data.repotDetail.reportDetail) {
      _time = this.data.repotDetail.reportDetail.coursehashours / this.data.repotDetail.reportDetail.coursetotalhours
      _time = _time > 1 ? 1 : _time
    }
    return _time * 100
  },

  computedTimeLongPosition () {
    let position = this.data.timeLong * 6.9
    position = position < 33 ? 33 : position
    position = (position > 690 - 66) ? (690 - 66) : position
    console.log(position)
    return position
  },
  
  _chooseImage () { // 上传图片
    let list = []
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
          const len = tempFilePaths.length
          for (let i = 0; i < len; i++) {
            uploadImg(tempFilePaths[i])
              .then(data => {
                list = list.concat(data.url)
                if (i === len - 1) {
                  wx.setStorage({
                    key: 'file',
                    data: list,
                    success: () => {
                      console.log(list)
                      this.data.file = list
                      wx.navigateTo({
                        url: `/pages/submitWork/submitWork?id=${this.data.repotDetail.report_id}`
                      })
                    },
                    complete: () => {
                      wx.hideLoading()
                    }
                  })
                }
              })
              .catch(() => {
                wx.showToast({
                  icon: 'none',
                  title: `第${i + 1}张图片上传失败`
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

  submitWork () {
    wx.navigateTo({
      url: `/pages/submitWork/submitWork?id=${this.data.repotDetail.report_id}`
    })
  },

  _toSchool () {
    wx.navigateTo({
      url: '/pages/mechanismDetail/mechanismDetail?groupId=' + this.data.repotDetail.reportDetail.group_id
    })
  },

  _submit () {
    if (!this.data.repotDetail.reportDetail.homework_needimgs) {
      wx.showToast({
        title: '不需要提交作业',
        icon: 'none'
      })
      return
    }
    // this._chooseImage()
    this.submitWork()
  },
  _toShare () {
    console.log(this.data.repotDetail.report_id, 'this.data.repotDetail.report_id')
    wx.navigateTo({
      url: '/pages/reportPoster/reportPoster?id=' + this.data.repotDetail.report_id
    })
  },
  _goSpace () {
    wx.navigateTo({
      url: `/pages/courseSpace/courseSpace?arrangeId=${this.data.repotDetail.reportDetail.arrange_id}&teacherId=${this.data.repotDetail.reportDetail.teacher_id}`
    })
  },
  _previewImage (e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.repotDetail.reportDetail.homework_images[index], // 当前显示图片的http链接
      urls: this.data.repotDetail.reportDetail.homework_images // 需要预览的图片http链接列表
    })
  }
  /* methods end */

})