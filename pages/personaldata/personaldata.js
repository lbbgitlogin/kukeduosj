var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
var phoneapi = require('../../api/phoneAPI.js');
Page({
	data: {
		Id: 0,
		NickName: "",
		RealName: "",
		identityCardNo: "",
		isCardNo: true,
		Email: "",
		StrBirthday: "",
    isEmail:true,
		Phone: "",
		Code: "",
		btntext: "发送",
		isSend: true, //是否可以再次发送
		isPhone: true, //手机是否验证通过
		sendTime: 120, //再次发送时间
		isCode: true //验证码是否通过
	},
	onLoad: function () {
		// 页面初始化 options为页面跳转所带来的参数
      app.GetUserInfo();
     
		this.setData({
			Id: app.globalData.UserInfo.Id,
			NickName: $.isNull(app.globalData.UserInfo.NickName) ? '' : app.globalData.UserInfo.NickName,
			RealName: $.isNull(app.globalData.UserInfo.RealName) ? '' : app.globalData.UserInfo.RealName,
			identityCardNo: $.isNull(app.globalData.UserInfo.identityCardNo) ? '' : app.globalData.UserInfo.identityCardNo,
			Email: $.isNull(app.globalData.UserInfo.Email) ? '' : app.globalData.UserInfo.Email,
			StrBirthday: $.isNull(app.globalData.UserInfo.StrBirthday) ? '请选择生日日期' : app.globalData.UserInfo.StrBirthday,
			Phone: $.isNull(app.globalData.UserInfo.Phone) ? '' : app.globalData.UserInfo.Phone
		});
	},
	bindDateChange: function (e) { //选择日期
		this.setData({
			StrBirthday: e.detail.value
		})
	},
	inputReName: function (e) { //输入真实姓名
		this.setData({
			RealName: e.detail.value
		});
	},
	inputICard: function (e) { //输入身份证号码
		if($.isNull(e.detail.value)){
			this.setData({
				isCardNo: true,
				identityCardNo: e.detail.value
			});
			return;
		}
		if (!this.IdentityCodeValid(e.detail.value)) {
			this.setData({
				isCardNo: false
			});
		} else {
			this.setData({
				isCardNo: true
			});
		}
		this.setData({
			identityCardNo: e.detail.value
		});
	},
	inputEmail: function (e) { //输入邮箱
		this.setData({
			Email: e.detail.value
		});
    if ($.isNull(e.detail.value)) {
      this.setData({
        isEmail: false
      });
    } else if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(e.detail.value)) {
      this.setData({
        isEmail: false
      });
    } else {
      this.setData({
        isEmail: true
      });
    }
	},
	// submitInfo:function(e) { //提交数据
	// 	if (!$.isNull(this.data.identityCardNo) && !this.data.isCardNo) {
	// 		return;
	// 	}
	// 	var val = {
	// 		Id: this.data.Id,
	// 		RealName: this.data.RealName,
	// 		identityCardNo: this.data.identityCardNo,
	// 		Email: this.data.Email,
	// 		Birthday: this.data.StrBirthday
	// 	}
	// 	$.xsr($.makeUrl(userapi.EditUserInfo, val), function (data) {
	// 		wx.showToast({
	// 			title: "更新成功!",
	// 			success: function () {
	// 				app.globalData.UserInfo = data.Info;
	// 				$.backpage(1);
	// 			}
	// 		});
	// 	});
	// },
	submitInfo: function (e) { //提交数据

		if (!$.isNull(this.data.identityCardNo) && !this.data.isCardNo) {
			return;
		}
    // if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(this.data.Email) ){
    //   this.setData({
    //     isEmail: false
    //   });
    //   return;
    // }
		if (!$.isNull(this.data.Phone) && (this.data.Phone == app.globalData.UserInfo.Phone)) {//绑定过手机只更新信息
			this.update();
		} else {
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
			} else if ($.isNull(this.data.Code)) {
				this.setData({
					isCode: false
				});
			} else {
				var val1 = {
					Phone: this.data.Phone,
					UserName: app.globalData.UserInfo.UserName,
					Code: this.data.Code
				}
				var that = this;
				$.xsr($.makeUrl(phoneapi.BindPhone, val1), function (data) {
					if (data.Code == 0) {
						app.globalData.UserInfo.Phone = val1.Phone;
						that.update();
						// $.backpage(1, function () {
						// 	$.alert("绑定成功！")
						// });

					} else {
						$.confirm("亲~请输入正确的验证码！");
					}
				});
			}
		}
	},

	update:function(){
		var val2 = {
				Id: this.data.Id,
				RealName: this.data.RealName,
				identityCardNo: this.data.identityCardNo,
				Email: this.data.Email,
				Birthday: this.data.StrBirthday
			}
			if(val2.Birthday=="请选择生日日期"){
				val2.Birthday='';
			}
			$.xsr($.makeUrl(userapi.EditUserInfo, val2), function (data) {
				wx.showToast({
					title: "更新成功!",
					success: function () {
						app.globalData.UserInfo = data.Info;
						$.backpage(1);
					}
				});
			});
	},
	IdentityCodeValid: function (code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var pass = true;
		if (!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
			pass = false;
		} else if (!city[code.substr(0, 2)]) {
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (code.length == 18) {
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if (parity[sum % 11] != code[17].toUpperCase()) {
					pass = false;
				}
			}
		}
		return pass;
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
          console.log(data);
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
						$.alert(data.Msg);
					}
				});
			}
		}
	}
})