//recharge.js
var app = getApp()
var color, sucmoney
var money = 0
var b = 0
var yajinid = 0
Page({
  data: {

 
  },

  //页面加载模块
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的账户流水',
    })
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/getmoneyrecord',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
          console.log(res.data.data);

          that.setData({
            list: res.data.data.list
          })

        }
      }
    });
  
  }


})
