
// 引入SDK核心类
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var config = require('../../resource/js/config.js');

var markersData = [];
var app = getApp();
Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    showmsg:true,
    date:'',
    jobdate:''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
   
    var that = this;
     
    wx.setNavigationBarTitle({
      title: '申请经纪人',
    })

    app.util.request({
      'url': 'entry/wxapp/GetSysInit',
      data: {},
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

        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });

    //获取信息

    



  },



  bindDateChange: function (e) {
    this.data.date = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      dates: e.detail.value
    })
  }
  ,

  bindDatejobChange: function (e) {
    this.data.jobdate = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      jobdates: e.detail.value
    })
  }
  ,
  bindTimeChange: function (e) {
    this.data.datetime = e.detail.value;

    console.log(e.detail.value);
    this.setData({
      datetime: e.detail.value
    })
  },
  savepubinfo: function (e) {

    // this.data.uploadimagelist = [];
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
 
    var name = e.detail.value.name;
    var tel = e.detail.value.tel;
    var weixin = e.detail.value.weixin;
    var email = e.detail.value.email;

   var tid =  wx.getStorageSync('tid');
   if(!tid)
    tid = 0 ;

    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的姓名',
        showCancel: false
      })
      return
    }
 
   
    if (tel == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号',
        showCancel: false
      })
      return
    }

    if (weixin == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的微信号',
        showCancel: false
      })
      return
    }

    if (email == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的电子邮箱',
        showCancel: false
      })
      return
    }
    var data = {
      sessionid: userinfo.sessionid,
      uid: userinfo.memberInfo.uid,
      tid:tid,
      name: name,
      weixin: weixin,
      tel: tel,
      email:email

    };
    app.util.request({
      'url': 'entry/wxapp/saveregagent',
      data: data,
      success: function (res) {


        if (res.data.errno != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.data.msg,
            showCancel: false
          })
          return;
        } else {
          if (res.data.data.error == 1)
            {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
            }else{
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000,
                    success: function (res) {
                      console.log(res);
                      wx.switchTab({
                        url: "/weixinmao_zp/pages/user/index"
                      })
                    }
                  })

            }

        }





      }
    });





  },


  toSaleLetPub: function (e) {
    var that = this;

    wx.navigateTo({
      url: "/weixinmao_wy/pages/saleletpub/index",
      success: function () {
        that.data.showmsg = true;
        that.setData({
          showmsg: that.data.showmsg

        })

      }
    })
  },
 

  goPub:function(e){
    this.data.showmsg = false;
    this.setData({
      showmsg: this.data.showmsg

    })
  
/*
    wx.navigateTo({
      url: "/weixinmao_wy/pages/pub/index"
    })

  */

  },
  closemsg:function(e) {
    this.data.showmsg = true;
    this.setData({
      showmsg: this.data.showmsg

    })},
  goMap: function (e) {
    wx.openLocation({
      latitude: parseFloat(wx.getStorageSync('companyinfo').lat),
      longitude: parseFloat(wx.getStorageSync('companyinfo').lng),
      scale: 18,
      name: wx.getStorageSync('companyinfo').name,
      address: wx.getStorageSync('companyinfo').address
    })
  },

  onReady: function () {
    // 页面渲染完成
    const self = this;
  },
  bindInput: function (e) {
    var that = this;
    this.setData({
      inputValue: e.detail.value
    });
    that.onShow();
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
    
  },
 
  doCall: function () {
    var tel = this.data.textData.shop_tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  onShareAppMessage() {
    return {
      title: wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_wy/pages/index/index'
    }
  }

  
})