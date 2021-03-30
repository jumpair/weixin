// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopinfo').name,
    })

    var pid = e.id;
    var that = this;
    // var WxParse = WxParse;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getlist',
      data: { pid: pid },
      success: function (res) {
        if (!res.data.message.errno) {

          that.setData({
            services: res.data.data,
          })

        }
      }
    });

  },
  tabClick: function (e) {


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
      url: "/wxsmall_001/pages/newsdetail/index?id=" + id
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
    return {
      title: wx.getStorageSync('shopinfo').name,
      path: '/wxsmall_001/pages/index/index'
    }
  }
})