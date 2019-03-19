var app = getApp()
var $ = require('../../utils/util.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		UserCoupon: [],
		id_checked: 0,
		IsUseCoupon:1,
    DiscountMoney:0
	},
	onLoad: function (options) {
    var that=this;
		var val = $.parseJSON(options.val);
		this.setData({
			UserCoupon: val,
      id_checked: options.id,
      Currency: app.globalData.VendorInfo.Currency
		});
	},

	changecoupon: function (e) {//用户手动点击切换优惠券
    for (var i = 0; i < this.data.UserCoupon.length;i++){
      if (this.data.UserCoupon[i].Id == e.currentTarget.dataset.id){
        this.setData({
          DiscountMoney: this.data.UserCoupon[i].DiscountMoney,
          MoneyLimit: this.data.UserCoupon[i].MoneyLimit
        });
      }
    }
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
			var isv1 = {
				couponItemId: that.data.id_checked,
        DiscountMoney: that.data.DiscountMoney,
				IsUseCoupon: that.data.IsUseCoupon,
        MoneyLimit: that.data.MoneyLimit
			}
		  notice.postNotificationName("RefreshCoupon1", isv1);
		});
	}
})




