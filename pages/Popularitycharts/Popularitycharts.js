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
      'http://bbcfile.kukeduo.cn//ad001/201802/0320//98d2bd5b-f0ae-4355-8685-8b33f4120b22.png',
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
    userId: 0,
    bid: 0,
    Ranking: [],
    indexUrl: [
      '../../img/1.png',
      '../../img/2.png',
      '../../img/3.png',
      '../../img/4.png',
      '../../img/5.png',
      '../../img/6.png',
      '../../img/7.png',
      '../../img/8.png',
    ],
    indexi: 0,
    IsSF:true,
    isdata: true
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      userId: options.uid,
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
    that.GetUserRanking()
  },
  shareQRCode: function (e) {  //分享二维码模板
    wx.showLoading({
      mask: true,
      title: '',
    })

    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      path: 'pages/HappyNewYear/HappyNewYear',
      BlessedIndex: that.data.Ranking.BlessedIndex,
      BlessedCount: that.data.Ranking.BlessedCount,
      RecordCount: that.data.Ranking.BlessedGameRecord ,
      userImg: app.globalData.UserInfo.Photo,
      // IsSF: that.data.IsSF
    }
      console.log(val)
    $.xsr($.makeUrl(napi.QRRankPoster, val), function (data) {
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
    // $.loading();
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
      title: '',
      path: '/pages/Popularitycharts/Popularitycharts?uid=' + app.globalData.UserInfo.Id + '&bid=' + that.data.bid,
      success: function (res) {
      },
    }
  },
  showCodeImg: function () {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  GetUserRanking: function () {   //获取转发记录信息
    var that = this;
    var val = {
      gameId: parseInt(that.data.bid),
      userId: parseInt(that.data.userId) || app.globalData.UserInfo.Id,
      vid: app.globalData.VendorInfo.Id,
    }
    console.log(val)
    $.xsr($.makeUrl(napi.GetUserRanking, val), function (data) {
      console.log(data)
      if (data.Code == 0) {
        that.setData({
          Ranking: data.Info[0],
        })
        if (data.Info[0].Title == "福气达人"){
          that.setData({
            IsSF: false,
          })
        }else{
          that.setData({
            IsSF: true,
          })
        }
        that.calculate()
      } else {
        that.setData({
          isdata: false
        });
      }
    });
  },
  calculate: function () {
    var that = this;
    var i = that.data.Ranking.BlessedIndex;
    var j = (i - 60) / 5
    that.setData({
      indexi: j
    })
  },
  gotohny: function () {
    wx.navigateTo({
      url: '../HappyNewYear/HappyNewYear',
    })
  }
})