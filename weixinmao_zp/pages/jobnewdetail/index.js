// index.js
// 引入SDK核心类
var WxParse = require('../../resource/wxParse/wxParse.js');//

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
    autoplay: true,
    interval: 3000,
    duration: 1000,
    companyid: 0,
    title: '',
    address: '',
    lat: 0,
    lng: 0,
    id: 0,
    title: '',
    isuser: true,
    tid:0,
    shareid:0
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('companyinfo').name,
    })
  
    var that = this;
    
 

    var scene = decodeURIComponent(options.scene)

    var uid_array = scene.split('@');
    var id = parseInt(uid_array[0]);
    var tid = parseInt(uid_array[1]);
    var shareid = parseInt(uid_array[2]);
  
        /*
    var id = 39;
     var tid = 0;
     var shareid = 0 ;
      */
    that.data.id = id;
    that.data.tid = tid;
    that.data.shareid = shareid;
    wx.setStorageSync('tid', tid);
    wx.setStorageSync('shareid', shareid);

 
    that.setData({
      isshow: true
    })
    //初始化导航数据





    that.getjobdetail();

  }
  , getjobdetail: function () {
    var that = this;

    var shareid = that.data.shareid;

    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);
    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = true;

        that.setData({
          userinfo: appuser
        });

        var data = { id: that.data.id, uid: appuser.memberInfo.uid, shareid: shareid };

      } else {
        that.data.isuser = false;
        var data = { id: that.data.id, uid: 0, shareid: shareid };

      }
    } else {

      that.data.isuser = false;
      var data = { id: that.data.id, uid: 0, shareid: shareid  };
    }
    console.log(that.data.isuser);
    that.setData({
      isuser: that.data.isuser
    });




    var id = that.data.id;
    app.util.request({
      'url': 'entry/wxapp/getjobdetail',
      data: data,
      success: function (res) {
        if (!res.data.message.errno) {
          that.data.title = res.data.data.jobdetail.title;
          that.data.address = res.data.data.jobdetail.address;
          that.data.companyid = res.data.data.jobdetail.companyid;
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
            title: that.data.title + '-' + wx.getStorageSync('companyinfo').name,
          })
          var title = res.data.data.title;
          that.setData({
            title:title,
            isshow: false,
            data: res.data.data.jobdetail,
            joblist:res.data.data.joblist,
            savestatus: res.data.data.savestatus,
            ispay: res.data.data.ispay,
            content: WxParse.wxParse('article', 'html', res.data.data.jobdetail.content, that, 5)
            // content: houseDetail
          })
        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });

  }


  , doSendjob: function (e) {
    var that = this;
    var companyid = e.currentTarget.dataset.id;
    console.log(companyid);
    var companyid = that.data.companyid;
    var form_id = e.detail.formId;
    var shareid = that.data.shareid;
    console.log(form_id);


    var userinfo = wx.getStorageSync('userInfo');
    console.log(userinfo);

    var jobid = that.data.id;

    app.util.request({
      'url': 'entry/wxapp/sendjob',
      data: { form_id: form_id, companyid: companyid, jobid: jobid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid, shareid: shareid },
      success: function (res) {

        if (!res.data.message.errno) {
          if (res.data.data.error == 0) {
            wx.showToast({
              title: '投递简历成功!',
              icon: 'success',
              duration: 2000
            })

          } else if (res.data.data.error == 2) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
          /*
          } else if (res.data.data.error == 4) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
              success: function (res) {
                wx.navigateTo({
                  url: "/weixinmao_zp/pages/binduser/index"
                })

              }

            })
            return
         */
          } else if (res.data.data.error == 3) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
              success: function (res) {
                wx.navigateTo({
                  url: "/weixinmao_zp/pages/mynote/index"
                })

              }


            })



            return
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return


          }
          that.setData({
            data: res.data.data.jobdetail,
          })
        }
      }
    });



  },
  toJobDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + id
    })
  },
  doSavejob: function (e) {
    var that = this;
    var companyid = e.currentTarget.dataset.id;
    console.log(companyid);
    this.checkuser({
      doElseServices: function () {

        var userinfo = wx.getStorageSync('userInfo');
        console.log(userinfo);

        var jobid = that.data.id;

        app.util.request({
          'url': 'entry/wxapp/savejob',
          data: { companyid: companyid, jobid: jobid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
          success: function (res) {
            if (!res.data.message.errno) {
              if (res.data.data.error == 0) {
                wx.showToast({
                  title: '收藏成功!',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  savestatus: 1,
                })

              } else if (res.data.data.error == 2) {

                wx.showModal({
                  title: '提示',
                  content: res.data.data.msg,
                  showCancel: false
                })
                return
              } else {
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

      }

    });

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
        wx.setStorageSync('userInfo', userInfo);
        app.util.request({
          'url': 'entry/wxapp/Updateuserinfo',
          data: { uid: uid, nickname: nickname, avatarUrl: avatarUrl },
          success: function (res) {
            if (!res.data.message.errno) {
              //app.globalData.isuser = true;
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
  goMap: function (e) {
    var that = this;
    console.log('ffffff');
    wx.openLocation({
      latitude: parseFloat(that.data.lat),
      longitude: parseFloat(that.data.lng),
      scale: 18,
      name: that.data.title,
      address: that.data.address
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
  toSharejob: function (e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/sharejob/index?id=" + id
    })
  },

  toCompanyDetail: function (e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/companydetail/index?id=" + id
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

  }, pay: function (e) {
    var that = this;
    that.checkuser({
      doServices: function () {
        console.log('ffff');
        that.data.showmsg = false;
        that.setData({
          showmsg: that.data.showmsg
        })
      },
      doElseServices: function () {

        var pid = that.data.id;
        var userinfo = wx.getStorageSync('userInfo');
        var ordertype = 'payjob';
        wx.showModal({
          title: '确认支付',
          content: '确认支付打赏金额？',
          success: function (res) {
            if (res.confirm) {
              app.util.request({
                'url': 'entry/wxapp/pay',
                data: { ordertype: ordertype, pid: pid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                success: function (res) {
                  console.log(res);
                  if (res.data && res.data.data) {
                    wx.requestPayment({
                      'timeStamp': res.data.data.timeStamp,
                      'nonceStr': res.data.data.nonceStr,
                      'package': res.data.data.package,
                      'signType': 'MD5',
                      'paySign': res.data.data.paySign,
                      'success': function (res) {
                        //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                        console.log(res);
                        that.setData({
                          ispay: 1
                        })

                      },
                      'fail': function (res) {
                        //支付失败后，
                      }
                    })
                  }

                },
                fail: function (res) {
                  console.log(res);
                }

              })



            }
          }

        })

      }


    });



  }, 

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage() {
    return {
      title: this.data.title + '-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/jobdetail/index?id=' + this.data.id
    }
  }, checkuser: function (options) {


    var that = this;
    var options = options;
    var userinfo = wx.getStorageSync('userInfo');

    if (!userinfo) {
      console.log('tmddddssssss222222');
      app.util.getUserInfo(
        function (userinfo) {
          that.getjobdetail();
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
              // options.doServices();
              options.doElseServices();

            } else {




            }

          }
        });

      }
    }


  }

})