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
  id:0,
  userinfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '生成分享卡片',
    })

    if (this.data.id > 0) {
      var id = this.data.id;
    } else {
      var id = options.id;
      this.data.id = options.id;
    }

    var appuser = wx.getStorageSync('userInfo');
    // if (app.sessionid && app.memberInfo !='') {
    if (!appuser.sessionid) {
      //app.util.getUserInfo();
    }
    that.getQrcodenewhouse();
    
  


  },

  getQrcodenewhouse:function(){
  var that = this;
  var userinfo = wx.getStorageSync('userInfo');
  console.log(userinfo);
    app.util.request({
      'url': 'entry/wxapp/getQrcodenewhouse',
      data: { id: that.data.id, uid: userinfo.memberInfo.uid},
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
          that.data.userinfo = res.data.data.userinfo;
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
  reload:function(e){



    var that = this;

    wx.setStorageSync('wxInfo', e.detail);

    if (e.detail.userInfo) {
      app.util.getUserInfo(
        function (userinfo) {
        
          that.getQrcodenewhouse();
        }

      );
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }



// this.onLoad();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  doShow: function () {
    var that = this;
    var houseinfo = that.data.houseinfo;
    var userinfo = that.data.userinfo;
    //1. 请求后端API生成小程序码
    //that.getQr();
    const ctx = wx.createCanvasContext('myCanvas');
    //  var imgPath = '../../resource/images/111.png';
    wx.showLoading({
      title: '正在生成分享卡片',
    })




    wx.downloadFile({
      url: userinfo.avatarUrl,
      success: function (res) {

        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {

          that.data.picfile = res.tempFilePath;
          console.log(that.data.picfile );
         

          wx.downloadFile({
            url: that.data.myqrcode,
            success: function (res) {
              console.log(res.tempFilePath);
              that.data.myqrcodefile = res.tempFilePath;
              console.log(that.data.myqrcodefile);
          
              ctx.setFillStyle('#ef4030')
              ctx.fillRect(0, 0, 600, 800);

            //  ctx.beginPath(); // 开始新的区域
            //  ctx.arc(73, 224, 38, 0, 2 * Math.PI);
            //  ctx.clip();  // 从画布上裁剪出这个圆形


              ctx.drawImage(that.data.picfile, 100, 570, 130, 130);
              ctx.font = 'normal bold 30px sans-serif';

              ctx.beginPath();
              ctx.setStrokeStyle('white')
              ctx.setLineWidth(3);
              ctx.moveTo(35, 40);
              ctx.lineTo(560, 40);
              ctx.stroke();

   
              ctx.beginPath();
              ctx.setStrokeStyle('white')
              ctx.setLineWidth(3);
              ctx.moveTo(35, 100);
              ctx.lineTo(560, 100);
              ctx.stroke();


              ctx.setFontSize(40);
              ctx.setFillStyle('white');
              ctx.setTextAlign('center');
              ctx.fillText(houseinfo.companyname, 300, 83);
              ctx.setStrokeStyle('white')

              ctx.setFontSize(100);
              ctx.setFillStyle('white');
              ctx.setTextAlign('center');
              ctx.fillText('悬  赏', 300, 200)


              ctx.setFontSize(65);
              ctx.setFillStyle('white');
              ctx.setTextAlign('center');
              ctx.fillText('￥'+houseinfo.vprice, 300, 300);

                   
              ctx.setFontSize(50);
              ctx.setFillStyle('white');
              ctx.setTextAlign('center');
              ctx.fillText(houseinfo.title, 300, 430);
              ctx.setStrokeStyle('white')
             
            

              ctx.setStrokeStyle('white');
              ctx.setLineWidth(5);
              ctx.strokeRect(35, 550, 540, 220);

              


              
              ctx.drawImage(that.data.myqrcodefile, 400, 570, 130, 130);


              ctx.setFontSize(20);
              ctx.setFillStyle('white');
              ctx.setTextAlign('center');
              ctx.fillText('长按识别查看招聘信息', 470, 740);
              ctx.setStrokeStyle('white')

              ctx.setFontSize(20);
              ctx.setFillStyle('white');
              ctx.setTextAlign('center');
              ctx.fillText(userinfo.name, 170, 740);
              ctx.setStrokeStyle('white')

              ctx.draw()



              setTimeout(() => {
                that.drawAfter();
              }, 200);
        



            }
          })

        }
      }
    })
    

    
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