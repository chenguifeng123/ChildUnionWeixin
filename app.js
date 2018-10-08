//app.js
App({
  hometeach: "https://www.qinzi123.com",
  userCode: "0",

  login: function () {
    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          this.userCode = code;
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  onLaunch: function () {
    this.login();
  },

  post: function (loadUrl, postData, func) {
    wx.request({
      url: this.hometeach + loadUrl,
      data: postData,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        func(res.data);
      }
    })
  },

  getUrl: function (loadUrl, func) {
    wx.request({
      url: this.hometeach + loadUrl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        func(res.data);
      }
    })
  },

  deleteUrl: function (loadUrl, func) {
    wx.request({
      url: this.hometeach + loadUrl,
      method: "DELETE",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        func(res.data);
      }
    })
  },

  isAuth: function (event) {
    if (!!event.detail.userInfo) {
      this.globalData.userInfo = event.detail.userInfo;
      return true;
    }
    return false;
  },

  // 后续要重构采用 result{code: msg: data}这种结构返回
  hasData: function (data) {
    if (data == undefined || data == null) return false;
    return true;
  },

  joinConfirm: function (event, func) {
    if (event.type != "getuserinfo") return;
    if (this.isAuth(event)) {
      func();
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '拒绝授权后,将无法发起拼班和参与拼班,  请您确认后重新操作,并允许授权',
        confirmText: '确认',
        showCancel: false,
        success: function (res) {
        }
      })
    }
  },

  getUserId: function(){
    var id = wx.getStorageSync('id');
    //return id == '' ? -1 : id;

    return 26;
  },

  globalData: {
    userInfo: null
  }
})