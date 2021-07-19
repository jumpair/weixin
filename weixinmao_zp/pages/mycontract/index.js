// weixinmao_house/pages/pub/index.js
var app = getApp();
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
            uid: options.uid
        });


    },

    oldhouseinit: function(e) {
        let that = this;
        let userinfo = wx.getStorageSync('userInfo');
        // that.interval1 = setInterval(function () {
        // console.log(uid);
        app.util.request({
            'url': 'entry/wxapp/Signcontract',
            data: { uid: userinfo.memberInfo.uid },
            showLoading: false,
            success: function(res) {
                if (!res.data.message.errno) {
                    if (!res.data.data.list) {
                        wx.showToast({
                            title: '您还未成为公司员工',
                            icon: 'fail',
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
                        list: res.data.data.list,
                        content: res.data.data.list.content
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
    scaleImg: function(e) {
        //获取data-src  
        let src = e.currentTarget.dataset.src;

        var content = new Array(src);
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: content // 需要预览的图片http链接列表
        })
    },

    Mysign: function(e) {
        let jobtype = e.currentTarget.dataset.jobtype;

        wx.navigateTo({
            url: "/weixinmao_zp/pages/mysign/index?jobtype=" + jobtype
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