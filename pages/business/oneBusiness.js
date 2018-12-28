var util = require('../../utils/util.js');
const app = getApp()
import oneBusinessTemp from '../common/oneBusinessTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneBusiness: {},
    isMyPage: false,
    imageIndex: 0,
    follow:0,
    id:-1,

    messageList:[],
    start: 0,
    pageSize: 10,
    hasMoreData: true,

    isLeaguer:false,
  },

  getFollowerById: oneBusinessTemp.getFollowerById,
  getFansById: oneBusinessTemp.getFansById,
  jumpScore: oneBusinessTemp.jumpScore,
  callMe: oneBusinessTemp.callMe,

  goHome:function(event){
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  jump2OneMessage:function(event){
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    var message = event.currentTarget.dataset.message;
    var last = event.currentTarget.dataset.last;
    var read = event.currentTarget.dataset.read;
    var like = event.currentTarget.dataset.like;

    var card = this.data.oneBusiness.id;
    var phone = this.data.oneBusiness.phone;
    var realname = this.data.oneBusiness.realname;
    var job = this.data.oneBusiness.job;
    var company = this.data.oneBusiness.company;
    var headimgurl = this.data.oneBusiness.headimgurl;

    var allUrl = util.fillUrlParams('/pages/cooperate/oneMessage', {
      id: id,
      title: title,
      message: message,
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

  cancel:function(event){
      // 加载一个商户
      var op = this;
      var userId = app.getUserId();
      app.getUrl('/business/deleteFollower/' + userId + '-' + this.data.id, function (data) {
        if (app.hasData(data)) {
          op.setData({ follow: 0 });
          app.globalData.listDataUpdated = true;

          var allUrl = util.fillUrlParams('/pages/business/success', {
          });
          wx.navigateTo({
            url: allUrl
          });
        }
      });
    },

  onGotUserInfo: function(e) {
    var op = this;
    app.onGotUserInfo(e, function(){
      op.addFollower(e);
    });
  },

  addFollower:function(event){
    // 加载一个商户
    var op = this;
    var userId = app.getUserId();
    app.getUrl('/business/addFollower/' + userId + '-' + this.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({follow:1});
        app.globalData.listDataUpdated = true;
        
        var allUrl = util.fillUrlParams('/pages/business/success', {
        });
        wx.navigateTo({
          url: allUrl
        });
      }
    });
  },

  loadOneBusiness: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        var business = data[0];
        if(business.score < 500){
          business.phone = util.hidePhone(business.phone);
          business.weixincode = util.hidePhone(business.weixincode);
        }
        op.setData({ oneBusiness: business });
      }
    });
  },

  loadMessageByCardId: function(id){
    var op = this;
    var messageList = this.data.messageList;
    app.post('/cooperate/cardId', {
      start: op.data.start,
      num: op.data.pageSize,
      cardId: id
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
      pageSize: 10,
      hasMoreData: true,
    });
    this.loadMessageByCardId(this.data.id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var follow = options.follow;
    this.setData({
      id: id,
      follow: follow
      });
    this.loadOneBusiness(id);
    this.loadMessageByCardId(id);
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
    if (app.globalData.messageBussinessUpdated) {
      this.refreshAllMessage();
      app.globalData.messageBussinessUpdated = false;
    }
    /*
    if (app.globalData.messageDataUpdated) {
      this.loadMessageByCardId(this.data.id);
      app.globalData.messageDataUpdated = false;
    }
    */
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
      this.loadMessageByCardId(this.data.id);
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
    var op = this;
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: op.data.id,
      isFollowed: 0,
    });

    return {
      title: '分享名片',
      path: allUrl,
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})