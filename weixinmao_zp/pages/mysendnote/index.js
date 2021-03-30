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
    wx.setNavigationBarTitle({
      title: '派遣人员管理',
    })
    var that = this;
  

        
        var userinfo = wx.getStorageSync('userInfo');
        var companyid = wx.getStorageSync('companyid');
   

        app.util.request({
          'url': 'entry/wxapp/mysendnotelist',
          data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid},
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
    var companyid = wx.getStorageSync('companyid');
    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/checkaddcompanyjob',
      data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {
          var companyinfo = res.data.data.companyinfo
         if(companyinfo.jobnum <1)
          {

           wx.showModal({
             title: '系统提示',
             content: '您的发布数量达到了上限或是普通会员,发布需支付费用！',
             showCancel: false,
             success:function(){

               wx.navigateTo({
                 url: "/weixinmao_zp/pages/addCompanyjob/index"
               })

             }
           })


          }else{

           wx.navigateTo({
             url: "/weixinmao_zp/pages/addCompanyjob/index"
           })


          }

        }
      }
    });





  },

  topPaytopjob:function(e){

    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: "/weixinmao_zp/pages/paytopjob/index?id=" + id
    })
  },
  doEmployee:function(e){
   
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: "/weixinmao_zp/pages/addemployee/index?id=" + id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  tabClick: function (e) {

    var that = this;
    this.checkuser({
      doServices: function () {
        var ordertype = e.currentTarget.id;
        var userinfo = wx.getStorageSync('userInfo');
        app.util.request({
          'url': 'entry/wxapp/myorderlist',
          data: { ordertype: ordertype, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
          success: function (res) {
            if (!res.data.message.errno) {

              that.setData({
                list: res.data.data,
                ordertype: ordertype
              })

            }
          }
        });

      }

    }); 

  },
  setsendnote:function(e){

    var that = this;

    this.checkuser({
      doServices: function () {
        var id = e.currentTarget.dataset.id;
        var status = e.currentTarget.dataset.status;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '信息提示',
          content: '确认操作？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/setsendnote',
                data: { status: status,id:id,sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {
                  console.log(res);
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
  }, upJob: function (e) {

    var that = this;

    this.checkuser({
      doServices: function () {
        var id = e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '上架',
          content: '确认上架？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/upJob',
                data: { id: id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {
                  console.log(res);
                  that.onLoad();

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
  RepayOrder: function (e) {

    var that = this;

        var id = e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '信息提示',
          content: '是否支付返费？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/sendpay',
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
              console.log('kkkkkk');
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