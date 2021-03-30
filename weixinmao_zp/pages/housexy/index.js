// index.js
// 引入SDK核心类
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var WxParse = require('../../resource/wxParse/wxParse.js');//

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  id:0,
  title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    
  var that = this;
    if (this.data.id > 0) {
      var id = this.data.id;
    } else {
      var id = e.id;
      this.data.id = e.id;
    }

    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/GetSysInit',
      data: {  },
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

          var newsDetail;
          var content;
          if(that.data.id == 1 )
          {
             that.data.title =  '简历发布协议';
            content = res.data.data.intro.notecontent;

          }else if(that.data.id == 2){
             that.data.title = '企业入驻协议';
            content = res.data.data.intro.companycontent;
          }else{
            that.data.title = '红包规则说明';
            content = res.data.data.intro.moneycontent;

          }
           wx.setNavigationBarTitle({
             title: that.data.title,
           })
        // console.log(res.data.data.content);
          that.setData({
            title: that.data.title,
            content:content

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
   // wx.showNavigationBarLoading();
   // this.onLoad();
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   // wx.showNavigationBarLoading();
   // this.onLoad();
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onShareAppMessage() {
    return {
      title: this.data.title + '-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_house/pages/newsdetail/index?id=' + this.data.id
    }
  }
})