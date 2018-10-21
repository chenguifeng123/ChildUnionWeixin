var util = require('../../utils/util.js');
const app = getApp()
import businessTemp from '../common/businessTemp';

Page({
  data: {
    businessList : [],

    start: 1,
    pageSize: 30,
    hasMoreData: true,
  },

  oneBusiness: businessTemp.oneBusiness,
  onGotUserInfo: businessTemp.onGotUserInfo,
  addFollower: businessTemp.addFollower,

  refreshAllBusiness:function(){
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var page = this.data.start == 1 ? this.data.pageSize : this.data.start;
    // 加载商户
    app.getUrl('/business/list/' + id + '-' + 1 + '-' + page, function (data) {
      if (app.hasData(data)) {
          op.setData({
            businessList: data
          });
      }
    });
  },

  loadAllBusiness:function(){
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var businessList = this.data.businessList;
    // 加载商户
    app.getUrl('/business/list/' + id + '-' + this.data.start + '-' + this.data.pageSize, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            businessList: businessList.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            businessList: businessList.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  onLoad: function () {
    this.refreshAllBusiness();
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    if (app.globalData.listDataUpdated){
      this.refreshAllBusiness();
      app.globalData.listDataUpdated = false;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    /*
    this.data.start = 1;
    wx.showToast({
      title: '正在刷新',
    });
    this.loadAllBusiness();
    */
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      /*
      wx.showToast({
        title: '正在加载',
        duration: 500,
      });*/
      this.loadAllBusiness();
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
