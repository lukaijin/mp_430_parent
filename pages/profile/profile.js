const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
const api = require('../../utils/api/index.js')
const options = require('../../utils/options.js')

Page({

  data: {
    index: 0,
    ageIndex: 10,
    relationIndex: 0,
    profile: {
      group_id: null,
      parent_name: '',
      parent_job: '',
      parent_age: '',
      child_relation: ''
    },
    options: {
      occupation: options.occupation,
      age: options.age,
      relation: options.relation
    }
  },

  onLoad () {
    this.getParentInfo()
  },

  /* methods start */
  async getParentInfo () {
    let info = await api.getParentInfo()
    this.setData({
      ['profile.parent_name']: info.parent_name,
      ['profile.parent_age']: parseInt(info.parent_age),
      index: this.data.options.occupation.indexOf(info.parent_job) > -1 ? this.data.options.occupation.indexOf(info.parent_job) : 0,
      relationIndex: this.data.options.relation.indexOf(info.child_relation)
    })
  },
  bindOccupationChange (e) {
    this.setData({
      index: parseInt(e.detail.value),
      ['profile.parent_job']: this.data.options.occupation[this.data.index]
    })
  },
  bindAgeChange (e) {
    this.setData({
      ageIndex: parseInt(e.detail.value),
      ['profile.parent_age']: this.data.options.age[this.data.ageIndex]
    })
  },
  bindRelationChange (e) {
    this.setData({
      relationIndex: parseInt(e.detail.value),
      ['profile.child_relation']: this.data.options.relation[this.data.relationIndex]
    })
  },
  async formSubmit (e) {
    console.log('formSubmit', e)
    var obj = e.detail.value
    var params = {
      parent_name: obj.parent_name,
      parent_job: this.data.options.occupation[obj.parent_job],
      child_relation: this.data.options.relation[obj.child_relation],
      parent_age: this.data.options.age[obj.parent_age]
    }
    try {
      await api.updateParentCommonInfo(params)
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      wx.showToast({
        title: '服务器异常',
        icon: 'none',
        duration: 2000
      })
    }
  }
  /* methods start */
})