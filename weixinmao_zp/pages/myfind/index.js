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
  
 
        
    var appuser = wx.getStorageSync('userInfo');
    // if (app.sessionid && app.memberInfo !='') {
    if (!appuser.sessionid) {
      app.util.getUserInfo(function () {

        that.initpage();
      });
    } else {

      that.initpage();
    }
  



  },initpage:function(){

  var that = this;
    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/myfind',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {
          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          var title = res.data.data.title;
          wx.setNavigationBarTitle({
            title: title[3],
          })
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
            title:res.data.data.title
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
  toNote:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id="+id
    })

  },
  toJob: function (e) {
    var pid = e.currentTarget.dataset.id;
    console.log(pid);
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + pid
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