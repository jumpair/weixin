//recharge.js
var app = getApp()
var color, sucmoney
var money = 0
var b = 0
var yajinid = 0
Page({
  data: {

    id:0
  },

  //页面加载模块
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: '员工工时列表',
    })
    var that = this;
    var id = e.id;

    that.data.id = id;


    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var companyid = wx.getStorageSync('companyid');
    app.util.request({
      'url': 'entry/wxapp/getemployeemoneylist',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid, id: id },
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
