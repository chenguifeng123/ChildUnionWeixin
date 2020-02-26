var util = require('../../utils/util.js');
const app = getApp()


Page({
  data: {
    scrollIntoId: '',
    location:'',
    county:'',
    hotCitys: [{
      "cityCode": 220,
      "cityName": "南京"
    }, 
    {
      "cityCode": 65,
      "cityName": "北京"
    },
    {
      "cityCode": 253,
      "cityName": "上海"
      },
    {
      "cityCode": 121,
      "cityName": "广州"
    },
    {
      "cityCode": 254,
      "cityName": "深圳"
    },
    {
      "cityCode": 408,
      "cityName": "镇江"
    },
    {
      "cityCode": 255,
      "cityName": "苏州"
    },
    {
      "cityCode": 292,
      "cityName": "武汉"
    },
    ],
    citys: [ ],

    sourceTab: 1,
    sourcePage: '/pages/business/list'
  },

  // 加载当前位置
  getLocation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
          success: res => {
            app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
            app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;
            that.setData({
              location: app.globalData.defaultCity,  //省份
              county: app.globalData.defaultCounty //城市
            });
          }
        })
      },
    })
  },

  // 加载所有城市
  getCitys: function () {
    var op = this;
    app.getUrl('/business/listCitys', function (data) {
      if (app.hasData(data)) {
        op.setData({
          citys: data,
        });
      }
    });
  },

  /**
 * 右侧字母索引的触发
 */
  touchstartfn: function (e) {
    //console.log(e.target.id)
    console.log(e);
    var letter = e.target.dataset.id
    var index = e.target.dataset.bigindex
    var letter = this.data.citys[index].name
    this.setData({
      scrollIntoId: letter
    })
    wx.showToast({
      icon: 'none',
      title: letter
    })
  },

  jump2First: function (cityCode, cityName){
    // 回退无法拿到值
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      cityCode: cityCode,
      cityName: cityName
    });
    app.globalData.listDataUpdated = true;
    var allUrl = util.fillUrlParams(this.data.sourcePage, {
      cityCode: cityCode,
      cityName: cityName
    });
    if(this.data.sourceTab == 1)
      wx.switchTab({
        url: allUrl,
      });
    else if(this.data.sourceTab == 0)
      wx.navigateBack({
        delta: 1
      })
  },

  // 选择热门城市
  selectHotCity: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.index)   //获取点击事件列表的索引
    var index = e.currentTarget.dataset.index
    var cityName = that.data.hotCitys[index].cityName   //根据索引找到热门城市的名称
    var cityCode = that.data.hotCitys[index].cityCode    //根据索引找到热门城市的code编码
    this.jump2First(cityCode, cityName);
  },

  //选择城市
  selectCity: function (e) {
    console.log(e)
    var bigIndex = e.target.dataset.bigindex     //嵌套循环找出外部的索引
    var index = e.target.dataset.index               //嵌套循环找出子索引
    var zimu = this.data.citys[bigIndex].name   //找到对应的字母
    console.log(index)
    console.log(zimu)
    if (index == undefined) {         //如果子索引为未定义，即点击了列表中的字母
      wx.showToast({
        title: zimu,
      })
    } else {                        //如果自索引有值，即点击了列表中的城市项
      var cityName = this.data.citys[bigIndex].list[index].cityName   //双重索引找到城市名称
      var cityCode = this.data.citys[bigIndex].list[index].cityCode     //双重索引找到城市编码
      this.jump2First(cityCode, cityName);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!!options.sourcePage)
      this.setData({ sourcePage: options.sourcePage, sourceTab: options.sourceTab   });
    //this.getLocation();
    this.getCitys();
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

  },

})