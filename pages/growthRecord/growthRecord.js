const api = require('../../utils/api/index.js')
const dayjs = require('../../utils/dayjs/dayjs.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    limit: 3,
    growthList: [],
    typeList: ['家长动态', '每节一报', '每课一报'],
    loadMore: false,
    isShow: false,
    isPreviewImage: false
  },

  onShow () {
    if (this.data.isPreviewImage) {
      this.setData({ isPreviewImage: false })
      return
    }
    this.data.offset = 0
    this.data.limit = 3
    this.setData({
      growthList: [],
      loadMore: false
    })
    this._getGrowthList()
  },

  onReachBottom () {
    if (this.data.loadMore) { // 最新报告
      this._getGrowthList()
    }
  },

  /* methods start */
    _toPublish () {
      wx.navigateTo({
        url: '/pages/publish/publish'
      })
    },
    _getGrowthList () {
      let parmes = {
        page_count: this.data.limit,
        page_index: this.data.offset
      }
      api.getGrowthList(parmes)
        .then(res => {
          // console.log(res.growth_list.length, this.growthList.length, res.total_count)
          this.setData({ isShow: true })
          if (res.total_count > Number(res.growth_list.length) + Number(this.data.growthList.length)) {
            this.setData({ loadMore: true })
          } else {
            this.setData({ loadMore: false })
          }
          this.data.offset = this.data.limit + this.data.offset
          this.data.growthList = this.data.growthList.concat(res.growth_list)
          const today = dayjs().startOf('day')
          this.data.growthList.forEach((item, index) => {
            item.showTime = 1
            if (dayjs(item.create_time).startOf('day').isSame(today)) {
              item.showTime = 0
            }
            if (index !== 0) {
              if (item.create_time.substr(0, 10) === this.data.growthList[(Number(index) - 1)].create_time.substr(0, 10)) {
                item.showTime = 0
              }
            }
          })
          this.setData({ growthList: this.data.growthList })
        })
    },
    _previewImage (e) {
      console.log('_previewImage', e)
      let index = e.currentTarget.dataset.index
      let item = e.currentTarget.dataset.item
      this.setData({ isPreviewImage: true })
      wx.previewImage({
        current: item, // 当前显示图片的http链接
        urls: this.data.growthList[index].moment_images // 需要预览的图片http链接列表
      })
    },
    _toReportDetail (e) {
      let id = e.currentTarget.dataset.reportId
      wx.navigateTo({
        url: '/pages/reportDetail/reportDetail?id=' + id
      })
    }
   /* methods end */

  
})