var util = require('../../utils/util.js');
const app = getApp()

var business = {

  oneBusiness: function (event) {
    var id = event.currentTarget.dataset.id;
    var follow = event.currentTarget.dataset.follow;
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: id,
      follow: follow
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.addFollower(e);
      app.batchAddFormId(op);
    });
  },

  addFollower: function (event) {
    var op = this;
    var userId = app.getUserId();
    var id = event.currentTarget.dataset.id;
    app.getUrl('/business/addFollower/' + userId + '-' + id, function (data) {
      if (app.hasData(data)) {
        app.globalData.listDataUpdated = true;
        //判断是否有打开过页面
        if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
      }
    });
  },

};

export default business;