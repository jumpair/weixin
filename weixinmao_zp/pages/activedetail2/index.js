// index.js
// 引入SDK核心类
var WxParse = require('../../resource/wxParse/wxParse.js');//

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('companyinfo').name,
    })

    if (this.data.id > 0) {
      var id = this.data.id;
    } else {
      var id = e.id;
      this.data.id = e.id;
    }
    console.log(id);
    var that = this;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getactivedetail2',
      data: { id: id },
      success: function (res) {
        if (!res.data.message.errno) {
          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.data.intro.maincolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
        
          that.data.title = res.data.data.activeinfo.title ;

          wx.setNavigationBarTitle({
            title: that.data.title,
          })
          // console.log(res.data.data.content);
          that.setData({
            data: res.data.data.activeinfo,
            content: WxParse.wxParse('article', 'html', res.data.data.activeinfo.content, that, 5)

          
          })
        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


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
      title: this.data.title + '-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/acitvedetail/index?id=' + this.data.id
    }
  }
})