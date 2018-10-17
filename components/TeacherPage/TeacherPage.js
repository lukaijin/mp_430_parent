const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const  { getSystemConfig } = require('../../utils/common.js')


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    query: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal, changedPath) {
        console.log('teacherPage_properties_query', newVal, oldVal, changedPath)
     }
    },
    isInitTeacher: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        console.log('properties_isInitTeacher', newVal, oldVal, changedPath)
        if (newVal === true) {
          this.init(this.data.query)
        }
      }
    },
    teacherCurrentTabIndex: {
      type: Number,
      value: 0
    },
    guanzhuCourse: {
      type: Number,
      value: -1
    }
  },

  // watch: {
  //   teacherCurrentTabIndex (newIndex, oldIndex) {
  //     if (newIndex === 1) {
  //       this.indexType = 1
  //       this.isReloadComment = true
  //     }
  //   },
  //   guanzhuCourse (newVal, oldVal) {
  //     console.log('watch_teacher_guanzhu', newVal, oldVal)
  //     this.getTeacherFollowInfo(this.teacherId)
  //       .then(info => {
  //         this.followed = info.followed
  //       })
  //   }
  // },
  
  /**
   * 组件的初始数据
   */
  data: {
    teacherId: null,
    arrangeId: null,
    indexType: 0,
    followed: false,
    isCommentList: false,
    isMoreComment: false,
    isReloadComment: false,
    isPreviewImage: false,
    courseList: [],
    allowComment: 0,
    guanzhu: -1,
    teacherInfo: {
      teacher_headimg: '',
      teacher_name: '',
      teacher_specialty: [],
      teacher_experience: '',
      teacher_outcome: '',
      teacher_feature: '',
      teacher_years: 0,
      teacher_education: '',
      recommend_index: 0,
      attendance_score: 0
    },
    stat: {
      recommend_index: 0,
      follower_count: 0,
      teacher_years: 0,
      attendance_score: 0
    }
  },

  lifetimes: {
    ready () { },
    moved () { },
    detached () { },
  },
  pageLifetimes: {
    show () {
      if (this.data.isPreviewImage) { // 预览大图刷新问题
        this.data.isPreviewImage = false
        return
      }
      this.setData({ indexType: 0 })
     },
  },

  methods: {
    async init (query) {
      this.data.arrangeId = parseInt(query.arrangeId)
      this.data.teacherId = parseInt(query.teacherId)
      let ID = this.data.teacherId
      let TeacherInfo = await this.getTeacherInfo(ID)
      let FollowInfo = await this.getTeacherFollowInfo(ID)
      let Stat = await this.getTeacherStat(ID)
      TeacherInfo.teacher_experience = TeacherInfo.teacher_experience.replace(/<br\/>/g, '\n')
      TeacherInfo.teacher_outcome = TeacherInfo.teacher_outcome.replace(/<br\/>/g, '\n')
      TeacherInfo.teacher_feature = TeacherInfo.teacher_feature.replace(/<br\/>/g, '\n')
      this.setData({
        teacherInfo: TeacherInfo,
        followed: FollowInfo.followed,
        stat: Stat
      })
    },
    getSystemConfig () { // 是否开启评论功能
      getSystemConfig()
        .then(res => {
          this.setData({ allowComment: Number(res) })
        })
    },
    getTeacherInfo (teacherId) {
      return api.getTeacherInfo(teacherId)
    },
    getTeacherFollowInfo (teacherId) {
      return api.getTeacherFollowInfo(teacherId)
    },
    getTeacherStat (teacherId) {
      return api.getTeacherStat(teacherId)
    },
    async updateTeacherFollowInfo () {
      this.data.followed = !this.data.followed
      this.setData({ followed: this.data.followed })
      var params = {
        teacher_id: this.data.teacherId,
        followed: Number(this.data.followed)
      }
      await api.updateTeacherFollowInfo(params)
      this.data.guanzhu++
      this.triggerEvent('sendGuanzhuTacher', this.data.guanzhu)
      wx.showToast({
        title: this.data.followed ? '已关注' : '取消关注'
      })

      this.data.stat.follower_count = this.data.followed ? this.data.stat.follower_count + 1 : this.data.stat.follower_count - 1
      this.setData({ 'stat.follower_count': this.data.stat.follower_count })
    },
    async getCourseList () {
      wx.showLoading()
      let params = {
        type: 'teacher',
        teacher_id: this.data.teacherId
      }
      let res = await api.getCourseList(params)
      this.setData({ courseList: res })
      wx.hideLoading()
    },
    onTab (e) {
      let index = e.currentTarget.dataset.tabIndex
      if (this.data.indexType === index) return
      this.data.indexType = index
      switch (index) {
        case 0:
          // this.isCommentList = false
          // this.isMoreComment = false
          this.setData({ isMoreComment: false })
          break
        case 1:
          // this.isCommentList = true
          // this.isMoreComment = true
          this.setData({ isMoreComment: true })
          break
        case 2:
          // this.isCommentList = false
          // this.isMoreComment = false
          this.setData({ isMoreComment: false })
          if (!this.data.courseList.length) this.getCourseList()
          break
      }
    },
    onPreviewImage (e) {
      // img, imgs
      this.data.isPreviewImage = true
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      })
    }
  }
  
})
