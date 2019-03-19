var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    pageindex: 1,
    tapindex: 0,
    ispage: true,
    flag: true, //是否可以进行下次分页
    UserCoupon: [],
    numNeverUsed: 0,
    numAlreadyused: 0,
    numOutdated: 0,
    isData: true
  },
  onLoad: function (options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          UserCoupon: [],
          Currency: app.globalData.VendorInfo.Currency,
        });
        that.getCouponlist();
      }, options.uid);
    } else {
      that.setData({
        UserCoupon: [],
        Currency: app.globalData.VendorInfo.Currency,
      });
      that.getCouponlist();
    }
  },
  neverused: function () { //未使用
    this.setData({
      tapindex: 0,
      UserCoupon: [],
      pageindex: 1,
      isData: true
    });
    this.getCouponlist();
  },
  alreadyused: function () { //已使用
    this.setData({
      tapindex: 1,
      UserCoupon: [],
      pageindex: 1,
      isData: true
    });
    this.getCouponlist();
  },

  outdated: function () { //已过期
    this.setData({
      tapindex: 2,
      UserCoupon: [],
      pageindex: 1,
      isData: true
    });
    this.getCouponlist();
  },

  usenow: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../couponsuitproduct/couponsuitproduct?id=' + id
    })
  },

  getCouponlist: function () {

    var val = {
      UserId: app.globalData.UserInfo.Id,
      PageIndex: this.data.pageindex,
      Status: this.data.tapindex
    }
    var that = this;
    $.xsr($.makeUrl(userapi.GetUserCouponItem, val), function (data) {
      console.log("优惠券5555", data);
      if (!$.isNull(data.Info) && data.Code != 1) {
        that.setData({
          numNeverUsed: data.Info.UnUseTotal,
          numAlreadyused: data.Info.UsedTotal,
          numOutdated: data.Info.OutTimeTotal,
          isData: true
        });
        if (!$.isNull(data.Info.MyCoupons)) {
          if (data.Info.MyCoupons.length < 10) {
            that.setData({
              UserCoupon: that.data.UserCoupon.concat(data.Info.MyCoupons),
              flag: false,
              ispage: false
            });
          } else {
            that.setData({
              UserCoupon: that.data.UserCoupon.concat(data.Info.MyCoupons),
              flag: true,
              ispage: true
            });
          }
        } else {
          that.setData({
            flag: false,
            ispage: false,
          });
        }
        if ($.isNull(data.Info) && res.Code == 0 && that.data.pageindex == 1) {
          that.setData({
            isData: false
          })
        }
      }
    });


  },
  nav_mycou: function () { //跳转我的领取优惠券
    wx.navigateTo({
      url: '../receivecontent/receivecontent'
 
    })


  },
  onReachBottom: function () { //进行分页
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
  }
})