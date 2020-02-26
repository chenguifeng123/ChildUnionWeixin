//app.js
App({
  qinzi: "https://www.qinzi123.com",
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
      url: this.qinzi + loadUrl,
      data: postData,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.code) {
          if (res.data.code != "00000000") {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
          } else {
            func(res.data.data);
          }
        } else
          func(res.data);
      }
    })
  },

  getUrl: function (loadUrl, func) {
    wx.request({
      url: this.qinzi + loadUrl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.code ){
          if(res.data.code != "00000000"){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
          }else{
            func(res.data.data);
          }
        }else
          func(res.data);
      }
    })
  },

  deleteUrl: function (loadUrl, func) {
    wx.request({
      url: this.qinzi + loadUrl,
      method: "DELETE",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        func(res.data.data);
      }
    })
  },

  modifyCard: function () {
    wx.navigateTo({
      url: '/pages/my/type'
    });
  },

  onGotUserInfo: function (e, getFunction) {
    this.globalData.userInfo = e.detail.userInfo;
    if (this.getUserId() != -1) {
      getFunction();
      return;
    }
    if (this.globalData.userInfo != null) {
      var op = this;
      op.getUrl('/business/info/code/' + op.userCode, function (data) {
        if (op.hasData(data)) {
          if (data == null || data == -1) {
            wx.showModal({
              title: '完善信息',
              content: '请完善个人信息,谢谢',
              success: function (res) {
                console.log(res)
                if (res.confirm) {
                  op.modifyCard();
                }
              }
            });
          } else {
            wx.setStorageSync('id', data);
            getFunction();
          }
        }
      });
    }
  },

  isLeaguerFunc:function(func){
    var op = this;
    //var score = wx.getStorageSync('score');
    var leaguer = wx.getStorageSync('leaguer');
    if (leaguer == ''){
      if(this.getUserId() == -1){
        func(false);
      }else{
        this.getUrl('/business/info/' + this.getUserId(), function (data) {
          if (op.hasData(data)) {
            if (data == null || data.length == 0) return;
            // 因为积分动态更新,使用缓存的话,需要在多个积分的地方增加更新缓存,暂不考虑缓存
            //wx.setStorageSync('score', data[0].score);
            //func(data[0].score >= 2000);
            func(data[0].leaguer == 1);
          }
        });
      }
    }else{
      //func(score >= 2000);
      func(leaguer == 1);
    }
    return;
  },

  formIdInput: function(v, op){
    var formId = v.detail.formId == 'the formId is a mock one' ? '0' : v.detail.formId;
    if (op.data.formIdArray.indexOf(formId) < 0)
      op.data.formIdArray.push(formId);
  },

  batchAddFormId: function(op){
    if(!!op.data.formIdArray){
      if(op.data.formIdArray.length == 0) return;
      var idList = op.data.formIdArray.join(",");
      this.post('/formList/' + this.getUserId() + '-' + idList, {}, function (data) {
        console.log("批量新增formId：" + data);
        op.setData({
          formIdArray: []
        });
      });
    }
  },

  // 后续要重构采用 result{code: msg: data}这种结构返回
  hasData: function (data) {
    if (data == undefined || data == null) return false;
    if (!!data.code && data.code != "00000000") return false;
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
    return id == '' ? -1 : id;
    //return 26;
  },

  loadCity: function(setCity){
    var defaultCity = {
      cityCode: 220,
      cityName: '南京'
    };
    if (this.getUserId() == -1)
      setCity(defaultCity); 
    var cityCode = wx.getStorageSync('city');
    var op = this;
    if(cityCode == ''){
      this.getUrl('/business/info/' + this.getUserId(), function (data) {
        if (op.hasData(data)) {
          if (data != null && data.length > 0){
            cityCode = data[0].city;
            if (!!cityCode){
              op.getUrl('/business/oneCity/' + cityCode, function (data1) {
                if (op.hasData(data1)) {
                  wx.setStorageSync('city', cityCode);  
                  wx.setStorageSync('cityName', data1.cityName);
                  setCity({
                    cityCode: cityCode,
                    cityName: data1.cityName
                  });
                }
              });
            }
          }
        }
      });
    }else{
      setCity({
        cityCode: cityCode,
        cityName: wx.getStorageSync('cityName')
      });
    }
  },

  globalData: {
    userInfo: null,
    listDataUpdated : false,
    messageDataUpdated : false,
    messageBussinessUpdated: false,
  }
})