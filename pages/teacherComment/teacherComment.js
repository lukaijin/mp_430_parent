const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    offsetReport: Math.ceil(Math.random() * 10),
    offsetAbility: Math.ceil(Math.random() * 10),
    offsetAttitude: Math.ceil(Math.random() * 10),
    offsetKnowledge: Math.ceil(Math.random() * 10),
    offsetSubject: Math.ceil(Math.random() * 10),
    limit3: 3,
    limit4: 4,
    toggleTextarea: false,
    teacherTagArr: [],
    teacherInfo: {
      teacher_headimg: '',
      teacher_name: '',
      teacher_specialty: []
    },
    stat: {
      recommend_index: 0,
      follower_count: 0,
      teacher_years: 0,
      attendance_score: 0
    },
    comment: {
      comment_score: 0,
      comment_content: '',
      comment_report_tag_id: null,
      comment_attitude_tag_id: null,
      comment_ability_tag_id: null,
      comment_knowledge_tag_id: null,
      comment_subject_tag_id: null
    },
    isLoadingReport: false,
    isLoadingAbility: false,
    isLoadingAttitude: false,
    isLoadingKnowledge: false,
    isLoadingSubject: false,
    defaults: {
      starArr: [1, 2, 3, 4, 5],
      report: [],
      attitude: [],
      ability: [],
      knowledge: [],
      subject: []
    },
    status: {
      1: '一般',
      2: '满意',
      3: '满意',
      4: '很满意',
      5: '很满意'
    }
  },
  onLoad (query) {
    this.init(query)
  },

  onShow () {
    this.comment = {
      comment_score: 0,
      comment_content: '',
      comment_report_tag_id: null,
      comment_ability_tag_id: null,
      comment_attitude_tag_id: null,
      comment_knowledge_tag_id: null,
      comment_subject_tag_id: null
    }
  },
  /* methods start */
  async init (query) {
    this.data.arrangeId = parseInt(query.arrangeId)
    this.data.teacherId = parseInt(query.teacherId)
    let ID = this.data.teacherId
    let TeacherInfo = await this.getTeacherInfo(ID)
    let Stat = await this.getTeacherStat(ID)
    let CommentTag = await this.getTeacherCommentTag(ID)
    let ReportTags = await this.getCommentTag('report', this.data.offsetReport, 3)
    let AttitudeTags = await this.getCommentTag('attitude', this.data.offsetAttitude, 4)
    let AbilityTags = await this.getCommentTag('ability', this.data.offsetAbility, 3)
    let KnowledgeTags = await this.getCommentTag('knowledge', this.data.offsetKnowledge, 4)
    let SubjectTags = await this.getCommentTag('subject', this.data.offsetSubject, 4)
    this.setData({
      teacherInfo: TeacherInfo,
      stat: Stat,
      teacherTagArr: CommentTag.comment_tag,
      ['defaults.report']: ReportTags.comment_list,
      ['defaults.attitude']: AttitudeTags.comment_list,
      ['defaults.ability']: AbilityTags.comment_list,
      ['defaults.knowledge']: KnowledgeTags.comment_list,
      ['defaults.subject']: SubjectTags.comment_list,
    })
    if (ReportTags.comment_list.length !== 0) {
      this.setData({ ['comment.comment_report_tag_id']: ReportTags.comment_list[0].comment_tag_id })
    }
    if (AttitudeTags.comment_list.length !== 0) {
      this.setData({ ['comment.comment_attitude_tag_id']: AttitudeTags.comment_list[0].comment_tag_id })
    }
    if (AbilityTags.comment_list.length !== 0) {
      this.setData({ ['comment.comment_ability_tag_id']: AbilityTags.comment_list[0].comment_tag_id })
    }
    if (KnowledgeTags.comment_list.length !== 0) {
      this.setData({ ['comment.comment_knowledge_tag_id']: KnowledgeTags.comment_list[0].comment_tag_id })
    }
    if (SubjectTags.comment_list.length !== 0) {
      this.setData({ ['comment.comment_subject_tag_id']: SubjectTags.comment_list[0].comment_tag_id })
    }
  },
  getTeacherInfo (teacherId) {
    return api.getTeacherInfo(teacherId)
  },
  getTeacherStat (teacherId) {
    return api.getTeacherStat(teacherId)
  },
  getTeacherCommentTag (teacherId) {
    return api.getTeacherCommentTag(teacherId)
  },
  getCommentTag (type, offset, limit = 4) {
    var parmas = {
      type: type,
      page_index: offset,
      page_count: limit
    }
    return api.getCommentTag(parmas)
  },
  onChecked (e) { // 选择标签
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    if (this.data.comment.comment_report_tag_id === id) return
    if (this.data.comment.comment_attitude_tag_id === id) return
    if (this.data.comment.comment_ability_tag_id === id) return
    if (this.data.comment.comment_knowledge_tag_id === id) return
    if (this.data.comment.comment_subject_tag_id === id) return
    console.log('onChecked', id)
    switch (type) {
      case 'report':
        this.setData({ ['comment.comment_report_tag_id']: id })
        console.log('comment_report_tag_id', id)
        break
      case 'attitude':
        this.setData({ ['comment.comment_attitude_tag_id']: id })
        console.log('comment_attitude_tag_id', id)
        break
      case 'ability':
        this.setData({ ['comment.comment_ability_tag_id']: id })
        console.log('comment_ability_tag_id', id)
        break
      case 'knowledge':
        this.setData({ ['comment.comment_knowledge_tag_id']: id })
        console.log('comment_knowledge_tag_id', id)
        break
      case 'subject':
        this.setData({ ['comment.comment_subject_tag_id']: id })
        console.log('comment_subject_tag_id', id)
        break
    }
  },
  async onAnotherBatch (e) { // 换一批
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'report':
        if (this.data.isLoadingReport) return
        this.data.isLoadingReport = true
        this.setData({ isLoadingReport: this.data.isLoadingReport })
        this.data.offsetReport += this.data.limit3
        let dataReport = await this.getCommentTag(type, this.data.offsetReport)
        this.data.isLoadingReport = false
        this.setData({
          isLoadingReport: this.data.isLoadingReport,
          ['comment.comment_report_tag_id']: null,
          ['defaults.report']: dataReport.comment_list
        })
        break
      case 'attitude':
        if (this.data.isLoadingAttitude) return
        this.data.isLoadingAttitude = true
        this.setData({ isLoadingAttitude: this.data.isLoadingAttitude })
        this.data.offsetAttitude += this.data.limit4
        let dataAttitude = await this.getCommentTag(type, this.data.offsetAttitude)
        this.data.isLoadingAttitude = false
        this.setData({
          isLoadingAttitude: this.data.isLoadingAttitude,
          ['comment.comment_attitude_tag_id']: null,
          ['defaults.attitude']: dataAttitude.comment_list
        })
        break
      case 'ability':
        if (this.data.isLoadingAbility) return
        this.data.isLoadingAbility = true
        this.setData({ isLoadingAbility: this.data.isLoadingAbility })
        this.data.offsetAbility += this.data.limit3
        let dataAbility = await this.getCommentTag(type, this.data.offsetAbility)
        this.data.isLoadingAbility = false
        this.setData({
          isLoadingAbility: this.data.isLoadingAbility,
          ['comment.comment_ability_tag_id']: null,
          ['defaults.ability']: dataAbility.comment_list
        })
        break
      case 'knowledge':
        if (this.data.isLoadingKnowledge) return
        this.data.isLoadingKnowledge = true
        this.setData({ isLoadingKnowledge: this.data.isLoadingKnowledge })
        this.data.offsetKnowledge += this.data.limit4
        let dataKnowledge = await this.getCommentTag(type, this.data.offsetKnowledge)
        this.data.isLoadingKnowledge = false
        this.setData({
          isLoadingKnowledge: this.data.isLoadingKnowledge,
          ['comment.comment_knowledge_tag_id']: null,
          ['defaults.knowledge']: dataKnowledge.comment_list
        })
        break
      case 'subject':
        if (this.isLoadingSubject) return
        this.data.isLoadingSubject = true
        this.setData({ isLoadingSubject: this.data.isLoadingSubject })
        this.data.offsetSubject += this.data.limit4
        let dataSubject = await this.getCommentTag(type, this.data.offsetSubject)
        this.data.isLoadingSubject = false
        this.setData({
          isLoadingSubject: this.data.isLoadingSubject,
          ['comment.comment_subject_tag_id']: null,
          ['defaults.subject']: dataSubject.comment_list
        })
        break
    }
  },
  onStar (e) { // 星星数
    let num = e.currentTarget.dataset.num
    this.setData({ ['comment.comment_score']: num })
  },
  onCommentContent (e) {
    this.setData({ ['comment.comment_content']: e.detail.value })
  },
  async addTeacherComment () { // 提交
    if (!this.data.comment.comment_score) {
      wx.showToast({ title: '请给满意度评价', icon: 'none' })
      return
    }
    if (!this.data.comment.comment_content) {
      wx.showToast({ title: '请输入老师评价', icon: 'none' })
      return
    }
    var params = {
      teacher_id: this.data.teacherId,
      arrange_id: this.data.arrangeId,
      comment_score: this.data.comment.comment_score,
      comment_content: this.data.comment.comment_content,
      comment_report_tag_id: this.data.comment.comment_report_tag_id,
      comment_attitude_tag_id: this.data.comment.comment_attitude_tag_id,
      comment_ability_tag_id: this.data.comment.comment_ability_tag_id,
      comment_knowledge_tag_id: this.data.comment.comment_knowledge_tag_id,
      comment_subject_tag_id: this.data.comment.comment_subject_tag_id
    }
    await api.addTeacherComment(params)
    let pages = getCurrentPages()// 当前页面
    let prevPage = pages[pages.length - 2]// 上一页面
    prevPage.setData({// 直接给上移页面赋值
      spaceCurrentTabIndex: 3,
      teacherCurrentTabIndex: 1,
      flagCurrentTab: 'yes'
    })
    wx.navigateTo({
      url: `/pages/teacher/main?arrangeId=${this.data.arrangeId}&teacherId=${this.data.teacherId}`
    })
  }
  /* methods end */
  
})