const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const { dateFormat } = require('../../utils/time.js')

Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    teacherId: {
      type: Number
    },
    arrangeId: {
      type: Number
    },
    isCommentList: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        console.log('properties_isCommentList', newVal, oldVal, changedPath)
        if (newVal === true) {
          this.getTeacherCommentList(this.data.teacherId, this.data.type)
        }
      }
    },
    isMoreComment: {
      type: Boolean,
      value: false
    },
    isReloadComment: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: 'all',
    allCommentList: [],
    goodCommentList: [],
    mediumCommentList: [],
    badCommentList: [],
    offsetAll: 0,
    offsetGood: 0,
    offsetMedium: 0,
    offsetBad: 0,
    limit: 5,
    totalCount: 0,
    all_count: 0,
    good_count: 0,
    medium_count: 0,
    bad_count: 0,
    isMoreAll: true,
    isMoreGood: true,
    isMoreMedium: true,
    isMoreBad: true,
    canComment: false
  },

  // watch: {
  //   isReloadComment (newBool, oldBool) {
  //     if (newBool === true) {
  //       this.isMoreAll = true
  //       this.isMoreGood = true
  //       this.isMoreMedium = true
  //       this.isMoreBad = true
  //       this.offsetAll = 0
  //       this.offsetGood = 0
  //       this.offsetMedium = 0
  //       this.offsetBad = 0
  //       this.getTeacherCommentList(this.teacherId, this.type)
  //       this.getCourseCommentInfo()
  //     }
  //   }
  // },

  onReachBottom () {
    if (this.data.isMoreComment === true) { // 因为啊，上拉的方法放在了组件，在外界的其它tab滚动时会受影响
      console.log('onReachBottom_加载更多')
      this.getTeacherCommentList(this.data.teacherId, this.data.type)
    }
  },
  
  // onLoad () {
  //   this.getTeacherCommentList(this.teacherId, this.type)
  //   this.getCourseCommentInfo()
  // },
  lifetimes: {
    ready () {
      // console.log('评架', this.data.teacherId)
    },
  },
  
  methods: {
    async onTab (e) {
      let type = e.currentTarget.dataset.type
      if (type === this.data.type) return
      this.data.type = type
      this.setData({ type: this.data.type })
      switch (type) {
        case 'all':
          this.data.offsetAll = 0
          this.setData({ allCommentList: [] })
          this.getAllCommentList(this.data.teacherId, this.data.type)
          break
        case 'good':
          this.data.offsetGood = 0
          this.setData({ goodCommentList: [] })
          this.getGoodCommentList(this.data.teacherId, this.data.type)
          break
        case 'medium':
          this.data.offsetMedium = 0
          this.setData({ mediumCommentList: [] })
          this.getMediumCommentList(this.data.teacherId, this.data.type)
          break
        case 'bad':
          this.data.offsetBad = 0
          this.setData({ badCommentList: [] })
          this.getBadCommentList(this.data.teacherId, this.data.type)
          break
      }
      console.log('type', type)
    },
    async getTeacherCommentList (teacherId, type = 'all') {
      if (!this.data.isMoreAll && type === 'all') {
        console.log('没有all更多啦')
        return '没有all啦'
      } else if (!this.data.isMoreGood && type === 'good') {
        return '没有good啦'
      } else if (!this.data.isMoreMedium && type === 'medium') {
        return '没有medium啦'
      } else if (!this.data.isMoreBad && type === 'bad') {
        return '没有bad啦'
      }
      switch (type) {
        case 'all':
          this.getAllCommentList(teacherId, type)
          break
        case 'good':
          this.getGoodCommentList(teacherId, type)
          break
        case 'medium':
          this.getMediumCommentList(teacherId, type)
          break
        case 'bad':
          this.getBadCommentList(teacherId, type)
          break
      }
    },
    async getAllCommentList (teacherId, type) {
      wx.showLoading()
      var params = {
        type: type,
        page_index: this.data.offsetAll,
        page_count: this.data.limit,
        teacher_id: teacherId
      }
      let res = await api.getTeacherCommentList(params)
      this.data.allCommentList = this.data.allCommentList.concat(res.comment_list)
      this.data.allCommentList.forEach(item => {
        item.comment_time = dateFormat(item.comment_time, 'YYYY-MM-DD')
      })
      this.setData({
        all_count: res.all_count,
        good_count: res.good_count,
        medium_count: res.medium_count,
        bad_count: res.bad_count,
        allCommentList: this.data.allCommentList 
      })
      this.data.offsetAll += res.comment_list.length
      console.log('下次offsetAll', this.data.offsetAll)
      if (this.data.offsetAll >= res.all_count) {
        this.data.isMoreAll = false
      }
      wx.hideLoading()
    },
    async getGoodCommentList (teacherId, type) {
      wx.showLoading()
      var params = {
        type: type,
        page_index: this.data.offsetGood,
        page_count: this.data.limit,
        teacher_id: teacherId
      }
      let res = await api.getTeacherCommentList(params)
      this.data.goodCommentList = this.data.goodCommentList.concat(res.comment_list)
      this.data.goodCommentList.forEach(item => {
        item.comment_time = dateFormat(item.comment_time, 'YYYY-MM-DD')
      })
      this.setData({ goodCommentList: this.data.goodCommentList })
      this.data.offsetGood += res.page_count
      console.log('下次offsetGood', this.data.offsetGood)
      if (this.data.offsetGood >= res.good_count) {
        this.data.isMoreGood = false
      }
      wx.hideLoading()
    },
    async getMediumCommentList (teacherId, type) {
      wx.showLoading()
      var params = {
        type: type,
        page_index: this.data.offsetMedium,
        page_count: this.data.limit,
        teacher_id: teacherId
      }
      let res = await api.getTeacherCommentList(params)
      this.data.mediumCommentList = this.data.mediumCommentList.concat(res.comment_list)
      this.data.mediumCommentList.forEach(item => {
        item.comment_time = dateFormat(item.comment_time, 'YYYY-MM-DD')
      })
      this.setData({ mediumCommentList: this.data.mediumCommentList })
      this.data.offsetMedium += res.page_count
      console.log('下次offsetMedium', this.data.offsetMedium)
      if (this.data.offsetMedium >= res.medium_count) {
        this.data.isMoreMedium = false
      }
      wx.hideLoading()
    },
    async getBadCommentList (teacherId, type) {
      wx.showLoading()
      var params = {
        type: type,
        page_index: this.data.offsetBad,
        page_count: this.data.limit,
        teacher_id: teacherId
      }

      let res = await api.getTeacherCommentList(params)
      this.data.badCommentList = this.data.badCommentList.concat(res.comment_list)
      this.data.badCommentList.forEach(item => {
        item.comment_time = dateFormat(item.comment_time, 'YYYY-MM-DD')
      })
      this.setData({ badCommentList: this.data.badCommentList })
      this.data.offsetBad += res.page_count
      console.log('下次offsetBad', this.data.offsetBad)
      if (this.data.offsetBad >= res.bad_count) {
        this.data.isMoreBad = false
      }
      wx.hideLoading()
    },
    async getCourseCommentInfo () {
      var params = {
        teacher_id: this.data.teacherId,
        arrange_id: this.data.arrangeId
      }
      let res = await api.getCourseCommentInfo(params)
      this.setData({ canComment: res.can_comment })
    },
    onPreviewImage (e) {
      console.log('onPreviewImage', e)
      // let img, imgs
      // this.triggerEvent('previewImage', {img, imgs})
    },
    openCommentPage () {
      wx.navigateTo({
        url: `/pages/teacherComment/teacherComment?arrangeId=${this.data.arrangeId}&teacherId=${this.data.teacherId}`
      })
    }
  }

})
