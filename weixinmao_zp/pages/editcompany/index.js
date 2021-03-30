
// weixinmao_house/pages/pub/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    title:'',
    special:'',
    imagelist:[],
    uploadimagelist:['','','','','',''],
    true1: true,
    true2: true,
    true3: true,
    true4: true,
    true5: true,
    true6: true,
    arealist:[],
    areaidindex:0,
    areaid:0
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.id =options.id;
    wx.setNavigationBarTitle({
      title: '企业信息编辑-' + wx.getStorageSync('companyinfo').name,
    })
    var companyid = wx.getStorageSync('companyid');

    if (companyid > 0) {

      that.oldhouseinit();
    }else{

      wx.redirectTo({
        url: "/weixinmao_zp/pages/message/index"
      })
    }





  },oldhouseinit:function(e){
    var that = this;
    var companyid = wx.getStorageSync('companyid');
    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/Editcompanyinit',
      data: { companyid: companyid },
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
          that.data.arealist= res.data.data.arealist;
          var companyinfo = res.data.data.companyinfo;
          if(companyinfo.thumb)
            {

           that.data.true1 = false;
            }


          that.data.areaidindex = isHasElementTwo(res.data.data.arealist, companyinfo.areaid);
          console.log(that.data.areaidindex);
          that.data.areaid = companyinfo.areaid;
          
          // console.log(companyinfo.thumb);return;
          that.setData({
            companyinfo: companyinfo,
            areaidindex: that.data.areaidindex ,
            imgurl1:companyinfo.thumb,
            true1:that.data.true1,
            arealist: that.data.arealist
         
          })


  


      }
      }
    });




  },
  checkboxChange: function (e) {
    var special = e.detail.value;
    this.data.special = special.join(',');
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  bindAreaChange: function (e) {
    var arealist = this.data.arealist;

    if (arealist) {
      this.data.areaid = arealist[e.detail.value].id;
      this.data.areaidindex = e.detail.value;
    }
    this.setData({
      arealist: arealist,
      areaidindex: e.detail.value
    })
  }
  ,




savepubinfo:function(e){

   // this.data.uploadimagelist = [];
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var companyid = wx.getStorageSync('companyid');
    var companyname = e.detail.value.companyname;
    var companycate = e.detail.value.companycate;
    var companytype = e.detail.value.companytype;
    var companyworker = e.detail.value.companyworker;
    var mastername = e.detail.value.mastername;
    var tel = e.detail.value.tel;
    var address = e.detail.value.address;
    var content = e.detail.value.content;
    var id = that.data.id;
    var areaid = that.data.areaid;
    if (areaid == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择区域',
        showCancel: false
      })
      return
    }
    if (companyname == "") {
      wx.showModal({
        title: '提示',
        content: '请输入企业名称',
        showCancel: false
      })
      return
    }

    if (companycate == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入企业行业',
        showCancel: false
      })
      return
    }

    if (companytype == "") {
      wx.showModal({
        title: '提示',
        content: '请输入企业性质',
        showCancel: false
      })
      return
    }

    if (companyworker == "") {
      wx.showModal({
        title: '提示',
        content: '请输入人员规模',
        showCancel: false
      })
      return
    }
  
    if (mastername == "") {
    wx.showModal({
      title: '提示',
      content: '请输入负责人',
      showCancel: false
    })
    return
  }
    if (tel == "") {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请输入地址',
        showCancel: false
      })
      return
    }
  
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '请输入公司介绍',
        showCancel: false
      })
      return
    }
  
    var uploadimagelist = this.data.uploadimagelist;

    

    
    var data = {
                sessionid: userinfo.sessionid,
                uid: userinfo.memberInfo.uid,
                areaid:areaid,
                companyid: companyid,
                companyname: companyname,
                companycate: companycate, 
                companytype: companytype,
                companyworker: companyworker,
                mastername: mastername,
                tel: tel,
                address: address,
                content: content,
                logo: uploadimagelist[0]
                            };
    app.util.request({
      'url': 'entry/wxapp/Savecompanyinfo',
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
                  url: "/weixinmao_house/pages/mysalepub/index?id=1"
                })
              }
            })

          }

        










      





      }
    });





  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  radioChange: function (e) {
    this.data.sex = e.detail.value;
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

  upload: function (e) {
    var that = this;
    var e = e;
    that.doupload(e);
  },
  doupload: function (e) {


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
            console.log(that.data.true1);
            if (that.data.true1 == false)
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
          true1: that.data.true1,
          true2: that.data.true2,
          true3: that.data.true3,
          true4: that.data.true4,
          true5: that.data.true5,
          true6: that.data.true6,

        })

        that.data.imagelist.push(tempFilePaths);

        //  upload(that, tempFilePaths);
        that.uploadimg(tempFilePaths, id);
      }
    })




  },

  uploadimg: function (path, id) {
    var uploadurl = app.util.geturl({ 'url': 'entry/wxapp/upload' });
    var id = id;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });

    var that = this;
    wx.uploadFile({
      url: uploadurl,
      filePath: path[0],
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


        //  var uploadimagelist = this.data.uploadimagelist;

        for (var i = 0; i < that.data.uploadimagelist.length; i++) {
          var j = i + 1;
          if (j == id) {

            that.data.uploadimagelist[i] = imgpath;
          }


        }




        //that.data.uploadimagelist.push(imgpath);
        // console.log(that.data.uploadimagelist);

        /*
        var data = res.data
        page.setData({  //上传成功修改显示头像
          src: path[0]
        })
        */
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

  delupload: function (e) {

    var that = this;
    var id = parseInt(e.currentTarget.dataset.id);

    switch (id) {
      case 1:
        that.setData({ imgurl1: '', true1: true })

        break;
      case 2:
        that.setData({ imgurl2: '', true2: true })

        break;
      case 3:
        that.setData({ imgurl3: '', true3: true })

        break;
      case 4:
        that.setData({ imgurl4: '', true4: true })

        break;
      case 5:
        that.setData({ imgurl5: '', true5: true })

        break;
      case 6:
        that.setData({ imgurl6: '', true6: true })

        break;


      default:


    }

    for (var i = 0; i < this.data.uploadimagelist.length; i++) {
      var j = i + 1;
      if (j == id) {

        this.data.uploadimagelist[i] = '';
      }


    }
    console.log(this.data.uploadimagelist);


  },
  checkboxChange: function (e) {
    var special = e.detail.value;
    this.data.special = special.join(',');
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


function isHasElementOne(arr, value) {
  for (var i = 0, vlen = arr.length; i < vlen; i++) {
    if (arr[i] == value) {
      return i;
    }
  } 
  return -1;
} 

function isHasElementTwo(arr, value) {
  for (var i = 0, vlen = arr.length; i < vlen; i++) {
    if (arr[i]['id'] == value) {
      return i;
    }
  }
  return -1;
} 