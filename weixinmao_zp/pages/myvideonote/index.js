
// weixinmao_house/pages/pub/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs1:[],
    title:'',
    imagelist:[],
    uploadimagelist:['','','','','',''],
    true1: true,
    true2: true,
    true3: true,
    true4: true,
    true5: true,
    true6: true,
    isuser:true,
    isagree:0,
    videourl:'',
    notevideo:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      housetype: that.data.housetype,
      show:'none',
      isvideo:'none'
    });
  

    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);
    if (appuser) {

      that.data.isuser = true;
      that.oldhouseinit();
      that.setData({
        userinfo: appuser
      });
    } else {
     
      that.data.isuser = false;
    }

    that.setData({
      isuser: that.data.isuser
    });

    
    that.setData({
      isuser: that.data.isuser,
      companyinfo: wx.getStorageSync('companyinfo')
    });

      






  }, oldhouseinit: function (e) {
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');

    

    app.util.request({
      'url': 'entry/wxapp/Myvideonote',
      data: {sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
          var title = res.data.data.title;

          wx.setNavigationBarTitle({
            title: title[0] + wx.getStorageSync('companyinfo').name,
          })
          that.setData({
            title:title
          })


            if(res.data.data.notevideo)
              {
                that.data.notevideo = res.data.data.notevideo;

                that.setData({
                  notevideo: that.data.notevideo,
                  isvideo:'block',
                  src:that.data.notevideo.videourl,
                  imgs1:res.data.data.imagelist,
                  show:'block'
                })
                that.data.videourl = that.data.notevideo.videourl;
                that.data.imagelist = res.data.data.imagelist;
                
              }else{


              }
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });










  },









  chooseImg: function (e) {
    var that = this;
   
    wx.chooseImage({
       count: 3, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs1 = that.data.imgs1;
        imgs1=[];
        that.data.imagelist = [];
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs1.length >= 9) {
            that.setData({
              imgs1: imgs1
            });
            // return false;
          } else {
            imgs1.push(tempFilePaths[i]);
          }
        }
        that.setData({
          imgs1: imgs1,
          show:'block'
        });
        that.setData({
          picture1: []
        })
        var tempFilePaths = that.data.imgs1
      
       // var uploadurl = app.util.geturl({ 'url': 'entry/wxapp/upload' });
      
        for (var s = 0; s < tempFilePaths.length; s++) {

          console.log(tempFilePaths[s]);
             
          that.uploadimg(tempFilePaths[s]);
        }
      
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },

  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.uploadvideo(res.tempFilePath);
        that.setData({
          src: res.tempFilePath,
          isvideo:'block'
        })
      }
    })
  },

  uploadvideo: function (path) {
    console.log(path);
    var uploadurl = app.util.geturl({ 'url': 'entry/wxapp/uploadvideo' });
    //   var id = id;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });

    var that = this;
    wx.uploadFile({
      url: uploadurl,
      filePath: path,
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token')
      },
      success: function (res) {
        var getdata = JSON.parse(res.data);
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        } else {

        }
        var imgpath = getdata.data.path;

        console.log(imgpath);
        that.data.videourl = imgpath;
        




      },
      fail: function (e) {

        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },

  bindGetUserInfo: function (e) {
    var that = this;
    var result;

    app.util.getUserInfo(function (userInfo) {
      console.log(userInfo);
      that.data.isuser = true
      that.setData({
        userinfo: userInfo,
        isuser: that.data.isuser,
      })
      that.oldhouseinit();
    }, e.detail);
  },
  upload:function(e){
    var that = this;
    var e = e;
    that.doupload(e);
  }
  ,
  

  doupload:function(e){


    var that = this;
    var id = parseInt(e.currentTarget.dataset.id);
  
    switch (id) {
      case 1:
        if (that.data.true1 == false)
          return;
        break;
      case 2:
        if (that.data.true2 == false)
          return;
        break;
      case 3:
        if (that.data.true3 == false)
          return;
        break;
      case 4:
        if (that.data.true4 == false)
          return;
        break;
      case 5:
        if (that.data.true5 == false)
          return;
        break;
      case 6:
        if (that.data.true6 == false)
          return;
        break;
     

      default:


    }

    var imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, imgurl6
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
     
      
        switch (id) {
          case 1:
            imgurl1 = tempFilePaths;
            console.log(that.data.true1 );
            if (that.data.true1  == false)
              return;
            that.data.true1 = false;
            break;
          case 2:
            imgurl2 = tempFilePaths;
            that.data.true2 = false;
            break;
          case 3:
            imgurl3 = tempFilePaths;
            that.data.true3 = false;
            break;
          case 4:
            imgurl4 = tempFilePaths;
            that.data.true4 = false;
            break;
          case 5:
            imgurl5 = tempFilePaths;
            that.data.true5 = false;
            break;
          case 6:
            imgurl6 = tempFilePaths;
            that.data.true6 = false;
            break;

          default:


        }
 
        that.setData({
          imgurl1: imgurl1,
          imgurl2: imgurl2,
          imgurl3: imgurl3,
          imgurl4: imgurl4,
          imgurl5: imgurl5,
          imgurl6: imgurl6,
          true1:that.data.true1,
          true2: that.data.true2,
          true3: that.data.true3,
          true4: that.data.true4,
          true5: that.data.true5,
          true6: that.data.true6,

        })
   
        that.data.imagelist.push(tempFilePaths);
      
      //  upload(that, tempFilePaths);
        that.uploadimg(tempFilePaths , id);
      }
    })



 
  },





  savepubinfo:function(e){


    var that = this;
    var userinfo = wx.getStorageSync('userInfo');

   // console.log(that.data.imagelist);
   // console.log(that.data.videourl);
  //  console.log(imgstr);

    if(that.data.videourl == '')
    {
      wx.showModal({
        title: '提示',
        content: '请先上传视频',
        showCancel: false
      })
      return

    }
    
    if (that.data.imagelist.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先上传形象照片',
        showCancel: false
      })
      return

    }
    console.log(that.data.imagelist);
    var imgstr = that.data.imagelist.join('@');
   
    var content = e.detail.value.content;

     var videourl = that.data.videourl;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '请输入填写个人介绍',
        showCancel: false
      })
      return
    }
    var data = {
      sessionid: userinfo.sessionid,
      uid: userinfo.memberInfo.uid,
      videourl:videourl,
      imgstr:imgstr,
      content:content
                };
    app.util.request({
      'url': 'entry/wxapp/savenotevideo',
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

          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              console.log(res);
              wx.navigateTo({
                url: "/weixinmao_zp/pages/user/index"
              })
            }
          })
          /*
          wx.switchTab({
            url: '/weixinmao_house/pages/index/index',
          })
          */
        }



      }
    });





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
  
  },

  uploadimg:function (path) {
    var uploadurl = app.util.geturl({ 'url': 'entry/wxapp/upload' });
   // var id = id;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });
    
    var that = this;
    wx.uploadFile({
      url: uploadurl,
      filePath: path,
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token')
      },
      success: function (res) {
        var getdata = JSON.parse(res.data);

        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }else{
        
        }
        var imgpath = getdata.data.path;

        that.data.imagelist.push(imgpath);




    
      },
      fail: function (e) {

        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },
  checkboxChange: function (e) {
    var special = e.detail.value;
    this.data.special = special.join(',');
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChangehouse: function (e) {
    var houselabel = e.detail.value;
    this.data.houselabel = houselabel.join(',');
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  checkuser: function (options) {


    var that = this;
    var options = options;
    var userinfo = wx.getStorageSync('userInfo');
    console.log(userinfo);
    if (!userinfo) {
      app.util.getUserInfo(
        function (userinfo) {
          that.getlethousedetail();
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


