var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList : [],
    start: 0,
    pageSize: 30,
    hasMoreData: true,

  },

  loadMessage:function(){
    var op = this;
    var messageList = this.data.messageList;
    app.post('/cooperate/list', {
      start: op.data.start,
      num: op.data.pageSize,
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            messageList: messageList.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            messageList: messageList.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  refreshAllMessage: function () {
    this.setData({
      messageList: [],
      start: 0,
      pageSize: 30,
      hasMoreData: true,
    });
    this.loadMessage();
  },

  oneMessage:function(event){
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    var message = event.currentTarget.dataset.message;
    var last = event.currentTarget.dataset.last;
    var card = event.currentTarget.dataset.card;
    var phone = event.currentTarget.dataset.phone;
    var realname = event.currentTarget.dataset.realname;
    var job = event.currentTarget.dataset.job;
    var company = event.currentTarget.dataset.company;
    var headimgurl = event.currentTarget.dataset.headimgurl;

    var allUrl = util.fillUrlParams('/pages/cooperate/oneMessage', {
      id: id,
      title: title,
      message: message,
      last: last,

      card: card,
      phone: phone,
      realname: realname,
      job: job,
      company: company,
      headimgurl: headimgurl
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  goMessage: function(){
    wx.navigateTo({
      url: '/pages/cooperate/message'
    });
  },

  onGotUserInfo: function(e){
    var op = this;
    app.onGotUserInfo(e, function () {
      op.goMessage();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMessage();
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
    if (app.globalData.messageDataUpdated) {
      this.refreshAllMessage();
      app.globalData.messageDataUpdated = false;
    }
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
    this.refreshAllMessage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadMessage();
    } else {
      wx.showToast({
        title: '没有更多数据',
        duration: 500,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})