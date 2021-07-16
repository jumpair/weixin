
// 引入SDK核心类
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var config = require('../../resource/js/config.js');

var markersData = [];
var app = getApp();

Page({
  data: {
    startofftime: '',
    endofftime: '',
    period: '',
    summary:'',
    sort:'',
    isuser:true,
    isagree:0,
  },
  onLoad: function (options) {
    
    // 页面初始化 options为页面跳转所带来的参数
    
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/Addaskoffinit',
      data: {sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {
          console.log(res.data)
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
            title: title[0] + wx.getStorageSync('companyinfo').name,
          })
          that.setData({
            title:title
          })

        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },



  bindDateChange: function (e) {
    this.data.date = e.detail.value;
    console.log(e.detail);
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
  changeTime:function(e){
    this.setData({ starttime: e.detail.value });
    wx.setStorageSync("starttime",  e.detail.value)
},
changeendTime:function(e){
  this.setData({ endtime: e.detail.value });
  wx.setStorageSync("endtime",  e.detail.value)
},
  savepubinfo: function (e) {

    // this.data.uploadimagelist = [];
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var startofftime = e.detail.value.startofftime;
    var endofftime = e.detail.value.endofftime;
    var reason = e.detail.value.reason;

  

    if (startofftime == "") {
      wx.showModal({
        title: '提示',
        content: '请输入开始时间',
        showCancel: false
      })
      return
    }
    if (endofftime == "") {
      wx.showModal({
        title: '提示',
        content: '请输入结束时间',
        showCancel: false
      })
      return
    }
    if (reason == "") {
      wx.showModal({
        title: '提示',
        content: '请输入事由',
        showCancel: false
      })
      return
    }
    var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    var regExp = new RegExp(reg);
    if(!regExp.test(startofftime)){
      wx.showModal({
        title: '提示',
        content: '"时间格式不正确,正确格式为: 2014-01-01 12:00:00',
        showCancel: false
      })
      return
　　
　　}
    if(!regExp.test(endofftime)){
      wx.showModal({
        title: '提示',
        content: '"时间格式不正确,正确格式为: 2014-01-01 12:00:00',
        showCancel: false
      })
      return
　　
　　}

    var data = {
      uid: userinfo.memberInfo.uid,
      startofftime: startofftime,
      endofftime: endofftime,
      reason: reason,
    };
    app.util.request({
      'url': 'entry/wxapp/addaskoffleave',
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

          if(res.data.data.error == 0)
          {

          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              console.log(res);
              wx.navigateTo({
                url: "/weixinmao_zp/pages/myoff/index"
              })
            }
          })
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

  radioChange: function (e) {
    this.data.sex = e.detail.value;
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