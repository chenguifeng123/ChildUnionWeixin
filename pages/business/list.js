var util = require('../../utils/util.js');
const app = getApp()
import businessTemp from '../common/businessTemp';

Page({
  data: {
    // 轮播URL和图片用来做广告栏
    imgUrls: [
      
      {
        link: '/pages/business/banner/banner1',
        url: "/pages/img/qinghuaci_banner.jpeg",
        isTab: true
      }
      , {
        link: '/pages/join/classList',
        url: "/pages/img/banner2.png",
        isTab: false
      }
      , {
        link: '/pages/my/invite',
        url: "/pages/img/invite.jpg",
        isTab: false
      }
      
    ],
    // 轮播控制项
    indicatorDots: true,
    autoplay: true,
    interval: 3000,  // 轮播间隔
    duration: 1000,

    selectTxt:'行业',

    businessList : [],

    start: 0,
    pageSize: 30,
    hasMoreData: true,

    inputShowed: false,
    searchValue: "",

    tag:-1,

    cityCode: 0,
    cityName: '',

    formIdArray: [],

    countDisplayCards: 1000,
  },

  oneBusiness: businessTemp.oneBusiness,
  onGotUserInfo: businessTemp.onGotUserInfo,
  addFollower: businessTemp.addFollower,

  saveFormId: function (v) {
    app.formIdInput(v, this);
  },


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

  selectCity: function (event) {
    var tag = this.data.tag;
    var allUrl = util.fillUrlParams('./citys', {
      sourceTab: 1,
      sourcePage: '/pages/business/list'
    });
    wx.navigateTo({
      url: allUrl,
    });
  },

  selectType:function(event){
    var tag = this.data.tag;
    var allUrl = util.fillUrlParams('./typeSelect', {
      tagId: tag
    });
    wx.navigateTo({
      url: allUrl,
    });
  },

  selectAll:function(event){
    this.setData({
      selectTxt: '行业',
      tag: -1,
    });
    this.refreshAllBusiness();
  },

  refreshAllBusiness:function(){
    this.setData({
      businessList: [],
      start: 0,
      hasMoreData: true,
      searchValue: "",
      inputShowed: false,
    });
    this.loadAllBusiness();
  },

  loadBusinessCount:function(city){
    var op = this;
    app.getUrl('/business/count/' + city, function (data) {
      if (app.hasData(data)) {
        op.setData({
          countDisplayCards: data,
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
    app.post('/business/list', {
        id: id,
        start: op.data.start,
        num: op.data.pageSize,
        search: op.data.searchValue,
        tag: op.data.tag,
        city: op.data.cityCode
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

  loadCity:function(){
    var op = this;
    app.loadCity(function (city) {
      op.setData({
        cityCode: city.cityCode,
        cityName: city.cityName
      });
      op.refreshAllBusiness();
    })
  },

  onLoad: function (options) {
    if(!!options.tagId){
      this.setData({ tag: options.tagId, selectTxt:options.tagName});
    }
    // 由公众号跳转过来
    if (!!options.cityCode){
      this.setData({ cityCode: options.cityCode, cityName: options.cityName });
      //this.loadAllBusiness();
    }else{
      //this.setData({ cityCode: 220, cityName: '南京' });
      this.setData({ cityCode: -1, cityName: '全部' });
      //this.loadCity();
     }
    this.loadAllBusiness();
    this.loadBusinessCount(-1);
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    if (app.globalData.listDataUpdated){
      this.refreshAllBusiness();
      app.globalData.listDataUpdated = false;
    }
    if (wx.getStorageSync('city') == ''){
      this.loadCity();
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
