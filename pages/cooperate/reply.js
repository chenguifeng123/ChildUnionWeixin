var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateId : '9mY0ssY4O1iSnG9c3hPID4BQxVBHA_GWWjBZ43-HEl4',
    messageId: 0,
    replyId: 0,
    message: '',
    formIdArray: [],
    authClick : false,
  },

  saveFormId: function (v) {
    if (v.detail.formId != 'the formId is a mock one') {
      this.data.formIdArray.push(v.detail.formId);
    }
  },

  bindMessageInput: function (e) {
    this.setData({
      message: e.detail.value
    })
  },

  checkInput: function () {
    if (!this.data.message || this.data.message.length < 5) {
      wx.showToast({
        title: '内容不能少于5个字'
      });
      return false;
    }
    return true;
  },

  auth: function(){
    if(!this.data.authClick){
      app.getAuth2PushMessage(this.data.templateId);
      this.setData({
        authClick:true
      })
    }
  },

  addReply:function(){
    var op = this;
    var replyMessage = this.data.message;
    app.post('/cooperate/messageReply', {
      messageId: op.data.messageId,
      cardId: app.getUserId(),
      //formId: formId,
      formIdList: op.data.formIdArray,
      replyId: op.data.replyId,
      replyMessage: replyMessage,
    }, function (data) {
      /** 
      if (app.hasData(data)) {
        wx.navigateBack({
          delta: 1
        })
      }
      */
      if (app.hasData(data)) {
        var allUrl = util.fillUrlParams('/pages/cooperate/verify', {
        });
        wx.navigateTo({
          url: allUrl
        });
      }
    });
  },

  submit: function (e) {
    if(!this.checkInput()) return; 
    //var formId = e.detail.formId;
    this.auth();
    this.addReply();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var messageId = options.messageId;
      var replyId = options.replyId;
      this.setData({
        messageId : messageId,
        replyId: replyId
      })
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