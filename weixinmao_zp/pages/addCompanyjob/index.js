
// weixinmao_house/pages/pub/index.js
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
    jobcate:[],
    jobcateid:0,
    toplist: [],
    areaid:0,
    toplistid: -1,
    sex:1,
    speciallist: [{ name: '五险', checked: false }, 
      {name:'五险一金',checked:false}, 
      { name: '补充医疗保险', checked: false }, 
      { name: '员工旅游', checked: false }, 
      { name: '交通补贴', checked: false }, 
      { name: '餐饮补贴', checked: false }, 
      { name: '出国机会', checked: false }, 
      { name: '年终奖金', checked: false }, 
      { name: '定期体检', checked: false },
      { name: '节日福利', checked: false },
      { name: '双休', checked: false },
      { name: '调休', checked: false },
      { name: '年假', checked: false },
      { name: '加班补贴', checked: false },
      { name: '职位晋升', checked: false },
      { name: '包食宿', checked: false }],
    education: ['不限','初中以上', '高中以上', '中技以上', '中专以上', '大专以上', '本科以上', '硕士以上', '博士以上', '博后'],
    educationindex: -1,
    educationname: '',
    express: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    expressindex:-1,
    expressname:'',
    worktype: ['全职', '兼职', '实习'],
    worktypeindex: -1,
    worktypename: '',
    id:0,
    videourl:'',
    title:[]
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.id =options.id;
 
    var companyid = wx.getStorageSync('companyid');

    if (companyid > 0) {

      that.oldhouseinit();


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



    }else{

      wx.redirectTo({
        url: "/weixinmao_zp/pages/message/index"
      })
    }


  },oldhouseinit:function(e){
    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var companyid = wx.getStorageSync('companyid');
    app.util.request({
      'url': 'entry/wxapp/Addjobinit',
      data: { companyid: companyid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
          that.setData({
          isvideo: 'none'
          })
          var title = res.data.data.title;
          that.data.title = title;
          wx.setNavigationBarTitle({
            title: title[0],
          })
          that.setData({title:title});
        
  if(res.data.data.isbind ==1 )
      {
          that.data.toplist = res.data.data.payjoblist;

          that.setData({
            jobcate: res.data.data.jobcate,
            payjoblist: res.data.data.payjoblist,
            ispay:res.data.data.ispay
          })

        
        }else{

    wx.redirectTo({
            url: "/weixinmao_zp/pages/binduser/index"
          })

        }


      }
      }
    });




  },

  onContentChange(e) {
    that.setData({
      content: e.detail,
    })
    console.log(e.detail);
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
          isvideo: 'block'
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
        console.log(res);
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
  },
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
  }
  ,

  savepubinfo:function(e){
     
    
    var that = this;
    var content = '';
    that.editorCtx.getContents({

      success: (res) => {

        console.log(res.html);

        content = res.html;


    var userinfo = wx.getStorageSync('userInfo');
    var jobtitle = e.detail.value.jobtitle;
    var jobcateid = this.data.jobcateid;
    var vprice = e.detail.value.vprice;
    var noteprice = e.detail.value.noteprice;
    var money = e.detail.value.money;
    var num = e.detail.value.num;
    var education =  that.data.educationname;
    var express = that.data.expressname;
    var jobtype = that.data.worktypename;
    var age = e.detail.value.age;
    var sex = that.data.sex;
    //var content = e.detail.value.content;
    var companyid = wx.getStorageSync('companyid');
    var toplistid = that.data.toplistid;
    var title = that.data.title;
    if (jobtitle == "") {
      wx.showModal({
        title: '提示',
        content: title[3],
        showCancel: false
      })
      return
    }

    if (jobcateid == 0) {
      wx.showModal({
        title: '提示',
        content: title[5],
        showCancel: false
      })
      return
    }

    if (money == "") {
      wx.showModal({
        title: '提示',
        content: '请输入薪资待遇',
        showCancel: false
      })
      return
    }
    if (num == "") {
      wx.showModal({
        title: '提示',
        content: title[9],
        showCancel: false
      })
      return
    }
    if (education == "") {
      wx.showModal({
        title: '提示',
        content: '请选择学历要求',
        showCancel: false
      })
      return
    }
    if (express == "") {
      wx.showModal({
        title: '提示',
        content: title[11],
        showCancel: false
      })
      return
    }
    if (jobtype == "") {
      wx.showModal({
        title: '提示',
        content: title[13],
        showCancel: false
      })
      return
    }
    if (age == "") {
      wx.showModal({
        title: '提示',
        content: '请输入年龄要求',
        showCancel: false
      })
      return
    }  
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: title[15],
        showCancel: false
      })
      return
    }
/*
    if (that.data.toplistid == -1)
    {

      wx.showModal({
        title: '提示',
        content: '选择上线天数',
        showCancel: false
      })
      return
    }
    */
    
    var data = {
                sessionid: userinfo.sessionid,
                uid: userinfo.memberInfo.uid,
                companyid: companyid,
                jobtitle:jobtitle,
                jobcateid: jobcateid, 
                vprice:vprice,
                noteprice:noteprice,
                money: money,
                num: num,
                education: education,
                express:express,
                jobtype:jobtype,
                age:age,
                sex: sex,
                special: that.data.special,
                content:content,
                toplistid :toplistid,
                videourl:that.data.videourl
                
                            };
    app.util.request({
      'url': 'entry/wxapp/Addcompanyjob',
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
            if (res.data.data.ispay ==0)
              {
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000,
                    success: function (res) {
                      console.log(res);
                      wx.redirectTo({
                        url: "/weixinmao_zp/pages/companyjob/index"
                      })
                    }
                  })

              }else{

                    


              if (that.data.toplistid > 0) {
                var toplistid = that.data.toplistid;
                var pid = res.data.data.pid;
                var userinfo = wx.getStorageSync('userInfo');
                var ordertype = 'paypubjob';
                wx.showModal({
                  title: '确认支付',
                  content: '确认支付？',
                  success: function (res) {
                    if (res.confirm) {
                      app.util.request({ 
                        'url': 'entry/wxapp/pay',
                        data: { toplistid: toplistid, ordertype: ordertype, pid: pid, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
                        success: function (res) {
                          console.log(res);
                          if (res.data && res.data.data) {
                            wx.requestPayment({
                              'timeStamp': res.data.data.timeStamp,
                              'nonceStr': res.data.data.nonceStr,
                              'package': res.data.data.package,
                              'signType': 'MD5',
                              'paySign': res.data.data.paySign,
                              'success': function (res) {
                                //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                                console.log(res);
                                wx.showToast({
                                  title: '提交成功',
                                  icon: 'success',
                                  duration: 2000,
                                  success: function (res) {
                                    console.log(res);
                                    wx.redirectTo({
                                      url: "/weixinmao_zp/pages/companyjob/index"
                                    })
                                  }
                                })

                              },
                              'fail': function (res) {
                                //支付失败后，
                              }
                            })
                          }

                        },
                        fail: function (res) {
                          console.log(res);
                        }

                      })

                    }
                  }

                })






























              }

          }

        



          }}
    });


      
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

  uploadimg:function (path,id) {
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
        }else{
        
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