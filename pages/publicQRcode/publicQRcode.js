var app = getApp();
var $ = require('../../utils/util.js');
Page({
  data: {
    vendorId: 0,
    type:0,
  },
  onLoad: function (options) {
    this.setData({
      vendorId: options.vendorId,
      type: options.type
    })
    var that = this
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.publicQRcode()
      }, options.uid);
    } else {
      this.publicQRcode()
    }
  },
  publicQRcode: function () {
    var that = this
    if (this.data.vendorId == app.globalData.VendorInfo.Id && this.data.type==1) {
      var intervalDate = setTimeout(function () {
        wx.redirectTo({
          url: '../favorable/favorable'
        })
      }, 500);
    } else {
      $.alert('无法识别')
    }
  }
})
