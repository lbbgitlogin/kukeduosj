var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
Page({
	data: {
		isPage: false,
		Info: [],
		EventId: '',
		activityagenda: ''	//解析会议详情
	},
	onLoad: function (options) {
		this.setData({
			EventId: options.eventId
		});
		this.initData();
	},
	initData: function () {
		var val = {
			EventId: this.data.EventId,
			UserId: app.globalData.UserInfo.Id
		}
		var thisobj = this;
		$.xsr($.makeUrl(activityapi.EventCheckIn, val), function (res) {
			if (res.Info != null && res.Code == 0) {
				thisobj.setData({
					isPage: true,
					Info: res.Info,
          activityagenda: res.Info.AgendaPlan
				});
			} else {
				$.alert("签到失败！");
				thisobj.setData({
					isPage: false
				})
			}
		});

	}




})