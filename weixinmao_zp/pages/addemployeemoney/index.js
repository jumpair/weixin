
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
    jobdate:'',
    title:[],
    sex:1,
    type:1,
    departmentlist:[],
    departmentid:0,
    id:0,
    jobdate:'',
    per:1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
   
    var that = this;
     
    var id = options.id;

    that.data.id = id;


    app.util.request({
      'url': 'entry/wxapp/GetEmployeemoneyInit',
      data: {id:id},
      success: function (res) {
        if (!res.data.message.errno) {
            var title = res.data.data.title;
          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          that.data.title = res.data.data.regtitle_two;
          var title = that.data.title;
          wx.setNavigationBarTitle({
            title: '录入工时',
          })


          that.setData({
            title: that.data.title,
            employee: res.data.data.employee,
            department: res.data.data.department
        
          })
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


  },


  bindJobcateChange: function (e) {
    var departmentlist = this.data.departmentlist;

    if (departmentlist) {
      this.data.jobcateindex = e.detail.value;
      this.data.departmentid = departmentlist[e.detail.value].id;
    }
    this.setData({
      departmentlist: departmentlist,
      jobcateindex: e.detail.value
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

    var workdays = e.detail.value.workdays;

    var mark = e.detail.value.mark;
    
    var per  = that.data.per;

    var jobdate = that.data.jobdate;





    if (workdays == "" || workdays == 0)
      {

        wx.showModal({
          title: '提示',
          content: '请正确输入工时',
          showCancel: false
        })
        return

      }


    if (jobdate == "") {
      wx.showModal({
        title: '提示',
        content: '请选择入职日期',
        showCancel: false
      })
      return
    }


    var data = {
      sessionid: userinfo.sessionid,
      uid: userinfo.memberInfo.uid,
      id:that.data.id,
      workdays: workdays,
      per:per,
      jobdate:jobdate,
      mark: mark
     
    };
    app.util.request({
      'url': 'entry/wxapp/Saveemployeemoney',
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
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              console.log(res);
              wx.navigateTo({
                url: "/weixinmao_zp/pages/myemployeelist/index"
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


  radioPerChange: function (e) {
    this.data.per = e.detail.value;
  },

  radioTypeChange: function (e) {
    this.data.type = e.detail.value;
  },

  bindDateChange: function (e) {
    this.data.jobdate = e.detail.value;
    this.setData({
      dates: e.detail.value
    })
  }
  ,


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