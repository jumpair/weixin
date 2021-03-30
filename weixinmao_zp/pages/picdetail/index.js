// index.js
// 引入SDK核心类
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    typeid:0,
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopinfo').name,
    })

    if (this.data.id > 0) {
      var id = this.data.id;
      var typeid = this.data.typeid;
    } else {
      var id = e.id;
      this.data.id = e.id;
      var typeid = e.typeid;
      this.data.typeid = e.typeid;
    }
    var that = this;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getpicdetail',
      data: { id: id ,typeid:typeid},
      success: function (res) {
        if (!res.data.message.errno) {

          var newsDetail;
          newsDetail = R_htmlToWxml.html2json(res.data.data.content);
          that.data.title = res.data.data.title + '-' + wx.getStorageSync('shopinfo').name;
          wx.setNavigationBarTitle({
            title: that.data.title,
          })
          // console.log(res.data.data.content);
          that.setData({
            data: res.data.data,
            content: newsDetail
          })
        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },
  toTeamDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: "/house_001/pages/teamdetail/index?id=" + id
    })

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
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: '/weixinmao_zp/pages/index/index'
    }
  }
})