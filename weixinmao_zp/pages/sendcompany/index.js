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
    listid:0,
    totalprice:0,
    id:0,
    isding:0,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '派送人员',
    })
    that.data.id = e.id;

 
 
    that.setData({

      isshow: true,
      isding:that.data.isding
    })
  

    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/mytask',
      data: { page: that.data.page, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
      success: function (res) {
        if (!res.data.message.errno) {


          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#09ba07';

          }
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.data.intro.maincolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })


          console.log(res.data.data.joblist);
          that.setData({
            joblist: res.data.data.joblist,
            jobcatelist: res.data.data.jobcatelist,
            intro:res.data.data.intro,
            isshow:false

          })
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
        that.setData({
          loadMore: ''
        })

      }
    });
  




  },


  toContentorderdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_jz/pages/contentorderdetail/index?id=" + id
    })

  },

  radioChange: function (e) {
    var that = this;
   var selectvalue = e.detail.value;

    that.data.listid = selectvalue;
    
  },
  
  SelectChange:function(e){
    var that = this;
    console.log(e.detail.value);
   var list = e.detail.value;
   var totalprice= 0;
   var listid = '';
   var item;
  if(list.length>0)
    {
   for(var i=0; i<list.length;i++)
    {
    item = list[i].split('@');

    totalprice = totalprice + parseFloat(item[0]);

    listid = listid + item[1]+'@';
    }

   console.log(listid);
    }
  that.data.listid = listid;
  that.data.totalprice = totalprice;
  that.setData({
    totalprice: totalprice,
  })

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
      url: "/weixinmao_jz/pages/newsdetail/index?id=" + id
    })

  },
  toOrder:function(e){
  var that = this;
    console.log(that.data.listid);

    if (that.data.listid == 0 )
    {
      wx.showModal({
        title: '提示',
        content: '请选择派遣职位',
        showCancel: false
      })
      return
    }
    var userinfo = wx.getStorageSync('userInfo');
    var form_id = e.detail.formId;


    var data = {
      sessionid: userinfo.sessionid,
      jobid: that.data.listid,
      uid: userinfo.memberInfo.uid,
      id:that.data.id,
      form_id: form_id    };
    app.util.request({
      'url': 'entry/wxapp/savesendnote',
      data: data,
      success: function (res) {


        if (res.data.errno != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: '提交失败',
            showCancel: false
          })
          return;
        } else {
          if (res.data.data.error == 0) {
            var orderid = res.data.data.orderid;
            wx.showToast({
              title: res.data.data.msg,
              icon: 'success',
              duration: 2000,
              success: function (res) {
                console.log(res);
                wx.navigateTo({
                  url: "/weixinmao_zp/pages/agentnotelist/index"
                })
              }
            })

          } else {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              title: res.data.data.msg,
              showCancel: false
            })
            return;

          }





        }
      }
    });
    /*
  wx.navigateTo({
    url: "/weixinmao_jz/pages/message/index?listid=" + that.data.listid
  })
  */

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
  //  this.onLoad();
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh();
 //   this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '服务列表-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_jz/pages/article/index'
    }
  }
})