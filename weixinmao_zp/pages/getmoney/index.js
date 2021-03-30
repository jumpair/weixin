// weixinmao_zp/pages/getmoney/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的账户',
    })

    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/getmoney',
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
          that.setData({
            moneyinfo: res.data.data.moneyinfo
          })

        }
      }
    });
  },
  toMymoney:function(){


    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/checkbindcard',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {
            if(res.data.data.error == 1)
              {

              wx.navigateTo({
                url: "/weixinmao_zp/pages/bindcard/index"
              })
              }else{
              wx.navigateTo({
                url: "/weixinmao_zp/pages/mymoney/index"
              })

              }
       
        }
      }
    });




  },
  toMymoneyrecord:function(){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mymoneyrecord/index"
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