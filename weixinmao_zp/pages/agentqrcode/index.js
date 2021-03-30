// weixinmao_house/pages/share/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  picfile:'',
  shareImgSrc:'',
  savebtn:true,
  myqrcode:'',
  myqrcodefile:'',
  houseinfo:'',
  id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '生成推广卡片',
    })

 that.getQrcodenewhouse();

  


  },

  getQrcodenewhouse:function(){
  var that = this;
  var userinfo = wx.getStorageSync('userInfo');

    app.util.request({
      'url': 'entry/wxapp/myagentspread',
      data: {  uid: userinfo.memberInfo.uid},
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
          that.data.myqrcode = res.data.data.myqrcode;
          that.data.houseinfo = res.data.data.houseinfo;
          that.doShow();
        }
      }
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onShow: function () {

  },
  reload:function(){

  this.onLoad();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  doShow: function () {
    var that = this;
    var houseinfo = that.data.houseinfo;
    //1. 请求后端API生成小程序码
    //that.getQr();
    const ctx = wx.createCanvasContext('myCanvas');
  //  var imgPath = '../../resource/images/111.png';
    wx.showLoading({
      title: '正在生成推广卡片',
    })
    wx.downloadFile({
      url: houseinfo.thumb,
      success: function (res) {
       
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {

          that.data.picfile = res.tempFilePath;

          wx.downloadFile({
            url: that.data.myqrcode,
            success: function (res) {
              console.log(res.tempFilePath);
              that.data.myqrcodefile = res.tempFilePath;
              ctx.setFillStyle('white')
              ctx.drawImage(that.data.picfile, 0, 0, 600, 320);

              ctx.setFillStyle('white')
              ctx.fillRect(0, 340, 600, 580);

              ctx.drawImage(that.data.myqrcodefile, 180, 350, 255, 255);


              ctx.setFontSize(24)
              ctx.setFillStyle('#000000')

              ctx.fillText('长按扫码成为代言人', 200, 630)
             // ctx.fillText(houseinfo.housename, 0, 630)

             // ctx.fillText('当你的粉丝在店铺内支付订单后，订单中的所有商品，都有相应的收益比例：一级粉丝10%，二级粉丝15%（以店铺设置为准）。将支付订单金额和收益比例相乘后，累计计算出你此单的总收益。', 20, 660)


              ctx.draw()


              setTimeout(() => {
                that.drawAfter();
              }, 200);

            }})

      
          


        }
      }
    })
    


    //2. canvas绘制文字和图片



    
    
  },


  drawAfter: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 600,
      height: 800,
      destWidth: 600,
      destHeight: 800,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);
        that.data.shareImgSrc = res.tempFilePath;
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        that.setData({
          shareImgSrc: res.tempFilePath,
          savebtn: false,
          test: 'aaaa'
        })

      },
      fail: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        that.onLoad();

        console.log(res)
      }
    })
  },
  savepic:function(){
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgSrc,
      success(res) {
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，去发圈噻~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
            that.hideShareImg()
          }
        })
      }
    })

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
  checkuser: function (options) {


    var that = this;
    var options = options;
    var userinfo = wx.getStorageSync('userInfo');
    console.log(userinfo);
    if (!userinfo) {
      app.util.getUserInfo(
        function (userinfo) {
          that.getQrcodenewhouse();
        }



      );
      return false;
    } else {
      if (!userinfo.memberInfo.uid) {
        app.util.getUserInfo();
        return false;
      } else {

        app.util.request({
          'url': 'entry/wxapp/checkuserinfo',
          data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
          success: function (res) {
            console.log('payyyy');
            if (res.data.data.error == 0) {

              options.doServices();

            } else if (res.data.data.error == 2) {
              // console.log('payyyy');
              options.doElseServices();

            } else {




            }

          }
        });

      }
    }

  }
})