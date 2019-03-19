var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    ispage: false,
    CenterCoupon: [],
    isspage: true, //是否可以进行下次分页
    Coupons: [],
    flag: true,
    pageIndex: 1,
    couponPageIndex: 0,
    pageSize: 10,
    showw: false,
    Id: 0,
    hide:1,
    Code: "",
    index: 0,
    idx:"",
    islength: ''
  },
  onLoad: function(options) {

    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.getCouponlist();
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.getCouponlist();
    }
    debugger
    notice.addNotification("Refresh", that.RefreshMethod, that);
    notice.addNotification("Refresh1", that.RefreshMethod1, that);
  },
  RefreshMethod: function (e) {
    debugger
   console.log("e1",e)
    var thatInfo = this.data.CenterCoupon;
    console.log("e2", thatInfo)
    if (thatInfo.length > e.i) {
      if (thatInfo[e.i].Id == e.id) {
        thatInfo[e.i].IsCanReceive = e.num;
        thatInfo[e.i].CouponItemId = e.CouponItemId;
        thatInfo[e.i].Percentage = e.Percentage
      }

      this.setData({
        CenterCoupon: thatInfo
      })
    }

  },
  RefreshMethod1: function (e) {
    console.log("e4", e)
    var thatInfo = this.data.CenterCoupon;
    console.log("e3", thatInfo)
    if (thatInfo.length > e.i) {
     
      if (thatInfo[e.i].Id == e.id) {
        thatInfo[e.i].Percentage = e.Percentage
      }

      this.setData({
        CenterCoupon: thatInfo
      })
    }

  },
  onGotUserInfo22: function(e) { //用户领取普通优惠券获取信息
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
      that.receivenow(e)
    } else {

    }
  },
  receivenow: function(e) { //立即领取
console.log("lingque",e)
    var that = this;
    if (e.currentTarget.dataset.isreceive == -1) {
      return;
    }
    that.setData({
      Id: e.currentTarget.dataset.id,
      idx: e.currentTarget.dataset.idx,
    });
    that.getUserReceiveCoupon();
  },

  outertouch: function() { //关闭
    this.setData({
      flag: true
    });
  },
  nav_mycou: function() { //跳转我的优惠券页面
    wx.navigateTo({
      url: '../usercoupon/usercoupon'
    })


  },
  innertouch: function() { //打开
    this.setData({
      flag: false
    });
  },

  getCouponlist: function (couponId) { //获取优惠券列表      couponId =   通过领取优惠券传入id     其他情况不穿
    console.log("couponId", couponId)
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      pageIndex: couponId != undefined && couponId > 0 ? that.data.couponPageIndex: that.data.pageIndex,
      vendorId: app.globalData.VendorInfo.Id
    }
   

    console.log("获取优惠券列表val", val)
    $.xsr($.makeUrl(userapi.GetVendorCouponList, val), function(data) {

      console.log("获取优惠券列表", data)
 
      if (data.Info != null && data.Code != 1) {

        console.log("1", data.Info)
        console.log("2", data.Code)
        if (couponId != undefined && couponId > 0) {
          console.log("3", data.Code)
          for (var j = 0; j < data.Info.length; j++) {
         
            if (couponId == data.Info[j].Id) {
              console.log("CenterCoupon", that.data.CenterCoupon)
              for (var i = 0; i < that.data.CenterCoupon.length; i++) {//已经成功分页pageindex的数据
           
                if (couponId == that.data.CenterCoupon[i].Id) {//通过id找到不同
                  console.log("CenterCoupon", that.data.CenterCoupon)
                  that.data.CenterCoupon[i] = data.Info[j];
                  that.data.couponPageIndex=0;
                  that.setData({
                    CenterCoupon: that.data.CenterCoupon,
                    couponPageIndex:0
                    });
                  console.log("55", that.data.CenterCoupon)
                  break;
                }            
              }
              break;
            }else{
              that.setData({
                CenterCoupon: data.Info,
        
              });
            }
          }
        } else {
          if (data.Info.length < 10) {
            that.setData({
              CenterCoupon: that.data.CenterCoupon.concat(data.Info),
              showw: false, //是否显示什么都没有
              ispage: true, //是否显示页面
              isspage: false //不可以分页
            })
          } else {
            that.setData({
              CenterCoupon: that.data.CenterCoupon.concat(data.Info),
              // showw: false,
              ispage: true,
              isspage: true //可以分页
            })
          }

        }

      } else {
        that.setData({
          ispage: true,
          showw: true
        })
      }
    })
  },
  onReachBottom: function() { //进行分页

    if (this.data.isspage) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        pageIndex: parseInt(that.data.pageIndex) + 1
      });
      this.getCouponlist();
    }
  },
  getUserReceiveCoupon: function() { //用户领取优惠券

    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: this.data.Id,
      UserId: app.globalData.UserInfo.Id,
      Code: this.data.Code,
      IsNewUser: 0
    }
    this.setData({
      couponPageIndex: (this.data.idx - this.data.idx%10)/10+1   //某条数据在第几页
    });
    var that = this;
    $.xsr($.makeUrl(userapi.UserReceiveCoupon, val), function(data) {
      console.log("aaaaa", data)
      if (!$.isNull(data.Info) && data.Code == 0) {
        that.setData({
          flag: false,
          Coupons: data.Info[0],
          islength: data.Info[0].DiscountMoney + '',
          // CenterCoupon: [],
          // pageIndex:1
        });

        that.getCouponlist(val.CouponIds);
      } else {
     
        $.alert(data.Msg);
       
     
      }
    })
  },
  // details:function(e){
  //   console.log("eee",e)
  //   wx.navigateTo({
  //     url: '../../pages/Coupondetails/Coupondetails?detailsId = ' + this.data.FGInfo.OwnGroupId
  //   })

  // },
  onShareAppMessage: function() { //分享
    return {
      title: app.globalData.VendorInfo.ShopName,
      desc: app.globalData.VendorInfo.VendorInfo,
      path: '/pages/receivecontent/receivecontent?uid=' + app.globalData.UserInfo.Id
    }
  },

  onGotUserInfo11: function(e) { //微信卡券领取
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
      that.receivenowWeixin(e)
    } else {

    }
  },

  receivenowWeixin: function(e) { //微信领取卡券

    var that = this;
    var val = {
      card_id: e.currentTarget.dataset.cardid,
      vendorId: app.globalData.VendorInfo.Id,
      openid: app.globalData.UserInfo.WeiXinOpenId
    }
    $.xsr($.makeUrl(userapi.receiveWeixinCoupons, val), function(data) {

      wx.addCard({
        cardList: [{
          cardId: data.Info.cardId,
          cardExt: '{"openId": "' + app.globalData.UserInfo.WeiXinOpenId + '", "timestamp": "' + data.Info.timestamp + '", "signature":"' + data.Info.signature + '","nonce_str":"' + data.Info.nonce_str + '",}'
        }],
        success: function(res) {
          console.log("微信卡：", res)
          //code解码
          var codeVla = {
            code: res.cardList[0].code,
            access_token: data.Info.access_token
          }
          $.xsr($.makeUrl(userapi.codeDecode, codeVla), function(data) {
            var thatdata = $.parseJSON(data.Info);
            that.setData({
              Code: thatdata.code,
              Id: e.currentTarget.dataset.id
            });
            that.getUserReceiveCoupon();
          });
        },
        fail: function(res) {
          console.log("领取失败", res);
        },
        complete: function(res) {
          console.log("领取成功或者失败", res);
        },
      });
    });
  }
})