// pages/Receivetails/Receivetails.js
var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
var userapi = require('../../api/userAPI.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: "",
    couponItemId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cid: options.cid,
      couponItemId: options.couponItemId
    })
    console.log("数据：", options)
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.GetCouponInfo();
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.GetCouponInfo();
    }
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
      that.shareQRCode()
    } else {

    }
  },

  shareQRCode: function (e) {
    console.log("2：", this.data.cid);
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
      couponId: this.data.cid
    }
    $.xsr($.makeUrl(userapi.QRCouponCodePoster, val), function (data) {
      console.log("图片", data)
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
  showCodeImg: function () {  //点击放大图片
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  saveImg: function () { //保存图片
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function (res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
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
          fail: function (e) {
            $.hideloading();
          }
        });
      },
      fail: function (e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  cancelShare: function () { //我的海报关闭按钮
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  usenow: function(e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../couponsuitproduct/couponsuitproduct?id=' + id
    })
  },
  shareBox: function () {//分享给好友按钮打开底部分享
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function () { //底部取消按钮事件
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  //分享功能
  onShareAppMessage: function(res) {

    var that = this;
      return {
        title:"送你一张优惠券，快来领取吧",
        path: 'pages/Coupondetails/Coupondetails?cid=' + this.data.cid  +'&uid='+ app.globalData.UserInfo.Id
      }
  },

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
  GetCouponInfo: function() {

    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
      couponId: this.data.cid,
      couponItemId: this.data.couponItemId
    }
    var that = this;
    console.log("获取优惠券列表", val)
    $.xsr($.makeUrl(userapi.GetCouponInfo, val), function(data) {
      console.log("获取优惠券列表666", data)
      if (data.Info != null && data.Code != 1) {
        that.setData({
          CenterCoupon: data.Info,

        })
      }
    })

  }
})