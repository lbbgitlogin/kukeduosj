var app = getApp()
var $ = require('../../utils/util.js')
var refundAPI = require('../../api/refundAPI.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnNum: "",
    Info: "",
    statusStr:"",
    recordList: [], //申请记录列表
    recordShow: false,
    recordpage: true,
    isnav: true,//悬浮导航字段
    isquicknav: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      returnNum: options.on,
      statusStr: options.statusStr
    })
    // on = H83520001712399 & statusStr=已取消
    that.GetPostSaleSchedule()
  },
  // GetPostSaleSchedule
  GetPostSaleSchedule: function() {
    var that = this;
    var val = {
      goodsReturnNum: that.data.returnNum
    }
    $.xsr($.makeUrl(refundAPI.GetPostSaleSchedule, val), function(res) {
      console.log(res)
      if (res.Code == 0) {
        that.setData({
          Info: res.Info
        })
      }
    })
  },
  //快捷导航
  nav: function () {
    this.setData({
      isnav: false,
      animation: false
    })
  },
  outnav: function () {
    var that = this;
    this.setData({
      animation: true
    })
    setTimeout(function () {
      that.setData({
        isnav: true
      })
    }, 250)
  },
  scrolltoupper: function (e) {
    console.log(e, this.data.isquicknav)
    if (e.detail.scrollTop >= this.data.screenHeight) {
      this.setData({
        isquicknav: true
      })
    } else {
      this.setData({
        isquicknav: false
      })
    }
  },
  returnTop: function () { //返回顶部
    this.setData({
      scposition: 0
    });
  },
})