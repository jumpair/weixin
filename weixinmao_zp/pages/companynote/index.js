// weixinmao_hssy/pages/orderlist/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    var that = this;
  

        
        var userinfo = wx.getStorageSync('userInfo');
        var companyid = wx.getStorageSync('companyid');
        app.util.request({
          'url': 'entry/wxapp/Mycompanynotelist',
          data: { companyid: companyid ,sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid},
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
            var title = res.data.data.title;


              wx.setNavigationBarTitle({
                title: title[0],
              })
              that.setData({
                list: res.data.data.list,
                title:title
              })


            }
          },
          complete: function () {

            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh();
          }
        });




  }, editCompanyjob:function(e){

    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: "/weixinmao_zp/pages/editCompanyjob/index?id=" + id
    })
  }, addcompanyjob:function(e){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/addCompanyjob/index"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
 
  toNote:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id="+id
    })

  },
 
  JobNotice:function(e){

    var that = this;

 
        var id = e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '邀请面试',
          content: '确认邀请面试？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/invatejob',
                data: { id: id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {
                  if (!res.data.message.errno) {

                   

                  }
                }
              });
            }
          }})

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
  

  }, payjob: function (e) {
    var that = this;


    var pid = e.currentTarget.dataset.id;
    var userinfo = wx.getStorageSync('userInfo');
    var ordertype = 'paysharenotelast';
    wx.showModal({
      title: '确认支付',
      content: '确认支付入职奖金？',
      success: function (res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/pay',
            data: { ordertype: ordertype, pid: pid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
            success: function (res) {
              console.log(res);
              if (res.data && res.data.data) {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                    console.log(res);
                    that.setData({
                      ispay: 1
                    })
                    that.onLoad();

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

  
  , pay: function (e) {
    var that = this;
   

    var pid =  e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        var ordertype = 'paysharenote';
        wx.showModal({
          title: '确认支付',
          content: '确认支付赏金？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/pay',
                data: { ordertype: ordertype, pid: pid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {
                  console.log(res);
                  if (res.data && res.data.data) {
                    wx.requestPayment({
                      'timeStamp': res.data.data.timeStamp,
                      'nonceStr': res.data.data.nonceStr,
                      'package': res.data.data.package,
                      'signType': 'MD5',
                      'paySign': res.data.data.paySign,
                      'success': function (res) {
                        //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                        console.log(res);
                        that.setData({
                          ispay: 1
                        })
                        that.onLoad();

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


 
})