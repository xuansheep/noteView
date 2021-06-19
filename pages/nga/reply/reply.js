const { ports } = require("../../../utils/http")
const http = require("../../../utils/http")
const util = require("../../../utils/util")

// pages/nga/reply/reply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    form: {
      tid: '',
      page: 0,
      size: 10,
      onlyImageFlag: false,
      onlyLouFlag: false,
    },
    subject: '',
    loading: false,
    empty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.form.tid = options.tid
    this.setData({subject: options.subject})
    this.getList()
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
    if (this.data.loading) {
      return
    }
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 自定义函数
   */
  getList: function () {
    this.setData({loading: true})
    var params = {...this.data.form, page: this.data.form.page + 1}
    http.post(ports.nga.reply.list, params).then((res) => {
      if (res.records.length > 0) {
        var list = this.data.dataList
        this.data.form.page++
        res.records.forEach(item => {
          item.avatar = util.proxyImage(item.avatar)
          item.postDate = util.formatDateMMddHHmmss(item.postDate)
          item.rvrc = (item.rvrc/10).toFixed(1)
          list.push(item)
        })
        this.setData({dataList: list, loading: false})
      } else {
        this.setData({loading: false, empty: true})
        if (this.data.dataList.length > 0) {
          setTimeout(() => {
            this.setData({empty: false})
          }, 1500)
        }
      }
    }, () => {
      this.setData({loading: false})
    })
  },
  onlyImage() {
    this.setData({'form.onlyImageFlag': !this.data.form.onlyImageFlag})
    this.data.form.page = 0
    this.setData({dataList: []})
    this.getList()
  },
  onlyLou(e) {
    this.setData({'form.onlyLouFlag': !this.data.form.onlyLouFlag})
    if (this.data.form.onlyLouFlag) {
      this.data.form.authorId = e.currentTarget.dataset.authorId
    }else {
      this.data.form.authorId = null
    }
    this.data.form.page = 0
    this.setData({dataList: []})
    this.getList()
  },
  showAttach(e){
    var attachList = e.target.dataset.attachList
    var index = e.target.dataset.attachIndex
    var urlList = []
    Object.keys(attachList).forEach(key => {
      urlList.push(util.proxyImage('https://img.nga.178.com/attachments/' + attachList[key].attachurl))
    })
    wx.previewImage({
      urls: urlList,
      current: urlList[index]
    })
},
})