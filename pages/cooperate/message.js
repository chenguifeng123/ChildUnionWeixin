var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    message: '',
    formIdArray:[]
  },


  saveFormId: function (v) {
    //if (v.detail.formId != 'the formId is a mock one') {
      this.data.formIdArray.push(v.detail.formId);
    //}
  },

  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindMessageInput: function (e) {
    this.setData({
      message: e.detail.value
    })
  },

  checkInput: function () {
    if (!this.data.title || this.data.title.length < 1) {
      wx.showToast({
        title: '标题不能为空'
      });
      return false;
    }
    if (!this.data.message || this.data.message.length < 1) {
      wx.showToast({
        title: '内容不能为空'
      });
      return false;
    }
    return true;
  },


  submit: function (e) {
    //var formId = e.detail.formId;
    this.saveFormId(e);
    var op = this;
    if (!this.checkInput()) return;
    app.post('/cooperate/message', {
      cardId: app.getUserId(),
      //formId: op.data.formIdArray,
      formIdList: op.data.formIdArray,
      title: op.data.title,
      message: op.data.message,
    }, function (data) {
      if (app.hasData(data)) {
        app.globalData.messageDataUpdated = true;
        if (data == 1) {
          var allUrl = util.fillUrlParams('/pages/cooperate/verify', {
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