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
    isuser: true,
    isphone: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '会员中心',
    })


    app.util.request({
      'url': 'entry/wxapp/UserInit',
      data: {},
      success: function (res) {
        if (!res.data.message.errno) {
          //   console.log(res.data.data.intro);

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

          if (res.data.data.intro.isright == 0) {
            var appuser = wx.getStorageSync('userInfo');
            console.log(appuser);
            if (!appuser) {
              //  that.setData({ isuser: true});
              that.data.isuser = true;
              console.log('mmmmmmm');
            } else {
              that.dealuserinfo();
            }


          } else {
            that.dealuserinfo();
          }


          that.setData({
            isuser: that.data.isuser,
            title: res.data.data.title

          });
          that.setData({
            ischeck: res.data.data.intro.ischeck,
            intro: res.data.data.intro

          })
        }
      }
    });

    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh();

  },


  dealuserinfo:function(){

    var that =this;
    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);
    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = false;
       console.log('eeeeeeeeeeeeesssss');
        var uid = appuser.memberInfo.uid;
        app.util.request({
          'url': 'entry/wxapp/Checkusertel',
          data: { uid: uid },
          success: function (res) {
            if (!res.data.message.errno) {
              //app.globalData.isuser = true;
              that.data.isphone = res.data.data.isphone;
              that.setData({
                isphone: that.data.isphone,
                userinfo: appuser,
                moneyrecordinfo: res.data.data.moneyrecordinfo,
                countinfo: res.data.data.countinfo,
              })
            }

          }
        })


      } else {
        that.data.isuser = false;

      }
    } else {

      that.data.isuser = false;
    }


  },

  toMyvideonote: function () {
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var uid = userinfo.memberInfo.uid;
    app.util.request({
      'url': 'entry/wxapp/Checknote',
      data: { uid: uid },
      success: function (res) {
        if (!res.data.message.errno) {
         if (res.data.data.error == 1) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
              success:function(){

                url: "/weixinmao_zp/pages/mynote/index"
              }
            })
            return
          } else {

            wx.navigateTo({
              url: "/weixinmao_zp/pages/myvideonote/index"
            })

          }

        }

      }
    })
  },
  toMyregmoney:function(){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/myregmoney/index"
    })
  },
  toLookrole:function(){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/lookrole/index"
    })

  },
  toAgent:function(){
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var uid = userinfo.memberInfo.uid;
    app.util.request({
      'url': 'entry/wxapp/Checkagent',
      data: { uid: uid },
      success: function (res) {
        if (!res.data.message.errno) {
          if(res.data.data.error == 0)
          {
            wx.navigateTo({
              url: "/weixinmao_zp/pages/agentcenter/index"
            })

           } else if (res.data.data.error == 1){

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
          }else{
       
            wx.navigateTo({
              url: "/weixinmao_zp/pages/regagent/index"
            })

          }
      
        }

      }
    })
  },

  toLogin: function (e) {

    var companyid = wx.getStorageSync('companyid');
    if (companyid > 0) {
      wx.navigateTo({
        url: "/weixinmao_zp/pages/companylogin/index"
      })
    } else {

      wx.navigateTo({
        url: "/weixinmao_zp/pages/message/index"
      })
    }

  },

  toMatchjob:function(){

    var that = this;

    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/Checkmatchjob',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (res.data.data.error == 1) {

          wx.showModal({
            title: '提示',
            content: res.data.data.msg,
            showCancel: false
          })
          return

        } else {
          wx.navigateTo({
            url: "/weixinmao_zp/pages/matchjob/index"
          })

        }
      }
    });



    



  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  tomyAgent:function(){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/myagent/index"
    })
  },
  toMyshare:function(){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/myshare/index"
    })

  },
   toOrderlist: function (e) {
    var pid = e.currentTarget.dataset.id;
    console.log(pid);
    wx.navigateTo({
      url: "/weixinmao_house/pages/orderlist/index?id=" + pid
    })
  },
  toMyPay: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/order/index"
    })
  },
  toMyNote: function (e) {
    var pid = e.currentTarget.dataset.id;
    console.log(pid);
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mynote/index?id=" + pid
    })

  },
  toMyPersonal: function (e) {
    var pid = e.currentTarget.dataset.id;
    console.log(pid);
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mypersonal/index?id=" + pid
    })

  }, toMySave: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/mysave/index"
    })
  },toMyWage: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/mywage/index"
    })
  },toMyTax: function (e) {

        wx.navigateTo({
            url: "/weixinmao_zp/pages/mytax/index"
        })
  },toMydynamic: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/mydynamic/index"
    })
  },


 refreshNotice: function (e) {
    var that = this;

    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/refreshNotice',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (res.data.data.error == 1) {

          wx.showModal({
            title: '提示',
            content: res.data.data.msg,
            showCancel: false
          })
          return

        } else {
          wx.showToast({
            title: res.data.data.msg,
            icon: 'success',
            duration: 2000,
            success: function () {


            }

          })


        }
      }
    });

  },


  toMyFind:function(e){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/myfind/index"
    })
  },
  toMyinvaterecord: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/myinvaterecord/index"
    })
  },
  toMyNotice: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/mynotice/index"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*
    var that = this;
    this.checkuser({
      doServices: function () {

        var userinfo = wx.getStorageSync('userInfo');
        console.log(userinfo.wxInfo);
        that.setData({ userinfo: userinfo })

      }

    });

    */
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
              that.data.isuser = false;

              that.data.isphone = res.data.data.isphone;
              that.setData({
                
                userinfo: userInfo,
                isphone: that.data.isphone,
                isuser: that.data.isuser,
              })
            }

          }
        })

      }



    }, e.detail);
  },
  toMySociety: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/mysociety/index"
    })
  },

  cancelUser: function (e) {

    this.data.isuser = true;
    this.setData({
      isuser: this.data.isuser
    })

  },
  cancelPhone: function (e) {

    this.data.isphone = true;
    this.setData({
      isphone: this.data.isphone
    })

  },
  /*
  binduserinfo: function (e) {
    var that = this;
    that.data.showmsg = false;

    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/getuserinfo',
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        that.setData({
          user: res.data.data,
          showmsg: that.data.showmsg
        })
      }
    });

  },
  */
  saveuserinfo: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var tel = e.detail.value.tel;
    that.data.showmsg = true;
    var userinfo = wx.getStorageSync('userInfo');

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
      data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid, name: name, tel: tel },
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


  getPhoneNumber: function (e) {
    console.log(e.detail);
    var that = this;
    ///   console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
  
    var userinfo = wx.getStorageSync('userInfo');
    var uid = userinfo.memberInfo.uid;



    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      that.setData({
        isphone: true,
      })
      app.util.request({
        'url': 'entry/wxapp/Getphone',
        data: { iv: e.detail.iv, encryptedData: e.detail.encryptedData, uid:uid },
        success: function (res) {
          if (!res.data.message.errno) {

            that.setData({
              isphone: true,
            })
          }

        }
      })
    }
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