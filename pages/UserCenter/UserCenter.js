var app = getApp()
var $ = require('../../utils/util.js');
var user = require('../../api/userAPI.js');
var vendorApi = require('../../api/vendorAPI.js');
Page({
	data: {
    Info:"",
		UserInfo: "",
    versionNumber:"",
    hascard: "",
		IsChannel:true,//是否展示技术支持
    PersonalCenterList:{},
    isMembership: true,
    isCoupon: true,
    isCutPrice:true,
    isECashCard: true,
    isMemDist: true,
    isFightGrp:true,
    isAbtVendor:true,
    isGetnum:true,
    isStorage: false,//是否有缓存
    isFlagPhoto:false,//后台是否开启获取手机号
    isWexinMobile:false//是否已授权
	},
	onShow:function(options) {
    var that =this
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.load();
      }, options.uid);
    } else {
      that.load();
    }
	},
  load:function(){
    var str = app.globalData.VendorInfo.VendorFeatureSet
    var that = this;
    this.setData({
      UserInfo: app.globalData.UserInfo,
      IsChannel: app.globalData.VendorInfo.IsChannel,//是否展示技术支持
      versionNumber: app.globalData.versionNumber
    });
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      UserId: app.globalData.UserInfo.Id,
    }
    $.xsr($.makeUrl(user.GetPersonalCenter, val), function (data) {
      console.log("判断：",data)
      that.setData({
        PersonalCenterList: JSON.parse(data.Info.DivContent),
        hascard: data.Info.IsReceiveCard
      });
    });
    if ($.isNull(app.globalData.UserInfo.Phone)){
      this.setData({
        isWexinMobile:true
      })
    }else{
      this.setData({
        isWexinMobile: false
      })
    }
    if (str.indexOf("Membership") > -1) {//会员体系
      this.setData({
        isMembership: true
      })
      var val = {
        UserId: app.globalData.UserInfo.Id,
        VendorId: app.globalData.VendorInfo.Id,
      }
      $.xsr1($.makeUrl(user.findUsablePoint, val), function (data) {
        that.setData({
          Info: data.Info
        });
      });
    } else {
      this.setData({
        isMembership: false
      })
    }
    if (str.indexOf("Coupon") > -1) {//优惠券
      this.setData({
        isCoupon: true
      })
    } else {
      this.setData({
        isCoupon: false
      })
    }

    if (str.indexOf("CutPrice") > -1) {//砍价
      this.setData({
        isCutPrice: true
      })
    } else {
      this.setData({
        isCutPrice: false
      })
    }
    if (str.indexOf("ECashCard") > -1) {//储值卡
      this.setData({
        isECashCard: true
      })
    } else {
      this.setData({
        isECashCard: false
      })
    }
    if (str.indexOf("MemDist") > -1) {//会员分销
      this.setData({
        isMemDist: true
      })
    } else {
      this.setData({
        isMemDist: false
      })
    }
    if (str.indexOf("FightGrp") > -1) {//拼团
      this.setData({
        isFightGrp: true
      })
    } else {
      this.setData({
        isFightGrp: false
      })
    }
    if (str.indexOf("AbtVendor") > -1) {//拼团
      this.setData({
        isAbtVendor: true
      })
    } else {
      this.setData({
        isAbtVendor: false
      })
    }
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      category: 'CollectMobile'
    }

    $.xsr($.makeUrl(vendorApi.GetVendorSetting, val), function (data) {
      
      if(data.Code==0){
        if(data.Info=='True'){
          that.setData({
            isFlagPhoto:true
          })
        }else{
          that.setData({
            isFlagPhoto: false
          })
        }
      }
    });
    wx.getStorage({
      key: 'cancel',
      success: function (res) {
        if(res.data=='yes'){
          that.setData({
            isStorage: false
          })
        }else{
          that.setData({
            isStorage: true
          })
        }
      },
      fail:function(res){
        that.setData({
          isStorage: true
        })
      }
    })
  },
  cancel:function(){
    this.setData({
      isGetnum:false
    });
    wx.setStorage({
      key: "cancel",
      data: "yes"
    })
  },
  getPhoneNumber: function (e) {
    var that=this
    wx.login({
      success:function(res){
   
        var val = {
          vendorId: app.globalData.VendorInfo.Id,
          userId: app.globalData.UserInfo.Id,
          encryptData: e.detail.encryptedData,
          encryptDataIV: e.detail.iv,
          code:res.code
        }
        console.log(val)
        $.xsr($.makeUrl(user.UpdateUserWexinMobile, val), function (data) {
          if (data.Code == 0) {
            app.globalData.UserInfo.Phone = data.Info
            that.setData({
              isGetnum: false,
            })
          }
        });
      }
    })
  },
  selectAddress: function () {//选择地址
    var that = this;
    wx.chooseAddress({
      success: function (res) {//授权成功，走调用地址
        $.gopage("../addresslist/addresslist");
      },
      fail: function (res) {//授权失败，继续走原来的
          $.gopage("../addresslist/addresslist");
      }
    })
  },
  goTabBar: function (e) {//跳转页面
    var that = this;
    $.goToTabBar(that, e.currentTarget.dataset.url);
  }
})