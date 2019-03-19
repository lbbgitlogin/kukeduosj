// pages/redpacket/redpacket.js
var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActivityGroup:{},
    isShowMessage:"",
    isShowBox:false,
    g:0,
    n:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that=this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.InitPage(options);
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.InitPage(options);
    }
    that.setData({
      g: options.g,
      n: options.n
    });
  },
  InitPage: function (options) {
    var that = this;
    var val = {
      activityGroupId: options.g,
      participantId: app.globalData.UserInfo.Id,
      isNewUser: app.globalData.UserInfo.IsNewUser
    }
    console.log(val);
    $.xsr($.makeUrl(orderapi.DrawLuckyRedPacket, val), function (data) {
      if(data.Code==0){
        that.setData({
          ActivityGroup:data.Info,
          isShowBox:true
        });
        if (data.Info.IsGotCoupon) {
          $.alert(data.Info.EchoMessage);
        }
      }else{
        that.setData({
          isShowMessage: data.Msg,
          isShowBox: true
        });
      }
    });
  },
  lookMore:function(){
    var val = {
      activityGroupId: 2
    }
    var that=this;
    var thatObj = this.data.ActivityGroup;
    $.xsr($.makeUrl(orderapi.MoreLuckyRedPacketActivityList, val), function (data) {
      if(data.Info.length>0){
        thatObj.DrawActivities=thatObj.DrawActivities.concat(data.Info);
      }
      that.setData({
        ActivityGroup: thatObj,
        isShowBox: true
      });
    });
  },
  Using:function(){
    wx.switchTab({ url:'/pages/index/index'})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "拼手气红包，第" + this.data.n + "个领取的红包最大!",
      imageUrl: 'http://kkdfile.kukeduo.cn/appicon/shareImg.png',
      path: 'pages/redpacket/redpacket?g=' + this.data.g+"&n="+this.data.n+"&uid="+app.globalData.UserInfo.Id
    }
  }
})