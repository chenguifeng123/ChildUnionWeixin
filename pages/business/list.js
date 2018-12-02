var util = require('../../utils/util.js');
const app = getApp()
import businessTemp from '../common/businessTemp';

Page({
  data: {
    businessList : [],

    start: 0,
    pageSize: 30,
    hasMoreData: true,

    inputShowed: false,
    searchValue: "",
  },

  oneBusiness: businessTemp.oneBusiness,
  onGotUserInfo: businessTemp.onGotUserInfo,
  addFollower: businessTemp.addFollower,

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  clearInput: function () {
    this.refreshAllBusiness();
  },

  inputTyping: function (e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  searchSubmit:function(e){
    this.setData({
      businessList: [],
      start: 0,
      hasMoreData: true,
      inputShowed: false
    });
    this.loadAllBusiness();
  },

  refreshAllBusiness:function(){
    this.setData({
      businessList: [],
      start: 0,
      hasMoreData: true,
      searchValue: "",
      inputShowed: false
    });
    this.loadAllBusiness();
  },

  loadAllBusiness:function(){
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var businessList = this.data.businessList;
    // 加载商户
    app.post('/business/list', {
        id: id,
        start: op.data.start,
        num: op.data.pageSize,
        search: op.data.searchValue
      }, function (data) {
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
    this.loadAllBusiness();
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
    this.refreshAllBusiness();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
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
