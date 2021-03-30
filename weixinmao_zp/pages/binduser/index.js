// weixinmao_zp/pages/binduser/index.js
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var config = require('../../resource/js/config.js');

var markersData = [];
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
    codePhone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '认证',
    })
  },
  binduser:function(e){
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var telephone = e.detail.value.telephone;
    var code = e.detail.value.code;
    if (telephone.length != 11 || isNaN(telephone)) {
      wx.showModal({
        title: '提示',
        content: '请输入有效的手机号码',
        showCancel: false
      })
      return
    }
    if(code == '')
      {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false
      })
      return
      }
    
    app.util.request({
      'url': 'entry/wxapp/register',
      data: {
        phone: telephone, code: code, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {

          if (res.data.data.error ==1)
            {
            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
            }else{

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
               success: function (res) {
                wx.navigateTo({
                  url: "/weixinmao_zp/pages/user/index"
                })

              }
            })
            return
            }
             
        
        
        }
      }})
  




    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
      'url': 'entry/wxapp/sendsms',
      data: { phone: this.data.telephone},
      success: function (res) {
        if (!res.data.message.errno) {

         
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
    });




         


  },

  phoneinput(e) {
    console.log(e)
      let value = e.detail.value
      console.log(value)
      this.setData({
      telephone: value
    })
  },
  codeinput(e) {
    let value = e.detail.value
      console.log(value)
      this.setData({
      codePhone: value
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.checkuser({
      doServices: function () {

        var userinfo = wx.getStorageSync('userInfo');
        console.log(userinfo.wxInfo);
        that.setData({ userinfo: userinfo })

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
  
  checkuser: function (options) {


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