var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname:'',
    company:'',
    job:'',
    phone:'',
    workaddress:'',
    introduce:'',
    weixincode:'',

    tag : [],
    invite:-1,
    formIdArray: [],

    commited:false,
  },

  bindRealnameInput: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },

  bindCompanyInput: function (e) {
    this.setData({
      company: e.detail.value
    })
  },

  bindJobInput: function (e) {
    this.setData({
      job: e.detail.value
    })
  },

  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  bindWeixinInput: function (e) {
    this.setData({
      weixincode: e.detail.value
    })
  },

  bindWorkaddressInput: function (e) {
    this.setData({
      workaddress: e.detail.value
    })
  },

  bindIntroduceInput: function (e) {
    this.setData({
      introduce: e.detail.value
    })
  },

  saveFormId: function (v) {
    app.formIdInput(v, this);
  },

  onGotUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    if (app.globalData.userInfo != null)
      this.submit();
  },

  loadOneBusiness: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        if(data == null || data.length == 0) return;
        var oneBusiness = data[0];
        op.setData({
          realname: oneBusiness.realname,
          company: oneBusiness.company,
          job: oneBusiness.job,
          phone: oneBusiness.phone,
          weixincode: !!oneBusiness.weixincode ? oneBusiness.weixincode: '',
          workaddress: oneBusiness.workaddress,
          introduce: oneBusiness.introduce,
         });
      }
    });
  },


  checkInput: function () {
    if (!this.data.realname || this.data.realname.length < 1) {
      wx.showToast({
        title: '姓名不能为空'
      });
      return false;
    }
    if (!this.data.company || this.data.company.length == 0) {
      wx.showToast({
        title: '公司不能为空'
      });
      return false;
    }
    if (!this.data.job || this.data.job.length == 0) {
      wx.showToast({
        title: '职务不能为空'
      });
      return false;
    }
    if (!this.data.phone || this.data.phone.length == 0) {
      wx.showToast({
        title: '手机不能为空'
      });
      return false;
    }
    if (!this.data.weixincode || this.data.weixincode.length == 0) {
      wx.showToast({
        title: '微信号不能为空'
      });
      return false;
    }
    if (!this.data.workaddress || this.data.workaddress.length == 0) {
      wx.showToast({
        title: '地址不能为空'
      });
      return false;
    }
    if (!this.data.introduce || this.data.introduce.length == 0) {
      wx.showToast({
        title: '简介不能为空'
      });
      return false;
    }
    return true;
  },

  submit:function(){
    var op = this;
    if(!this.checkInput()) return;

    op.setData({
      commited:true,
    });

    app.post('/business/setUser', {
      code:  app.userCode,
      headimgurl: app.globalData.userInfo.avatarUrl,
      realname: op.data.realname,
      company: op.data.company,
      job: op.data.job,
      phone: op.data.phone,
      weixincode: op.data.weixincode,
      workaddress: op.data.workaddress,
      introduce: op.data.introduce,
      tag : op.data.tag,

      invite:op.data.invite
    }, function (data) {
      if (app.hasData(data)) {
        if(app.getUserId() == -1){
          wx.setStorageSync('id', data);
          var allUrl = util.fillUrlParams('/pages/business/commend', {
          });
          wx.navigateTo({
            url: allUrl
          });
        }else{
          var allUrl = util.fillUrlParams('/pages/business/success', {
          });
          wx.navigateTo({
            url: allUrl
          });
        }
        app.batchAddFormId(op);
      }else{

        op.setData({
          commited: false,
        });
      }

    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tag = options.tag;
    var invite = options.invite;
    this.setData({
      tag: tag,
      invite:invite,
      commited:false,
      });
    this.loadOneBusiness(app.getUserId());
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