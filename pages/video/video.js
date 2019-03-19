var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
Page({
  data: {
    url:''
  },
  onLoad:function(options){
    var that=this
    var val = {
      userName: app.globalData.UserInfo.UserName,
      proId: options.pid,
    }
    $.xsr($.makeUrl(api.GetProductInfo, val), function (data) {
      console.log(data);
      that.setData({
        url: data.Info[0].Video
      })
    })
  }
})