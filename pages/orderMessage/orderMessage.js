var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
  data: {
    shoplogo: "",
    shopname: "",
    isTrue: false,
    isShow: false,
    height: 0,
    index: 0,
    peopleNum: 0,
    remark: "",
    couponItemId: 0,
    IsUseCoupon: 1,
    addressId: 0,
    isFightGroup: "",
    addressId: 0,
    physicalStoreId: "",
    shipMethod: 0,
    sponsorId: 0,
    length: 0,
    submitinfo: {},
    orderNum:"",
    Info:[]
  },
  onLoad: function (options) {
    this.setData({
      peopleNum:options.peopleNum,
      remark:options.remark,
      orderNum:options.orderNum,
      shoplogo: app.globalData.VendorInfo.WapLogoPath,
      shopname: app.globalData.VendorInfo.ShopName,
      Currency: app.globalData.VendorInfo.Currency
    })
    this.GetMealOrder()
  },
  more: function () {
    this.setData({
      isShow: false,
      height: this.data.length * 78
    })
  },
  GetMealOrder:function(){
    var that=this
    var val={
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(orderapi.GetMealOrder, val), function (data) {
      if (data.Code == 0) {
        that.setData({
          Info: data.Info,
          length: data.Info[0].OrderDetailVOList.length
        })
        if (data.Info[0].OrderDetailVOList.length * 78 > 780) {
          that.setData({
            isShow: true,
            height: 780,
          })
        } else {
          that.setData({
            isShow: false,
            height: data.Info[0].OrderDetailVOList.length.length * 78
          })
        }
      }
    })
  },
  goback:function(){
    wx.redirectTo({
      url: '../orderFood/orderFood?orderNum=' + this.data.orderNum + "&tableNum=" + this.data.Info[0].Num,
    })
  },
  gobuy:function(){
    wx.navigateTo({
      url: '../orderPay/orderPay?orderNum=' + this.data.orderNum,
    })
  }
  
})