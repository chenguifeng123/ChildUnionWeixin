var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerDefault: '/pages/cooperate/banner',
    messageList : [],
    start: 0,
    pageSize: 30,
    hasMoreData: true,

    // 轮播URL和图片用来做广告栏
    imgUrls: [
    ],
    // 轮播控制项
    indicatorDots: true,
    autoplay: true,
    interval: 3000,  // 轮播间隔
    duration: 1000,

  },

  translateMessageType: function(value){
    return util.translateMessageType(value);
  },

  loadBanner:function(){
    var op = this;
    app.getUrl('/banner/list', function (data) {
      if (app.hasData(data)) {
        op.setData({
          imgUrls: data,
        });
      }
    });
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
    var messageType = event.currentTarget.dataset.type;
    var last = event.currentTarget.dataset.last;
    var read = event.currentTarget.dataset.read;
    var like = event.currentTarget.dataset.like;
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
      messageType: messageType,
      last: last,
      read: read,
      like: like,

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
    this.loadBanner();
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