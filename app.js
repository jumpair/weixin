//app.js
App({
	onLaunch: function () {

   
		//调用API从本地缓存中获取数据
	},
	onShow: function () {
//		console.log(getCurrentPages())
	},
	onHide: function () {
	//	console.log(getCurrentPages())

	},
	onError: function (msg) {
		//console.log(msg)
	},
	util: require('we7/resource/js/util.js'),
	tabBar: {
		"color": "#123",
		"selectedColor": "#1ba9ba",
		"borderStyle": "#1ba9ba",
		"backgroundColor": "#fff",
		"list": [
			
		]
	},
	globalData: {
		userInfo: null,
	},
   siteInfo: require('siteinfo.js') 
});