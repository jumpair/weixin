
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
    jobcate:[],
    jobcateid:0,
    toplist: [],
    areaid:0,
    toplistid: 0,
    date:'',
    date2:'',
    datetime:'',
    datetime2:'',
    sex:1,
    speciallist: [
      { name: '交通补贴', checked: false },
      { name: '餐饮补贴', checked: false },
      { name: '包接送', checked: false },
      { name: '包盒饭', checked: false },
      { name: '包食宿', checked: false }],
    birthday: ['1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990'],
    birthdayindex:-1,
    birthdayname:'',
    education: ['初中以上', '高中以上', '中技以上', '中专以上', '大专以上', '本科以上', '硕士以上', '博士以上', '博后'],
    educationindex: -1,
    educationname: '',
    express: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    expressindex:-1,
    expressname:'',
    currentstatus: ['我目前已离职,可快速到岗', '我目前在职，但考虑换个新环境', '观望有好的机会再考虑', '目前暂无跳槽打算', '应届毕业生'],
    currentstatusindex: -1,
    currentstatusname: '',
    worktype: ['日结', '周结', '月结'],
    worktypeindex:-1,
    worktypename:'',
    money: ['1千~2千/月', '1千~2千/月', '2千~3千/月', '3千~4千/月', '4千~5千/月', '5千~1万/月', '1万以上/月'],
    moneyindex: -1,
    moneyname: '',
    id:0,
    parttitle: []
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.id =options.id;
  

    that.oldhouseinit();







  },oldhouseinit:function(e){
    var that = this;
    var id = that.data.id;
    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/Editpartjobinit',
      data: {id:id, sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
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
     

        

          var parttitle = res.data.data.parttitle;
          that.data.parttitle = parttitle;
          wx.setNavigationBarTitle({
            title: parttitle[0],
          })
          that.setData({
            parttitle: parttitle,

          })



  if(res.data.data.isbind ==1 )
      {
          that.data.arealist= res.data.data.arealist;
          var jobinfo = res.data.data.jobinfo;
          if (jobinfo)
            {
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
          for(var i=0 ; i<that.data.speciallist.length ;i++)
            {
              if (jobinfo.special.indexOf(that.data.speciallist[i].name) >=0)
                {
                that.data.speciallist[i].checked= true;   
                }
            }
          console.log(that.data.speciallist);
          that.setData({
            jobcate: res.data.data.jobcate,
            jobinfo: jobinfo,
            jobcateindex: that.data.jobcateindex,
            special: jobinfo.special,
            speciallist: that.data.speciallist,
            educationindex: that.data.educationindex,
            expressindex: that.data.expressindex,
            worktypeindex: that.data.worktypeindex,
            dates: jobinfo.beginjobdate,
            dates2: jobinfo.endjobdate,
            datetime: jobinfo.beginjobtime,
            datetime2: jobinfo.endjobtime,

         
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

  bindDateChange: function (e) {
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

savepubinfo:function(e){

   // this.data.uploadimagelist = [];
    var that = this;
    var parttitle = that.data.parttitle;
    var userinfo = wx.getStorageSync('userInfo');
    var jobtitle = e.detail.value.jobtitle;
    var jobcateid = this.data.jobcateid;
    var money = e.detail.value.money;
    var num = e.detail.value.num;
    var education = that.data.educationname;
    var express = that.data.expressname;
    var jobtype = that.data.worktypename;
    var age = e.detail.value.age;
    var sex = that.data.sex;
    var address = e.detail.value.address;
    var workaddress = e.detail.value.workaddress;
    var content = e.detail.value.content;
    var companyid = wx.getStorageSync('companyid');
    var beginjobdate = that.data.date;
    var endjobdate = that.data.date2;
    var beginjobtime = that.data.datetime;
    var endjobtime = that.data.datetime2;
    var id = that.data.id;
    if (jobtitle == "") {
      wx.showModal({
        title: '提示',
        content: parttitle[3],
        showCancel: false
      })
      return
    }

    if (jobcateid == 0) {
      wx.showModal({
        title: '提示',
        content: parttitle[5],
        showCancel: false
      })
      return
    }

    if (money == "") {
      wx.showModal({
        title: '提示',
        content: parttitle[7],
        showCancel: false
      })
      return
    }
    if (num == "") {
      wx.showModal({
        title: '提示',
        content: parttitle[9],
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
        content: parttitle[11],
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

    if (workaddress == "") {
      wx.showModal({
        title: '提示',
        content: parttitle[14],
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


    if (content == "") {
      wx.showModal({
        title: '提示',
        content: parttitle[17],
        showCancel: false
      })
      return
    }

  


    
    var data = {
                sessionid: userinfo.sessionid,
                uid: userinfo.memberInfo.uid,
                id:id,
                jobtitle: jobtitle,
                jobcateid: jobcateid,
                money: money,
                num: num,
                education: education,
                express: express,
                jobtype: jobtype,
                age: age,
                sex: sex,
                special: that.data.special,
                workaddress: workaddress,
                address: address,
                content: content,
                beginjobdate: beginjobdate,
                endjobdate: endjobdate,
                beginjobtime: beginjobtime,
                endjobtime: endjobtime
                            };
    app.util.request({
      'url': 'entry/wxapp/Savecompanypartjob',
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