const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const options = require('../../utils/options.js')
const { dateFormat, getWeek, getRangTime } = require('../../utils/time.js')


Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    query: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal, changedPath) {
        console.log('properties_query', newVal, oldVal, changedPath)
     }
    },
    isInitCourse: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        console.log('properties_isInitCourse', newVal, oldVal, changedPath)
        if (newVal === true) {
          this.init(this.data.query)
        }
      }
    },
    guanzhuTeacher: {
      type: Number,
      value: -1,
      observer: function(newVal, oldVal, changedPath) {
        console.log('properties_guanzhuTeacher', newVal, oldVal, changedPath)
        console.log('properties_guanzhuTeacher_teacherId', this.data.query)
        let teacherId = parseInt(this.data.query.teacherId)
        this.getTeacherFollowInfo(teacherId)
        .then(info => {
          this.setData({ followed: info.followed })
        })
      }
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    arrangeId: null,
    teacherId: null,
    followed: false,
    isShowDialog: false,
    maxAge: null,
    course: {
      course_name: '',
      course_desc: '',
      price: 0,
      abilityinfo: [],
      course_know_point: '',
      location: '',
      max_signup_num: 0,
      group_name: '',
      match_age_min: -1,
      match_age_max: 0,
      course_photos: [],
      signup_status: -1,
      sold_count: 0
    },
    courseOutline: [],
    teacherTagArr: [],
    teacher: {
      teacher_headimg: null,
      teacher_name: '',
      school: '',
      specialty: []
    },
    stat: {
      feedback_rate: 0,
      report_count: 0,
      student_count: 0
    },
    options: {
      outlineStatus: options.outlineStatus
    },
    guanzhu: -1
  },
  
  lifetimes: {
    ready () { },
    moved () { },
    detached () { },
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    async init (query = {}) {
      wx.showLoading({title: '加载中...'})
      this.data.arrangeId = parseInt(query.arrangeId)
      try {
        let CourseDetail = await this.getCourseDetail(this.data.arrangeId)
        let computedMaxAge = CourseDetail[0].match_age_min !== CourseDetail[0].match_age_max ? `-${CourseDetail[0].match_age_max}` : ''
        CourseDetail[0].course_know_point = CourseDetail[0].course_know_point.replace(/<br\/>/g, '\n')
        // 报名状态
        this.triggerEvent('sendSignupStatus', {
          signupStatus: CourseDetail[0].signup_status,
          signupDesc: CourseDetail[0].signup_desc,
          groupName: CourseDetail[0].group_name,
        })
        this.setData({
          course: CourseDetail[0],
          maxAge: computedMaxAge
         })
        this.data.teacherId = parseInt(CourseDetail[0].teacher_id) // query.teacherId
        // 授课老师
        let TeacherInfo = await this.getTeacherInfo(this.data.teacherId)
        let CommentTag = await this.getTeacherCommentTag(this.data.teacherId)
        let FollowInfo = await this.getTeacherFollowInfo(this.data.teacherId)
        let Stat = await this.getTeacherStat(this.data.teacherId)
        // 大纲
        let CourseOutline = await this.getCourseOutline(this.data.arrangeId)
        this.setData({
          teacher: TeacherInfo,
          teacherTagArr: CommentTag.comment_tag,
          followed: FollowInfo.followed,
          stat: Stat,
          courseOutline: CourseOutline
        }, () => {
          for (let i = 0; i < this.data.courseOutline.length; i++) {
            let item = this.data.courseOutline[i]
            let start_date = 'courseOutline['+i+'].start_date'
            let end_date = 'courseOutline['+i+'].end_date'
            let start_week = 'courseOutline['+i+'].start_week'
            let range_time = 'courseOutline['+i+'].range_time'
            this.setData({
              [start_date]: dateFormat(item.outline_start_time, 'YYYY-MM-DD'),
              [end_date]: dateFormat(item.outline_start_time),
              [start_week]: getWeek(item.outline_start_time),
              [range_time]: getRangTime(item.outline_start_time, item.outline_end_time)
            })
          }
          // 第02种写法
          // item.start_date = dateFormat(item.outline_start_time, 'YYYY-MM-DD')
          // item.end_date = dateFormat(item.outline_start_time)
          // item.start_week = getWeek(item.outline_start_time)
          // item.range_time = getRangTime(item.outline_start_time, item.outline_end_time)
          // this.setData({
            //   courseOutline: this.data.courseOutline
            // })
          // console.log(this.data.courseOutline, 'this.data.courseOutline')
          wx.hideLoading()
        })
      } catch (error) {
        console.info('报错', error)
        wx.hideLoading()
        wx.showToast({ title: '服务器有误', duration: 3000 })
      }
    },
    getCourseDetail (arrangeId) {
      return api.getCourseDetail(arrangeId)
    },
    getCourseOutline (arrangeId) {
      return api.getCourseOutline(arrangeId)
    },
    getTeacherInfo (teacherId) {
      return api.getTeacherInfo(teacherId)
    },
    getTeacherCommentTag (teacherId) {
      return api.getTeacherCommentTag(teacherId)
    },
    getTeacherStat (teacherId) {
      return api.getTeacherStat(teacherId)
    },
    getTeacherFollowInfo (teacherId) {
      return api.getTeacherFollowInfo(teacherId)
    },
    async updateTeacherFollowInfo () {
      let followed = !this.data.followed
      this.setData({
        followed: followed
      })
      var params = {
        teacher_id: this.data.teacherId,
        followed: Number(followed)
      }
      await api.updateTeacherFollowInfo(params)
      this.data.guanzhu++
      this.triggerEvent('sendGuanzhuCourse', this.data.guanzhu)
      wx.showToast({
        title: this.data.followed ? '已关注' : '取消关注',
        duration: 2000
      })
    },
    onShowDialog () {
      this.setData({ isShowDialog: true })
    },
    openTeacherIntroduction () {
      wx.navigateTo({
        url: `/pages/teacher/teacher?arrangeId=${this.data.arrangeId}&teacherId=${this.data.course.teacher_id}`
      })
    },
    openMechanismPage (groupId) {
      wx.navigateTo({
        url: `/pages/mechanismDetail/mechanismDetail?groupId=${groupId}`
      })
    },
    handleClose (e) {
      this.setData({ isShowDialog: e.detail.bool })
    }
    // onTab (tabType) {
    //   if (this.tabType === tabType) return false
    //   this.tabType = tabType
    // },
  }
})
