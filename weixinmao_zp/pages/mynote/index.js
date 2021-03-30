
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

    title: '',
    special: '',
    imagelist: [],
    uploadimagelist: ['', '', '', '', '', ''],
    imgurl1 :'',
    true1: true,
    true2: true,
    true3: true,
    true4: true,
    true5: true,
    true6: true,
    arealist: [],
    areaindexid: -1,
    areaid: 0,

    jobcate: [],
    jobcateid: 0,
    
    current: [],
    currentid: 0,
    currentindex:-1,

    toplist: [],
   
    toplistid: 0,
    sex: 1,
    speciallist: [{ name: '五险一金', checked: false },
    { name: '补充医疗保险', checked: false },
    { name: '员工旅游', checked: false },
    { name: '交通补贴', checked: false },
    { name: '餐饮补贴', checked: false },
    { name: '出国机会', checked: false },
    { name: '年终奖金', checked: false },
    { name: '定期体检', checked: false }],
    birthday: ['1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969','1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000','2001','2002'],
    birthdayindex: -1,
    birthdayname: '',
    education: ['初中', '高中', '中技', '中专', '大专', '本科', '硕士', '博士', '博后'],
    educationindex: -1,
    educationname: '',
    express: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    expressindex: -1,
    expressname: '',
    currentstatus: ['我目前已离职,可快速到岗', '我目前在职，但考虑换个新环境', '观望有好的机会再考虑', '目前暂无跳槽打算', '应届毕业生'],
    currentstatusindex: -1,
    currentstatusname: '',
    worktype: ['全职', '兼职', '实习'],
    worktypeindex: -1,
    worktypename: '',
    money: [ '1千~2千/月', '2千~3千/月', '3千~4千/月', '4千~5千/月', '5千~1万/月', '1万以上/月'],
    moneyindex: -1,
    moneyname: '',
    id: 0,
    status:0,
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
      'url': 'entry/wxapp/Getpubinit',
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
            title: title[0] + wx.getStorageSync('companyinfo').name,
          })
          that.setData({
            title:title
          })
          if (res.data.data.isbind == 1) {


            var cityinfo = res.data.data.cityinfo;
            wx.setStorageSync('cityinfo', cityinfo);

            that.data.arealist = res.data.data.arealist;
            var noteinfo = res.data.data.noteinfo;
            console.log(noteinfo);
            if (noteinfo) {
              that.data.jobtitle = noteinfo.jobtitle;

              that.data.imgurl1 = noteinfo.avatarUrl;
              if(that.data.imgurl1!='')
              {
              that.data.true1 = false;

             // that.data.uploadimagelist_str = that.data.imgurl1;


                that.data.uploadimagelist.unshift(that.data.imgurl1);
              }
              that.data.birthdayindex = isHasElementOne(that.data.birthday, noteinfo.birthday);
              that.data.birthdayname = noteinfo.birthday;
              

              that.data.currentstatusindex = isHasElementOne(that.data.currentstatus, noteinfo.currentstatus);
              that.data.currentstatusname = noteinfo.currentstatus;

      
              that.data.jobcateindex = isHasElementTwo(res.data.data.jobcate, noteinfo.jobcateid);
              that.data.jobcateid = noteinfo.jobcateid;


              that.data.currentindex = isHasElementTwo(res.data.data.current, noteinfo.cateid);
              that.data.currentid = noteinfo.cateid;

              that.data.areaindexid = isHasElementTwo(res.data.data.arealist, noteinfo.areaid);

              that.data.areaid = noteinfo.areaid;
            
              that.data.educationindex = isHasElementOne(that.data.education, noteinfo.education);
              that.data.educationname = noteinfo.education;
              that.data.expressindex = isHasElementOne(that.data.express, noteinfo.express);
              that.data.expressname = noteinfo.express;

              that.data.worktypeindex = isHasElementOne(that.data.worktype, noteinfo.worktype);
              that.data.worktypename = noteinfo.worktype;
        

              that.data.moneyindex = isHasElementOne(that.data.money, noteinfo.money);
              that.data.moneyname = noteinfo.money;

              that.data.sex = noteinfo.sex;
              that.data.special = noteinfo.special;



              const query = wx.createSelectorQuery();
              
          
              query.select('#editor').context(function (res) {



              



                  res.context.setContents({

                    html: noteinfo.content

                  })
                  

                that.editorCtx = res.context
                wx.pageScrollTo({
                  scrollTop: 0,
                  success: () => {
                    that.editorCtx.scrollIntoView()
                  }
                })


                }).exec();

        
            }
         
            that.setData({
              jobcate: res.data.data.jobcate,
              arealist: res.data.data.arealist,
              current:res.data.data.current,
              imgurl1: that.data.imgurl1,
              noteinfo: noteinfo,
              birthdayindex: that.data.birthdayindex,
              currentstatusindex: that.data.currentstatusindex,
              jobcateindex: that.data.jobcateindex,
              currentindex: that.data.currentindex,
              educationindex: that.data.educationindex,
              expressindex: that.data.expressindex,
              worktypeindex: that.data.worktypeindex,
              moneyindex: that.data.moneyindex,
              areaindexid: that.data.areaindexid,
              true1:that.data.true1 


            })



          } else {

         

          }


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
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
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
  bindAreaChange: function (e) {
    var arealist = this.data.arealist;

    if (arealist) {
      this.data.areaid = arealist[e.detail.value].id;
      this.data.areaindexid = e.detail.value;
    }
    this.setData({
      arealist: arealist,
      areaindexid: e.detail.value
    })
  }
  ,
  bindJobcateChange: function (e) {
    var jobcate = this.data.jobcate;

    if (jobcate) {
      this.data.jobcateindex = e.detail.value;
      this.data.jobcateid = jobcate[e.detail.value].id;
    }
    this.setData({
      jobcate: jobcate,
      jobcateindex: e.detail.value
    })
  }
  ,

  bindCurrentChange: function (e) {
    var current = this.data.current;

    if (current) {
      this.data.currentindex = e.detail.value;
      this.data.currentid = current[e.detail.value].id;
    }
    this.setData({
      current: current,
      currentindex: e.detail.value
    })
  }
  ,

  bindExpressChange: function (e) {
    var express = this.data.express;

    if (express) {
      this.data.expressindex = e.detail.value;
      this.data.expressname = express[e.detail.value];
    }
    console.log(this.data.expressname);
    this.setData({
      express: express,
      expressindex: e.detail.value
    })
  }
  ,
  bindBirthdayChange: function (e) {
    var birthday = this.data.birthday;

    if (birthday) {
      this.data.birthdayindex = e.detail.value;
      this.data.birthdayname = birthday[e.detail.value];
    }
    this.setData({
      birthday: birthday,
      birthdayindex: e.detail.value
    })
  }
  ,

  bindEducationChange: function (e) {
    var education = this.data.education;

    if (education) {
      this.data.educationindex = e.detail.value;
      this.data.educationname = education[e.detail.value];
    }
    console.log(this.data.educationname);
    this.setData({
      education: education,
      educationindex: e.detail.value
    })
  }
  ,
  bindWorktypeChange: function (e) {
    var worktype = this.data.worktype;

    if (worktype) {
      this.data.worktypeindex = e.detail.value;
      this.data.worktypename = worktype[e.detail.value];
    }
    console.log(this.data.worktypename);
    this.setData({
      worktype: worktype,
      worktypeindex: e.detail.value
    })
  },
  bindMoneyChange: function (e) {
    var money = this.data.money;

    if (money) {
      this.data.moneyindex = e.detail.value;
      this.data.moneyname = money[e.detail.value];
    }
    console.log(this.data.moneyname);
    this.setData({
      money: money,
      moneyindex: e.detail.value
    })
  }
  ,
  bindCurrentstatusChange: function (e) {
    var currentstatus = this.data.currentstatus;

    if (currentstatus) {
      this.data.currentstatusindex = e.detail.value;
      this.data.currentstatusname = currentstatus[e.detail.value];
    }
    console.log(this.data.currentstatusname);
    this.setData({
      currentstatus: currentstatus,
      currentstatusindex: e.detail.value
    })
  }
  ,
  bindToplistChange: function (e) {
    var toplist = this.data.toplist;

    if (toplist) {
      this.data.toplistid = toplist[e.detail.value].id;
    }
    this.setData({
      toplist: toplist,
      toplistidindex: e.detail.value
    })
  }
  ,

  savepubinfo: function (e) {

    // this.data.uploadimagelist = [];
    var that = this;

    var content = '';

    that.editorCtx.getContents({

      success: (res) => {


        content = res.html;



    var form_id = e.detail.formId;
    var title = that.data.title;

    var userinfo = wx.getStorageSync('userInfo');
    var jobtitle = e.detail.value.jobtitle;
    var name = e.detail.value.name;
    var sex = that.data.sex;
    var birthday = this.data.birthdayname;
    var education = that.data.educationname;
    var express = that.data.expressname;
    var address = e.detail.value.address;
    var email = e.detail.value.email;
    var tel = e.detail.value.tel;
    var identity = e.detail.value.identity;
    var currentstatus = that.data.currentstatusname;
    var worktype = that.data.worktypename;
    var jobcateid = this.data.jobcateid;
    var money = this.data.moneyname;
    var areaid = this.data.areaid;
        var currentid = that.data.currentid;
   // var content = e.detail.value.content;
    var tid = 0 ;
    var shareid = 0 ;
    var status  = that.data.status;
    if (wx.getStorageSync('tid'))
      {
      tid = wx.getStorageSync('tid');
      }
    
    if (wx.getStorageSync('shareid')) {
      shareid = wx.getStorageSync('shareid');
    }

   

    if (that.data.isagree == 0) {
      wx.showModal({
        title: '提示',
        content: '请先同意发布协议',
        showCancel: false,
        success: function (res) {


        }
      })
      return

    }


  
    if (jobtitle == "") {
      wx.showModal({
        title: '提示',
        content: title[2],
        showCancel: false
      })
      return
    }

    if (name == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false
      })
      return
    }

    if (birthday == "") {
      wx.showModal({
        title: '提示',
        content: '请选择出生年份',
        showCancel: false
      })
      return
    }

    if (education == "") {
      wx.showModal({
        title: '提示',
        content: '请选择最高学历',
        showCancel: false
      })
      return
    }

  
    if (express == "") {
      wx.showModal({
        title: '提示',
        content: title[4],
        showCancel: false
      })
      return
    }

    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写现居住地',
        showCancel: false
      })
      return
    }
    
    if (email == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮箱',
        showCancel: false
      })
      return
    } else {

      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!reg.test(email)) {

        wx.showModal({
          title: '提示',
          content: '邮箱格式错误,请重新填写',
          showCancel: false
        })
        return

      }



    }

    if (tel == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号',
        showCancel: false
      })
      return
    } else {


      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel))) {

        wx.showModal({
          title: '提示',
          content: '手机号有误,请重新填写',
          showCancel: false
        })
        return
      }
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

        if (currentid == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择目前状态',
        showCancel: false
      })
      return
    }
    
    if (worktype == "") {
      wx.showModal({
        title: '提示',
        content: title[6],
        showCancel: false
      })
      return
    }
    

    if (jobcateid == 0) {
      wx.showModal({
        title: '提示',
        content: title[8],
        showCancel: false
      })
      return
    }
    if (money == "") {
      wx.showModal({
        title: '提示',
        content: title[10],
        showCancel: false
      })
      return
    }
   
    if (areaid == 0) {
      wx.showModal({
        title: '提示',
        content:title[12],
        showCancel: false
      })
      return
    }

    if (content == "") {
      wx.showModal({
        title: '提示',
        content: title[14],
        showCancel: false
      })
      return
    }
    var uploadimagelist = this.data.uploadimagelist;

        console.log(uploadimagelist);
    if (uploadimagelist.length < 2) {
      wx.showModal({
        title: '提示',
        content: '上传图片不少于2张',
        showCancel: false
      })
      return

    }
    var uploadimagelist_str = uploadimagelist[0];

    var cityinfo = wx.getStorageSync('cityinfo');
    var data = {
      cityid: cityinfo.id,
      sessionid: userinfo.sessionid,
      uid: userinfo.memberInfo.uid,
      jobtitle: jobtitle,
      name:name,
      sex:sex,
      tel:tel,
      birthday:birthday,
      education: education,
      express: express,
      address:address,
      email:email,
      tel:tel,
      identity:identity,
      //currentstatus: currentstatus,
      currentid: currentid,
      worktype:worktype,
      jobcateid: jobcateid,
      money: money,
      areaid:areaid,
      content: content,
      uploadimagelist_str: uploadimagelist_str,
      tid:tid,
      status:status,
      form_id: form_id
    };
    app.util.request({
      'url': 'entry/wxapp/Savenote',
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