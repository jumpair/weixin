var app = getApp();

Page({
    data: {
        imgs1: [],
        imagelist: [],
        true1: true,
        true2: true,
        true3: true,
        true4: true,
        true5: true,
        true6: true,
        startofftime: '',
        endofftime: '',
        period: '',
        summary: '',
        sort: '',
        isuser: true,
        isagree: 0,
    },
    onLoad: function(options) {

        // 页面初始化 options为页面跳转所带来的参数

        var that = this;
        var userinfo = wx.getStorageSync('userInfo');

        app.util.request({
            'url': 'entry/wxapp/Addrepair',
            data: { sessionid: userinfo.sessionid, uid: userinfo.memberInfo.uid },
            success: function(res) {
                if (!res.data.message.errno) {
                    console.log(res.data)
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
                    console.log(res.data.department);
                    that.setData({
                        title: title,
                        departmentlist: res.data.data.department,
                    })
                    if (res.data.data.notevideo) {
                        that.data.notevideo = res.data.data.notevideo;
                        that.setData({
                            notevideo: that.data.notevideo,
                            isvideo: 'block',
                            src: that.data.notevideo.videourl,
                            imgs1: res.data.data.imagelist,
                            show: 'block'
                        })
                        that.data.videourl = that.data.notevideo.videourl;
                        that.data.imagelist = res.data.data.imagelist;

                    }

                }
            },
            complete: function() {

                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh();
            }
        });


    },
    bindDepartmentChange: function(e) {
        var departmentlist = this.data.departmentlist;

        if (departmentlist) {
            this.data.jobcateindex = e.detail.value;
            this.data.departmentid = departmentlist[e.detail.value].id;
        }
        this.setData({
            departmentlist: departmentlist,
            jobcateindex: e.detail.value
        })
    },
    chooseImg: function(e) {
        var that = this;

        wx.chooseImage({
            count: 3, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths);
                var imgs1 = that.data.imgs1;
                imgs1 = [];
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
                    show: 'block'
                });
                that.setData({
                    picture1: []
                })
                var tempFilePaths = that.data.imgs1
                console.log(tempFilePaths);
                // var uploadurl = app.util.geturl({ 'url': 'entry/wxapp/upload' });

                for (var s = 0; s < tempFilePaths.length; s++) {

                    console.log(tempFilePaths[s]);

                    that.uploadimg(tempFilePaths[s]);
                }

            },
            fail: function(res) {},
            complete: function(res) {}
        });
    },
    upload: function(e) {
        var that = this;
        var e = e;
        that.doupload(e);
    },


    doupload: function(e) {


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
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;


                switch (id) {
                    case 1:
                        imgurl1 = tempFilePaths;
                        // console.log(that.data.true1 );
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

    savepubinfo: function(e) {

        // this.data.uploadimagelist = [];
        var that = this;
        var userinfo = wx.getStorageSync('userInfo');
        var title = e.detail.value.title;
        var departmentid = that.data.departmentid;
        var repair_man = e.detail.value.repair_man;
        var imgstr = that.data.imagelist.join('@');
        var content = e.detail.value.content;

        if (that.data.imagelist.length == 0) {
            wx.showModal({
                title: '提示',
                content: '请先上传图片',
                showCancel: false
            })
            return

        }

        if (title == "") {
            wx.showModal({
                title: '提示',
                content: '请输入报修人',
                showCancel: false
            })
            return
        }
        if (departmentid == "") {
            wx.showModal({
                title: '提示',
                content: '请选择部门',
                showCancel: false
            })
            return
        }
        if (repair_man == "") {
            wx.showModal({
                title: '提示',
                content: '请输入报修主管',
                showCancel: false
            })
            return
        }
        if (content == "") {
            wx.showModal({
                title: '提示',
                content: '请输入详细描述',
                showCancel: false
            })
            return
        }

        var data = {
            uid: userinfo.memberInfo.uid,
            title: title,
            departmentid: departmentid,
            repair_man: repair_man,
            imgstr: imgstr,
            content: content
        };
        app.util.request({
            'url': 'entry/wxapp/Saverepair',
            data: data,
            success: function(res) {


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

                    if (res.data.data.error == 0) {

                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000,
                            success: function(res) {
                                console.log(res);
                                wx.navigateTo({
                                    url: "/weixinmao_zp/pages/myrepair/index"
                                })
                            }
                        })
                    } else {

                        wx.showModal({
                            title: '提示',
                            content: res.data.data.msg,
                            showCancel: false
                        })
                        return

                    }

                }





            }
        });





    },





    onReady: function() {
        // 页面渲染完成
        const self = this;
    },
    bindInput: function(e) {
        var that = this;
        this.setData({
            inputValue: e.detail.value
        });
        that.onShow();
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.onLoad();

    },


    doCall: function() {
        var tel = this.data.textData.shop_tel;
        wx.makePhoneCall({
            phoneNumber: tel
        })
    },
    onShareAppMessage() {
        return {
            title: wx.getStorageSync('companyinfo').name,
            path: '/weixinmao_wy/pages/index/index'
        }
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


})