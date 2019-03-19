var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
    data: {
        CashData:{},
        isECashCard: true,
        isMemDist: true
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that=this
      if ($.isNull(app.globalData.UserInfo)) {
        app.GetUserInfo(function () {
          that.GetUserCashInfo()
          that.setData({
            Currency: app.globalData.VendorInfo.Currency
          })
        }, options.uid);
      } else {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.GetUserCashInfo()
      }
    },
    GetUserCashInfo:function(){
      var that = this;
      var val = {
        UserId: app.globalData.UserInfo.Id,
      }
      $.xsr($.makeUrl(userapi.GetUserCashInfo, val), function (data) {
        console.log(data);
        that.setData({
          CashData: data.Info,
        });
      });
      var str = app.globalData.VendorInfo.VendorFeatureSet
      if (str.indexOf("ECashCard") > -1) {//储值
        this.setData({
          isECashCard: true
        })
      } else {
        this.setData({
          isECashCard: false
        })
      }
      if (str.indexOf("MemDist") > -1) {//会员分销
        this.setData({
          isMemDist: true
        })
      } else {
        this.setData({
          isMemDist: false
        })
      }
    },
    
    showTip:function(){
        $.confirm("只要你在店铺分享任何商品或者活动页面到微信，吸引到朋友点击并且进入店铺，TA即会成为你的一级粉丝，TA分享的一级粉丝会成为你的二级粉丝，一、二级粉丝支付购买的任何店铺内的商品，都会按照一定的计算方法算作你的奖金收益。 如果没有获得收益，主要可能有以下原因：- 你的朋友在之前已经成为其他人粉丝；- 系统判定该笔订单数据异常，收益被取消；- 自己点击了自己分享的商品链接。");
    },
  onGotUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.goto()
    } else {

    }
  },
    goto:function(){
      $.gotopage('../recharge/recharge')
    }
})