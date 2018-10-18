// components/ReportList/ReportList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      reportList: {
        type: Array,
        value: []
      },
      type: {
        type: Number,
        value: 0
      },
      typeList: {
        type: Array,
        value: []
      },
      orShowTime: {
        type: Boolean,
        value: false
      },
      allowComment: {
        type: Number,
        value: 0
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
    _toComment(e) {
      let repyItem = e.currentTarget.dataset.repyitem
      let reportId = e.currentTarget.dataset.reportid
      let replyId = e.currentTarget.dataset.replyId
      if (repyItem.from_user_id === wx.getStorageSync('userInfo').parent_id) {
        return
      }
      wx.navigateTo({
        url: `/pages/comment/main?to_user_id=${repyItem.from_user_id}&report_id=${reportId}&to_user_type=${repyItem.from_user_type}&parent_reply_id=${replyId}&from_user_id=${repyItem.to_user_id}`
      })
    },
    _previewImage(e) {
      let imagesIndex = e.currentTarget.dataset.imagesindex
      let index = e.currentTarget.dataset.index
      let repyIndex = e.currentTarget.dataset.repyindex
      let contentIndex = e.currentTarget.dataset.contentindex
      this.reLoad = true
      this.$emit('previewImage', imagesIndex, index, repyIndex, contentIndex)
    },
    _toReportDetail(e) {
      let reportId = e.currentTarget.dataset.reportid
      wx.navigateTo({
        url: '/pages/report-detail/main?id=' + reportId
      })
    },
    _updateReportZan(e) {
      let info = {
        report_id: e.currentTarget.dataset.reportid,
        like: !e.currentTarget.dataset.orlike,
        index: e.currentTarget.dataset.index
      }
      this.$emit('sendLike', info)
    },
    _longtap(e) {
      info.report_id = e.currentTarget.dataset.reportid
      info.repyIndex = e.currentTarget.dataset.repyindex
      info.index = e.currentTarget.dataset.index
      info.contentIndex = e.currentTarget.dataset.contentindex
      this.$emit('longtap', info)
    }
  }
})
