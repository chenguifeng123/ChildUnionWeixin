var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qinzi: app.qinzi,

    addBtnImg: 'classAddNum',
    minusBtnImg: 'classMinusNumDisable',

    id: 0,
    img: '',
    oneCampaign:{},
    channel : 0,
    stockNumber: 1,
    allPrice: 0,
  },

  sum: function(count){
    this.setData({allPrice : this.data.channel * count});
  },

  addStock: function () {
    var current = this.data.stockNumber;
    var max = Number(this.data.oneCampaign.stock);

    if (current == max) return;
    if (current == max - 1) {
      this.setData({
        addBtnImg: 'classAddNumDisable',
        minusBtnImg: 'classMinusNum'
      });
    } else {
      this.setData({
        minusBtnImg: 'classMinusNum',
      });
    }
    this.setData({ stockNumber: current + 1});
    this.sum(this.data.stockNumber);
  },

  minusStock: function () {
    var current = this.data.stockNumber;
    var min = Number(this.data.oneCampaign.limit_stock);
    if (current == min) return;
    if (current == min + 1) {
      this.setData({
        addBtnImg: 'classAddNum',
        minusBtnImg: 'classMinusNumDisable'
      });
    } else {
      this.setData({
        addBtnImg: 'classAddNum',
      });
    }
    this.setData({ stockNumber: current - 1});
    this.sum(this.data.stockNumber);
  },


  goHome: function (event) {
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  goCampaignlist: function (event) {
    wx.switchTab({
      url: '/pages/campaign/list',
    })
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.goOrder(e);
    });
  },

  goOrder: function (event) {
    var card = wx.getStorageSync('id');
    if (card == ''){
      wx.showToast({
        title: '请先绑定用户',
      });
      return;
    }
    var op = this;
    app.post('/order/data', {
      cardId: card,
      productId: op.data.id,
      price: op.data.channel,
      num: op.data.stockNumber,
      total: op.data.allPrice,
    }, function (data) {
      if (typeof data == 'number'){
        var allUrl = util.fillUrlParams('/pages/campaign/order', {
          id: data,
        });
        wx.navigateTo({
          url: allUrl
        });
      }else{
        wx.showToast({
          title: '订单创建失败',
        })
      }
    });

  },

  loadOneCampaign(id){
    var op = this;
    // 加载一个商户
    app.getUrl('/campaign/' + id, function (data) {
      if (app.hasData(data)) {
        var campaign = data[0];
        op.setData({ oneCampaign: campaign, stockNumber: campaign.limit_stock, channel: campaign.channel_price });
        op.sum(campaign.limit_stock);;
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var img = options.img;
    this.setData({id: id, img:img});
    this.loadOneCampaign(id);
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