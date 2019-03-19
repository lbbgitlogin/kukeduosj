var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
Page({
	data: {
		UserName: '',
		UserPhone: '',
		UserAddress: '',
		isPhone: true,
		isName: true,
		isAddress: true,
		LuckyDrawId: '',
		LuckyDrawPrizeId: '',
		LuckyDrawUniqueId:''
	},
	onLoad: function (options) {
		this.setData({
			LuckyDrawId: options.id,
			LuckyDrawPrizeId: options.prizeid,
			LuckyDrawUniqueId:options.uniqueid
		});
		this.RecipientInfo();
	},

	RecipientInfo: function () {
		var val = {
			UserId: app.globalData.UserInfo.Id,
			LuckyDrawId: this.data.LuckyDrawId,
			LuckyDrawPrizeId: this.data.LuckyDrawPrizeId,
			Id: this.data.LuckyDrawUniqueId
		}
		var that = this;
		$.xsr($.makeUrl(activityapi.GetLuckyDrawRecipientInfo, val), function (data) {
			if (data.Code == 0 && !$.isNull(data.Info)) {
				that.setData({
					UserName:data.Info[0].RecipientName,
					UserPhone:data.Info[0].RecipientMobile,
					UserAddress:data.Info[0].RecipientAddress
				});
			} 
		});
	},

	inputname: function (even) {//输入姓名
		this.setData({
			UserName: even.detail.value
		});
		if ($.isNull(even.detail.value)) {
			this.setData({
				isName: false
			});
		} else {
			this.setData({
				isName: true
			});
		}

	},
	inputphone: function (e) {//输入电话号码
		if(e.detail.value.length > 11){
			this.setData({
			UserPhone: e.detail.value.slice(0,11)
		});
			return;
		}
		
		this.setData({
			UserPhone: e.detail.value
		});
		if ($.isNull(e.detail.value)) {
			this.setData({
				isPhone: false
			});
		} else if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
			this.setData({
				isPhone: false
			});
		} else {
			this.setData({
				isPhone: true
			});
		}
	},
	inputaddress: function (even) {//输入地址
		this.setData({
			UserAddress: even.detail.value
		});
		if ($.isNull(even.detail.value)) {
			this.setData({
				isAddress: false
			});
		} else {
			this.setData({
				isAddress: true
			});
		}
	},


	submit: function () {//提交信息
		if ($.isNull(this.data.UserName)) {
			this.setData({
				isName: false
			});
		}
		if ($.isNull(this.data.UserPhone)) {
			this.setData({
				isPhone: false
			});
		}

		if ($.isNull(this.data.UserAddress)) {
			this.setData({
				isAddress: false
			});
		}

		if (this.data.isName && this.data.isPhone && this.data.isAddress) {
			var val = {
				UserId: app.globalData.UserInfo.Id,
				RecipientName: this.data.UserName,
				RecipientMobile: this.data.UserPhone,
				RecipientAddress: this.data.UserAddress,
				LuckyDrawId: this.data.LuckyDrawId,
				LuckyDrawPrizeId: this.data.LuckyDrawPrizeId,
				Id: this.data.LuckyDrawUniqueId
			}
			var that = this;
			$.xsr($.makeUrl(activityapi.AddUpdateLuckyDrawRecipientInfo, val), function (data) {
				if (data.Code == 0) {
					setTimeout(function () {
						that.goback();
					}, 1000);

				} else {
					$.alert(data.Msg);
				}
			});
		}
	},

	goback: function () {
		$.backpage(1, function () {
			$.alert("提交信息成功！", function () { }, 2000);
		});
	}

})