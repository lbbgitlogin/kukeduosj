var app = getApp();
var $ = require('../../utils/util.js');
var fgapi = require('../../api/fightGroups.js');
var venapi = require('../../api/vendorAPI.js');
Page({
  data: {
    groupId: 0,
    pageSize1: 10,
    pageIndex1: 1,
    pageSize2: 10,
    pageIndex2: 1,
    pageSize: 6,
    pageIndex: 1,
    Info: [],
    Coupons: [],
    show: true,
    flag: false,
    ispage: false,
    ProductList: [],
    luckyInfo: [],
    flag2: false,
    ispage2: false,
    isShow: false
  },
  onLoad: function(options) {
    console.log("options", options)
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          groupId: options.groupId,
          OrderNum: options.OrderNum,
          Currency: app.globalData.VendorInfo.Currency
        })
        that.GetLuckyInfoByEvent(options)
        that.GetRecommendedProductList()
        that.GetWinnerList()
      }, options.uid);
    } else {
      that.setData({
        groupId: options.groupId,
        OrderNum: options.OrderNum,
        Currency: app.globalData.VendorInfo.Currency
      })
      that.GetLuckyInfoByEvent(options)
      that.GetRecommendedProductList()
      that.GetWinnerList()
    }
    // this.setData({
    //   groupId: options.groupId,
    //   OrderNum: options.OrderNum
    // })
    // this.GetLuckyInfoByEvent(options)
    // this.GetRecommendedProductList()
    // this.GetWinnerList()
  },
  GetLuckyInfoByEvent: function() {
    var that = this
    var val = {
      groupId: this.data.groupId,
      orderNum: this.data.OrderNum,
      pageSize: this.data.pageSize1,
      pageIndex: this.data.pageIndex1,
    }
    $.xsr($.makeUrl(fgapi.GetLuckyInfoByEvent, val), function(data) {
      console.log("GetLuckyInfoByEvent",data)
      that.setData({
        Info: data.Info[0]
      })
    });
  },
  GetWinnerList: function() {
    var that = this
    var val = {
      groupId: this.data.groupId,
      orderNum: this.data.OrderNum,
      pageSize: this.data.pageSize2,
      pageIndex: this.data.pageIndex2,
    }
    $.xsr($.makeUrl(fgapi.GetWinnerList, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 10) {
          that.setData({
            flag2: false,
            ispage2: false
          });
          that.setData({
            luckyInfo: that.data.luckyInfo.concat(res.Info)
          });
        } else {
          that.setData({
            flag2: true,
            luckyInfo: that.data.luckyInfo.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag2: false,
          ispage2: false
        });
      }
    });
  },
  scrollbottom: function(even) { //滚动到底部进行分页
    if (this.data.flag2) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex2: parseInt(that.data.pageIndex2) + 1
        });
        that.GetWinnerList();
        that.setData({
          flag2: false
        })
      }, 500)
    }
  },
  getcoupon: function() {
    var that = this
    var val = {
      groupId: this.data.groupId,
      marketingEventId: this.data.Info.MarketingEventId,
      pageSize: 10,
      pageIndex: 1,
      userId: app.globalData.UserInfo.Id,
    }
    $.xsr($.makeUrl(fgapi.DrawCoupon, val), function(data) {
      that.setData({
        Coupons: data.Info,
        show: false,
      })
    });
  },
  gotocoupon: function() {
    wx.navigateTo({
      url: '../usercoupon/usercoupon',
    })
  },
  GetRecommendedProductList: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageSize: this.data.pageSize,
      pageIndex: this.data.pageIndex,
    }
    $.xsr($.makeUrl(venapi.GetRecommendedProductList, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 6) {
          that.setData({
            flag: false,
            ispage: false
          });
          that.setData({
            ProductList: that.data.ProductList.concat(res.Info)
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            ProductList: that.data.ProductList.concat(res.Info)
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
  fightPage: function(e) {
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1
        });
        that.GetRecommendedProductList();
        that.setData({
          flag: false
        })
      }, 500);
    }
  },
  gotoorder: function() {
    var that = this
    console.log(that.data.OrderNum,)
    var servicePlaceCode = that.data.Info.ServicePlaceCode;
    if (servicePlaceCode == 0) {
      wx.navigateTo({
        url: '../orderdetail/orderdetail?on=' + that.data.OrderNum,
      })
    }
    if (servicePlaceCode == 1) {
      wx.navigateTo({
        url: '/server/offlineorderdetail/offlineorderdetail?on=' + that.data.OrderNum,
      })
    }
    if (servicePlaceCode == 2) {
      wx.navigateTo({
        url: '/server/orderdetail/orderdetail?on=' + that.data.OrderNum,
      })
    }
    if (servicePlaceCode == 3) {
      wx.navigateTo({
        url: '/server/orderdetail/orderdetail?on=' + that.data.OrderNum,
      })
    }
  },
  cancelsuccess: function() { //关闭
    this.setData({
      show: true
    });
    this.GetLuckyInfoByEvent()
  },
  open: function() {
    this.setData({
      isShow: true,
      luckyInfo: [],
      pageSize2: 10,
      pageIndex2: 1
    })
    this.GetWinnerList()
  },
  close: function() {
    this.setData({
      isShow: false
    })

  },
  innertouch: function() {}, //事件拦截
})