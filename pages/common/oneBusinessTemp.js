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

};

export default oneBusiness;