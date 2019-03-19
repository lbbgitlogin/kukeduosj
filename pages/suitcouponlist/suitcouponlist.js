var app = getApp()
var $ = require('../../utils/util.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		UserCoupon: [],
		id_checked: 0,
    var:"",
		IsUseCoupon:1
	},
	onLoad: function (options) {
   
    console.log("优惠券信息：",options)
		var val = $.parseJSON(options.val);
		this.setData({
			UserCoupon: val,
			id_checked: options.id,
      Currency: app.globalData.VendorInfo.Currency
		});
	},

	changecoupon: function (e) {//用户手动点击切换优惠券
		this.setData({
			id_checked: e.currentTarget.dataset.id
		});

		this.goback();	
	},

	uesnothing: function () {
		this.setData({
			IsUseCoupon:0,
			id_checked: 0,
		});
		this.goback();
	},
	goback: function () {
		var that = this;
		$.backpage(1, function () {
			var isv = {
				couponItemId: that.data.id_checked,
				IsUseCoupon: that.data.IsUseCoupon
			}
		notice.postNotificationName("RefreshCoupon", isv);
		});
	}
})




