const app = getApp()
const { ports } = require('../../utils/http')
const http = require('../../utils/http')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    isAuth: true
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log('load')
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // 登录
    wx.login({
      success: res => {
        console.log('jsCode', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        http.signIn(res.code).then((res) => {
          app.globalData.userInfo.openId = res.xcxOpenId
          if(res.token) {
            app.globalData.token = res.token
          }else {
            this.getUser().then(res => {
              if(!res) {
                this.setData({isAuth: false})
              }
            })
          }
        })
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  enter() {
    var app = getApp();
    if(!app.globalData.tokan) {
      return;
    }
    wx.redirectTo({
      url: '../nga/subject/subject',
    })
  },
  getUser() {
    let promise = new Promise((resolve, reject) => {
      wx.getSetting({
        success (res){
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log(res)
                http.post(ports.user.userInfo, {openId: app.globalData.userInfo.openId, encryptedData: res.encryptedData, iv: res.iv}).then(res => {
                  app.globalData.token = res.token
                  resolve(true)
                })
              }
            })
          } else {
            reject(false)
          }
        }
      })
    })
    return promise
  }
})
