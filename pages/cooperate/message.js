var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    message: '',
    formIdArray:[],
    index:'',
    messageType: util.messageType,
    select: false,
    sourceType: -1,
    sourcePath: '',
    showResult: '',
  },

  saveFormId: function (v) {
    //if (v.detail.formId != 'the formId is a mock one') {
    app.formIdInput(v, this);
    //}
  },

  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindMessageInput: function (e) {
    this.setData({
      message: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      select: true
    });
    
  },

  radioChange: function (e) {
    this.setData({
      sourceType: e.detail.value
    })
  },

  postFile2Server:function(path){
    var op = this;
    wx.uploadFile({
      url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
      filePath: path,
      name: 'file',
      success(res) {
        var data = JSON.parse(res.data);
        op.setData({
          sourcePath: data.data.url,
          showResult: '上传成功'
        });
      }
    })
  },

  checkAndPost: function (tempFilePaths){

  },

  uploadFile:function(){
    var op = this;
    if(this.data.sourceType == -1){
      wx.showToast({
        title: '请选择上传类型'
      });
      return;
    }
    if(this.data.sourceType == 0){
      wx.chooseImage({
        success(res) {
          var tempFilePaths = res.tempFilePaths;
          if (tempFilePaths.length > 1) {
            wx.showToast({
              title: '只能选择一个'
            });
            return;
          }
          op.postFile2Server(tempFilePaths[0]);
        }
      });
    }
    else if (this.data.sourceType == 1) {
      wx.chooseVideo({
        success(res) {
          op.postFile2Server(res.tempFilePath);
        }
      });
    }
  },

  checkInput: function () {
    if (!this.data.title || this.data.title.length < 1) {
      wx.showToast({
        title: '标题不能为空'
      });
      return false;
    }
    if (!this.data.message || this.data.message.length < 1) {
      wx.showToast({
        title: '内容不能为空'
      });
      return false;
    }
    if (!this.data.index || this.data.message.index < 1) {
      wx.showToast({
        title: '分类不能为空'
      });
      return false;
    }
    return true;
  },

  submit: function (e) {
    //var formId = e.detail.formId;
    this.saveFormId(e);
    var op = this;
    if (!this.checkInput()) return;
    app.post('/cooperate/message', {
      cardId: app.getUserId(),
      //formId: op.data.formIdArray,
      formIdList: op.data.formIdArray,
      title: op.data.title,
      message: op.data.message,
      messageType:op.data.index,
      sourceType:op.data.sourceType,
      sourcePath:op.data.sourcePath,
    }, function (data) {
      if (app.hasData(data)) {
        app.globalData.messageDataUpdated = true;
        if (data == 1) {
          var allUrl = util.fillUrlParams('/pages/cooperate/verify', {
          });
          wx.navigateTo({
            url: allUrl
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      select:false
    });
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