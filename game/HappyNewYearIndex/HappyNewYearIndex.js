var app = getApp()
var $ = require('../../utils/util.js');
var napi = require('../../api/NewAPI.js');

Page({
  data: {
    PageQRCodeInfo: {//二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false,
    },
    photo: '',   //用户头像
    imgUrls: [
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//827f1524-628d-4df7-9437-8ed2dbfd0e30.jpg',
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//827f1524-628d-4df7-9437-8ed2dbfd0e30.jpg',
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//827f1524-628d-4df7-9437-8ed2dbfd0e30.jpg',
    ],
    butUrls: [
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//7d711099-9ce3-4bab-9f1a-f0bed64762aa.png', //去拜年
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//69459aed-b03e-4bb4-981d-a04fd744e4a1.png', //比人气
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//6fe6303e-7051-4b3b-9d28-41f65d133dd8.png', //朋友圈
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//6fe6303e-7051-4b3b-9d28-41f65d133dd8.png', //朋友圈
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//5d959b96-54a0-416d-851b-10a5882e2567.png', //请扫码
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//5bef75fc-59aa-45fd-ac31-dc1b216caefb.png', //喝芝香
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//9c014ebf-9b50-4312-90cd-32db208e64f6.png', //换贺词
      'http://bbcfile.kukeduo.cn//ad001/201802/0517//bfa7b267-3f3f-4c8c-a517-fcb3f09e8adb.png', //预览
      'http://bbcfile.kukeduo.cn//ad001/201802/0517//0ace19f6-0a08-4a6d-8365-55b9de448877.png', //写福卡
    ],
    sid: 0,  //当前贺卡信息的id
    GameMsg: [],   //当前贺卡的信息
    bid: 0,   //当前活动的id
    isdata: true,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      sid: options.sid,
      bid: options.bid
    })
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          IsChannel: app.globalData.VendorInfo.IsChannel,//是否展示技术支持
        })
        that.Initialize()
      });
    }
    else {
      that.setData({
        IsChannel: app.globalData.VendorInfo.IsChannel,//是否展示技术支持
      })
      that.Initialize()
    }
  },
  Initialize: function () {
    var that = this
    that.setData({
      photo: app.globalData.UserInfo.Photo,
    })
    that.GetBlessedGameMsg()
  },
  shareQRCode: function (e) {  //分享二维码模板
    wx.showLoading({
      mask: true,
      title: '',
    })

    var that = this;
    var GameMsg = that.data.GameMsg
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      path: 'game/HappyNewYearIndex/HappyNewYearIndex?sid=' + that.data.sid + '&bid=' + that.data.bid,
      userCall: GameMsg.UserCall,
      position: GameMsg.Position,
      congratulations: GameMsg.Congratulations,
      userImg: GameMsg.UserPhotoPath,
      userName: GameMsg.UserName,
    }
    console.log(val)
    $.xsr($.makeUrl(napi.QRBlessedGamePoster, val), function (data) {
      console.log(data)
      if (data.Code == 0) {
        wx.hideLoading()
        that.setData({
          PageQRCodeInfo: {
            Path: data.Info,
            IsShare: true,
            IsShareBox: false,
            IsJT: true
          }
        });
        that.AddForwardRecord()
      } else {
        wx.hideLoading()
      }

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
        wx.showToast({
          title: '',
          icon: 'loading',
          duration: 2000,
          mask: true
        })
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
            $.alert("保存图片失败：", e)
            wx.openSetting({
              success: (res) => {
              }
            })
          }
        });
      }, fail: function (e) {//下载图片出错
        wx.showToast({
          title: '下载图片出错',
          icon: 'loading',
          duration: 2000
        })
        wx.openSetting({
          success: (res) => {
          }
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.GameMsg.UserName + '给你送福气啦！',
      path: '/game/HappyNewYearIndex/HappyNewYearIndex?sid=' + this.data.sid,
      success: function (res) {
        that.AddForwardRecord()
      },
    }
  },
  showCodeImg: function () {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  GetBlessedGameMsg: function () {   //获取贺岁信息接口
    var that = this;
    var val = {
      Id: that.data.sid,
    }
    console.log(val)
    $.xsr($.makeUrl(napi.GetBlessedGameMsg, val), function (data) {
      console.log("获取贺岁信息接口",data)
      if (data.Code == 0) {
        that.setData({
          GameMsg: data.Info
        });
        if (data.Info.UserId != app.globalData.UserInfo.Id) {   //如果送福人不等于接受福人  执行访问量接口
          that.AddBlessedGameRecord()
        }
      }else{
        that.setData({
          isdata: false
        });
      }
    });
  },
  AddForwardRecord: function () {   //记录转发记录接口
    var that = this;
    var val = {
      blessedGameId: parseInt(that.data.bid),
      userId: app.globalData.UserInfo.Id,
      vendorId: app.globalData.VendorInfo.Id,
    }
    console.log(val)
    $.xsr($.makeUrl(napi.AddForwardRecord, val), function (data) {
      console.log(data)
    });
  },
  AddBlessedGameRecord: function () {   //2.1.3记录访问记录接口
    var that = this;
    var GameMsg = that.data.GameMsg
    var val = {
      shareUserId: GameMsg.UserId,
      sharePhoto: GameMsg.UserPhotoPath,
      userId: app.globalData.UserInfo.Id,
      photo: app.globalData.UserInfo.Photo,
      gameId: that.data.bid,
      vendorId: app.globalData.VendorInfo.Id,
      wordId: that.data.sid
    }
    console.log(val)
    $.xsr($.makeUrl(napi.AddBlessedGameRecord, val), function (data) {
      console.log(data)
    });
  },
  gotohny:function(){
    wx.navigateTo({
      url: '../HappyNewYear/HappyNewYear',
    })
  }
})