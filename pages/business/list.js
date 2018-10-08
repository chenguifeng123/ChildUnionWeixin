var util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    businessList : [],

  },

  oneBusiness:function(event){
    var id = event.currentTarget.dataset.id;
    var isFollowed = event.currentTarget.dataset.isfollowed;
    var allUrl = util.fillUrlParams('./oneBusiness', {
      id : id,
      isFollowed: isFollowed
    });
    wx.navigateTo({
      url: allUrl
    });

  },

  loadAllBusiness:function(){
    var op = this;
    var id = wx.getStorageSync('id');
    id = 26;
    id = id == '' ? -1 : id;
    // 加载外教
    app.getUrl('/business/list/' + id, function (data) {
      if (app.hasData(data)) {
        op.setData({businessList : data});
      }
    });
  },

  onLoad: function () {
    this.loadAllBusiness();
  },

})
