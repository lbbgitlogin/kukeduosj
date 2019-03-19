var app = getApp();
var $ = require('util.js');
var api = require('../api/indexAPI.js');
var homeAdvertising = function (that) {
  var thatdata = {
    vendorId: app.globalData.VendorInfo.Id
  }
  $.clearxsr($.makeUrl(api.GetVendorMiniAppAdSetting, thatdata), function (data) {
    console.log("首页弹窗：",data)
    if (data.Info.length > 0) {
      for (var item of data.Info) {
        if (item.AdType == 1) { //全屏广告
          if (item.DisplayType == 2) { //表示每日首次登陆
            wx.getStorage({
              key: "home-ads",
              success: function (res) { //如果缓存中存在，查看是否过期
                var dateNow = new Date(new Date().toLocaleDateString()).getTime();
                if (dateNow === res.data) { //看下缓存中是否等于当前时间,表示不弹窗
                  wx.showTabBar();
                } else { //不等于表示隔了一天弹窗，重置缓存，重新记录
                  that.setData({
                    homeAds: item,
                    countNum: item.StaySecond //用来倒计时
                  });
                  wx.setStorage({ //写入缓存
                    key: "home-ads",
                    data: dateNow
                  });
                }
              },
              fail: function (res) { //否则弹出弹框，记录缓存
                that.setData({
                  homeAds: item,
                  countNum: item.StaySecond //用来倒计时
                });
                var dateNow = new Date(new Date().toLocaleDateString()).getTime();
                wx.setStorage({ //写入缓存
                  key: "home-ads",
                  data: dateNow
                });
              }
            });
          } else {
            that.setData({
              homeAds: item,
              countNum: item.StaySecond //用来倒计时
            });
          }
        }
        if (item.AdType == 2) { //弹窗广告
          if (item.DisplayType == 2) { //表示每日首次登陆
            wx.getStorage({
              key: "msk-ads",
              success: function (res) { //如果缓存中存在，查看是否过期
                var dateNow = new Date(new Date().toLocaleDateString()).getTime();
                if (dateNow === res.data) { //看下缓存中是否等于当前时间,表示不弹窗
                  that.setData({
                    mskAds: null
                  });
                } else { //不等于表示隔了一天弹窗，重置缓存，重新记录
                  that.setData({
                    mskAds: item
                  });
                  wx.setStorage({ //写入缓存
                    key: "msk-ads",
                    data: dateNow
                  });
                }
              },
              fail: function (res) { //否则弹出弹框，记录缓存
                that.setData({
                  mskAds: item
                });
                var dateNow = new Date(new Date().toLocaleDateString()).getTime();
                wx.setStorage({ //写入缓存
                  key: "msk-ads",
                  data: dateNow
                });
              }
            });

          } else { //每次进入弹出
            that.setData({
              mskAds: item
            });
          }
        }
      }

      if (!that.data.homeAds) {
        wx.showTabBar();
      }
    } else {
      wx.showTabBar()
    }
  });

  that.mskAdsError = function (e) {//弹窗广告图片加载出错
    that.setData({
      mskAds: null
    });
  }

  that.homeAdsError = function (e) {//首页广告图片加载出错
    wx.showTabBar();
    that.setData({
      homeAds: null,
      countNum: 0 //用来倒计时
    });
  }

  that.imageLoad = function (e) { //首屏广告图片加载成功
    // var imgWidth = e.detail.width,
    //   imgHeight = e.detail.height;

    // wx.getSystemInfo({ //获取系统信息
    //   success: function(e) {
    //     var sysWidth = e.windowWidth,
    //       sysHeight = e.windowHeight;
    //     var per = remConversion(imgWidth, imgHeight, sysWidth, sysHeight)

    //     that.setData({ //设置图片个宽高
    //       imgHeight: per.height,
    //       imgWidth: per.width
    //     });

    var time = setInterval(function () { //进行倒计时
      if (that.data.countNum > 0) {
        that.setData({
          countNum: that.data.countNum - 1
        });
      } else {
        clearInterval(time);
        that.setData({
          homeAds: null
        });
        wx.showTabBar()
      }
    }, 1000);

    //     }
    //   })
  }
}

//计算图片宽高
function remConversion(imgWidth, imgHeight, sysWidth, sysHeight) {
  var sysPer = sysHeight / sysWidth; //屏幕高宽比
  var imgPer = imgHeight / imgWidth; //图片高宽比
  var result = {
    width: 0,
    height: 0
  };
  if (imgPer < sysPer) { //图片的高宽比小于屏幕的高宽比
    result.width = sysWidth;
    result.height = (sysHeight * imgHeight) / imgHeight;
  } else {
    result.height = sysHeight;
    result.width = (sysWidth * imgWidth) / imgWidth;
  }
  return result;
}

module.exports = {
  homeAdvertising: homeAdvertising
}