// components/CourseList/CourseList.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    courseList: {
      type: Array,
      value: []
    }
  },

  methods: {
    _selectClass () {
      wx.switchTab({
        url: '/pages/courseList/courseList',
        success: () => {
          console.log('成功')
        },
        fail: (err) => {
          console.log('失败', err)
        }
      })
    },
    _toCourseSpace (e) {
      let arrangeId = e.currentTarget.dataset.arrangeId
      let teacherId = e.currentTarget.dataset.teacherId
      wx.navigateTo({
        url: `/pages/courseSpace/courseSpace?arrangeId=${arrangeId}&teacherId=${teacherId}`
      })
    }
  }

})
