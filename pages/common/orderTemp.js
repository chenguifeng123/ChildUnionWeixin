var util = require('../../utils/util.js');
const app = getApp()

var orderTemp = {

  oneOrder: function (event) {
    var id = event.currentTarget.dataset.id;
    var allUrl = util.fillUrlParams('/pages/campaign/oneOrder', {
      id: id,
    });
    wx.navigateTo({
      url: allUrl
    });
  },


};

export default orderTemp;