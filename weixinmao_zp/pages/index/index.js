
// 引入SDK核心类
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var config = require('../../resource/js/config.js');

var markersData = [];
var app = getApp();
Page({
  data: {
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
    current: 0 ,
    swiperCurrent: 0,
    indeximg: true,
    isright:0,
    isuser:true

  }, imageLoad: function (e) {
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
  }, bindchange: function (e) {
    console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },

onShow:function(){
   var that = this;
    var cityinfo = wx.getStorageSync('cityinfo');
    if (cityinfo) {

      wx.setStorageSync('city', cityinfo.name);
      that.initpage();

    }

  },
 
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  
    var that = this;
    console.log(options);
    if(options)
    {
        if (options.hasOwnProperty("scene"))
        {
        var scene = decodeURIComponent(options.scene);
        var uid_array = scene.split('=');
        var uid = parseInt(uid_array[1]);
        wx.setStorageSync('tid',uid);

        }
    }
    var userid = 0;
    
    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);

    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = true;
        userid = appuser.memberInfo.uid;
        that.setData({
          isuser: that.data.isuser
        });

      } 
    }



    that.setData({
      isshow: true
    })
    //系统初始化

    
    app.util.request({
      'url': 'entry/wxapp/Sysinit',
      data: { userid:userid  },
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

          console.log(res.data.data.navtitle);

          var bartitle = res.data.data.bartitle;
          that.setData({
            navtitle: res.data.data.navtitle,
            pubtitle:res.data.data.pubtitle,
            cmtitle:res.data.data.cmtitle,
            searchtitle: res.data.data.searchtitle,
            companycount: res.data.data.companycount,
            jobcount: res.data.data.jobcount,
            notecount: res.data.data.notecount,
            advmoney: res.data.data.advmoney,


          });

          if (res.data.data.intro.ischeck == 0) {
            that.setData({
              ischeck: 0,
              indeximg:res.data.data.indeximg
             
            });

            if (res.data.data.intro.isright == 1) {

              var userinfo = wx.getStorageSync('userInfo');
              if (userinfo) {
                if (userinfo.hasOwnProperty("wxInfo")) {

                  that.setData({

                    //   isphone: false,
                    isuser: true
                  })

                }
              } else {

                that.setData({

                  //   isphone: false,
                  isuser: false
                })
              }


            } else {

              that.setData({

                isuser: true

              })

            }

            wx.setTabBarItem({
              index: 0,
              text: bartitle[0],
              iconPath: 'weixinmao_zp/resource/images/nav/home-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/home-on.png'
            })
            wx.setTabBarItem({
              index: 1,
              text: bartitle[1],
              iconPath: 'weixinmao_zp/resource/images/nav/news-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/news-on.png'
            })
            wx.setTabBarItem({
              index: 2,
              text: bartitle[2],
              iconPath: 'weixinmao_zp/resource/images/nav/er-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/er-on.png'
            })
            wx.setTabBarItem({
              index: 3,
              text: bartitle[3],
              iconPath: 'weixinmao_zp/resource/images/nav/user-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/user-on.png'
            })

          } else {
            that.setData({
              ischeck: 1,
              intro:res.data.data.intro,
              isuser: true
            });
            wx.setTabBarItem({
              index: 0,
              text: '首页',
              iconPath: 'weixinmao_zp/resource/images/nav/home-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/home-on.png'
            })
            wx.setTabBarItem({
              index: 1,
              text: '服务',
              iconPath: 'weixinmao_zp/resource/images/nav/news-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/news-on.png'
            })
            wx.setTabBarItem({
              index: 2,
              text: '资讯',
              iconPath: 'weixinmao_zp/resource/images/nav/er-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/er-on.png'
            })
            wx.setTabBarItem({
              index: 3,
              text: '会员',
              iconPath: 'weixinmao_zp/resource/images/nav/user-off.png',
              selectedIconPath: 'weixinmao_zp/resource/images/nav/user-on.png'
            })

          }

          if (res.data.data.intro.isgps == 0) {

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
                  wx.setStorageSync('latitude', res.latitude);
                  wx.setStorageSync('longitude', res.longitude);
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
                  // fail

                  that.initpage();
                },
                complete: function () {
                  // complete
                }
              })




            }         

          }else{


            that.initpage();

          }


            
         
        }

      }})

    
    //   that.initpage();


  },
  initpage:function(){
  var that = this;
  var city = wx.getStorageSync('city');
    app.util.request({
      'url': 'entry/wxapp/GetIndexList',
      data: { city: city },
      success: function (res) {
        if (!res.data.message.errno) {
        
            wx.setStorageSync('companyinfo', res.data.data.intro);
            wx.setStorageSync('companyinfo', res.data.data.intro);
            console.log(res.data.data.cityinfo);
            wx.setStorageSync('cityinfo', res.data.data.cityinfo);
            wx.setNavigationBarTitle({
              title: wx.getStorageSync('companyinfo').name,
            })

            that.setData({
              companylist: res.data.data.companylist,
              notelist: res.data.data.notelist,
              joblist: res.data.data.joblist,
              intro: res.data.data.intro,
              banners: res.data.data.bannerlist,
              navlist: res.data.data.navlist,
              glist: res.data.data.glist,
              isshow: false,
              city: wx.getStorageSync('cityinfo').name

            })

         
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },
  getRedmoney:function()
  {

    var that = this;
    var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/getredmoney',
      data: {  sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {
      
          that.data.indeximg = true;

          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '领取成功',
            success: function (res) {

              that.setData({
                indeximg: that.data.indeximg
              })
             }
          })
       

        }
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
        wx.setStorageSync('userInfo',userInfo);
        app.util.request({
          'url': 'entry/wxapp/Updateuserinfo',
          data: { uid: uid, nickname: nickname, avatarUrl: avatarUrl },
          success: function (res) {
            if (!res.data.message.errno) {
              //app.globalData.isuser = true;
              that.data.isphone = res.data.data.isphone;
              that.data.indeximg = res.data.data.indeximg;
              that.setData({
                indeximg: that.data.indeximg,
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
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      swiperCurrent: e.detail.current   //获取当前轮播图片的下标
    })
  },

  closeIndeximg: function () {
    var that = this;
    that.data.indeximg = true;
   // wx.setStorageSync('onimg', true);
    that.setData({
      indeximg: that.data.indeximg,
    })

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

  toWxappbanner: function (e) {
    var url = e.currentTarget.dataset.id;
    var appid = e.currentTarget.dataset.appid;
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
      url: "/weixinmao_zp/pages/openweb/index?id="+id
    })

  },
  toAgentlist:function(){
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
      url: "/weixinmao_zp/pages/navlast/index?id="+id
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
  toWorkerdetial:function(e){
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
  toAddCompanyjob:function(e){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/addCompanyjob/index"
    })
  }
  
  ,
  toNicejob:function(){
    wx.navigateTo({
      url: "/weixinmao_zp/pages/nicejoblist/index"
    })

  },
  toNewHouseDetail:function(e){

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
  toMessage: function(e)
    {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/message/index"
    })

    },
    
  toSearch:function(e){

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

  onReady: function () {
    // 页面渲染完成
    const self = this;
  },
  bindInput: function (e) {
    var that = this;
    this.setData({
      inputValue: e.detail.value
    });
    that.onShow();
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
    
  },
 
  doCall: function () {
    var tel = this.data.textData.shop_tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  onShareAppMessage() {
    return {
      title: wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/index/index'
    }
  }

  
})