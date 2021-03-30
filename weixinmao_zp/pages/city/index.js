var app = getApp();
Page({
	data: {
		scrollHeight: '',
		toView: '#',
    type:0
	},
	// 首屏渲染
	onLoad (e) {
		var that = this;
    console.log(e.id);
    that.data.type = e.id;
    wx.setNavigationBarTitle({
      title:'切换城市',
    })
		wx.getSystemInfo({
			success: function(res) {
				that.setData({
					scrollHeight: res.windowHeight
				})
			}
		})
  

    app.util.request({
      'url': 'entry/wxapp/getcitylist',
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
          console.log(res.data.data.firstnamelist);
          that.setData({
            hotlist: res.data.data.hotlist,
            firstnamelist: res.data.data.firstnamelist,
          })
        }
      }
    });




	},
	goBack: function() {
		wx.navigateBack({
		  delta: 1
		})
	},
  selectcity:function(e){

    var that = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
  var cityinfo={};
    cityinfo.name = name;
    cityinfo.id = id;

    console.log(cityinfo);
    wx.setStorageSync('cityinfo', cityinfo);

  if(that.data.type == 1)
    {
        wx.switchTab({
          url: "/weixinmao_zp/pages/findjob/index"
        })
    }else if(that.data.type == 2)
    {
    wx.switchTab({
      url: "/weixinmao_zp/pages/findworker/index"
    })

  } else if (that.data.type == 0) {
    wx.switchTab({
      url: "/weixinmao_zp/pages/index/index"
    })

  } else if (that.data.type == 3) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/findpartjob/index"
    })

  } 


  },
	// 选择字母 返回指定索引
	choiceWordindex: function(e) {
		let wordindex = e.target.dataset.wordindex;
    this.setData({
      toView: wordindex
    })
	}
})