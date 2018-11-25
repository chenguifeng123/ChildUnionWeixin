var util = require('../../utils/util.js');
const app = getApp()
import messageReplyTemp from '../common/messageReplyTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    title: '',
    message: '',
    last: '',

    card: 0,
    phone: '',
    realname: '',
    job: '',
    company: '',
    headimgurl: '',

    replyList : [],
    replyMessage : '',
  },

  oneBusiness: messageReplyTemp.oneBusiness,
  jumpBusiness: messageReplyTemp.jumpBusiness,

  onGotUserInfo: function (e) {
    var op = this;
    var replyId = e.currentTarget.dataset.id;
    app.onGotUserInfo(e, function () {
      var allUrl = util.fillUrlParams('/pages/cooperate/reply', {
        messageId: op.data.id,
        replyId: !!replyId ? replyId : 0
      });
      wx.navigateTo({
        url: allUrl
      });
    });
  },

  goHome: function (event) {
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  contact: function(event){
    var call = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: call, //此号码并非真实电话号码，仅用于测试  
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  loadReply4MessageId: function(messageId){
    var op = this;
    // 加载一个商户
    app.getUrl('/cooperate/messageReply/' + messageId, function (data) {
      if (app.hasData(data)) {
        op.setData({
          replyList: data,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var title = options.title;
    var message = options.message;
    var last = options.last;
    var card = options.card;
    var phone = options.phone;
    var realname = options.realname;
    var job = options.job;
    var company = options.company;
    var headimgurl = options.headimgurl;

    this.setData({
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

    this.loadReply4MessageId(id);
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
    this.loadReply4MessageId(this.data.id);
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
    var allUrl = util.fillUrlParams('/pages/business/oneMessage', {
      id: op.data.id,
      title: op.data.title,
      message: op.data.message,
      last: op.data.last,

      card: op.data.card,
      phone: op.data.phone,
      realname: op.data.realname,
      job: op.data.job,
      company: op.data.company,
      headimgurl: op.data.headimgurl
    });

    return {
      title: '分享合作',
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