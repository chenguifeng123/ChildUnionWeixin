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
    id:-1
  },

  getFollowerById: oneBusinessTemp.getFollowerById,
  getFansById: oneBusinessTemp.getFansById,
  callMe: oneBusinessTemp.callMe,

  goHome:function(event){
    wx.switchTab({
      url: '/pages/business/list',
    })
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
    app.globalData.userInfo = e.detail.userInfo;
    //console.log(e.detail.errMsg)
    //console.log(e.detail.userInfo)
    //console.log(e.detail.rawData)
    if (app.getUserId() == -1){
      wx.showModal({
        title: '提示',
        content: '请先完善个人信息,再关注',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/type'
            });
          }
        }
      })
    }else{
      this.addFollower(e);
    }
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
        op.setData({ oneBusiness: data[0] });
      }
    });
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