var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
    data: {
        pageindex: 1,
        tapindex: 0,
        ispage: true,
        flag: true, //是否可以进行下次分页
        SuitProduct: [],
      SuitProducts:5,
        Id:0,
        viewtype:0,
        IsShow:false,
    },
    onLoad: function (options) {
    
      console.log("优惠券：",options)
        this.setData({
            Id:options.id,
            Currency: app.globalData.VendorInfo.Currency,
        })
        // 生命周期函数--监听页面加载
        this.getCouponlist();
    }, 

    getCouponlist: function () {

        var val = {
            VendorId: app.globalData.VendorInfo.Id,
            PageIndex: this.data.pageindex,
            CouponId: this.data.Id
        }
        var that = this;
        $.xsr($.makeUrl(userapi.GetCouponLimitProduct, val), function (data) {
          console.log("f返回值",data)
            if (data.Info != null && data.Code != 1) {
                if (data.Info.length < 10) {
                    that.setData({
                        SuitProduct: that.data.SuitProduct.concat(data.Info),
                        SuitProducts: that.data.SuitProduct.concat(data.Info).length,
                        flag: false,
                        ispage: false,
                        IsShow:true,
                    });
                } else {
                    that.setData({
                        SuitProduct: that.data.SuitProduct.concat(data.Info)
                    });
                }

            } else {
                that.setData({
                    flag: false,
                    ispage: false
                });
            }
        });


    },
    scrollbottom: function () { //进行分页
        if (this.data.flag) { //判断是否可以进行下次分页
            var that = this;
            clearTimeout(time);
            var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
                that.setData({
                    pageindex: parseInt(that.data.pageindex) + 1
                });
                that.getCouponlist();
            }, 500);
        }
    },

    viewType: function () { //切换商品列表展示方式
        var thatProm = this.data.viewtype;
		if (thatProm == 0) {
			thatProm = 1;
		} else {
			thatProm = 0;
		}
		this.setData({
			viewtype: thatProm
		});
	}
})