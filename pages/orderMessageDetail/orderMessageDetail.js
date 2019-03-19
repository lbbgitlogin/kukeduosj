var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
  data: {
    shoplogo: "",
    shopname: "",
    isTrue: false,
    isShow: false,
    isShow1:false,
    height: 0,
    index: 0,
    peopleNum: 0,
    remark: "",
    couponItemId: 0,
    IsUseCoupon: 1,
    addressId: 0,
    isFightGroup: "",
    addressId: 0,
    physicalStoreId: "",
    shipMethod: 0,
    sponsorId: 0,
    length: 0,
    length1:0,
    submitinfo: {},
    orderNum: "",
    Info: [],
    deduction: 0,
    showRPK: true,
    ActivityGroupId: 0,
    maxRPK: 0,
    deduction: 0
  },
  onLoad: function (options) {
    this.setData({
      peopleNum: options.peopleNum,
      remark: options.remark,
      orderNum: options.orderNum,
      shoplogo: app.globalData.VendorInfo.WapLogoPath,
      shopname: app.globalData.VendorInfo.ShopName,
      Currency: app.globalData.VendorInfo.Currency
    })
    this.GetMealOrder()
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      sponsorId: app.globalData.UserInfo.Id,
      orderNum: options.orderNum
    }
    var that=this;
    $.xsr($.makeUrl(orderapi.PrepareShareLuckyRedPacket, val), function (data) {
      that.setData({
        maxRPK: data.Info.LuckyOrder,
        ActivityGroupId: data.Info.LuckyRedPacketActivityGroupId
      });
    });
    wx.hideShareMenu();
  },
  more: function () {
    this.setData({
      isShow: false,
      height: this.data.length * 100
    })
  },
  more1: function () {
    this.setData({
      isShow1: false,
      height: this.data.length * 100
    })
  },
  GetMealOrder: function () {
    var that = this
    var val = {
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(orderapi.GetMealOrder, val), function (data) {
      if (data.Code == 0) {
        that.setData({
          Info: data.Info,
          length: data.Info[0].OrderDetailVOList.length,
          deduction: (data.Info[0].ECardCash + data.Info[0].ExtraCash).toFixed(2)
        })
        if (data.Info[0].OrderDetailVOList.length * 100 > 1000) {
          that.setData({
            isShow: true,
            height: 1000,
          })
        } else {
          that.setData({
            isShow: false,
            height: data.Info[0].OrderDetailVOList.length * 100
          })
        }
        if (!$.isNull(data.Info[0].OrderDetailAddMealVOList)){
          that.setData({
            length1: data.Info[0].OrderDetailAddMealVOList.length
          })
        }
        if (!$.isNull(data.Info[0].OrderDetailAddMealVOList)){
          if (data.Info[0].OrderDetailAddMealVOList.length1 * 100 > 1000) {
            that.setData({
              isShow1: true,
              height: 1000,
            })
          } else {
            that.setData({
              isShow1: false,
              height: data.Info[0].OrderDetailAddMealVOList.length1 * 100
            })
          }
        }
      }
    })
  },
  goback: function () {
    wx.navigateTo({
      url: '../orderFood/orderFood?orderNum=' + this.data.orderNum + "&tableNum=" + this.data.Info[0].Num,
    })
  },
  gobuy: function () {
    //  wx.navigateTo({
    //   url: '../orderPay/orderPay?orderNum=' + this.data.orderNum + "&money=" + this.data.Info[0].TotalMoney,
    // })
  wx.redirectTo({
      url: '../orderPay/orderPay?orderNum=' + this.data.orderNum + "&money=" + this.data.Info[0].TotalMoney,
    })

  }, sendMessage: function (OrderNum) {//发送模版消息
    var val = {
      api: orderapi.OrderPaySuccessWXMessage,
      pages: 'pages/orderdetail/orderdetail?on=' + OrderNum,
      formId: this.data.formId,
      WeiXinOpenId: app.globalData.UserInfo.WeiXinOpenId,
      value: {
        VendorId: app.globalData.VendorInfo.Id,
        OrderNum: OrderNum
      }
    }
    $.sendTpl(val);
  },
  onShareAppMessage: function () {//分享
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
          showRPK: false
        });
      }, 250);
    } else {
      that.setData({
        showRPK: true
      });
    }
  }
})