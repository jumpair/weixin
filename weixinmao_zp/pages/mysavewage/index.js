
// weixinmao_house/pages/pub/index.js
// 引入SDK核心类
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var config = require('../../resource/js/config.js');

var markersData = [];
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {


    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,

    name: '',
    identity: '',
    mobile: '',
    wage_year: '',
    wage_month: '',
    company :'',
    money :'',
    city: '',

    title:[],
    isagree: 0
    
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   // that.data.id = options.id;

    const platform = wx.getSystemInfoSync().platform;
    const isIOS = platform === 'ios';
    this.setData({ isIOS });
    this.updatePosition(0);
    let keyboardHeight = 0;
    
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    });




    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);
    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = true;
        that.initpage();
        that.setData({
          userinfo: appuser
        });
      } else {
        that.data.isuser = false;

      }
    } else {

      that.data.isuser = false;
    }

    that.setData({
      isuser: that.data.isuser
    });






  },
  initpage:function(){
      var that = this;
    var cityinfo = wx.getStorageSync('cityinfo');
    if (cityinfo) {

      wx.setStorageSync('city', cityinfo.name);
      that.oldhouseinit();

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
              //  console.log(city);
              wx.setStorageSync('city', city);

              that.oldhouseinit();

            }
          })

        },
        fail: function () {
          // fail

          that.oldhouseinit();
        },
        complete: function () {
          // complete
        }
      })

    }      


  }
  , oldhouseinit: function (e) {
    var that = this;

    var userinfo = wx.getStorageSync('userInfo');
    var city = wx.getStorageSync('city');
    app.util.request({
      'url': 'entry/wxapp/Mysavewage',
      data: { city: city,sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
          that.data.current = res.data.data.current;
          that.data.title = title;
          wx.setNavigationBarTitle({
            title: title[0] ,
          })

          that.setData({
            city:city,
            Taxdeclare: res.data.data.Taxdeclare,
            title:res.data.data.title
          })


        }
      }
    });




  },


  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this;
    console.log('fffffff');
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail

    console.log(formats);
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },


  doagree: function (e) {
    var isagree = e.detail.value;



    if (isagree.length > 0) {
      this.data.isagree = isagree[0];
    } else {

      this.data.isagree = 0;
    }

    //


    console.log(this.data.isagree);

  },
  checkboxChange: function (e) {
    var special = e.detail.value;
    this.data.special = special.join(',');
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  bindidentityChange: function (e) {
    var identity = this.data.identity;

    if (identity) {
      this.data.identityindex = e.detail.value;
      this.data.identityid = identity[e.detail.value].id;
    }
    this.setData({
      identity: identity,
      identityindex: e.detail.value
    })
  }
  ,
  bindmobileChange: function (e) {
    var mobile = this.data.mobile;

    if (mobile) {
      this.data.mobileindex = e.detail.value;
      this.data.mobileid = mobile[e.detail.value].id;
    }
    this.setData({
      mobile: mobile,
      mobileindex: e.detail.value
    })
  }
  ,
  bindwage_yearChange: function (e) {
    var wage_year = this.data.wage_year;

    if (wage_year) {
      this.data.wage_yearindex = e.detail.value;
      this.data.wage_yearid = wage_year[e.detail.value].id;
    }
    this.setData({
      wage_year: wage_year,
      wage_yearindex: e.detail.value
    })
  }
  ,
   bindwage_monthChange: function (e) {
    var wage_month = this.data.wage_month;

    if (wage_month) {
      this.data.wage_monthindex = e.detail.value;
      this.data.wage_monthid = wage_month[e.detail.value].id;
    }
    this.setData({
      wage_month: wage_month,
      wage_monthindex: e.detail.value
    })
  }
  ,
  bindcompanyChange: function (e) {
    var company = this.data.company;

    if (company) {
      this.data.companyindex = e.detail.value;
      this.data.companyid = company[e.detail.value].id;
    }
    this.setData({
      company: company,
      companyindex: e.detail.value
    })
  }
  ,

   bindmoneyChange: function (e) {
    var money = this.data.money;

    if (money) {
      this.data.moneyindex = e.detail.value;
      this.data.moneyid = money[e.detail.value].id;
    }
    this.setData({
      money: wage_month,
      moneyindex: e.detail.value
    })
  }
,

  savepubinfo: function (e) {

    // this.data.uploadimagelist = [];
    var that = this;

      var userinfo = wx.getStorageSync('userInfo');
      var name = e.detail.value.name;
      var identity = e.detail.value.identity;
      var mobile = e.detail.value.mobile;
      var wage_year = e.detail.value.wage_year;
      var wage_month = e.detail.value.wage_month;
      var company = e.detail.value.company;
      var money = e.detail.value.money;
      var wage_pay = e.detail.value.wage_pay;


    if (name == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false
      })
      return
    }

    if (wage_year == "") {
      wx.showModal({
        title: '提示',
        content: '请输入工资年份',
        showCancel: false
      })
      return
    }
    if (wage_month == "") {
      wx.showModal({
        title: '提示',
        content: '请输入工资月份',
        showCancel: false
      })
      return
    }


    if (company == "") {
      wx.showModal({
        title: '提示',
        content: '请输入公司名称',
        showCancel: false
      })
      return
    }
        if (money == "") {
      wx.showModal({
        title: '提示',
        content: '请输入金额',
        showCancel: false
      })
      return
    }
    if (wage_pay == "") {
      wx.showModal({
        title: '提示',
        content: '请输入发薪日期',
        showCancel: false
      })
      return
    }

    if (identity == "") {
      wx.showModal({
        title: '提示',
        content: '请填写身份证号',
        showCancel: false
      })
      return
    } else {

      var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
      if (!reg.test(identity)) {

        wx.showModal({
          title: '提示',
          content: '身份证号格式错误,请重新填写',
          showCancel: false
        })
        return

      }



    }

    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号',
        showCancel: false
      })
      return
    } else {


      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile))) {

        wx.showModal({
          title: '提示',
          content: '手机号有误,请重新填写',
          showCancel: false
        })
        return
      }
    }


    var data = {
      uid: userinfo.memberInfo.uid,
      name:name,
      identity:identity,
      mobile:mobile,
      wage_year:wage_year,
      wage_month:wage_month,
      company: company,
      money: money,
      wage_pay: wage_pay
    };
    app.util.request({
      'url': 'entry/wxapp/infowage',
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
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              console.log(res);
              wx.navigateBack({ changed: true });
            }
          })

        }



      }
    });

  },

  goHousexy: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/housexy/index?id=1"
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  radioChange: function (e) {
    this.data.sex = e.detail.value;
  },

  radioStatusChange: function (e) {
    this.data.status = e.detail.value;
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

  bindGetUserInfo: function (e) {
    var that = this;
    var result;

    app.util.getUserInfo(function (userInfo) {
      console.log(userInfo);
      that.data.isuser = true

      that.oldhouseinit();
      that.setData({
        userinfo: userInfo,
        isuser: that.data.isuser,
      })

    }, e.detail);


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
  upload: function (e) {
    var that = this;
    var e = e;

      console.log('fffffffffff');
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
         // that.getlethousedetail();
          that.oldhouseinit();
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