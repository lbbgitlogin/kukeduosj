// integratShop/memberIntegral/ memberIntegral.js
var app = getApp()
var $ = require('../../utils/util.js');
var integraiAPI = require('../../api/integratShop.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipInfo:"",
    PointContent:"",//积分解读初始化数据
    isTrue:true,//解读明细切换
  },
  /** 积分解读切换 */
  navAnalysis:function(){
    let that = this ;
    that.setData({
      isTrue: true,
    })
  },
  /** 积分明细切换 */
  navdetail: function () {
    let that = this;
    that.setData({
      isTrue: false,
    })
  },


/**去花积分 */
  toPoints:function(){
    wx.navigateBack({
      url: '/integratShop/integralPage/integralPage',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.findUsablePoint();
        that.GetMemberPointContent()
      });
    } else {
      that.findUsablePoint();
      that.GetMemberPointContent()
    }
  },

  findUsablePoint: function () { //根据当前账户查询可用积分
    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id,
    };
    $.xsr($.makeUrl(integraiAPI.findUsablePoint, val), function (res) {
      if (res.Code == 0) {
        that.setData({
          vipInfo: res.Info
        })
      }
    })
  },
  GetMemberPointContent: function() {
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
    };
    $.xsr($.makeUrl(integraiAPI.GetMemberPointContent, val), function(res) {
      console.log("获取积分解读数据", res)
      if (res.Code == 0) {
        that.setData({
          PointContent: res.Info
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})