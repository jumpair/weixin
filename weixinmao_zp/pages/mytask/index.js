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
    that.initpage();







  },initpage:function(){

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

          if (res.data.data.intro.ischeck == 1){

            wx.setNavigationBarTitle({
              title: '服务中心-' + wx.getStorageSync('companyinfo').name,
            })

          }else{

            wx.setNavigationBarTitle({
              title: '我的任务',
            })

          }
          
          that.setData({
            ischeck: res.data.data.intro.ischeck
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
    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/mytask',
      data: { page: that.data.page, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid  },
      success: function (res) {
        if (!res.data.message.errno) {


          console.log(res.data.data.joblist);
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
  toJobDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + id
    })
  },
  toJobmoneyDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/myjobmoneydetail/index?id=" + id
    })
  },
  toSearch: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/search/index"
    })

  },
  toNewsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/newsdetail/index?id=" + id
    })

  },
  getTask: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var userinfo = wx.getStorageSync('userInfo');
    wx.showModal({
      title: '提示',
      content: '确认领取任务？',
      success: function (res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/getTask',
            data: { jobid: id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
            success: function (res) {
              console.log(res);
            if(res.data.data.error == 0)
            {
              

              wx.showToast({
                title: res.data.data.msg,
                icon: 'success',
                duration: 2000,
                success: function (res) {
                  that.onLoad();
                }
              })
            

            }else{

              wx.showModal({
                title: '提示',
                content: res.data.data.msg,
                showCancel: false
              })
              return


            }

            },
            fail: function (res) {
              console.log(res);
            }

          })
        }
      }

    })

  },
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
      title: '悬赏职位-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/moneyjob/index'
    }
  }
})