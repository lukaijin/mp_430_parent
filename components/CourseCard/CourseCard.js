// components/courseList/courseList.js
Component({
  /**
   * 组件的属性列表
   */
  // externalClasses: ['course-card-class'],
  
  options: {
    addGlobalClass: true,
  },

  properties: {
    info: {
      type: Object,
      value: {}
    },
    isLastOnce: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenDetails () {
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?type=homeCourse&arrangeId=${this.data.info.arrange_id}&teacherId=${this.data.info.teacher_id}`
      })
    }
  }
})
