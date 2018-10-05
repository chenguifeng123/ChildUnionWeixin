//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    businessList : [],

  },

  oneBusiness:function(event){
    var index = event.currentTarget.dataset.index;
    /*
    var allUrl = util.fillUrlParams('./oneTeacher', this.data.pageTeacher[index]);
    wx.navigateTo({
      url: allUrl
    });
    */
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
