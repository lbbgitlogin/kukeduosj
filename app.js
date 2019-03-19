//app.js
var $ = require('utils/util.js');
var urlmap = require('utils/urlmap.js');
var api = require('api/indexAPI.js');
var tj = require('kkd-tj/kkd-tj.js');

App({
  onShow: function () {
  },
  SendMessage: function (PostData) { //发送模版消息
    PostData.VendorId = this.globalData.VendorInfo.Id;
    PostData.UserId = this.globalData.UserInfo.Id;
    PostData.WXOpendId = this.globalData.UserInfo.WeiXinOpenId;
    $.xsr1($.makeUrl(api.NewSendTemplateMessage, PostData), function (data) {

    })
  },
  GetUserInfo: function (callback, Uid, sid, callfrist) {
    //获取店铺信息test
    var that = this;
    //获取商家信息
    wx.getSetting({
      success: function (res) {
        console.log("获取设置：",res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({ //获取登录用户的信息
            success: function (res) {//直接进行更新
              var wxinfo = $.parseJSON(res.rawData);
              wx.login({
                success: function (datainfo) {
                  console.log("已经登陆", datainfo)
                  var thatdata = {
                    code: datainfo.code,
                    NickName: wxinfo.nickName,
                    sex: wxinfo.gender,
                    photo: wxinfo.avatarUrl,
                    WXCountry: wxinfo.country,
                    WXCity: wxinfo.city,
                    WXProvince: wxinfo.province,
                    Uid: Uid || 0,
                    storeId: sid || 0
                  }
                  $.xsr($.makeUrl(api.UserLogin, thatdata), function (data) {

            
                    console.log("店铺页面基本设置1：",data)
                    that.globalData.ImgPath = data.Info.ShopInfo.ShopConfig.AppIconPath;
                    that.globalData.VendorInfo = data.Info.ShopInfo;
                    that.globalData.UserInfo = data.Info.UserInfo;
                    callback && callback();
                    callfrist && callfrist();
                    that.kkd_tj.SyscUser(data.Info.UserInfo.UserName);
                  });
                }
              });
            }
          });
        } else {
          wx.login({
            success: function (datainfo) {
              var thatdata = {
                code: datainfo.code,
                Uid: Uid || 0,
                sex: 0,
                storeId: sid || 0
              }
             
              $.xsr($.makeUrl(api.UserLogin, thatdata), function (data) {
                console.log("店铺页面基本设置：", data)
                that.globalData.ImgPath = data.Info.ShopInfo.ShopConfig.AppIconPath;
                that.globalData.VendorInfo = data.Info.ShopInfo;
                that.globalData.UserInfo = data.Info.UserInfo;
                callback && callback();
                callfrist && callfrist();
                that.kkd_tj.SyscUser(data.Info.UserInfo.UserName);
              });
            },
            fail: function (e) {
              console.log("登录失败：", e);
            }
          });
        }
      }, fail(res) {
        console.log("失败", res);
      }
    });
  },
  onPageNotFound(res) {
    urlmap.urlmap(res.path);
  },
  globalData: {
    UserInfo: null,
    AdContent: null,
    ImgPath: "",

    
    VendorInfo: null,
    versionNumber: 'v1.9.0'
  }
})