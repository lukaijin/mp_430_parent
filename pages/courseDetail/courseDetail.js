
Page({

 data: {
  query: {}
 },
  
  onLoad (query) {
    console.log('courseDetail_onLoad', query)
    this.setData({ query })
  }
})