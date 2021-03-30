// weixinmao_zp/pages/agentdetail/index.js
var WxParse = require('../../resource/wxParse/wxParse.js');//
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
      title: wx.getStorageSync('companyinfo').name,
    })

    if (this.data.id > 0) {
      var id = this.data.id;
    } else {
      var id = e.id;
      this.data.id = e.id;
    }

    var that = this;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getcompanydetail',
      data: { id: id },
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
          wx.setNavigationBarTitle({
            title: that.data.title,
          })
          console.log(res.data.data.companydetail);
          that.setData({
            data: res.data.data.companydetail,
            content: WxParse.wxParse('article', 'html', res.data.data.companydetail.content, that, 5),

            joblist: res.data.data.joblist,
            title: res.data.data.title
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
  }, toJobDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + id
    })

  }
  ,
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
      path: '/weixinmao_zp/pages/companydetail/index?id=' + this.data.id
    }
  }
})