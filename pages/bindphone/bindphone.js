var app = getApp();
var $ = require('../../utils/util.js');
var phoneapi = require('../../api/phoneAPI.js');
Page({
	data: {
		Phone: "",
		Code: "",
		btntext: "发送",
		isSend: true, //是否可以再次发送
		isPhone: true, //手机是否验证通过
		sendTime: 120, //再次发送时间
		isCode: true //验证码是否通过
	},
	inputphone: function (e) {
		this.setData({
			Phone: e.detail.value
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
	inputcode: function (e) {
		this.setData({
			Code: e.detail.value
		});
		if ($.isNull(e.detail.value)) {
			this.setData({
				isCode: false
			});
		} else {
			this.setData({
				isCode: true
			});
		}
	},
	sendmessage: function () {
		if ($.isNull(this.data.Phone)) {
			this.setData({
				isPhone: false
			});
		} else if (!(/^1[34578]\d{9}$/.test(this.data.Phone))) {
			this.setData({
				isPhone: false
			});
		} else if (this.data.Phone == app.globalData.UserInfo.Phone) {
			$.confirm("你已经绑定过该手机！");
		} else {
			if (this.data.isSend) {
				this.setData({
					isSend: false
				});
				var thisobj = this;
				var time = this.data.sendTime;
				//开始发送
				var val = {
					Phone: this.data.Phone,
					UserName: app.globalData.UserInfo.UserName,
					NickName: app.globalData.UserInfo.NickName
				}
				$.xsr($.makeUrl(phoneapi.SendMessage, val), function (data) {
					if (data.Code == 0) {
						var inter = setInterval(function () {
							if (time > 0) {
								thisobj.setData({
									btntext: (time--) + "s"
								});
							} else {
								thisobj.setData({
									isSend: true,
									sendTime: 120,
									btntext: "重新发送"
								});
								clearInterval(inter);
							}
						}, 1000);
					} else {
						thisobj.setData({
							isSend: true
						});
					}
				});
			}
		}
	},
	submitdata: function () { //提交数据
		if ($.isNull(this.data.Phone)) {
			this.setData({
				isPhone: false
			});
		} else if (!(/^1[34578]\d{9}$/.test(this.data.Phone))) {
			this.setData({
				isPhone: false
			});
		} else if (this.data.Phone == app.globalData.UserInfo.Phone) {
			$.confirm("你目前已经绑定该手机！");
		} else if ($.isNull(this.data.Code)) {
			this.setData({
				isCode: false
			});
		} else {
			var val = {
				Phone: this.data.Phone,
				UserName: app.globalData.UserInfo.UserName,
				Code: this.data.Code
			}
			$.xsr($.makeUrl(phoneapi.BindPhone, val), function (data) {
				console.log(data);
				if (data.Code == 0) {
					app.globalData.UserInfo.Phone = val.Phone;
					$.backpage(1, function () {
						$.alert("绑定成功！")
					});
				} else {
					$.confirm("亲~请输入正确的验证码！");
				}
			});
		}
	}
})