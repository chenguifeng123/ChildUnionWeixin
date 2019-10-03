var util = require('../../utils/util.js');
const app = getApp()

var orderTemp = {

  loadOrder:function(event, pageUrl){
    var id = event.currentTarget.dataset.id;
    var allUrl = util.fillUrlParams(pageUrl, {
      id: id,
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  oneOrder: function (event) {
    this.loadOrder(event, '/pages/campaign/oneOrder');
  },

  oneRechargeOrder:function(event){
    this.loadOrder(event, '/pages/campaign/oneRechargeOrder');
  }


};

export default orderTemp;