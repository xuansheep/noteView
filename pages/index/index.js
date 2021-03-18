var app = getApp()
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
    isAuth: true,
    enterLoading: true,
    userLoading: false,
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    const _this = this
    // 登录
    wx.login({
      success: res => {
        console.log('jsCode', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        http.signIn(res.code).then((res) => {
          app.globalData.userInfo.openId = res.xcxOpenId
          if(res.token) {
            app.globalData.token = res.token
            _this.setData({enterLoading: false})
          }else {
            wx.getSetting({
              success (res){
                if (res.authSetting['scope.userInfo']) {
                  wx.getUserInfo({
                    success: function(res) {
                      http.post(ports.user.userInfo, {openId: app.globalData.userInfo.openId, 
                        encryptedData: res.encryptedData, iv: res.iv}).then(res => {
                        app.globalData.token = res.token
                        _this.setData({buttonLoading: false})
                      })
                    }
                  })
                }else {
                  _this.setData({isAuth: false, buttonLoading: false})
                }
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
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
    if('getUserInfo:ok' === e.detail.errMsg){
      this.setData({userLoading: true})
      http.post(ports.user.userInfo, {openId: app.globalData.userInfo.openId, 
        encryptedData: e.detail.encryptedData, iv: e.detail.iv}).then(res => {
        app.globalData.token = res.token
        this.enter()
      }, () => {
        this.setData({userLoading: false})
      })
    } else {
      wx.showToast({
        title: '用户取消授权',
        icon: 'none',
        duration: 2000
      })
    }
  },
  enter() {
    if(!app.globalData.token) {
      return;
    }
    wx.redirectTo({
      url: '../nga/subject/subject',
    })
  }
})
