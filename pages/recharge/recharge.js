countNumcountNumvar app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
var vendorapi = require('../../api/vendorAPI.js');
var orderapi = require('../../api/orderAPI.js');
var cartapi = require('../../api/cartAPI.js');
Page({
  data: {
    Info:[],
    fid:0,
    OrderNum:"",
    isShow:true
  },
  onLoad:function(){
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.GetVendorECashCardList();
      });
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.GetVendorECashCardList();
    } 
  },
  choose:function(e){
    this.setData({
      fid: e.currentTarget.dataset.id
    });
  },
  GetVendorECashCardList:function(){
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
    }
    var that = this;
    $.xsr($.makeUrl(vendorapi.GetVendorECashCardList, val), function (data) {
      if(data.Info.length>0){
        that.setData({
          Info:data.Info,
          fid:data.Info[0].Id,
          isShow:true
        })
      }else{
        that.setData({
          isShow: false
        })
      }
    });
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
      that.paysubmit()
    } else {

    }
  },
  paysubmit: function (e) {
    var that = this;
    var val = {
      eCashCardId: this.data.fid,
      userId: app.globalData.UserInfo.Id,
      vendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(orderapi.ECashRecharge, val), function (data) {
      console.log("充值：",val,data);
      that.setData({
        orderNum: data.Info.OrderNum
      });
      if (data.Code == 0) {
        if (data.Info.RealCardCash  > 0) {
          that.gotopay()
        }
        else if (data.Info.RealCardCash  == 0) {
          $.gotopage('../rechargeorderdetail/rechargeorderdetail?on=' + data.Info.OrderNum);
        }
      }
    });
  },
  gotopay: function () { //去支付
    var that = this
    var val = {
      OrderNum: this.data.orderNum,
      OpendId: app.globalData.UserInfo.WeiXinOpenId,
      VendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(cartapi.GetWeiXinPrePayNum, val), function (data) {
      wx.requestPayment({
        'timeStamp': data.Info.timeStamp,
        'nonceStr': data.Info.nonceStr,
        'package': data.Info.package,
        'signType': data.Info.signType,
        'paySign': data.Info.paySign,
        'success': function (res) {
          that.returnUrl(val.OrderNum);
        },
        'fail': function (res) {
          // $.gotopage('../rechargeorderdetail/rechargeorderdetail?on=' + val.OrderNum);
        },
        'complete': function (res) {
          if (res.errMsg == "requestPayment:cancel") {
            $.gotopage('../rechargeorderdetail/rechargeorderdetail?on=' + val.OrderNum);
            that.sendMessage(val.OrderNum, 1);
          }
        }
      })
    });
  },
  returnUrl: function (OrderNum) {
    var that = this;
    if (!$.isNull(that.data.spinfo)) {
      var json = JSON.parse(that.data.spinfo);
      if (json.isFightGroup == 2) {
        if (json.isOwner) {
          $.gotopage('../rechargeorderdetail/rechargeorderdetail?on=' + OrderNum);
          return;
        } else {
          $.backpage(1, function () {
            notice.postNotificationName("RefreshFG");
          });
          return;
        }
      } else {
        $.gotopage('../rechargeorderdetail/rechargeorderdetail?on=' + OrderNum);
        return;
      }
    } else {
      $.gotopage('../rechargeorderdetail/rechargeorderdetail?on=' + OrderNum);
      return;
    }
  },
})