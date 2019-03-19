// pages/Coupondetails/Coupondetails.js
var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
var userapi = require('../../api/userAPI.js');
var notice = require('../../utils/notice.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    cid: "",
    Coupons:"",
    couponname: "",
    flag: true,
    Percentage: "",//赋值领取百分比
    state:"",//领取后赋值
    infoIndex: 0,//对应列表第几条
    Id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options",options)
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency,
          cid: options.cid,
          infoIndex: options.i
        })
        that.GetCouponInfo();

      }, options.uid, options.sid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency,
        cid: options.cid,
        infoIndex: options.i
      })
      that.GetCouponInfo();
    }
  },
  onShareAppMessage: function (res) {


    var that = this;
  
      return {
        title: "送你一张优惠券，快来领取吧",
        path: 'pages/Coupondetails/Coupondetails?cid=' + this.data.cid + '&uid=' + app.globalData.UserInfo.Id
        
      }
  
  },
  GetCouponInfo: function() {  //优惠券信息
  
    console.log("1：", this.data.cid);
    var taht=this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
      couponId: this.data.cid
    }
    var that = this;
    console.log("this.data",this.data)
    
    $.xsr($.makeUrl(userapi.GetCouponInfo, val), function(data) {
      console.log("res",data)

      if (data.Info != null && data.Code != 1) {
        console.log("that.data", taht.data.infoIndex)
       
        if (data.Info.UsedStatus != 1 ){
          that.setData({
            state:2

          })
          notice.postNotificationName("Refresh", { num: that.data.state, id: val.couponId, i: taht.data.infoIndex, CouponItemId: taht.data.Coupons.CouponItemId, Percentage: taht.data.Percentage});
        }
     
        that.setData({
          CenterCoupon: data.Info,
          couponname: app.globalData.VendorInfo.ShopName
        })
      }
    })

  },
  onGotUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.shareQRCode()
    } else {

    }
  },

  shareQRCode: function(e) {
    console.log("2：", this.data.cid);
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
      couponId: this.data.cid
    }
    $.xsr($.makeUrl(userapi.QRCouponCodePoster, val), function(data) {
      console.log("图片",data)
      that.setData({
        PageQRCodeInfo: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT: true
        }
      });
    });
  },
  getUserReceiveCoupon: function() { //用户领取普通优惠券
    var taht = this;
    console.log("2：", this.data.cid);
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: this.data.cid,
      UserId: app.globalData.UserInfo.Id,
      Code: this.data.Code,
      IsNewUser: 0
    }
    var that = this;
    $.xsr($.makeUrl(userapi.UserReceiveCoupon, val), function(data) {
      console.log("red",data)
      if (!$.isNull(data.Info) && data.Code == 0) {
     
        that.setData({
          flag: false,
          Coupons: data.Info[0],
          islength: data.Info[0].DiscountMoney + '',
          Percentage: data.Info[0].Percentage
        });
        notice.postNotificationName("Refresh1", { i: taht.data.infoIndex, id: val.CouponIds, Percentage: that.data.Percentage });
        that.GetCouponInfo();
      } else {
        $.alert(data.Msg);
        that.GetCouponInfo();
      }
    })
  },
  cancelShare: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function() {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function(res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              PageQRCodeInfo: {
                Path: '',
                IsShare: false,
                IsShareBox: false,
                IsJT: false
              }
            });
            $.alert("保存图片成功！");
          },
          fail: function(e) {
            $.hideloading();
          }
        });
      },
      fail: function(e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  shareBox: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function() {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function(res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              PageQRCodeInfo: {
                Path: '',
                IsShare: false,
                IsShareBox: false,
                IsJT: false
              }
            });
            $.alert("保存图片成功！");
          },
          fail: function(e) {
            $.hideloading();
          }
        });
      },
      fail: function(e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  showCodeImg: function() {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  shareBox: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  onGotUserInfo11: function (e) {
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
      that.receivenowWeixin(e)
    } else {

    }
  },
  receivenowWeixin: function(e) { //微信领取卡券

    var that = this;
    var val = {
      card_id: e.currentTarget.dataset.cardid,
      vendorId: app.globalData.VendorInfo.Id,
      openid: app.globalData.UserInfo.WeiXinOpenId
    }
    $.xsr($.makeUrl(userapi.receiveWeixinCoupons, val), function(data) {

      console.log("微信领卡：", data)
      wx.addCard({
        cardList: [{
          cardId: data.Info.cardId,
          cardExt: '{"openId": "' + app.globalData.UserInfo.WeiXinOpenId + '", "timestamp": "' + data.Info.timestamp + '", "signature":"' + data.Info.signature + '","nonce_str":"' + data.Info.nonce_str + '",}'
        }],
        success: function(res) {

          console.log("code解码：", res)
          //code解码
          var codeVla = {
            code: res.cardList[0].code,
            access_token: data.Info.access_token
          }
          $.xsr($.makeUrl(userapi.codeDecode, codeVla), function(data) {
            var thatdata = $.parseJSON(data.Info);
            that.setData({
              Code: thatdata.code,
              Id: e.currentTarget.dataset.cardid
            });
            that.getUserReceiveCoupon();
          });
        },
        fail: function(res) {
          console.log("领取失败", res);
        },
        complete: function(res) {
          console.log("领取成功或者失败", res);
        },
      });
    });
  },
  onGotUserInfo22: function (e) {
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
      that.receivenow(e)
    } else {

    }
  },
  receivenow: function(e) { //立即领取优惠券普通

    var that = this;
    if (e.currentTarget.dataset.isreceive == -1) {
      return;
    }
    that.setData({
      Id: e.currentTarget.dataset.id
    });
    that.getUserReceiveCoupon();
  },
  outertouch: function() { //关闭
    this.setData({
      flag: true
    });
  },

  innertouch: function() { //打开
    this.setData({
      flag: false
    });
  }

})