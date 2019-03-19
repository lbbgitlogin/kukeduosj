var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
	data: { 
    info:{},
    discount:"",
    deduction:0,
    showRPK: false,
    ActivityGroupId: 0,
    maxRPK: 0,
    deduction: 0,
    type: 0,
	},
	onLoad: function (options) {
    this.setData({
      Currency: app.globalData.VendorInfo.Currency
    })
    var val = {
      userId: app.globalData.UserInfo.Id,
      orderNum: options.on,
    }
    this.setData({
      type: options.type
    })
    if (options.type) {
      this.setData({
        showRPK: true
      })
    }
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetOrderInfo, val), function (data) {
      console.log(data);
      thisobj.setData({
        info: data.Info[0],
        discount: (data.Info[0].CouponDiscount + data.Info[0].OrderTypeDiscount).toFixed(2),
        deduction: data.Info[0].ECardCash + data.Info[0].ExtraCash
      });
    });
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      sponsorId: app.globalData.UserInfo.Id,
      orderNum: options.on
    }
    $.xsr($.makeUrl(orderapi.PrepareShareLuckyRedPacket, val), function (data) {
      thisobj.setData({
        maxRPK: data.Info.LuckyOrder,
        ActivityGroupId: data.Info.LuckyRedPacketActivityGroupId
      });
    });
    wx.hideShareMenu();
  }, onShareAppMessage: function () {//分享
    return {
      title: "拼手气红包，第" + this.data.maxRPK + "个领取的红包最大!",
      imageUrl: 'http://kkdfile.kukeduo.cn/appicon/shareImg.png',
      path: 'pages/redpacket/redpacket?g=' + this.data.ActivityGroupId + "&n=" + this.data.maxRPK+"&uid="+app.globalData.UserInfo.Id,
      success:function(){
        $.xsr1($.makeUrl(orderapi.ShareCount, { sponsorId: app.globalData.UserInfo.Id, audienceType: 1, audienceId: 0, ContentType: 22, contentId: that.data.ActivityGroupId }));
      }
    }
  },
  shareQRCode: function (e) {
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      sponsorId: app.globalData.UserInfo.Id,
      imageUrl: 'http://kkdfile.kukeduo.cn/appicon/shareImg.png',
      path: 'pages/redpacket/redpacket?g=' + this.data.ActivityGroupId+ "&n=" + this.data.maxRPK+"&uid="+app.globalData.UserInfo.Id,
      luckyOrder: this.data.maxRPK
    }
    $.xsr($.makeUrl(orderapi.ShareLuckyRedPacket, val), function (data) {
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
  shareBox: function () {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function () {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function () {
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
            $.xsr1($.makeUrl(orderapi.ShareCount, { sponsorId: app.globalData.UserInfo.Id, audienceType: 3, audienceId: 0, ContentType: 22, contentId: that.data.ActivityGroupId }));
          },
          fail: function (e) {
            $.hideloading();
            console.log("保存图片失败：", e)
          }
        });
      }, fail: function (e) {//下载图片出错
        $.hideloading();
      }
    })
  },
  showCodeImg: function () {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  IsShowRPK: function () {
    var that = this;
    if (that.data.showRPK) {
      setTimeout(function () {
        that.setData({
          showRPK: false,
          type: 1
        });
      }, 250);
    } else {
      that.setData({
        showRPK: true,
        type: 1
      });
    }
  }
})