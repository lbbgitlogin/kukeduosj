// pages/carDdetails/carDdetails.js
var app = getApp()
var $ = require('../../utils/util.js');
var user = require('../../api/userAPI.js');
var integraiAPI = require('../../api/integratShop.js');
var venapi = require('../../api/vendorAPI.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.GetMemberCardDetail()
  },
  // 会员卡信息
  GetMemberCardDetail: function () { //会员卡信息
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
    };
    $.xsr($.makeUrl(user.GetMemberCardDetail, val), function (res) {
      console.log("rrrrr", res)
      if (res.Code == 0) {
        that.setData({
          member: res.Info
        })
      }
    })
  },
  card_xinxi: function () {
    wx.navigateTo({
      url: '../datalits_card/datalits_card'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})