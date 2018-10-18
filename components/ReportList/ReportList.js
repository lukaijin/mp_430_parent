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
      let replyId = e.currentTarget.dataset.replyid
      if (repyItem) {
        if (repyItem.from_user_id === wx.getStorageSync('userInfo').parent_id) {
          return
        }
        wx.navigateTo({
          url: `/pages/comment/comment?to_user_id=${repyItem.from_user_id}&report_id=${reportId}&to_user_type=${repyItem.from_user_type}&parent_reply_id=${replyId}&from_user_id=${repyItem.to_user_id}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/comment/comment?report_id=${reportId}`
        })
      }
    },
    _previewImage(e) {
      let info = {
        imagesIndex: e.currentTarget.dataset.imagesindex,
        index: e.currentTarget.dataset.index,
        repyIndex: e.currentTarget.dataset.repyindex,
        contentIndex: e.currentTarget.dataset.contentindex
      }
      this.triggerEvent('previewImage', info) //myevent自定义名称事件，父组件中使用
    },
    _toReportDetail(e) {
      let reportId = e.currentTarget.dataset.reportid
      wx.navigateTo({
        url: '/pages/reportDetail/reportDetail?id=' + reportId
      })
    },
    _updateReportZan(e) {
      let info = {
        report_id: e.currentTarget.dataset.reportid,
        like: Number(!e.currentTarget.dataset.orlike),
        index: e.currentTarget.dataset.index
      }
      this.triggerEvent('sendLike',  info) //myevent自定义名称事件，父组件中使用
    },
    _longtap(e) {
      let info = {
        report_id: e.currentTarget.dataset.reportid,
        repyIndex: e.currentTarget.dataset.repyindex,
        index: e.currentTarget.dataset.index,
        contentIndex: e.currentTarget.dataset.contentindex,
        from_user_type: e.currentTarget.dataset.repyitem.from_user_type,
        from_user_id: e.currentTarget.dataset.repyitem.from_user_id,
        report_reply_id: e.currentTarget.dataset.repyitem.report_reply_id
      }
      this.triggerEvent('longtap',  info) //myevent自定义名称事件，父组件中使用
    }
  }
})
