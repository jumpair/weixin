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
  message:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: '消息发送',
    })

    var that = this;
    this.setData({
      userid: e.userid,     //通过setData方法将值存进去
      nums:'1',
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
    var userid = this.data.userid;
    var nums = '1';

    that.interval1 = setInterval(function () {
    app.util.request({
      'url': 'entry/wxapp/Mynews',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid,userid:userid },
      showLoading: false,
      success: function (res) { 
        // console.log(res.data.data.intro);
        var num = nums++;
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

          if(num == 2 || res.data.data.allnum != 0){
            wx.pageScrollTo({
              selector:'#hei',
              duration: 100
            });
          }
          // console.log(res.data.data.list);return;
            that.setData({
              list: res.data.data.list,
              name: res.data.data.name,
              maxid: res.data.data.maxid,
              uid: userinfo.memberInfo.uid,
              title:res.data.data.title
            })

        }
      },
      
      complete: function () {
        
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });
  },1000);
   //setInterval(that.add,2000);

  },

  bindChange: function (e) {
  var message = e.detail.value;
   this.setData({
      message: e.detail.value,     //通过setData方法将值存进去
    })
 },
 
   //事件处理函数
   add: function (e) {
    var that = this
    var userinfo = wx.getStorageSync('userInfo');
    var userid = this.data.userid;
    var message = this.data.message;


    app.util.request({
      'url': 'entry/wxapp/Mynewsinfo',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid, userid:userid,message:message},
      showLoading: false,
      success: function (res) {
        // console.log(res.data.data.intro);
        
       
        
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
            news_input_val:'',
            title:res.data.data.title
          })
          
        }
      },
      complete: function () {
        
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });
   }
  , toJob:function(e){

    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + id
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
  
  cancleSave:function(e){

    var that = this;

    this.checkuser({
      doServices: function () {
        var id = e.currentTarget.dataset.id;
        var userinfo = wx.getStorageSync('userInfo');
        wx.showModal({
          title: '取消收藏',
          content: '确认取消收藏？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/cancleSave',
                data: { id:id,sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
  toMyNote:function(){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mynote/index"
    })

  },
  //监听input获得焦点

    bindfocus: function(e) {
    let that = this;

    let height = 0;

    let height_02 = 0;

    wx.getSystemInfo({
    success: function (res) {
    height_02 = res.windowHeight;

    }

    })

     

    height = e.detail.height - (app.globalData.height_01 - height_02);

    console.log('app is', app.globalData.height_01);

    that.setData({
    height: height,

    })

    console.log('获得焦点的 e is', e);

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
    clearInterval(this.data.realTime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    clearInterval(that.interval1);
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