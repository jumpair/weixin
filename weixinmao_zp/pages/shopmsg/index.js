// weixinmao_hssy/pages/user/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showmsg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '接收消息设置',
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
    var that = this;

    var companyid = wx.getStorageSync('companyid');

    app.util.request({
      'url': 'entry/wxapp/getshopmsg',
      data: { companyid: companyid },
      success: function (res) {
        if (!res.data.message.errno) {
          that.setData({ msgcount: res.data.data.msgcount })
        }
      }
    });

    /*
    this.checkuser({
      doServices: function () {

        var userinfo = wx.getStorageSync('userInfo');
        var companyid = wx.getStorageSync('companyid');
        
        if (companyid>0)
          {
          app.util.request({
            'url': 'entry/wxapp/GetCompanyinfo',
            data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid},
            success: function (res) {
              if (!res.data.message.errno) {
                that.setData({
                    companyinfo:res.data.data.companyinfo
                })
              }
            },
            complete: function () {

              wx.hideNavigationBarLoading(); //完成停止加载
              wx.stopPullDownRefresh();
            }
          });
          }
     
        that.setData({ userinfo: userinfo })

      }

    });
    */
  },
  bindMsg: function (e) {
    var that = this;

    var userinfo = wx.getStorageSync('userInfo');



    var that = this;

    that.data.showmsg = true;
    var form_id = e.detail.formId;
  
    var userinfo = wx.getStorageSync('userInfo');


    var companyid = wx.getStorageSync('companyid');

    app.util.request({
      'url': 'entry/wxapp/saveshopmsg',
      data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid, companyid: companyid },
      success: function (res) {


        if (res.data.errno != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        } else {

          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            msgcount:res.data.data.msgcount
           
          })
        }



      }
    });
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

  },
  binduserinfo: function (e) {
    var that = this;
    that.data.showmsg = false;

    var userinfo = wx.getStorageSync('userInfo');
    var companyid = wx.getStorageSync('companyid');
    app.util.request({
      'url': 'entry/wxapp/getuserinfo',
      data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        that.setData({
          user: res.data.data,
          showmsg: that.data.showmsg
        })
      }
    });

  },
  saveuserinfo: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var tel = e.detail.value.tel;
    that.data.showmsg = true;
    var userinfo = wx.getStorageSync('userInfo');
    var companyid = wx.getStorageSync('companyid');
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写您的姓名',
        showCancel: false
      })
      return;
    }
    if (tel == "") {
      wx.showModal({
        title: '提示',
        content: '请填写您的手机号',
        showCancel: false
      })
      return;
    }


    app.util.request({
      'url': 'entry/wxapp/saveshopuserinfo',
      data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid, name: name, tel: tel },
      success: function (res) {


        if (res.data.errno != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        } else {

          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({

            showmsg: that.data.showmsg
          })
        }



      }
    });




  }, closemsg: function (e) {

    this.data.showmsg = true;
    this.setData({
      showmsg: this.data.showmsg
    })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }, toMycouponlist: function (e) {
    wx.navigateTo({
      url: "/weixinmao_ktv/pages/couponlist/index"
    })

  },
  toShoporderlist: function (e) {
    wx.navigateTo({
      url: "/weixinmao_ktv/pages/shoproomorderlist/index"
    })

  },
  Puboldhouse: function (e) {

    wx.navigateTo({
      url: "/weixinmao_ktv/pages/pub/index"
    })

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, checkuser: function (options) {


    var that = this;
    var options = options;
    var userinfo = wx.getStorageSync('userInfo');

    if (!userinfo) {
      console.log('tmddddssssss222222');
      app.util.getUserInfo(
        function (userinfo) {


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