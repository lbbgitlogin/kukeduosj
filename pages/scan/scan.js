var app = getApp();
var $ = require('../../utils/util.js');
Page({
  data: {
    vendor:0,
    tableNum:"",
    path:""
  },
  onLoad: function (options) {
    var that = this
    var intervalDate = setTimeout(function () {
      var that = this
      wx.scanCode({
        success: function (data) {
          var path = data.path.split(/\=|\&/)
          if (path[1] == app.globalData.VendorInfo.Id) {
            wx.redirectTo({
              url: '../orderFood/orderFood?tableNum=' + path[3],
            })
          } else {
            $.alert('无法识别')
          }
        }
      })
    }, 500);
  },
})
