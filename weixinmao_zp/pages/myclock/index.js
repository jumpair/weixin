// weixinmao_house/pages/pub/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        companyname: '',
        clocknum: '',
        worktime: '',
        offworktime: '',
        lng: '',
        lat: '',
        range: '',
        isuser: true,
        isagree: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;


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


    },

    oldhouseinit: function(e) {
        var that = this;
        var userinfo = wx.getStorageSync('userInfo');
        // that.interval1 = setInterval(function () {
        //页面加载时获取位置
        wx.getLocation({
                type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
                success: function(res) {
                    wx.setStorageSync('lat', res.latitude);
                    wx.setStorageSync('lng', res.longitude);
                    //赋值经纬度
                    that.setData({
                        lat: res.latitude,
                        lng: res.longitude,

                    })
                }
            })
            // var lat = wx.getStorageSync('lat');
            // var lng = wx.getStorageSync('lng');
        var lat = '37.509139';
        var lng = '121.269937';
        console.log(lat, lng)

        app.util.request({
            'url': 'entry/wxapp/Myclock',
            data: { uid: userinfo.memberInfo.uid, lat: lat, lng: lng },
            showLoading: false,
            success: function(res) {
                if (!res.data.message.errno) {
                    if (res.data.data.attendancestatus == 0) {
                        wx.showToast({
                            title: '您未签署合同或所在公司未开启考勤',
                            icon: 'none',
                            duration: 2000,
                            success: function(res) {
                                setTimeout(function() {
                                    wx.switchTab({
                                        url: "/weixinmao_zp/pages/user/index"
                                    })
                                }, 2000)
                            }
                        })

                    } else {
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
                            // console.log(title);
                        that.setData({
                            title: title
                        })
                        console.log(res.data.data.list);
                        wx.setStorageSync('titlename', res.data.data.list.titlename);
                        that.setData({
                            name: res.data.data.list.name,
                            companyname: res.data.data.list.companyname,
                            outworknum: res.data.data.list.outworknum,
                            inrange: res.data.data.list.inrange,
                            starttime: res.data.data.list.starttime,
                            endtime: res.data.data.list.endtime,
                            titlename: res.data.data.list.titlename,
                            inrange: res.data.data.list.inrange,
                            buttoncolor: res.data.data.list.buttoncolor,
                            tscolor: res.data.data.list.tscolor,
                            clickstarttime: res.data.data.list.clickstarttime,
                            clickendtime: res.data.data.list.clickendtime,
                            startcolor: '#a6a9a8',
                            endcolor: '#a6a9a8'
                        })
                    }
                }
            },
            complete: function() {

                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh();
            }
        });
        // },3000);

    },
    setclock: function(e) {
        var that = this;
        var userinfo = wx.getStorageSync('userInfo');
        // var companyid = this.data.companyid;
        var titlename = wx.getStorageSync('titlename');

        if (titlename == '无法打卡' || titlename == '未到范围') {
            wx.showToast({
                title: '当前无法打卡',
                icon: 'none',
                duration: 3000,
                success: function(res) {
                    setTimeout(function() {
                        wx.switchTab({
                            url: "/weixinmao_zp/pages/user/index"
                        })
                    }, 2000)
                }
            })
        } else {
            app.util.request({
                'url': 'entry/wxapp/Setclock',
                data: { uid: userinfo.memberInfo.uid },
                success: function(res) {
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

                        wx.showToast({
                            title: res.data.data.msg,
                            icon: 'success',
                            duration: 2000,
                            success: function(res) {
                                setTimeout(function() {
                                    wx.switchTab({
                                        url: "/weixinmao_zp/pages/user/index"
                                    })
                                }, 2000)
                            }
                        })


                    }
                }
            });
        }
    },
    gooff: function(e) {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/myoff/index"
        })
    },
    Myabsence: function(e) {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/myabsence/index"
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.onLoad();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    uploadimg: function(path) {
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
            success: function(res) {

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

                that.data.imagelist.push(imgpath);





            },
            fail: function(e) {

                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
            },
            complete: function() {
                wx.hideToast(); //隐藏Toast
            }
        })
    },
    checkboxChange: function(e) {
        var special = e.detail.value;
        this.data.special = special.join(',');
        //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    },
    checkboxChangehouse: function(e) {
        var houselabel = e.detail.value;
        this.data.houselabel = houselabel.join(',');
        //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    },
    checkuser: function(options) {


        var that = this;
        var options = options;
        var userinfo = wx.getStorageSync('userInfo');
        console.log(userinfo);
        if (!userinfo) {
            app.util.getUserInfo(
                function(userinfo) {
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
                    success: function(res) {
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