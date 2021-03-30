// weixinmao_hssy/pages/orderlist/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  id:0,
  ordertype:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: '我的消费记录',
    })
    var that = this;
  

        

        if (that.data.id > 0) {
          var ordertype = that.data.id;
        } else {
          if(e)
          {
          var ordertype = e.id;
          that.data.id = e.id;
          }
        }
        that.setData({
          ordertype: ordertype
        })
        var appuser = wx.getStorageSync('userInfo');
        // if (app.sessionid && app.memberInfo !='') {
        if (!appuser.sessionid) {
          app.util.getUserInfo(function () {

            that.initpage();
          });
        } else {

          that.initpage();
        }
      

   


  },
initpage:function(){

  var that = this;
  var userinfo = wx.getStorageSync('userInfo');

  var ordertype = that.data.ordertype;
  app.util.request({
    'url': 'entry/wxapp/myorderlist',
    data: { ordertype: ordertype, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
          list: res.data.data.list,
          title:res.data.data.title,
          ordertype: ordertype
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
  tabClick: function (e) {

    var that = this;
 
        var ordertype = e.currentTarget.id;
        var userinfo = wx.getStorageSync('userInfo');
        app.util.request({
          'url': 'entry/wxapp/myorderlist',
          data: { ordertype: ordertype, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
          success: function (res) {
            if (!res.data.message.errno) {

              that.setData({
                list: res.data.data.list,
                ordertype: ordertype
              })

            }
          }
        });

   

  },
  delOrder:function(e){

    var that = this;

    this.checkuser({
      doServices: function () {
        var id = e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '订单取消',
          content: '确认取消订单？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/delOrder',
                data: { id:id,sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {
                  console.log(res);
                  that.data.id = 4;

                  that.onLoad();

                },
                fail: function (res) {
                  console.log(res);
                }

              })
            }
          }

        })

      }});
  },
  RepayOrder: function (e) {

    var that = this;

    this.checkuser({
      doServices: function () {
        var id = e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '订单支付',
          content: '是否确认订单？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/repay',
                data: { id: id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {

                  if (res.data && res.data.data) {
                    wx.requestPayment({
                      'timeStamp': res.data.data.timeStamp,
                      'nonceStr': res.data.data.nonceStr, 
                      'package': res.data.data.package,
                      'signType': 'MD5',
                      'paySign': res.data.data.paySign,
                      'success': function (res) {
                        that.onLoad();
                        //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                      },
                      'fail': function (res) {
                        //支付失败后，
                      }
                    })
                  }

                },
                fail: function (res) {
                  console.log(res);
                }

              })
            }
          }

        })

      }
    });
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }, checkuser: function (options) {


    var that = this;
    var options = options;
    var userinfo = wx.getStorageSync('userInfo');
    // console.log(userinfo);
    if (!userinfo) {
      app.util.getUserInfo();
      return false;
    } else {
      if (!userinfo.memberInfo.uid) {
        app.util.getUserInfo();
        return false;
      } else {

        app.util.request({
          'url': 'entry/wxapp/checkuserinfo',
          data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
          success: function (res) {
            if (res.data.data.error == 0) {
              console.log(options);
              options.doServices();

            } else if (res.data.data.error == 2) {
              options.doServices();
              //  options.doElseServices();

            } else {




            }

          }
        });

      }
    }

  }
})