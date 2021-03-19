const application_json = "application/json;charset=UTF-8"
const application_form = 'application/x-www-form-urlencoded;charset=UTF-8'

// const server_url = 'https://notes.xuanss.com'
const server_url = 'http://localhost:10001'

const ports = {
  user: {
    signIn: '/api/user/xcx/signIn',
    userInfo: '/api/user/xcx/userInfo'
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

function signIn(jsCode) {
  let promise = new Promise((resolve, reject) => {
    fun(ports.user.signIn, 'POST', {jsCode: jsCode}).then((res) => {
      resolve(res)
    })
  }, (res) => {
    reject(res)
  })
  return promise
}

function getToken() {
  const app = getApp()
  return app.globalData.token
}

function fun(port, type, data, contentType) {
  let promise = new Promise((resolve, reject) => {
    wx.request({
      url: server_url + port,
      method: type,
      data: data,
      header: {
        'content-type': contentType ? contentType : application_form,
        'Authorization': getToken(),
        'device': 'xcx'
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
  return promise
}

module.exports = {
  ports,
  signIn: function(jsCode) {
    return signIn(jsCode)
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