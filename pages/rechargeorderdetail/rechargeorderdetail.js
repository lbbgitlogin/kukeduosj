var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
	data: {
    info:{},
    discount:"",
	},
	onLoad: function (options) {
    this.setData({
      Currency: app.globalData.VendorInfo.Currency
    })
    var val = {
      orderNum: options.on
    }
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetECashOrderDetail, val), function (data) {
      thisobj.setData({
        info: data.Info
      });
    });
	},
  goback:function(){
    $.gotopage('../cashaccount/cashaccount')
  }
})