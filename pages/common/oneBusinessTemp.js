var util = require('../../utils/util.js');

var oneBusiness = {

  getFollowerById: function (event) {
    var id = event.currentTarget.dataset.id;
    var count = event.currentTarget.dataset.count;
    if (count == 0) return;
    var allUrl = util.fillUrlParams('/pages/business/follower', {
      id: id
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  getFansById: function (event) {
    var id = event.currentTarget.dataset.id;
    var count = event.currentTarget.dataset.count;
    if (count == 0) return;
    var allUrl = util.fillUrlParams('/pages/business/fans', {
      id: id
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  jumpScore:function(event){
    var allUrl = util.fillUrlParams('/pages/business/score', {
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  callMe:function(event){
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }

};

export default oneBusiness;