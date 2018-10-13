
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const options = require('../../utils/options.js')
const { getUserInfo, setUserInfo, wxLogin } = require('../../utils/common.js')
const { dateFormat, getWeek, getRangTime } = require('../../utils/time.js')


Page({

/*   props: {
    isNavTitle: {
      type: Boolean,
      default: true
    },
    isInitCourse: {
      type: Boolean,
      default: true
    }
  }, */
 
  data: {
    userInfo: {},
    auth: false,
    arrangeId: null,
    teacherId: null,
    type: 'homeCourse',
    schoolIndex: 0,
    isBindSchool: true,
    followed: false,
    isShowDialog: false,
    isBackHome: false,
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
      outlineStatus: options.outlineStatus,
      school: []
    }
  },

/*   computed: {
    maxAge () {
      return this.course.match_age_min !== this.course.match_age_max ? `-${this.course.match_age_max}` : ''
    }
  },
  watch: {
    isInitCourse (newVal, oldVal) {
      // console.log('watch_isInitCourse', newVal, oldVal)
      if (newVal === true) {
        this.init()
      }
    }
  }, */
  
  onLoad (query) {
    // if (this.data.isInitCourse) {
    this.init(query)
    // }
  },

  /* methods start */
  async init (query) {
    wx.showLoading({title: '加载中...'})
    console.log(query, 'query')
    if (query.isBackHome) this.setData({ isBackHome: true })
    this.setData({
      type: query.type,
      userInfo: getUserInfo()
    })
    this.data.arrangeId = parseInt(query.arrangeId)
    try {
      let CourseDetail = await this.getCourseDetail(this.data.arrangeId)
      let computedMaxAge = CourseDetail[0].match_age_min !== CourseDetail[0].match_age_max ? `-${CourseDetail[0].match_age_max}` : ''
      this.setData({
        course: CourseDetail[0],
        maxAge: computedMaxAge
       })
      this.data.teacherId = parseInt(CourseDetail[0].teacher_id)
      // 授课老师
      let TeacherInfo = await this.getTeacherInfo(this.data.teacherId)
      let CommentTag = await this.getTeacherCommentTag(this.data.teacherId)
      let FollowInfo = await this.getTeacherFollowInfo(this.data.teacherId)
      let Stat = await this.getTeacherStat(this.data.teacherId)
      // 大纲
      let CourseOutline = await this.getCourseOutline(this.data.arrangeId)
      // 获取学校列表
      let GroupList = await this.getGroupList()
      this.setData({
        teacher: TeacherInfo,
        teacherTagArr: CommentTag.comment_tag,
        followed: FollowInfo.followed,
        stat: Stat,
        courseOutline: CourseOutline,
        ['options.school']: GroupList
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
          // item.start_date = dateFormat(item.outline_start_time, 'YYYY-MM-DD')
          // item.end_date = dateFormat(item.outline_start_time)
          // item.start_week = getWeek(item.outline_start_time)
          // item.range_time = getRangTime(item.outline_start_time, item.outline_end_time)
        }
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
  getGroupList () {
    return api.getGroupList()
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
    wx.showToast({
      title: this.data.followed ? '已关注' : '取消关注',
      duration: 2000
    })
  },
  async onSignUp () {
    let groupId = parseInt(this.data.userInfo.group_id)
    if (this.data.course.signup_status !== 1) { // 已报名或报满
      console.log('已报名或报满')
      return false
    }
    if (!this.data.userInfo.nickName) { // 检测是否授权
      this.auth = true
      this.setData({ auth: true })
      return false
    }
    if (groupId < 0) { // 检测是否绑定学校
      console.log('检测是否绑定学校')
      this.setData({ isBindSchool: false })
      return false
    }
    if (groupId < 0 && !this.data.userInfo.parent_phone) { // 检测用户是否判定手机
      console.log('检测用户是否判定手机')
      this.goBindPhone()
      return false
    }
    let params = {
      arrange_id: this.data.arrangeId
    }
    try {
      let data = await api.createOrder(params)
      wx.navigateTo({
        url: `/pages/confirm-order/main?orderId=${data.order_id}`
      })
    } catch (err) {
      console.error('创建订单失败', err)
      wx.showModal({
        content: err.errmsg,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  getCode () {
    wx.login({
      success: res => {
        this.data.code = res.code
        // callback && callback(res.code)
      },
      fail: () => {
        this.getCode()
      }
    })
  },
  handleAuthLogin (info) {
    console.log('courseDetail_handleAuthLogin', info.detail)
    wxLogin({
      userInfo: info.detail.userInfo,
      encryptedData: info.detail.encryptedData,
      iv: info.detail.iv,
      code: this.data.code,
      callback: (updateUserInfo) => {
        this.setData({
          auth: false,
          userInfo: updateUserInfo
        })
      }
    })
  },
  async bindSchoolChange (e) {
    console.log('bindSchoolChange', e)
    this.data.schoolIndex = parseInt(e.detail.value)
    this.setData({ schoolIndex: parseInt(e.detail.value) })
    let groupId = +this.data.options.school[this.data.schoolIndex].group_id
    await api.bindGroup({ group_id: groupId })
    this.data.userInfo.group_id = groupId
    setUserInfo(this.data.userInfo)
    this.setData({ isBindSchool: true })
    wx.showToast({
      title: '学校绑定成功',
      icon: 'none',
      duration: 2000
    })
    if (!this.data.userInfo.parent_phone) { // 检测用户是否判定手机
      this.goBindPhone()
    }
  },
  onShowDialog () {
    this.setData({ isShowDialog: true })
  },
  goBindPhone () {
    let route = this.route
    console.log('route', route)
    wx.navigateTo({
      url: `/pages/phone/phone?arrangeId=${this.data.arrangeId}&pagePath=${encodeURIComponent(route)}`
    })
  },
  openTeacherIntroduction () {
    wx.navigateTo({
      url: `/pages/teacher/teacher?arrangeId=${this.data.arrangeId}&teacherId=${this.data.course.teacher_id}`
    })
  },
  openPoster () {
    wx.navigateTo({
      url: `/pages/poster/poster?arrangeId=${this.data.arrangeId}&school=${encodeURIComponent(this.data.course.group_name)}`
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
  /* methods end */

  // onShareAppMessage (res) {
  //   // console.log(res)
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log('button——转发', res.target)
  //   }
  //   return {
  //     title: '课程详情',
  //     path: `/pages/course-detail/main?type=homeCourse&arrangeId=${this.data.arrangeId}`
  //   }
  // }
})