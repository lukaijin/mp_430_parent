const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const { getYear } = require('../../utils/time.js')


Page({
 
  data: {
    indexType: 0,
    mechanism: {
      group_create_date: '',
      group_desc: '',
      group_image: [],
      group_loc: '',
      group_logo: '',
      group_name: '',
      group_student_count: '',
      group_teacher_count: ''
    },
    courseList: []
  },

  onLoad (query) {
    this.data.groupId = parseInt(query.groupId)
    console.log(query)
    this.getGroupInfo(this.data.groupId)
  },

  /* methods start */
  async getGroupInfo (groupId) {
    try {
      let res = await api.getGroupInfo(groupId)
      res.group_create_date = getYear(res.group_create_date)
      this.setData({ mechanism: res })
    } catch (err) {
      console.error('getGroupInfo_error', err)
    }
  },
  onTab (e) {
    let index = e.currentTarget.dataset.index
    if (this.data.indexType === index) return
    this.setData({ indexType: index })
    switch (index) {
      case 1:
        if (!this.data.courseList.length) this.getCourseList()
        break
    }
  },
  async getCourseList () {
    wx.showLoading()
    let params = {
      type: 'group',
      group_id: this.data.groupId
    }
    let res = await api.getCourseList(params)
    this.setData({ courseList: res })
    wx.hideLoading()
  }
  /* methods end */

})