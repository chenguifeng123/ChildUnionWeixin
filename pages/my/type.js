var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service :[],
    canPushCount : 3,
    btnServiceSelected:[],
    tagMap : {},
    tagList:[]
  },

  btnSelect: function(data){
    var subArray = [];
    var tagMap = {};
    for(var subIndex = 0; subIndex < data.length; subIndex ++){
      var tagList = data[subIndex]["tagList"];
      var tagArray = [];
      for(var tagIndex = 0; tagIndex < tagList.length; tagIndex ++){
        tagMap[tagList[tagIndex]["tagId"]] = {parent: subIndex, index: tagIndex};
        tagArray.push("not-click");
      }
      subArray.push(tagArray);
    }
    return {
      map: tagMap,
      array: subArray
    };
  },

  tagClick:function(event){
    var tagId = event.currentTarget.dataset.tag;
    var parent = event.currentTarget.dataset.parent;
    var index = event.currentTarget.dataset.index;

    var currentTagList = this.data.tagList;
    var btnServiceSelected = this.data.btnServiceSelected;

    var dataIndex = currentTagList.indexOf(tagId);
    // 已关注
    if (dataIndex >=0){
      currentTagList.splice(dataIndex, 1);
      btnServiceSelected[parent][index] = "not-click";
    }else{
      if (currentTagList.length >= this.data.canPushCount){
      }else{
        currentTagList.push(tagId);
        btnServiceSelected[parent][index] = "click";
      }
    }

    this.setData({
      tagList: currentTagList,
      btnServiceSelected: btnServiceSelected
    });
  },

  nextStep:function(event){
    var op = this;
    var allUrl = util.fillUrlParams('./info', {
      tag: op.data.tagList,
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  loadService: function () {
    var op = this;
    // 加载所有信息
    app.getUrl('/business/service/list', function (data) {
      if (app.hasData(data)) {
        for(var index = 0; index < data.length; index++){
          if (data[index].serviceId == 1){
            var service = data[index]['subserviceList'];
            op.setData({ service: service });
            var select = op.btnSelect(service);
            op.setData({ 
              btnServiceSelected : select.array,
              tagMap : select.map
            });
            op.loadTagList();
          }
          
        }
      }
    });
  },

  loadTagList:function(){
    var op = this;
    // 加载一个商户
    if(app.getUserId() == -1) return;
    app.getUrl('/business/tag/' + app.getUserId(), function (data) {
      if (app.hasData(data)) {
        var tags = data;
        var btnServiceSelected = op.data.btnServiceSelected;
        var tagList = [];
        for(var index = 1; index <= 3; index ++){
          var tagId = tags["tag" + index];
          var fullIndex = op.data.tagMap[tagId];
          var parent = fullIndex["parent"];
          var child = fullIndex["index"];
          btnServiceSelected[parent][child] = "click";
          tagList.push(tagId);
        }
        op.setData({ 
          btnServiceSelected: btnServiceSelected,
          tagList: tagList
          });

      }
    });
  },

  initTagClick: function(data){
    var btnS
    for (var subIndex = 0; subIndex < data.length; subIndex++) {
      var tagList = data[subIndex]["tagList"];
      var tagArray = [];
      for (var tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
        tagArray.push("not-click");
      }
      subArray.push(tagArray);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadService();
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

  }
})