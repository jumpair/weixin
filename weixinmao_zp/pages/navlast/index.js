// index.js
// 引入SDK核心类
var WxParse = require('../../resource/wxParse/wxParse.js');//

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: '',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    //是否采用衔接滑动  
    circular: true,
    //是否显示画板指示点  
    indicatorDots: false,
    //选中点的颜色  
    indicatorcolor: "#000",
    //是否竖直  
    vertical: false,
    //是否自动切换  
    //滑动动画时长毫秒  
    //所有图片的高度  
    imgheights: [],
    //图片宽度  
    imgwidth: 750,
    //默认  
    current: 0,
    swiperCurrent: 0,
    indeximg: true,
    isright: 0,
    isuser: true
  },

  imageLoad: function (e) {
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;

    console.log('ffffffffffff');
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里  
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('companyinfo').name,
    })

    if (this.data.id > 0) {
      var id = this.data.id;
    } else {
      var id = e.id;
      this.data.id = e.id;
    }
    console.log(id);
    var that = this;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getnavlist',
      data: { pid: id },
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
          that.data.title = res.data.data.title ;

          wx.setNavigationBarTitle({
            title: that.data.title,
          })
          that.setData({
            navlist: res.data.data.navlist,
            bannerlist: res.data.data.bannerlist,
            newslist:res.data.data.newslist,
            cateinfo:res.data.data.cateinfo


          })
        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },


  toNagivate: function (e) {
    var url = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: url
    })
  },

  toSwitchtab: function (e) {
    var url = e.currentTarget.dataset.id;
    wx.switchTab({
      url: url
    })
  },
  toWxapp: function (e) {
    var url = e.detail.value.innerurl;
    var appid = e.detail.value.appid;
    console.log(url);
    console.log(appid);
    wx.navigateToMiniProgram({
      appId: appid,
      path: url,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },

  toInnerUrl: function (e) {


    var url = e.detail.value.innerurl;
    wx.navigateTo({
      url: url
    })

  },

  toMenuUrl: function (e) {

    var url = e.detail.value.innerurl;
    wx.switchTab({
      url: url
    })

  },
  toWebview: function (e) {

    var id = e.detail.value.id;
    console.log(id);

    wx.navigateTo({
      url: "/weixinmao_zp/pages/openweb/index?id=" + id
    })

  },
  toAgentlist: function () {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/agentlist/index"
    })

  },
  toMyNote: function (e) {


    var that = this;
    if (that.data.isright == 1) {
      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {


            wx.navigateTo({
              url: "/weixinmao_zp/pages/mynote/index"
            })
          }
        }
      });
    } else {
      wx.navigateTo({
        url: "/weixinmao_zp/pages/mynote/index"
      })


    }

  },

  toMoneyjob: function () {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/moneyjob/index"
    })
  },
  toNotevideo: function () {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/findnotevideo/index"
    })
  },

  toNavlast: function (e) {
    var id = e.detail.value.id;
    console.log(id);
    wx.navigateTo({
      url: "/weixinmao_zp/pages/navlast/index?id=" + id
    })
  },
  toRegmoney: function () {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/regmoney/index"
    })
  },
  toUser: function () {

    wx.switchTab({
      url: "/weixinmao_zp/pages/user/index"
    })
  },
  toRegsub: function () {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/regsub/index"
    })
  },
  toMySave: function (e) {


    var that = this;
    if (that.data.isright == 1) {
      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {



            wx.navigateTo({
              url: "/weixinmao_zp/pages/mysave/index"
            })
          }
        }
      });

    } else {

      wx.navigateTo({
        url: "/weixinmao_zp/pages/mysave/index"
      })

    }
  },

  toNearjob: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/nearjob/index"
    })
  },
  toNewsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/newsdetail/index?id=" + id
    })

  },
  toFindjob: function (e) {

    var that = this;
    if (that.data.isright == 1) {
      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {


            wx.switchTab({
              url: "/weixinmao_zp/pages/findjob/index"
            })

          }
        }
      });
    } else {
      wx.switchTab({
        url: "/weixinmao_zp/pages/findjob/index"
      })

    }


  },

  toFindpartjob: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/findpartjob/index"
    })

  },
  toFindworker: function (e) {


    var that = this;

    if (that.data.isright == 1) {

      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {


            wx.switchTab({
              url: "/weixinmao_zp/pages/findworker/index"
            })

          }
        }
      });

    } else {

      wx.switchTab({
        url: "/weixinmao_zp/pages/findworker/index"
      })
    }

  }
  ,
  toNotice: function (e) {

    var that = this;

    if (that.data.isright == 1) {

      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {
            wx.navigateTo({
              url: "/weixinmao_zp/pages/mynotice/index"
            })
          }
        }
      });
    } else {

      wx.navigateTo({
        url: "/weixinmao_zp/pages/mynotice/index"
      })

    }
  }
  ,
  toJobDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + id
    })
  },
  toJobmoneyDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobmoneydetail/index?id=" + id
    })
  },
  toWorkerdetial: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id=" + id
    })

  },
  toCompanydetial: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/companydetail/index?id=" + id
    })
  },
  toArticle: function (e) {



    var that = this;
    if (that.data.isright == 1) {

      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {


            wx.navigateTo({
              url: "/weixinmao_zp/pages/article/index"
            })
          }
        }
      });
    } else {

      wx.navigateTo({
        url: "/weixinmao_zp/pages/article/index"
      })

    }


  }
  ,
  toLogin: function (e) {


    var that = this;

    if (that.data.isright == 1) {
      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {


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




          }
        }
      });

    } else {

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





    }



  },
  toActive: function (e) {

    var that = this;
    if (that.data.isright == 1) {
      var form_id = e.detail.formId;

      var userinfo = wx.getStorageSync('userInfo');

      app.util.request({
        'url': 'entry/wxapp/SaveFormId',
        data: { form_id: form_id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
        success: function (res) {
          if (!res.data.message.errno) {


            wx.navigateTo({
              url: "/weixinmao_zp/pages/active/index"
            })

          }
        }
      });
    } else {

      wx.navigateTo({
        url: "/weixinmao_zp/pages/active/index"
      })

    }


  }
  ,
  toAddCompanyjob: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/addCompanyjob/index"
    })
  }

  ,
  toNicejob: function () {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/nicejoblist/index"
    })

  },
  toNewHouseDetail: function (e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/newhousedetail/index?id=" + id
    })

  },
  toOldHouseDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/oldhousedetail/index?id=" + id
    })

  },
  toLethouse: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/lethouselist/index?id=" + id
    })

  },
  toMessage: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/message/index"
    })

  },

  toSearch: function (e) {

    wx.navigateTo({
      url: "/weixinmao_zp/pages/search/index"
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

  },
  onShareAppMessage() {
    return {
      title: this.data.title + '-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/newsdetail/index?id=' + this.data.id
    }
  }
})