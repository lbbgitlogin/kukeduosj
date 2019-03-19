// pages/moneyrule/moneyrule.js
var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    isPop:false,
    ruleInfo:null,
    ListInfo:null
  },
  onLoad: function (options) {
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(userapi.GetUserDistributionRuleDesc, val), function (data) {
      if(data.Code==0){
        that.setData({
          ruleInfo:data.Info
        });
      }
    });
    $.xsr($.makeUrl(userapi.GetUserDistributionProduct, val), function (data) {
      if(data.Code==0){
        that.setData({
          ListInfo: data.Info
        });
      }
    });
  },
  ShowPop:function(){
    if (this.data.isPop){
      this.setData({
        isPop:false
      });
    }else{
      this.setData({
        isPop: true
      });
    }
  }
})