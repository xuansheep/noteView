const { ports } = require("../../../utils/http")
const http = require("../../../utils/http");
const util = require("../../../utils/util");

// pages/nga/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      uid: 'undefined'
    },
    user: {},
    subjectNum: undefined,
    replyNum: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.form.uid = options.uid;
    http.post(ports.nga.user.detail, this.data.form).then((res) => {
      res.avatar = util.proxyImage(res.avatar)
      this.setData({user: res})
      http.post(ports.nga.user.subjectNum, this.data.form).then((res) => {
          this.setData({subjectNum: res})
      })
      http.post(ports.nga.user.replyNum, this.data.form).then((res) => {
          this.setData({replyNum: res})
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})