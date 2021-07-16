// weixinmao_house/pages/pub/index.js
var app = getApp();
var context = null; // 使用 wx.createContext 获取绘图上下文 context  
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
//获取系统信息  
wx.getSystemInfo({
    success: function(res) {
        canvasw = res.windowWidth; //设备宽度  
        canvash = res.windowHeight;
    }
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        mobile: '',
        department: '',
        contracttype: '',
        jobtype: '',
        contractimg: '',
        content: [],
        isuser: true,
        isagree: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;


        var appuser = wx.getStorageSync('userInfo');

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
            isuser: that.data.isuser,
            uid: options.uid,
            jobtype: options.jobtype
        });
        // 使用 wx.createContext 获取绘图上下文 context  
        context = wx.createCanvasContext('canvas');
        context.beginPath()
        context.setStrokeStyle('#000000');
        context.setLineWidth(6);
        context.setLineCap('round');
        context.setLineJoin('round');


    },

    oldhouseinit: function(e) {
        let that = this;
        let userinfo = wx.getStorageSync('userInfo');
        // that.interval1 = setInterval(function () {
        // console.log(uid);
        app.util.request({
            'url': 'entry/wxapp/Mysign',
            data: { uid: userinfo.memberInfo.uid },
            showLoading: false,
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

                    that.setData({
                        list: res.data.data.list
                    })

                }
            },
            complete: function() {

                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh();
            }
        });
        // },3000);

    },
    canvasIdErrorCallback: function(e) {
        console.error(e.detail.errMsg)
    },
    canvasStart: function(event) {
        isButtonDown = true;
        arrz.push(0);
        arrx.push(event.changedTouches[0].x);
        arry.push(event.changedTouches[0].y);
        context.moveTo(event.changedTouches[0].x, event.changedTouches[0].y);
    },
    canvasMove: function(event) {
        if (isButtonDown) {
            arrz.push(1);
            arrx.push(event.changedTouches[0].x);
            arry.push(event.changedTouches[0].y);
            // context.lineTo(event.changedTouches[0].x, event.changedTouches[0].y);
            // context.stroke();
            // context.draw()
        };
        for (var i = 0; i < arrx.length; i++) {
            if (arrz[i] == 0) {
                context.moveTo(arrx[i], arry[i])
            } else {
                context.lineTo(arrx[i], arry[i])
            };
        };
        context.clearRect(0, 0, canvasw, canvash);
        context.stroke();
        context.draw(true);
    },
    canvasEnd: function(event) {
        isButtonDown = false;
    },
    cleardraw: function() {
        //清除画布  
        arrx = [];
        arry = [];
        arrz = [];
        context.clearRect(0, 0, canvasw, canvash);
        context.draw(true);
    },
    getimg: function(e) {
        if (arrx.length == 0) {
            wx.showModal({
                title: '提示',
                content: '签名内容不能为空！',
                showCancel: false
            });
            return false;
        };

        //生成图片  
        wx.canvasToTempFilePath({
            canvasId: 'canvas',
            destWidth: 50,
            destHeight: 100,
            quality: 1, //图片质量
            success: function(res) {
                console.log(res.tempFilePath);
                //存入服务器  
                var uploadurl = app.util.geturl({ 'url': 'entry/wxapp/imagesynthesis' });
                // var id = id;

                wx.showToast({
                    icon: "loading",
                    title: "正在上传"
                });

                var that = this;
                let userinfo = wx.getStorageSync('userInfo');
                wx.uploadFile({

                    url: uploadurl,
                    filePath: res.tempFilePath,
                    name: 'file',
                    header: { "Content-Type": "multipart/form-data" },
                    formData: {
                        //和服务器约定的token, 一般也可以放在header中
                        'session_token': wx.getStorageSync('session_token'),
                        'jobtype': e.currentTarget.dataset.jobtype,
                        'uid': userinfo.memberInfo.uid
                    },
                    success: function(res) {

                        // var getdata = JSON.parse(res.data);

                        if (res.statusCode != 200) {
                            wx.showModal({
                                title: '提示',
                                content: '上传失败',
                                showCancel: false
                            })
                            return;
                        } else {

                            wx.showToast({
                                title: '上传成功',
                                icon: 'success',
                                duration: 5000,
                                success: function(res) {
                                    setTimeout(function() {
                                        wx.switchTab({
                                            url: "/weixinmao_zp/pages/user/index"
                                        })
                                    }, 2000)
                                }
                            })
                            return;
                        }


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
            }
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
                'session_token': wx.getStorageSync('session_token'),

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