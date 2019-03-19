var app = getApp();
var $ = require('../../utils/util.js');
Page({
  data: {
    vendorId: 0,
    tableNum: "",
  },
  onLoad: function (options) {
    console.log(app)
    this.setData({
      vendorId: options.vendorId,
      tableNum: options.tableNum
    })
    var that = this
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.QRcode()
      }, options.uid);
    } else {
      this.QRcode()
    }
  },
  QRcode: function () {
    
    var that = this
    if (this.data.vendorId == app.globalData.VendorInfo.Id) {
      var intervalDate = setTimeout(function () {
        wx.redirectTo({
          url: '../orderFood/orderFood?tableNum=' + that.data.tableNum,
        })
      }, 500);
    } else {
      $.alert('无法识别')
    }
  }
})
