var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');

Page({
  data: {
    UserInfo: null,
    NickName: "",
    Photo: "",
    current: "",
    desc: "",
    issharetitle: "",
    VendorInfo: null,
    BoxType: 0, //展示类型：1.我要代言,2.还是我也要代言
    DisplayDistributionSettingDetail: false,
    PageQRCodeInfo2: { //二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false
    },
    PageQRCodeInfo1: { //二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false,
      IsJT1: false,
    },
    IsSatisfyDistribution: false //是否可以分销
  },
  onLoad: function(options) {
    console.log("opopopop:",options)
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.loadInit(options);
        that.GetShopNameDesc();
      }, options.uid);
    } else {
      that.loadInit(options);
      that.GetShopNameDesc();
    }
  },
  GetShopNameDesc: function(options) { //代言页面基本信息
    var that = this;
    var val = {
      vendorId: that.data.VendorInfo.Id
    }
    $.xsr($.makeUrl(userapi.GetShopNameDesc, val), function(data) {
      console.log("代言页面基本信息：", data)
      if (data.Code == 0) {
        that.setData({
          desc: data.Info
        });


      }

    });
  },
  loadInit: function(options) {
    var that = this;
    var val = {
      userId: options.uid || app.globalData.UserInfo.Id
    }
    $.xsr($.makeUrl(userapi.GetUserNickNameAndPhotoById, val), function(data) {
     
      that.setData({
        BoxType:  1,
        // BoxType: options.uid ? ((options.uid == app.globalData.UserInfo.Id) ? 1 : 2) : 1,
        NickName: data.Info.NickName || '',
        Photo: data.Info.Photo || ''
      });
    });
    this.setData({
      UserInfo: app.globalData.UserInfo,
      VendorInfo: app.globalData.VendorInfo
    });
    that.GetUserCashInfo();
  },

  onShareAppMessage: function() {

    var that=this;
    console.log("taht:",that.data)
    // that.setData({
    //   isopen: that.data.desc.IsDiyShare,
    //   isshopname: that.data.desc.ShopName,
    //   issharetitle: that.data.desc.ShareTite,
    //   isshareurl: that.data.desc.ShareUrl
    // })
    let isshopname = that.data.desc.ShopName;
    let isopen = that.data.desc.IsDiyShare;
    let title = that.data.desc.ShareTite;
    let url = that.data.desc.ShareUrl;
    if (isopen){
      return {
        title: title, // 分享标题
        imageUrl: url,
        path: "/pages/endorsement/endorsement?uid=" + this.data.UserInfo.Id + "&n=" + this.data.UserInfo.NickName + "&p=" + this.data.UserInfo.Photo // 分享路径
      }
    }else{
      return {
        title: "我为"+ isshopname +"代言，邀请你一起推广代言", // 分享标题
        path: "/pages/endorsement/endorsement?uid=" + this.data.UserInfo.Id + "&n=" + this.data.UserInfo.NickName + "&p=" + this.data.UserInfo.Photo // 分享路径
      }

    }
  
  },
  onGotUserInfo3: function(e) { //   我要代言授权   按钮
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
      that.shareBox1()
    } else {

    }
  },
  onGotUserInfo2: function(e) { //邀请好友代言
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
      that.shareBox()
    } else {

    }
  },
  onGotUserInfo: function(e) { //邀请好友 生成海报
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
      that.shareQRCode1()
    } else {

    }
  },
  shareQRCode1: function (e) { //  我的代言 海报
    var that = this;

    var val = {
      vendorId: that.data.VendorInfo.Id,
      userId: that.data.UserInfo.Id,
      type: 2
    }

    $.xsr($.makeUrl(userapi.DYPosterPic, val), function (data) {
      console.log("海报：", data)
      that.setData({
        PageQRCodeInfo2: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT: true
        }
      });
    });
  },
  shareBox: function() { //打开分享页面
    this.setData({
      PageQRCodeInfo2: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  shareBox1: function() { //打开分享页面
    this.setData({
      PageQRCodeInfo1: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false,
        IsJT1: false,
      }
    });
  },
  onGotUserInfo4: function(e) { //我的代言码 授权个人信息，  t太阳码
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
      that.shareQRCode4(e)
    } else {

    }
  },
  shareQRCode4: function(e) { //我的代言码 生成太阳码，
    var that = this;
    var val = {
      vendorId: that.data.VendorInfo.Id,
      userId: that.data.UserInfo.Id,
      path: "/pages/index/index?uid=" + this.data.UserInfo.Id
    }
    $.xsr($.makeUrl(userapi.GetWXPageCode, val), function(data) {
      console.log("太阳码：", data)
      that.setData({
        PageQRCodeInfo1: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT: true
        }
      });
    });
  },
  showCodeImg: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.imgurl]
      })
  },
  cancelShare: function() { //关闭分享页面
    this.setData({
      PageQRCodeInfo2: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  cancelShare1: function() { //关闭分享页面
    this.setData({
      PageQRCodeInfo1: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false,
        IsJT1: false
      }
    });
  },
  cancelShare2: function() { //关闭分享页面
    this.setData({
      PageQRCodeInfo1: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT1: false
      }
    });
  },
  shareQRCode: function(e) { //  我的代言 海报
    var that = this;

    var val = {
      vendorId: that.data.VendorInfo.Id,
      userId: that.data.UserInfo.Id,
      type: 1
    }
    $.xsr($.makeUrl(userapi.DYPosterPic, val), function(data) {
   
      console.log("海报：", data)
      that.setData({
        PageQRCodeInfo1: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT1: true
        }
      });
    });
  },
  onGotUserInfo5: function(e) { //  我的代言 海报
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
  saveImg: function() {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo2.Path, //仅为示例，并非真实的资源
      success: function(res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              PageQRCodeInfo2: {
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
            console.log("保存图片失败：", e)
          }
        });
      },
      fail: function(e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  saveImg1: function() { //太阳码保存

    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo1.Path, //仅为示例，并非真实的资源
      success: function(res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              PageQRCodeInfo1: {
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
            console.log("保存图片失败：", e)
          }
        });
      },
      fail: function(e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  
  saveImg2: function () { //太阳码保存
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo1.Path, //仅为示例，并非真实的资源
      success: function (res) {
        console.log("保存成功图片")
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            that.setData({
              PageQRCodeInfo1: {
                Path: '',
                IsShare: false,
                IsShareBox: false,
                IsJT1: false
              }
            });
            $.alert("保存图片成功！");
          },
          fail: function (e) {
            
            $.hideloading();
            console.log("保存图片失败：", e)
          }
        });
      },
      fail: function (e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  BoxType: function() {
    this.setData({
      BoxType: 1
    });
  },

  GetUserCashInfo: function() {
    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
    }
    $.xsr($.makeUrl(userapi.GetUserCashInfo, val), function(data) {
      console.log("分销:",data);
      if (data.Code == 0) {
        that.setData({
          IsSatisfyDistribution: data.Info.IsSatisfyDistribution,
          DisplayDistributionSettingDetail: data.Info.DisplayDistributionSettingDetail
        });
      }
    });
  },
  shareBoxOff: function() {
    $.confirm("你目前还没有分销权限，请查看佣金规则，了解开启分销门槛！")
  }
})