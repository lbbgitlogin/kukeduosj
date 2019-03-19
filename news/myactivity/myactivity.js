var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
Page({
	data: {
		PageIndex: 1,
		ispage: false,
		flag: true, //是否可以进行下次分页
		Info: [],
		windowHeight: 0
	},
	onLoad: function (options) {
		try {
			var res = wx.getSystemInfoSync()
			this.setData({
				windowHeight: res.windowHeight
			})
		} catch (e) {
			console.log(' Do something when catch error');
		}
		this.getActivitylist();
	},
	getActivitylist: function () {
		var val = {
			VendorId: app.globalData.VendorInfo.Id,
            UserId:app.globalData.UserInfo.Id,
			PageIndex: this.data.PageIndex
		}
		var thisobj = this;
		$.xsr($.makeUrl(activityapi.GetUserAdvertismentEvent, val), function (res) {
			if (!$.isNull(res.Info) && res.Code==0) {
				if (res.Info.length < 10) {
					thisobj.setData({
						flag: false,
					});
				}
				thisobj.setData({
					ispage: true,
					Info: thisobj.data.Info.concat(res.Info)
				});
			} else {
				thisobj.setData({
					flag: false,
					ispage: true
				});
			}
		});
	},

	gotoActivityList:function(){
		$.backpage(1,function(){

		});   	
	},

	scrollbottom: function () {//滑动的底部加载下一页
		if (this.data.flag) {
			var thisobj = this;
			clearTimeout(time);
			var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
				thisobj.setData({
					PageIndex: thisobj.data.PageIndex + 1
				})
				thisobj.getActivitylist();
			}, 500);
		}
	}
})