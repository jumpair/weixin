// list.js
var app = getApp();
Page({
  data: {
    city: wx.getStorageSync('companyinfo').city,
    isCars: true,	// 选择车源开关
    isSort: true,	// 选择排序开关
    isPrice: true,	// 选择价格开关
    isType:true,
    loadMore: '',
    list: [],
    house_list: [],
    housetypelist:[],
    houseareaid:0,
    housepriceid:0,
    housetype:0,
    page:1
  },
  // 首屏渲染
  onShow(params) {
    var that = this;
   // var data = { 'name': '住宅', 'id': 1 };
    var housetypelist = [
      { 'name': '按最新发布时间', 'id': 1 }];
    
  //  housetypelist.push(data);
    var typeid = 0;
    var carid = 0;
    var priceid =0;
    this.setData({ housetypelist: housetypelist, typeid: typeid,carid:carid,priceid:priceid });


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
          var selecttitle = res.data.data.selecttitle;
          wx.setNavigationBarTitle({
            title: title['vocationjob'],
          })

          that.setData({
            selecttitle: selecttitle,
            city: wx.getStorageSync('cityinfo').name,
            arealist: res.data.data.arealist,
            housepricelist: res.data.data.housepricelist,
            title: '',
            price: '',
            typetitle: ''
          })
          that.gethouselist();

        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },gethouselist:function(e){
    var that = this;
    var cityid = wx.getStorageSync('cityinfo').id;
    app.util.request({
      'url': 'entry/wxapp/getvocationjoblist',
      data: { cityid: cityid,page: that.data.page,houseareaid: that.data.houseareaid, housepriceid: that.data.housepriceid, housetype: that.data.housetype },
      success: function (res) {
        if (!res.data.message.errno) {
          that.setData({
            joblist: res.data.data.joblist,
            jobcatelist: res.data.data.jobcatelist

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

 
  toNewHouseDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/vocationjobdetail/index?id=" + id
    })

  }
  ,
  toSearch: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/search/index"
    })

  },
  selectcarsitem: function (e) {
    var carid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;

    this.setData({ carid: carid, isCars: true,title:title });
    this.data.houseareaid = carid;
    this.gethouselist();

  }
  ,
  selectpriceitem: function (e) {
    var priceid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    this.setData({ priceid: priceid, isPrice: true, price: title });
    this.data.housepriceid = priceid;
    this.gethouselist();
  }
  ,
  selecttypeitem: function (e) {
    var typeid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
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
    this.data.page = this.data.page+1;
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
      isType:true,
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
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onShow();
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '兼职工作-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/findpartjob/index'
    }
  }
})