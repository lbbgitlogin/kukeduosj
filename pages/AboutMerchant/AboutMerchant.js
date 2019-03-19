var app = getApp()
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
	data: {
		UserInfo:{},
	},
  onLoad:function(){
    var that=this
    this.setData({
      UserInfo: app.globalData.VendorInfo
    })
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.UserInfo.LegalNumber
    })
  },
})