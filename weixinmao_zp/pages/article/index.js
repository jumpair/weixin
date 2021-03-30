// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
  
    

    var that = this;
    // var WxParse = WxParse;
    //初始化导航数据
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
      'url': 'entry/wxapp/getarticle',
      data: {  },
      success: function (res) {
        if (!res.data.message.errno) {

          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          var title = res.data.data.title;
          that.data.title = title;
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.data.intro.maincolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
          if(res.data.data.intro.ischeck == 1)
            {

            wx.setNavigationBarTitle({
              title:  wx.getStorageSync('companyinfo').name,
            })

            }else{
          wx.setNavigationBarTitle({
            title: title[0],
          })
            }
            console.log(res.data.data);
            // console.log(res.data.data.article);return;
          that.setData({
            category: res.data.data.category,
            article: res.data.data.article,
            imgs1:res.data.data.imagelist,
            activeCategoryId: res.data.data.activeCategoryId
          })

        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });
  
  },
  tabClick: function(e){


    var pid = e.currentTarget.id;
    var that = this;
    // var WxParse = WxParse;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getsecondlist',
      data: { pid: pid },
      success: function (res) {
        if (!res.data.message.errno) {

          that.setData({
            article: res.data.data,
            activeCategoryId: pid
          })

        }
      }
    });
  },

  toNewsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/newsdetail/index?id=" + id
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
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/weixinmao_zp/pages/article/index'
    }
  }
})