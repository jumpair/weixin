// weixinmao_hssy/pages/user/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showmsg: true,
    isuser: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '企业中心',
    })
    var that = this;
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

          that.setData({
            intro: res.data.data.intro,
            title: res.data.data.companytitle
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

  }, toOrderlist: function (e) {
    var pid = e.currentTarget.dataset.id;
    console.log(pid);
    wx.navigateTo({
      url: "/weixinmao_house/pages/orderlist/index?id=" + pid
    })
  },
  toShopmsg: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/shopmsg/index"
    })

  },
  toCompanyrole:function(e){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/companyrole/index"
    })
  },

  toMyjoblist: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/companyjob/index"
    })

  },
  toMatchnote:function(){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/matchnewnote/index"
    })

  },
  toMyvocationjoblist:function(){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/vocationjob/index"
    })

  },

  toMysendnote: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/mysendnote/index"
    })

  },
  toMypartjoblist: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/companypartjob/index"
    })

  },
  toMynote:function(e)
  {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/companynote/index"
    })

  },
  toEditcompany:function(e)
  {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/editcompany/index"
    })

  },
  toMyPayMoney:function(e){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/paymoney/index"
    })

  },
  toMySavewage:function(e){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mysavewage/index"
    })

  },
  toMyCompanydynamic:function(e){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mycompanydynamic/index"
    })

  },
  loginout: function (e) {
    wx.clearStorageSync('companyid');
    wx.redirectTo({
      url: "/weixinmao_zp/pages/message/index"
    })

  },


  toEmployeemain: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/employeemain/index"
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);
    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = true;

      that.initpage();


      } else {
        that.data.isuser = false;

      }
    } else {

      that.data.isuser = false;
    }

    that.setData({
      isuser: that.data.isuser
    });
      

  },

  initpage:function(){
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var companyid = wx.getStorageSync('companyid');

    if (companyid > 0) {
      app.util.request({
        'url': 'entry/wxapp/GetCompanyinfo',
        data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {
            if(res.data.data.error == 1)
              {
              wx.clearStorageSync('companyid');

              wx.navigateTo({
                url: "/weixinmao_zp/pages/message/index"
              })

              }else{
            that.setData({
              companyinfo: res.data.data.companyinfo
            })
              }
          }
        },
        complete: function () {

          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh();
        }
      });
    }

    that.setData({ userinfo: userinfo })

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
          isphone: false,
          isuser: that.data.isuser,
        })
        app.util.request({
          'url': 'entry/wxapp/Updateuserinfo',
          data: { uid: uid, nickname: nickname, avatarUrl: avatarUrl },
          success: function (res) {
            if (!res.data.message.errno) {
              that.initpage();
              that.setData({
                userinfo: userInfo,
                isphone: false,
                isuser: that.data.isuser,
              })
            }

          }
        })

      }



    }, e.detail);
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
      'url': 'entry/wxapp/saveuserinfo',
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
      url: "/weixinmao_house/pages/couponlist/index"
    })

  },
  Puboldhouse: function (e) {

    wx.navigateTo({
      url: "/weixinmao_house/pages/pub/index"
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