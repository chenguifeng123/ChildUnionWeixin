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

    tag : []
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
          workaddress: oneBusiness.workaddress,
          introduce: oneBusiness.introduce,
         });
      }
    });
  },

  submit:function(){
    var op = this;
    app.post('/business/setUser', {
      code:  app.userCode,
      headimgurl: app.globalData.userInfo.avatarUrl,
      realname: op.data.realname,
      company: op.data.company,
      job: op.data.job,
      phone: op.data.phone,
      workaddress: op.data.workaddress,
      introduce: op.data.introduce,
      tag : op.data.tag
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
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tag = options.tag;
    this.setData({
      tag: tag
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