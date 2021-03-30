
// weixinmao_house/pages/pub/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    title: '',
    special: '',
    imagelist: [],
    uploadimagelist: ['', '', '', '', '', ''],
    true1: true,
    true2: true,
    true3: true,
    true4: true,
    true5: true,
    true6: true,
    arealist: [],
    areaidindex: 0,
    jobcate: [],
    jobcateid: 0,
    toplist: [],
    areaid: 0,
    toplistid: 0,
    sex: 1,
    speciallist: [
      { name: '交通补贴', checked: false },
      { name: '餐饮补贴', checked: false },
      { name: '包接送', checked: false },
      { name: '包盒饭', checked: false },
      { name: '包食宿', checked: false }],
    education: ['初中以上', '高中以上', '中技以上', '中专以上', '大专以上', '本科以上', '硕士以上', '博士以上', '博后'],
    educationindex: -1,
    educationname: '',
    express: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    expressindex: -1,
    expressname: '',
    worktype: ['时薪', '日结', '周结', '月结', '完工结'],
    worktypeindex: -1,
    worktypename: '',
    id: 0,
    vocationtitle: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.id = options.id;

    var companyid = wx.getStorageSync('companyid');

    if (companyid > 0) {
      that.oldhouseinit();


    } else {

      wx.redirectTo({
        // url: "/weixinmao_zp/pages/message/index"
      })
    }


  }, oldhouseinit: function (e) {
    var that = this;
    var id = that.data.id;
    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/Editvocationjobinit',
      data: { id: id,sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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

          var vocationtitle = res.data.data.vocationtitle;
          that.data.vocationtitle = vocationtitle;

          that.setData({
            vocationtitle: vocationtitle

          })

          wx.setNavigationBarTitle({
            title: vocationtitle[0]
          })
          if (res.data.data.isbind == 1) {

            that.data.arealist = res.data.data.arealist;
            var jobinfo = res.data.data.jobinfo;
            if (jobinfo) {
              that.data.jobtitle = jobinfo.jobtitle;

              that.data.jobcateindex = isHasElementTwo(res.data.data.jobcate, jobinfo.worktype);
              that.data.jobcateid = jobinfo.worktype;

              that.data.educationindex = isHasElementOne(that.data.education, jobinfo.education);
              that.data.educationname = jobinfo.education;
              that.data.expressindex = isHasElementOne(that.data.express, jobinfo.express);
              that.data.expressname = jobinfo.express;
              that.data.worktypeindex = isHasElementOne(that.data.worktype, jobinfo.jobtype);

              that.data.worktypename = jobinfo.jobtype;
              that.data.sex = jobinfo.sex;
              that.data.special = jobinfo.special;
            }

            /*
            for (var i = 0; i < that.data.speciallist.length; i++) {
              if (jobinfo.special.indexOf(that.data.speciallist[i].name) >= 0) {
                that.data.speciallist[i].checked = true;
              }
            }
            */
            that.setData({
              jobcate: res.data.data.jobcate,
              jobinfo: jobinfo,
              jobcateindex: that.data.jobcateindex,
             // special: jobinfo.special,
           //   speciallist: that.data.speciallist,
              educationindex: that.data.educationindex,
              expressindex: that.data.expressindex,
              worktypeindex: that.data.worktypeindex,
              dates: jobinfo.beginjobdate,
              dates2: jobinfo.endjobdate,
              datetime: jobinfo.beginjobtime,
              datetime2: jobinfo.endjobtime,


            })



            that.setData({
              jobcate: res.data.data.jobcate,

            })


          } else {

            wx.redirectTo({
              url: "/weixinmao_zp/pages/binduser/index"
            })

          }


        }
      }
    });




  }, bindDateChange: function (e) {
    this.data.date = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      dates: e.detail.value
    })
  }
  ,

  bindDateChange2: function (e) {
    this.data.date2 = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      dates2: e.detail.value
    })
  }
  ,

  bindTimeChange: function (e) {
    this.data.datetime = e.detail.value;

    console.log(e.detail.value);
    this.setData({
      datetime: e.detail.value
    })
  },

  bindTimeChange2: function (e) {
    this.data.datetime2 = e.detail.value;

    console.log(e.detail.value);
    this.setData({
      datetime2: e.detail.value
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

  savepubinfo: function (e) {

    var that = this;
    var userinfo = wx.getStorageSync('userInfo');
    var jobtitle = e.detail.value.jobtitle;
    var vocationtitle = that.data.vocationtitle;

    var bmoney = e.detail.value.bmoney;
    var gmoney = e.detail.value.gmoney;
    var moneydes = e.detail.value.moneydes;
    var moneyday = e.detail.value.moneyday;
    var money = e.detail.value.money;
    var yearmoney = e.detail.value.yearmoney;

    var food = e.detail.value.food;
    var hotel = e.detail.value.hotel;
    var travel = e.detail.value.travel;
    var workcloseth = e.detail.value.workcloseth;
    var travel = e.detail.value.travel;
    var workcloseth = e.detail.value.workcloseth;
    var age = e.detail.value.age;

    var education = e.detail.value.education;
    var height = e.detail.value.height;
    var health = e.detail.value.health;
    var workcontent = e.detail.value.workcontent;
    var worktime = e.detail.value.worktime;
    var workev = e.detail.value.workev;
    var jobmoney = e.detail.value.jobmoney;

    var agreedes = e.detail.value.agreedes;
    var sendmoney = e.detail.value.sendmoney;
    var safedes = e.detail.value.safedes;



    var education = that.data.educationname;
    var express = that.data.expressname;
    var jobtype = that.data.worktypename;
    var age = e.detail.value.age;
    var sex = that.data.sex;


    var address = e.detail.value.address;
    var sendmoney = e.detail.value.sendmoney;
    var safedes = e.detail.value.safedes;

    var companyid = wx.getStorageSync('companyid');


    if (jobtitle == "") {
      wx.showModal({
        title: '提示',
        content: vocationtitle[3],
        showCancel: false
      })
      return
    }

    if (bmoney == "") {
      wx.showModal({
        title: '提示',
        content: '请输入男补贴',
        showCancel: false
      })
      return
    }

    if (gmoney == "") {
      wx.showModal({
        title: '提示',
        content: '请输入女补贴',
        showCancel: false
      })
      return
    }

    if (moneydes == "") {
      wx.showModal({
        title: '提示',
        content: '请输入补贴要求',
        showCancel: false
      })
      return
    }
    if (moneyday == "") {
      wx.showModal({
        title: '提示',
        content: '请输入发薪日',
        showCancel: false
      })
      return
    }
    if (money == "") {
      wx.showModal({
        title: '提示',
        content: '请输入底薪',
        showCancel: false
      })
      return
    }



    if (yearmoney == "") {
      wx.showModal({
        title: '提示',
        content: '请输入年终奖',
        showCancel: false
      })
      return
    }

    if (food == "") {
      wx.showModal({
        title: '提示',
        content: '请输入伙食',
        showCancel: false
      })
      return
    }

    if (hotel == "") {
      wx.showModal({
        title: '提示',
        content: '请输入住宿',
        showCancel: false
      })
      return
    }

    if (travel == "") {
      wx.showModal({
        title: '提示',
        content: '请输入交通',
        showCancel: false
      })
      return
    }


    if (workcloseth == "") {
      wx.showModal({
        title: '提示',
        content: vocationtitle[6],
        showCancel: false
      })
      return
    }



    if (height == "") {
      wx.showModal({
        title: '提示',
        content: '请输入身高要求',
        showCancel: false
      })
      return
    }



    if (workcontent == "") {
      wx.showModal({
        title: '提示',
        content: vocationtitle[8],
        showCancel: false
      })
      return
    }


    if (worktime == "") {
      wx.showModal({
        title: '提示',
        content: vocationtitle[10],
        showCancel: false
      })
      return
    }


    if (workev == "") {
      wx.showModal({
        title: '提示',
        content: vocationtitle[12],
        showCancel: false
      })
      return
    }



    if (agreedes == "") {
      wx.showModal({
        title: '提示',
        content: '请输入合同说明',
        showCancel: false
      })
      return
    }


    if (sendmoney == "") {
      wx.showModal({
        title: '提示',
        content: '请输入工资发放',
        showCancel: false
      })
      return
    }


    if (safedes == "") {
      wx.showModal({
        title: '提示',
        content: '请输入保险说明',
        showCancel: false
      })
      return
    }




    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请输入集合地点',
        showCancel: false
      })
      return
    }





    var data = {
      sessionid: userinfo.sessionid,
      uid: userinfo.memberInfo.uid,
      companyid: companyid,
      jobtitle: jobtitle,
      bmoney: bmoney,
      gmoney: gmoney,
      moneydes: moneydes,
      moneyday: moneyday,
      money: money,
      yearmoney: yearmoney,
      food: food,
      hotel: hotel,
      travel: travel,
      workcloseth: workcloseth,
      age: age,
      education: education,
      height: height,
      health: health,
      workcontent: workcontent,
      worktime: worktime,
      workev: workev,
      jobmoney: jobmoney,
      agreedes: agreedes,
      sendmoney: sendmoney,
      safedes: safedes
    };
    app.util.request({
      'url': 'entry/wxapp/Saveeditvocationjob',
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
              wx.redirectTo({
                url: "/weixinmao_zp/pages/vocationjob/index"
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