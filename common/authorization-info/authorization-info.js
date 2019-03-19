// common/authorization-info.js
var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/indexAPI.js');
Component({
  properties: {
    isMust: Boolean || false//是否必须授权
  },
  data: {
    isAuthorization: false//是否需要进行授权操作
  },
  ready: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isAuthorization: false
          });
        } else {
          wx.login({
            success: function (datainfo) {
              var thatdata = {
                code: datainfo.code,
                Uid: 0,
                sex: 0,
                storeId: 0
              }
              $.xsr($.makeUrl(api.UserLogin, thatdata), function (data) {
                if (data.Info.UserInfo.NickName.indexOf("未注册")>-1) {
                  that.setData({
                    isAuthorization: true
                  });
                } else {
                  that.setData({
                    isAuthorization: false
                  });
                }
              });
            }
          });
        }
      }
    });

    // wx.getUserInfo({ //获取登录用户的信息
    //   success: function (res) {//直接进行更新
    //     that.setData({
    //       isAuthorization: false
    //     });
    //   },
    //   fail: function (res) { //需要进行授权，在进行更新
    //     wx.login({
    //       success: function (datainfo) {
    //         var thatdata = {
    //           code: datainfo.code,
    //           Uid: 0,
    //           sex: 0,
    //           storeId: 0
    //         }
    //         $.xsr($.makeUrl(api.UserLogin, thatdata), function (data) {
    //           if (data.Info.UserInfo.NickName == "未注册") {
    //             that.setData({
    //               isAuthorization: true
    //             });
    //           } else {
    //             that.setData({
    //               isAuthorization: false
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // })
  },
  methods: {
    bindGetUserInfo: function (e) {
      var that = this;
      if (e.detail.errMsg == 'getUserInfo:ok') {//开始更新用户信息
        that.setData({
          isAuthorization: false
        });
        var wxinfo = $.parseJSON(e.detail.rawData);
        wx.login({
          success: function (datainfo) {
            var thatdata = {
              code: datainfo.code,
              NickName: wxinfo.nickName,
              sex: wxinfo.gender,
              photo: wxinfo.avatarUrl,
              WXCountry: wxinfo.country,
              WXCity: wxinfo.city,
              WXProvince: wxinfo.province,
              Uid: 0,
              storeId: 0
            }
            $.xsr($.makeUrl(api.UserLogin, thatdata), function (data) {
              app.globalData.ImgPath = data.Info.ShopInfo.ShopConfig.AppIconPath;
              app.globalData.VendorInfo = data.Info.ShopInfo;
              app.globalData.UserInfo = data.Info.UserInfo;
            });
          }
        });
      }
    }

  }
})
