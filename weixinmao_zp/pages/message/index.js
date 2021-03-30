// wxsmall_001/pages/message/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isuser:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: '企业登录',
    })
    var that = this;

    var companyid = wx.getStorageSync('companyid');
    if (companyid > 0) {
      wx.navigateTo({
        url: "/weixinmao_zp/pages/companylogin/index"
      })
    }




    app.util.request({
      'url': 'entry/wxapp/getbanner',
      success: function (res) {
        if (!res.data.message.errno) {
          that.setData({
            banners: res.data.data,
          })
        }
      }
    });

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


  },
  goregister:function(e){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/companyregister/index"
    })

  },

  toCompanyforget: function () {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/companyforget/index"
    })

  },
  goMap: function (e) {
    wx.openLocation({
      latitude: parseFloat(wx.getStorageSync('companyinfo').lat),
      longitude: parseFloat(wx.getStorageSync('companyinfo').lng),
      scale: 18,
      name: wx.getStorageSync('companyinfo').name,
      address: wx.getStorageSync('companyinfo').address
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
  onLoad: function () {
    
    var that = this;

    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);

    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = true;
        var userid = appuser.memberInfo.uid;
        that.setData({
          isuser: that.data.isuser
        });

      }
    }
  
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


  bindGetUserInfo: function (e) {
    var that = this;
    var result;

    app.util.getUserInfo(function (userInfo) {
      console.log(userInfo);
      that.data.isuser = true
      var uid = userInfo.memberInfo.uid;
      var nickname = userInfo.wxInfo.nickName;
      var avatarUrl = userInfo.wxInfo.avatarUrl;
      that.data.uid = uid;
      if (uid > 0) {
        that.setData({
          userinfo: userInfo,
          isuser: that.data.isuser,
        })
        wx.setStorageSync('userInfo', userInfo);
        app.util.request({
          'url': 'entry/wxapp/Updateuserinfo',
          data: { uid: uid, nickname: nickname, avatarUrl: avatarUrl },
          success: function (res) {
            if (!res.data.message.errno) {
              //app.globalData.isuser = true;
              that.data.isphone = res.data.data.isphone;
              that.data.indeximg = res.data.data.indeximg;
              that.setData({
                userinfo: userInfo,
                isuser: that.data.isuser,
              })
            }

          }
        })

      }



    }, e.detail);
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
  
  },
  bindSave: function (e) {
    console.log(e.detail.formId);
    var that = this;
 

    
    var name = e.detail.value.name;
    var password = e.detail.value.password;

    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写企业登录账号',
        showCancel: false
      })
      return
    }
    if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请填写企业登录密码',
        showCancel: false
      })
      return
    }

  


    app.util.request({
      'url': 'entry/wxapp/companylogin',
      data: { name: name, password: password },
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
        }else{
    if(res.data.data.error == 1)
      {
      wx.showModal({
            title: '登录提示',
            content: res.data.data.msg,
            showCancel: false
          })

         
      }else{
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000,
        success:function () {
          console.log(res.data.data.companyid);
          
          wx.setStorageSync('companyid', res.data.data.companyid);
          wx.redirectTo({
            url: "/weixinmao_zp/pages/companylogin/index"
          })

        }

      })

      }
          /*
          wx.switchTab({
            url: '/weixinmao_zp/pages/index/index',
          })
          */
        } 



    

      }
    });

    

  
  },
  onShareAppMessage() {
    return {
      title: '申请入驻'+wx.getStorageSync('companyname').name,
      path: '/weixinmao_zp/pages/message/index'
    }
  },
  
 checkuser: function (options) {


    var that = this;
    var options = options;
    var userinfo = wx.getStorageSync('userInfo');

    if (!userinfo) {
      console.log('tmddddssssss222222');
      app.util.getUserInfo(
        function (userinfo) {
          options.doServices();
          that.setData({ userinfo: userinfo })
        }
      );
      return false;
    } else {
      if (!userinfo.memberInfo.uid) {
        console.log('tmddddsssssqqqqs1111');
        app.util.getUserInfo(
          function (userinfo) {
            that.setData({ userinfo: userinfo })
          });

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