var util = require('../../utils/util.js');
const app = getApp()
import oneBusinessTemp from '../common/oneBusinessTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneBusiness: {},
    isMyPage: true,
    needShow: false,
    needSign: true,
    id: -1,
    imageIndex: 1,
  },

  getFollowerById: oneBusinessTemp.getFollowerById,
  getFansById: oneBusinessTemp.getFansById,
  jumpScore: oneBusinessTemp.jumpScore,
  callMe: oneBusinessTemp.callMe,

  modifyCard: function (event) {
    app.modifyCard();
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function(){
      op.refresh();
    });
  },

  sign:function(e){
    var op = this;
    app.onGotUserInfo(e, function () {
      op.sign2Server(op.data.id);
      op.refresh();
    });
  },

  jumpInvite:function(e){
    var allUrl = util.fillUrlParams('/pages/my/invite', {
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  loadSign:function(id){
    var op = this;
    // 加载一个商户
    app.getUrl('/business/hasSigned/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null) return;
        if(data == 1){
          op.setData({
            needSign: false
          });
        }else{
          op.setData({
            needSign: true
          });
        }
      }
    });
  },

  sign2Server:function(id){
    var op = this;
    // 加载一个商户
    app.getUrl('/business/sign/' + id, function (data) {
      if (app.hasData(data)) {

      }
    });
  },

  loadOneBusiness: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        if(data == null || data.length == 0) return;
        op.setData({ 
          oneBusiness: data[0],
          needShow: true
         });
      }
    });
  },

  refresh:function(){
    var op = this;
    var id = app.getUserId();
    this.setData({id: id});
    this.loadOneBusiness(id);
    this.loadSign(id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refresh();

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
    var op = this;
    
    this.refresh();
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
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.refresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var op = this;
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: app.getUserId(),
      follow:0
    });

    return {
      title: '请关注我',
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