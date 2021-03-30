// weixinmao_zp/pages/getmoney/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   moneyinfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '申请提现',
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
          that.data.moneyinfo = res.data.data.moneyinfo;
          that.setData({
            moneyinfo: res.data.data.moneyinfo
          })

        }
      }
    });
  },
  toGetmoney: function (e) {
    var that = this;
    var moneyinfo = that.data.moneyinfo;
    var money = e.detail.value.money;
    if (money == "") {
      wx.showModal({
        title: '提示',
        content: '请输入提现金额',
        showCancel: false
      })
      return
    }else if(money <=0)
    {
      wx.showModal({
        title: '提示',
        content: '输入提现金额必须大于0',
        showCancel: false
      })
      return

    }
    if(money > moneyinfo['totalmoney'])
    {
      wx.showModal({
        title: '提示',
        content: '提现金额大于余额',
        showCancel: false
      })
      return

    }


    var userinfo = wx.getStorageSync('userInfo');
    var type ='getmoney';
    app.util.request({
      'url': 'entry/wxapp/dealmoneyrecord',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid,money:money,type:type },
      success: function (res) {
        if (!res.data.message.errno) {
          if (res.data.data.error == 0 )
            {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
              success:function(){
                wx.navigateTo({
                  url: 'weixinmao_zp/pages/mymoneyrecord/index',
                })

              }
            })
            return
            }else{
              
            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return

            }
        }
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