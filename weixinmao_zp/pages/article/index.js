// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    showInput: false, //控制输入栏
    title:'',
    article:'',
  },
   
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (e) {
  
    

    var that = this;
    
    // var WxParse = WxParse;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getbanner',
      success: function (res) {
        if (!res.data.message.errno) {
          that.setData({
            banners: res.data.data,
          })
        }
      }
    });
    
    var userinfo = wx.getStorageSync('userInfo');
    app.util.request({
      'url': 'entry/wxapp/getarticle',
      data: {uid: userinfo.memberInfo.uid},
      success: function (res) {
        if (!res.data.message.errno) {

          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          var title = res.data.data.title;
          that.data.title = title;
          var placeholder = that.data.comment_name; 
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.data.intro.maincolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
          
  
          if(res.data.data.intro.ischeck == 1)
            {

            wx.setNavigationBarTitle({
              title:  wx.getStorageSync('companyinfo').name,
            })

            }else{
          wx.setNavigationBarTitle({
            title: title[0],
          })
            }
          
            // console.log(res.data.data.article);return;
          /*
             var g = this.data.article;
             g[0]['comment']  = 返回新评论数组；
          */
          that.setData({
            category: res.data.data.category,
            article: res.data.data.article,
            imgs1:res.data.data.imagelist,
            placeholder:'请输入评论',
            activeCategoryId: res.data.data.activeCategoryId
          })

          

        }
      },
      complete: function () {


        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });
  
  },
  bindInputMsg:function(e){
    var comment = e.detail.value;
    
    this.setData({
      comment: e.detail.value,     //通过setData方法将值存进去
     })
  },

  bindFaso: function (e) {
    
    var that = this
    var userinfo = wx.getStorageSync('userInfo');
    var comment = this.data.comment;
    var artid = this.data.artid;
    var cuid = this.data.cuid;
    
    if(cuid == userinfo.memberInfo.uid){
      wx.hideLoading()
      wx.showToast({
        title: '请不要回复自己',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    if(cuid !== ' '){
      var title = '回复';
      var data = {uid: userinfo.memberInfo.uid, comment:comment,artid:artid,cuid:cuid};
    }else{
      var title ='评论';
      var data = {uid: userinfo.memberInfo.uid, comment:comment,artid:artid};
    } 
  //  console.log(title);return;
    this.setData({
      showInput: true
    })

    // var WxParse = WxParse;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/Getcomment',
      data: data,
      showLoading: false,
      success: function (res) {
        
         
        if (res.data.errno != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: title+'失败',
            content: res.data.data.msg,
            showCancel: false
          })
          return;
        } else {
           var comment = that.data.article;
          // console.log(comment);
          
           let s = res.data.data.msg[0].article_id;
           for (let index = 0; index < comment.length; index++) {
             if(comment[index]['id']==s){
              comment[index]['comment'] = res.data.data.msg;
              comment[index].dt = res.data.data.msg.dt;
             }
             
           }
           console.log(comment);
           //comment[s]['comment'] = res.data.data.msg;
            that.setData({
              article:comment
            })    
            
          wx.hideLoading();
          return;
        }
        }

    });
  },
  morecomment:function(e){
    var that = this
    var artid = e.currentTarget.dataset.artid;
    var eventid = e.currentTarget.dataset.eventid;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/MoreComment',
      data: {artid:artid,eventid:eventid},
      showLoading: false,
      success: function (res) {
 
        if (res.data.errno != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: title+'失败',
            content: res.data.data.msg,
            showCancel: false
          })
          return;
        } else {
           var comment = that.data.article;

           let s = res.data.data.msg[0].article_id;
           for (let index = 0; index < comment.length; index++) {
             if(comment[index]['id']==s){
              comment[index]['comment'] = res.data.data.msg;
              comment[index]['countevent'] = res.data.data.msg[index].countevent;
             }
             
           }
           //comment[s]['comment'] = res.data.data.msg;

            that.setData({
              article:comment
            })    
            
          wx.hideLoading();
          return;
        }
        }

    });
  },
 
  likeNum:function(e){
    var that = this
    var artid = e.target.dataset.art;
    var userinfo = wx.getStorageSync('userInfo');
      //初始化导航数据
      app.util.request({
          'url': 'entry/wxapp/Getlikenum',
          data: {uid: userinfo.memberInfo.uid,artid:artid},
          showLoading: false,
          success: function (res) {
            if (res.data.errno != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '点赞失败',
                content: res.data.msg,
                showCancel: false
              })
              return;
            } else {
              var likenum = that.data.article;

              for (let index = 0; index < likenum.length; index++) {
                 if(likenum[index]['id']==artid){
                   likenum[index]['likenum'] = res.data.data.msg.likenum;
                   likenum[index]['like'] = res.data.data.msg.like;
                 }
               }
              //  console.log(likenum);return;
              that.setData({
                article:likenum
              })   
            }
        }
      });

  },
  commentReply: function (e) {
    var comment_name = e.target.dataset.name;
    var cuid = e.target.dataset.uid;
    var artid = e.target.dataset.artid;
    this.setData({
      showInput: true,
      cuid:cuid,
      artid:artid,
      placeholder:"回复" + comment_name + ":"
    })

  },
  
 //点击出现输入框
 showInput: function(e) {
  var cuid =' ';
  var artid = e.target.dataset.artid;
  var comment_name = ' ';
  this.setData({
    artid:artid,
    cuid:cuid,
    placeholder:'请输入评论',
    showInput: true
  })
},

//隐藏输入框
onHideInput: function() {
  var that = this;
  setTimeout(hide,1000);
  function hide(){
    that.setData({
      showInput: false
    })
  } 
},

tabClick: function(e){

    var pid = e.currentTarget.id;
    var that = this;
    // var WxParse = WxParse;
    //初始化导航数据
    app.util.request({
      'url': 'entry/wxapp/getsecondlist',
      data: { pid: pid },
      success: function (res) {
        if (!res.data.message.errno) {

          that.setData({
            article: res.data.data,
            activeCategoryId: pid
          })

        }
      }
    });
  },
  imgYu:function(e){
    var src = e.currentTarget.dataset.src;//获取data-src  
    var imgList = e.currentTarget.dataset.pic;//获取data-list 
    // console.log(src);
    // console.log(imgList);return;
    var imgList = new Array(src);
    //图片预览
    wx.previewImage({
     current: src, // 当前显示图片的http链接 
     urls: imgList // 需要预览的图片http链接列表
    })
    },

  toNewsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/newsdetail/index?id=" + id
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/weixinmao_zp/pages/article/index'
    }
  }
})