var util = require('../../utils/util.js');

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

};

export default business;