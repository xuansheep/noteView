const application_json = "application/json;charset=UTF-8";
const application_form = 'application/x-www-form-urlencoded;charset=UTF-8';

const server_url = 'http://localhost:10001'

const ports = {
  user: {
    signIn: '/api/user/xcx/signIn'
  },
  nga: {
    subject: {
        list: '/api/nga/subjectList',
        detail: '/api/nga/subjectDetail'
    },
    reply: {
        list: '/api/nga/replyList'
    },
    section: {
        list: '/api/nga/sectionList'
    },
    user: {
        detail: '/api/nga/userDetail',
        subjectNum: '/api/nga/userSubjectNum',
        replyNum: '/api/nga/userReplyNum',
        replyList: '/api/nga/userReplyList'
    }
},
}

function getToken() {
  let promise = new Promise((resolve, reject) => {
    var app = getApp()
    if(!app.globalData.token) {
      // wx.request({
      //   url: server_url + ports.user.signIn,
      //   method: 'POST',
      //   success: (res) => {
      //     wx.stopPullDownRefresh();
      //     app.globalData.token = res.data.data.token
      //     resolve(app.globalData.token)
      //   },
      //   fail: function (res) {
      //     wx.stopPullDownRefresh();
      //     reject(app.globalData.token)
      //   }
      // })
      app.globalData.token = res.data.data.token
      resolve(app.globalData.token)
    }else {
      resolve(app.globalData.token)
    }
  })
  return promise
}

function fun(port, type, data, contentType) {
  let promise = new Promise((resolve, reject) => {
    getToken().then((token) => {
      wx.request({
        url: server_url + port,
        method: type,
        data: data,
        header: {
          'content-type': contentType ? contentType : application_form,
          'token': token
        },
        success: function (res) {
          wx.stopPullDownRefresh();
          if (res.data && res.data.code === 200) {
            resolve(res.data.data)
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.stopPullDownRefresh();
          reject(res)
        }
      })
    })
  })
  return promise
}

module.exports = {
  ports,
  token: function() {
    return getToken()
  },
  get:function(port, data) {
    return fun(port, 'GET', data)
  },
  post:function(port, data) {
    return fun(port, 'POST', data)
  },
  postJson:function(port, data) {
    return fun(port, 'POST', data, application_json)
  }
}