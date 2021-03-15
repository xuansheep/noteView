// app.js

const http = require('./utils/http')

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('jsCode', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        http.token()
      }
    })
  },
  globalData: {
    userInfo: null,
    token: 'xcx_auth_string',
  }
})
