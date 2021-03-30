// list.js
var app = getApp();
Page({
  data: {
    city: wx.getStorageSync('companyinfo').city,
    isCars: true,	// 选择车源开关
    isSort: true,	// 选择排序开关
    isPrice: true,	// 选择价格开关
    isType: true,
    loadMore: '',
    list: [],
    house_list: [],
    housetypelist: [],
    houseareaid: 0,
    housepriceid: 0,
    housetype: 0,
    page: 1,
    title: ''
  },
  // 首屏渲染
  onShow(params) {
    var that = this;
    // var data = { 'name': '住宅', 'id': 1 };
    var housetypelist = [
      { 'name': '初中', 'id': 1 },
      { 'name': '高中', 'id': 2 },
      { 'name': '中技', 'id': 3 },
      { 'name': '中专', 'id': 4 },
      { 'name': '大专', 'id': 5 },
      { 'name': '本科', 'id': 6 },
      { 'name': '硕士', 'id': 7 },
      { 'name': '博士', 'id': 8 },
      { 'name': '博后', 'id': 9 }];

    //  housetypelist.push(data);
    var typeid = 0;
    var carid = 0;
    var priceid = 0;
    this.setData({ housetypelist: housetypelist, typeid: typeid, carid: carid, priceid: priceid });

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
          // fail
        },
        complete: function () {
          // complete
        }
      })

    }


  },

  initpage: function () {

    var that = this;
    var city = wx.getStorageSync('city');
    app.util.request({
      'url': 'entry/wxapp/getinitinfo',
      data: { city: city },
      success: function (res) {
        if (!res.data.message.errno) {
          wx.setStorageSync('cityinfo', res.data.data.cityinfo);

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

          var title = res.data.data.title;
          if (res.data.data.intro.ischeck == 1) {

            wx.setNavigationBarTitle({
              title: '服务中心-' + wx.getStorageSync('companyinfo').name,
            })

          } else {

            wx.setNavigationBarTitle({
              title: title['agentnote'] + wx.getStorageSync('companyinfo').name,
            })

          }
          that.setData({
            notetitle:title,
            city: wx.getStorageSync('cityinfo').name,
            arealist: res.data.data.arealist,
            jobcatelist: res.data.data.jobcatelist,
            title: '',
            price: '',
            typetitle: '',
            ischeck: res.data.data.intro.ischeck,
            intro: res.data.data.intro
          })

          that.gethouselist();
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },
  toAddagentnote:function(){

    wx.navigateTo({
      url: "/weixinmao_zp/pages/addagentnote/index"
    })

  },

  toWorkerDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id=" + id
    })

  }
  ,
  toSearch: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/search/index"
    })

  }
  ,
  gethouselist: function (e) {
    var that = this;
    var cityid = wx.getStorageSync('cityinfo').id;
    app.util.request({
      'url': 'entry/wxapp/getfindworkerlist',
      data: { cityid: cityid, page: that.data.page, houseareaid: that.data.houseareaid, housepriceid: that.data.housepriceid, housetype: that.data.housetype },
      success: function (res) {
        if (!res.data.message.errno) {
          console.log(res.data.data);
          that.setData({
            worklist: res.data.data.worklist,

          })
        }
      },
      complete: function () {
        that.setData({
          loadMore: ''
        })

      }
    });


  },
  selectcarsitem: function (e) {
    console.log(e.currentTarget.id);
    var carid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    console.log(e.currentTarget);

    this.setData({ carid: carid, isCars: true, title: title });
    this.data.houseareaid = carid;
    this.gethouselist();

  }
  ,
  selectpriceitem: function (e) {
    console.log(e.currentTarget.id);
    var priceid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    console.log(e.currentTarget);
    this.setData({ priceid: priceid, isPrice: true, price: title });
    this.data.housepriceid = priceid;
    this.gethouselist();
  }
  ,
  selecttypeitem: function (e) {
    console.log(e.currentTarget.id);
    var typeid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    console.log(e.currentTarget);
    this.setData({ typeid: typeid, isType: true, typetitle: title });
    this.data.housetype = typeid;
    this.gethouselist();
  }
  ,
  // 下拉加载
  onReachBottom(params) {
    var that = this;
    that.setData({
      loadMore: '正在加载中...'
    })
    this.data.page = this.data.page + 1;
    this.gethouselist();
  },
  // 点击搜索
  clickSearch: function (e) {
    wx.switchTab({
      url: '/pages/search/search'
    })
  },
  // 点击列表
  clickList: function () {
    wx.navigateTo({
      url: '../cars/cars'
    })
  },
  // 选择排序方式
  selectCars: function (e) {
    var that = this;
    that.setData({
      isSort: true,
      isPrice: true,
      isType: true,
      isCars: (!that.data.isCars)
    })
  },
  selectPrice: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isType: true,
      isPrice: (!that.data.isPrice)
    })
  },
  selectType: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isPrice: true,
      isType: (!that.data.isType)
    })
  },
  selectSort: function () {
    var that = this;
    that.setData({
      isCars: true,
      isPrice: true,
      isType: true,
      isSort: (!that.data.isSort)
    })
  },
  selectBrand: function () {
    wx.navigateTo({
      url: '../brand/brand'
    })
  }, onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onShow();
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '经纪人推荐简历-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/findworkder/index'
    }
  }
})