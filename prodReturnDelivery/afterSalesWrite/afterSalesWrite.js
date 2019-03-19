var app = getApp()
var $ = require('../../utils/util.js')
var refundAPI = require('../../api/refundAPI.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnNum: '', //退货单号
    expressCompany: "", //快递公司
    logisticsNum: "", //快递单号
    readyInfo: "", //初始化数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
      }, options.uid, options.sid)
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
    }
    if ($.isNull(options.m)==false){
      wx.setNavigationBarTitle({
        title: '修改寄回单'
      })
    }
    that.setData({
      returnNum: options.on
    })
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow:")
    this.GetSendOrderInfo()
  },

  GetSendOrderInfo: function() {
    var that = this;
    var val = {
      goodsReturnNum: that.data.returnNum,
    }
    $.xsr($.makeUrl(refundAPI.GetSendOrderInfo, val), function(res) {
      console.log("回调：",val, res)
      if (res.Code == 0) {
        that.setData({
          readyInfo: res.Info,
          expressCompany: res.Info.ExpressCompany,
          logisticsNum: res.Info.LogisticsNum
        })
      }
    })
  },

 
  inputBlur: function (even){
    console.log(even)
    this.setData({
      expressCompany: even.detail.value
    })
  },
  logisticsBlur:function(even){
    this.setData({
      logisticsNum: even.detail.value
    })
  },

  sao: function() {
    var that = this;
    wx.scanCode({
      success: function(res) {
        that.setData({
          logisticsNum: res.result
        });
      },
      fail:function(e){
        console.log("扫码失败:",e)
        that.setData({
          logisticsNum: that.data.logisticsNum
        });
      }
    })
  },
  EditSendOrderInfo: function () { //编辑 提交
    var that = this;
    var val = {
      userName: app.globalData.UserInfo.UserName,
      goodsReturnNum: that.data.returnNum,
      expressCompany: that.data.expressCompany,
      logisticsNum: that.data.logisticsNum
    }
    if (val.expressCompany == null || val.expressCompany == '') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入快递公司名称！'
      });
      return;
    }
    console.log()
    if (val.logisticsNum == null || val.logisticsNum == '' || (/[^\u0000-\u00FF]/.test(val.logisticsNum))) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的快递单号！'
      });
      return;
    }
    console.log(val)
    $.xsr($.makeUrl(refundAPI.EditSendOrderInfo, val), function (res) {
      if(res.Code==0){
        $.alert("提交成功")
        setTimeout(function () {
          var pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
          var prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
          prevPage.setData({
            tabNav: 2,
            isBack: true
          }) 
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
      console.log(res)
    })
  },
})