// weixinmao_house/pages/agentdetail/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: '',
    tel:'',
    pid:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      title: '我的经纪人',
    })


    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/myagent',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid  },
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
            data: res.data.data.list,
            list: res.data.data.oldhouselist,
            activeCategoryId:1,
            city: wx.getStorageSync('companyinfo').city,
            intro:res.data.data.intro
           // content: newsDetail
          })
        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });
  },
  tabClick: function (e) {


    var pid = e.currentTarget.id;
    
    var that = this;
    that.data.pid = pid;
    // var WxParse = WxParse;
    //初始化导航数据
    var tel = that.data.tel;
    app.util.request({
      'url': 'entry/wxapp/getagenthouse',
      data: { pid: pid,tel:tel },
      success: function (res) {
        if (!res.data.message.errno) {

          that.setData({
            list: res.data.data.houselist,
            activeCategoryId: pid
          })

        }
      }
    });
  }, toComplain:function(e){
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: "/weixinmao_house/pages/complain/index?id=" + id
    })


  }, toHouseDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var pid = this.data.pid;
    if(pid == 1)
      {
    wx.navigateTo({
      url: "/weixinmao_house/pages/oldhousedetail/index?id=" + id
    })
      }else{
      wx.navigateTo({
        url: "/weixinmao_house/pages/lethousedetail/index?id=" + id
      })

      }

  }
  ,
  Changeagent: function () {
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var uid = userinfo.memberInfo.uid;
    app.util.request({
      'url': 'entry/wxapp/changeagent',
      data: { uid: uid },
      success: function (res) {
        if (!res.data.message.errno) {
         
          if (res.data.data.error == 0) {
           
           that.onLoad();

          } else if (res.data.data.error == 1) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
          }
        }

      }
    })
  },
  doCall: function (e) {
    console.log(e.currentTarget);
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
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
    return {
      title: this.data.title,
      path: '/weixinmao_house/pages/agentdetail/index?id=' + this.data.id
    }
  }
})