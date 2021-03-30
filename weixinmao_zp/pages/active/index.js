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
  onLoad: function (options) {
   

    var that = this;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    var cityinfo = wx.getStorageSync('cityinfo');
    if (cityinfo) {

      wx.setStorageSync('city', cityinfo.name);
      that.initpage();

    } else {
      //获取信息
      qqmapsdk = new QQMapWX({
        key: '5D3BZ-J55WF-SFPJJ-NI6PG-YN2ZO-M4BHX' // 必填
      });
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {

          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (addressRes) {
              var address = addressRes.result.address_component.city;

              var city = address.substr(0, address.length - 1);

              wx.setStorageSync('city', city);

              that.initpage();

            }
          })




        },
        fail: function () {

          that.initpage();
          // fail
        },
        complete: function () {
          // complete
        }
      })

    }

  }, initpage: function () {

      var that = this;
    app.util.request({
      'url': 'entry/wxapp/getactivelist',
      success: function (res) {
        if (!res.data.message.errno) {
          console.log(res.data.data);
          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          var title = res.data.data.title;
          wx.setNavigationBarTitle({
            title: title[0] + wx.getStorageSync('companyinfo').name,
          })

          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.data.intro.maincolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
          
          that.setData({
            city: wx.getStorageSync('cityinfo').name,
            list: res.data.data.list,
          })
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });

  },
  toActiveDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    
    var data = {
      aid: id,
    };
    app.util.request({
      'url': 'entry/wxapp/Checkactive',
      data: data,
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
        } else {
          if (res.data.data.error == 0) {
          
            wx.navigateTo({
              url: "/weixinmao_zp/pages/activedetail/index?id=" + id
            })
            
          } else {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })

          }

        }


      }
    });



   

  },

  toActiveDetail2: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/activedetail2/index?id=" + id
    })

  },
  doBaomsg:function(e){
    var companyid = wx.getStorageSync('companyid');
    var aid = e.currentTarget.dataset.id;

    if(companyid>0)
      {

      var data = {
        companyid: companyid,
        aid: aid,
      };
      app.util.request({
        'url': 'entry/wxapp/Saveactiverecord',
        data: data,
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
          } else {
            if (res.data.data.error == 0 )
              {
            wx.showToast({
              title: res.data.data.msg,
              icon: 'success',
              duration: 2000,
              success: function (res) {
                console.log(res);

              }
            })
              }else{

              wx.showModal({
                title: '提示',
                content: res.data.data.msg,
                showCancel: false
              })

              }

          }


        }
      });




      }else{
      wx.showModal({
        title: '提示',
        content: '请先企业登录',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: "/weixinmao_zp/pages/message/index"
          })
        }
      })
      return

      }


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
    return {
      title: '招聘会-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/active/index'
    }
  }
})