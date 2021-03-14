const http = require("../../../utils/http")
const { ports } = require("../../../utils/http")

// pages/nga/subject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    form: {
      page: 1,
      size: 15,
      word: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.post(ports.nga.subject.list, this.data.form).then((res) => {
      this.setData({dataList: res.records})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.form.page++
    http.post(ports.nga.subject.list, this.data.form).then((res) => {
      var list = this.data.dataList
      res.records.forEach(item => {
        list.push(item)
      })
      console.log(list)
      this.setData({dataList: list})
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toReply: function (e) {
    var tid = e.currentTarget.dataset.tid
    wx.navigateTo({
      url: '../reply/reply?tid=' + tid,
    })
  }
})