// wxsmall_001/pages/message/index.js
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    codePhone: "",
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: '企业密码修改',
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
  toCompanyforget:function(){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/companyforget/index"
    })

  },
  goregister:function(e){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/companyregister/index"
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

  phoneinput(e) {
    console.log(e)
    let value = e.detail.value
    console.log(value)
    this.setData({
      telephone: value
    })
  },
  changeCode() {
    var _this = this
    let telephone = this.data.telephone
    if (telephone.length != 11 || isNaN(telephone)) {


      wx.showModal({
        title: '提示',
        content: '请输入有效的手机号码',
        showCancel: false
      })
      return

    }
    this.setData({
      codeDis: true
    })


    app.util.request({
      'url': 'entry/wxapp/Sendforgetsms',
      data: { phone: this.data.telephone },
      success: function (res) {
        if (!res.data.message.errno) {

          if(res.data.data.error == 1)
          {

       
            _this.setData({
              codeDis: false
            })

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return



          }else{

          _this.setData({
            phoneCode: 60
          })
          let time = setInterval(() => {
            let phoneCode = _this.data.phoneCode
            phoneCode--
            _this.setData({
              phoneCode: phoneCode
            })
            if (phoneCode == 0) {
              clearInterval(time)
              _this.setData({
                phoneCode: "获取验证码",
                flag: true,
                codeDis: false
              })
            }
          }, 1000)


          }



        }
      }
    });







  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
  
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
  
  },
  bindSave: function (e) {
    console.log(e.detail.formId);
    var that = this;
     
    var userinfo = wx.getStorageSync('userInfo');
    var password = e.detail.value.password;
    var password2 = e.detail.value.password2
    
    var tel = e.detail.value.tel;

    var code = e.detail.value.code;


    if (tel == "") {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false
      })
      return
    } else {


      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel))) {

        wx.showModal({
          title: '提示',
          content: '请输入有效手机账号',
          showCancel: false
        })
        return
      }
    }

    if (code == "") {

      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false
      })
      return
    }

    if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请填写密码',
        showCancel: false
      })
      return
    }
    

    if (password2 == "") {
      wx.showModal({
        title: '提示',
        content: '请填写确认密码',
        showCancel: false
      })
      return
    }


    if (password != password2) {
      wx.showModal({
        title: '提示',
        content: '两次密码不一致',
        showCancel: false
      })
      return
    }


  


    app.util.request({
      'url': 'entry/wxapp/updatesecret',
      data: {password: password, code:code,tel:tel},
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

      wx.showModal({
        title: '提示',
        content: res.data.data.msg,
        showCancel: false,
        success:function(){
          wx.navigateTo({
            url: "/weixinmao_zp/pages/message/index"
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