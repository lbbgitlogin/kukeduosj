var app = getApp();
var $ = require('../../utils/util.js');
Page({
  data: {
    remark: ""
  },
  onLoad: function (options) {
    
  },
  inputRemark: function (e) {//输入参数
    this.setData({
      remark: e.detail.value,
      remarkLength: e.detail.value.length
    });
  },
  goback:function(){
    $.gopage('../orderTrue/orderTrue?remark=' + this.data.remark)
  }
})