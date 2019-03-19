var app = getApp()
var $ = require('../../utils/util.js');
var user = require('../../api/userAPI.js');
var integraiAPI = require('../../api/integratShop.js');
var venapi = require('../../api/vendorAPI.js');

Page({
  data: {
    message: "",
    member: "",
    con: "",
    Info: "",
    UserInfo: "",
    flag: false,
    flag2: false,
    flag1: false,
    flag3: false,
    isColor: true,
    couponListityList: [],
    scposition: 0, //滚动条位置
    screenHeight: 37,
    nextflg: true, //是否可以进行下次分页
    // swiper组件控制
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    showHide: "", //控制轮播图显示
    three: "", //超值兑换和积分兑换
    forGoods: "", //仅有商品
    forConvertible: "", //仅有兑劵
    tabTrue: true, //超值与兑券切换
    commodityBox: "",
    couponItem: "none",
    ispage: false,
    ProductList: [],
    pageSize: 6,
    pageIndex: 1,
  },
  onLoad: function(options) {
    var that = this;
    that.load();
    that.GetEPointCouponList() //获取积分兑换优惠券列表

    that.GetFavoriteEPointEventList(); //获取参与人次最多的兑换活动列表
    that.GetRecommendedProductList(); //推荐商品列表
    that.GetMemberCard(); //会员卡信息

    that.setData({ //设置货币符号
      Currency: app.globalData.VendorInfo.Currency
    });

  },
  GetMemberCard: function() { //会员卡信息
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
    };
    $.xsr($.makeUrl(user.GetMemberCard, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          member: res.Info
        })
      }
    })
  },
  GetFavoriteEPointEventList: function() { //获取参与人次最多的兑换活动列表
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id
    };
    $.xsr($.makeUrl(integraiAPI.GetFavoriteEPointEventList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          mostParticipants: res.Info
        })
      }
    })
  },
  GetRecommendedProductList: function() { //推荐商品列表
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageSize: this.data.pageSize,
      pageIndex: this.data.pageIndex,
    }
    $.xsr($.makeUrl(venapi.GetRecommendedProductList, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 6) {
          that.setData({
            flag2: false,
            ispage: false
          });
          that.setData({
            ProductList: that.data.ProductList.concat(res.Info)
          });
        } else {
          that.setData({
            flag2: true,
            ispage: true,
            ProductList: that.data.ProductList.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag2: false,
          ispage: false
        });
      }
    });
  },
  fightPage: function(e) {
    if (this.data.flag2) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1
        });
        that.GetRecommendedProductList();
        that.setData({
          flag2: false
        })
      }, 500);
    }
  },
  scrolltoupper: function(e) {
    if (e.detail.scrollTop >= this.data.screenHeight) {
      this.setData({
        isquicknav: true
      })
    } else {
      this.setData({
        isquicknav: false
      })
    }
  },
  GetEPointProductList: function(pageIndex) { //获取积分兑换商品列表
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      swithType: that.data.swithType,
      minPoint: that.data.minNum,
      maxPoint: that.data.maxNum,
      pageSize: 10,
      pageIndex: pageIndex
    };
    $.xsr1($.makeUrl(integraiAPI.GetEPointProductList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          commodityList: that.data.commodityList.concat(res.Info),
          ispage: true
        })
      }
      if (res.Code == 1) {
        if (that.data.pageIndex > 1) {
          var pageIndex = that.data.pageIndex;
          pageIndex--;

        }
        that.setData({
          pageIndex: pageIndex,
          ispage: false
        })
      }
    })
  },

  GetEPointCouponList: function(commodityPageIndex) { //获取积分兑换优惠券列表

    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      swithType: that.data.swithType,
      minPoint: that.data.minNum,
      maxPoint: that.data.maxNum,
      pageSize: 10,
      pageIndex: commodityPageIndex
    };
    $.xsr1($.makeUrl(integraiAPI.GetEPointCouponList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          couponListityList: that.data.couponListityList.concat(res.Info),
          ispageCon: true
        })
      } else {
        if (that.data.commodityPageIndex > 1) {
          var commodityPageIndex = that.data.commodityPageIndex;
          commodityPageIndex--;
        }
        that.setData({
          commodityPageIndex: commodityPageIndex,
          ispageCon: false
        })
      }
    })
  },
  hot_excha: function() {

    wx.navigateTo({
      url: '../../integratShop/integralPage/integralPage'
    })

  },

  getPhoneNumber: function(e) {
    if (e.detail.errMsg.indexOf("ok") > -1) {
      var that = this;
      if (that.data.member.IsToWeixin == false) {
        var val = {
          userId: app.globalData.UserInfo.Id,
          vendorId: app.globalData.VendorInfo.Id,
          cardId: that.data.member.Id,
          phone: app.globalData.UserInfo.Phone
        }
        $.xsr($.makeUrl(user.AddMemberCard, val), function(res) {
          console.log("buzhidao:", res)
          if (res.Code == 0) {

            $.alert(res.Info.Msg);


          }
          that.onLoad()
        })
      } else {
        that.GetMemberCard();



        var that = this;
        var val1 = {
          vendorId: app.globalData.VendorInfo.Id,
          cardInfo: that.data.member.WeixinId
        }
        $.xsr($.makeUrl(user.GetMemberCardPostInfo, val1), function(res) {

          that.setData({
            id: res.Info.id,
            tsamp: res.Info.tsamp,
            nonstr: res.Info.nonstr,
            sign: res.Info.sign
          })
          wx.addCard({

            cardList: [{

              cardId: that.data.id,

              cardExt: '{ "timestamp":' + that.data.tsamp + ', "signature":"' + that.data.sign + '","nonce_str":"' + that.data.nonstr + '"}'
            }],

            success: function(res) {
              that.onLoad()

              var val1 = {
                vendorId: app.globalData.VendorInfo.Id,
                userId: app.globalData.UserInfo.Id,
                cCode: res.cardList[0].code,
                cCard: res.cardList[0].cardId,
                cardId: that.data.member.Id
              }
              $.xsr($.makeUrl(user.GetMCardRelationInfo, val1), function(res) {
                that.onLoad()
              })
              var val = {
                userId: app.globalData.UserInfo.Id,
                vendorId: app.globalData.VendorInfo.Id,
                cardId: that.data.member.Id,
                phone: app.globalData.UserInfo.Phone
              }
              $.xsr($.makeUrl(user.AddMemberCard, val), function(res) {
                if (res.Code == 0) {

                  $.alert(res.Info.Msg);
                  that.onLoad()

                }

              })


            },

            fail: function(res) {


            }
          })
        })
      }

    } else {

    }

  },
  onGotUserInfo1: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(user.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.exchangeCoupon(e)
    } else {

    }
  },
  exchangeCoupon: function(e) {
    var that = this;
    var couponId = e.currentTarget.dataset.id;
    that.setData({
      Id: couponId
    })
    if (e.currentTarget.dataset.showsucessbutton) {
      $.alert("来晚了，已兑完")
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认兑换？',
        success: function(res) {
          if (res.confirm) {
            var val = {
              vendorId: app.globalData.VendorInfo.Id,
              userId: app.globalData.UserInfo.Id,
              couponId: couponId
            }
            //积分兑换优惠券接口
            $.xsr($.makeUrl(integraiAPI.ExchangeCoupon, val), function(res) {
              if (res.Code == 0) {
                var couponListityList = that.data.couponListityList;
                for (var i = 0, len = couponListityList.length; i < len; i++) {
                  if (couponId === couponListityList[i].CouponId) {
                    couponListityList[i].Percentage = res.Info[0].Percentage;
                  }
                }
                that.setData({
                  Coupons: res.Info[0],
                  couponListityList: couponListityList,
                  flag: true
                })

              } else {
                $.alert(res.Msg)
              }
            })
          }
        }
      })
    }

  },
  innertouch: function() { //打开优惠券弹窗
    this.setData({
      flag: false
    });
  },
  outertouch: function() { //关闭优惠券弹窗
    this.setData({
      flag: true
    });
  },
  onGotUserInfo3: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(user.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.details(e)
    } else {

    }
  },
  details: function(e) {
    wx.navigateTo({
      url: '/integratShop/commodityDetails/commodityDetails?pid=' + e.currentTarget.id,
    })
  },
  open_card: function() {
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
    };
    $.xsr($.makeUrl(user.GetMemberCard, val), function(res) {
      console.log("rrrrr", res)
      // && res.Info.ReciveStatus == 1
      if (res.Code == 0) {
        that.setData({
          member2: res.Info.WeixinCode,
          member3: res.Info.access_token,
        })
        that.getUserReceiveCoupon();
      }
    })

  },
  getUserReceiveCoupon: function() {

    wx.openCard({
      cardList: [{
        cardId: this.data.member.WeixinId,
        code: this.data.member2,
      }],
      success: function(res) {
        console.log("1", res)
      }
    })

  },
  // 积分========================================================
  load: function() {
    var that = this
    that.setData({
      UserInfo: app.globalData.UserInfo,
    })
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id,
    }
    $.xsr1($.makeUrl(user.findUsablePoint, val), function(data) {
      console.log("基本信息", data);
      that.setData({
        message: data.Info,
        isColor: data.Info.HasRegisteredAttendance
      });
    });
  },
  onGotUserInfo: function(e) {

    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(user.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.click()
    } else {

    }
  },
  click: function() {

    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id
    }
    console.log("签到", val)
    $.xsr1($.makeUrl(user.settingAttendancePoint, val), function(data) {
      console.log("签到", data)
      that.setData({
        Info: data.Info
      });
      if (data.Info.flag) {
        that.setData({
          flag3: true
        })
        setTimeout(function() {
          that.setData({
            flag3: false
          })
        }, 2000);
      } else {
        that.setData({
          flag1: true
        })
        setTimeout(function() {
          that.setData({
            flag1: false
          })
        }, 2000);
      }
      that.load()
    });
  },
  cardDetail: function(e) {
    wx.navigateTo({
      url: '../vip_ind/vip_ind?cardid=' + this.data.member.Id,
    })
  },
  cardvip: function(e) {
    wx.navigateTo({
      url: '../carDdetails/carDdetails'
    })

  }
})