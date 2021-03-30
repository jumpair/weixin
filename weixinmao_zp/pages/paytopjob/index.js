//recharge.js
var app = getApp()
var color, sucmoney
var money = 0
var b = 0
var yajinid = 0
Page({
  data: {
    id:0,
    jobid:0,
    mymoney: 0,
    disabled: false,
    curNav: 1,
    curIndex: 0,
    cart: [],
    cartTotal: 0,
    lockhidden: true,
    yajinhidden: true,
    sucmoney: 424,
    color: "limegreen",
    nocancel: false,
    tajinmodaltitle: "押金充值",
    yajinmodaltxt: "去充值",
    yajinmoney: 0,
    yajintxt: "您是否确定充值押金299元？押金充值后可以在摩拜单车App全额退款",
 
  },
  //充值金额分类渲染模块
  selectNav(event) {
    var that = this;
    let id = event.target.dataset.id;
    that.data.id = id;
    var  index = parseInt(event.target.dataset.index);
   var b = parseInt(event.target.dataset.money);
    self = this;
    this.setData({
      curNav: id,
      curIndex: index,
    })
  },
  //页面加载模块
  onLoad: function (e) {
    b = 424;
    wx.setNavigationBarTitle({
      title: '置顶支付',
    })
  var that = this;
  that.data.jobid = e.id;
    var companyid = wx.getStorageSync('companyid');

    if (companyid > 0) {
      app.util.request({
        'url': 'entry/wxapp/GetTopMoneyLable',
        data: { companyid: companyid},
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
            console.log(res.data.data.moneylist);
            that.setData({
              navList: res.data.data.moneylist
            })
          }
        },
        complete: function () {

          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh();
        }
      });
    }
    this.setData({
      mymoney: money,
    })
  },
  buttonEventHandle: function (event) {
  },

 pay: function (e) {
    var that = this;
   
   var companyid = wx.getStorageSync('companyid');
        var pid = that.data.id;
        var userinfo = wx.getStorageSync('userInfo');
        var ordertype = 'paytopjob';
        wx.showModal({
          title: '确认支付',
          content: '确认支付金额？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/pay',
                data: { ordertype: ordertype,companyid:companyid, pid: pid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid,jobid:that.data.jobid },
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

                        wx.redirectTo({
                          url: '/weixinmao_zp/pages/companylogin/index',
                        })

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

   


    });



  },



  //去充值功能模块
  goblance: function (event) {
    money += b;
    this.setData({
      lockhidden: false,
      mymoney: money,
      sucmoney: b,
    })
  },
  confirm: function () {
    this.setData({
      lockhidden: true
    });
  },
  //押金功能模块
  yajin: function (event) {
    this.setData({
      yajinhidden: false
    });
  },
  yajincancel: function (event) {
    this.setData({
      yajinhidden: true
    });
  },
  yajinconfirm: function (event) {
    if (yajinid == 0) {
      yajinid = 1;
      this.setData({
        nocancel: true,
        yajintxt: "您已成功充值押金299元",
        tajinmodaltitle: "充值成功",
        yajinmodaltxt: "完成"
      });
    } else {
      yajinid = 0;
      this.setData({
        nocancel: false,
        yajinhidden: true,
        yajinmoney: 299
      });
    }
    this.setData({
      nocancel: true,
    });
  }
})
