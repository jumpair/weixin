// index.js
// 引入SDK核心类

var WxParse = require('../../resource/wxParse/wxParse.js');//
var R_htmlToWxml = require('../../resource/js/htmlToWxml.js');//引入公共方法
var imageUtil = require('../../resource/js/images.js');
//var GPSTransformWX = require('../../resource/js/GPSTransformWX.js');
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
    title:'',
    address:'',
    lat:0,
    lng:0,
    id: 0,
    title: '',
    showcontact:true,
    isuser:true
  }
  , imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //console.log(GPSTransformWX.GPSTransformWX.prototype);

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('companyinfo').name,
    })

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    var companyid = wx.getStorageSync('companyid');
  //  var showcontact = true;
    if(!companyid)
      {
      companyid = 0 ;
      }
    var that = this;
    if (this.data.id > 0) {
      var id = this.data.id;
    } else {
      var id = e.id;
      this.data.id = e.id;
    }
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/Getworkerdetail',
      data: { id: id, companyid: companyid },
      success: function (res) {
        if (!res.data.message.errno) {
          that.data.title = res.data.data.workerdetail.name;
        
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
          
          that.setData({
            data: res.data.data.workerdetail,
            showcontact: res.data.data.showcontact,
            intro:res.data.data.intro,
            title:res.data.data.title,
            advmoney: res.data.data.advmoney,
            content: WxParse.wxParse('article', 'html', res.data.data.workerdetail.content, that, 5)

           
          })
        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },
  toMessage:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/message/index"
    })

  },
  toSelectlook:function(){
     
     var that = this;
    that.setData({
      isuser: false

    })

  },
  toLookUser:function(){
    var that =this;
    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/CheckLookuserrecord',
      data: { id: that.data.id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid,notetype:0},
      success: function (res) {
        if (!res.data.message.errno) {

          if (res.data.data.status == 1) {
            wx.showModal({
              title: '系统提示',
              content: '您的查看简历次数达到了上限,请到用户套餐购买！',
              showCancel: false,
              success:function(){

                wx.navigateTo({
                  url: "/weixinmao_zp/pages/lookrole/index"
                })
              }
            })

          }
          that.setData({
            showcontact: res.data.data.showcontact,
            isuser:true

          })
        }
      }
    });


  },
  toLookContact:function(e){
    var that = this;

    var companyid = wx.getStorageSync('companyid');
    //  var showcontact = true;
    if (!companyid) {
      wx.navigateTo({
        url: "/weixinmao_zp/pages/message/index"
      })
    }else{

      app.util.request({
        'url': 'entry/wxapp/CheckLookrecord',
        data: { id: that.data.id, companyid: companyid,notetype:0 },
        success: function (res) {
          if (!res.data.message.errno) {
           
            if(res.data.data.status == 1)
              {
                  wx.showModal({
                    title: '系统提示',
                    content: '您的查看简历次数达到了上限,请到企业中心购买！',
                    showCancel: false,
                    success:function(){
                      wx.navigateTo({
                        url: "/weixinmao_zp/pages/paymoney/index"
                      })

                    }
                  })

              }
            that.setData({
              showcontact: res.data.data.showcontact,
 isuser: true
            })
          }
        }
      });
      



      
    }

  },
  doSendmsg: function (e) {

    var that = this;
    var tel = e.currentTarget.dataset.tel;
    var form_id = e.detail.formId;
     //if (that.data.isinvate == 1) {
      wx.showModal({
        title: '邀请面试',
        content: '确认邀请面试？',
        success: function (res) {
          if (res.confirm) {

            var companyid = wx.getStorageSync('companyid');
            var id = that.data.id;
            //初始化导航数据
            console.log('a' + id);
            console.log('b' + companyid);
            console.log('c' + form_id);
            app.util.request({
              'url': 'entry/wxapp/Sendinvatejob',
              data: { id: id, companyid: companyid, form_id: form_id },
              success: function (res) {
                if (!res.data.message.errno) {

                }
              }

            });


          }

        }
      })
/*
    } else {

      wx.showModal({
        title: '提示',
        content: '未投简历,无法邀请',
        showCancel: false
      })
      return
    }
*/

  },
  goMap: function (e) {
    var that = this;

    console.log(that.data.lat);
    console.log(that.data.lng);
   // var lbs = GPSTransformWX.GPSTransformWX.prototype.transform(parseFloat(that.data.lat), parseFloat(that.data.lng));
   
    wx.openLocation({
   
      latitude: that.data.lat,
      longitude: that.data.lng,
      scale: 28,
      name: that.data.title ,
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

  },
  onShareAppMessage() {
    console.log(this.data.id)
    return {
      title: this.data.title + '-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/workerdetail/index?id=' + this.data.id
    }
  }
})