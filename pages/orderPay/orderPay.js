var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var cartapi = require('../../api/cartAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    money: 0,//总金额
    payment: 0,//实付款
    integral: "",//积分
    info: [],
    orderNum: "",
    formId: "",
    time: "",
    Description: "",
    MoneyLimit: "",
    CouponEnabeld: "",
    discountvalue: "",
    nodiscountvalue: "",
    discount: 0,//积分抵现
    membediscountmoney: 0,//会员折扣
    DiscountMoney: 0,//优惠券金额
    couponItemId: 0,//使用优惠券id
    IsUseCoupon: 1,//表示用户是否使用优惠券
    totlemoney: 0,//用此金额获取优惠券
    Info: [],
    MaxUsableCash: 0,
    MaxUsableECardCash: 0,
    MaxUsableExtraCash: 0,
    balance: 0,
    realMoney: 0.00,
    isBalance: true,
    eCardCash: 0,
    extraCash: 0,
    isMembership: true,
    isECashCard: true,
    isCoupon: true
  },
  onLoad: function (options) {
    this.setData({
      orderNum: options.orderNum,
      money: options.money,
      Currency: app.globalData.VendorInfo.Currency
    })
    var that = this;
    notice.addNotification("RefreshCoupon1", that.RefreshCoupon1, that);
    var str = app.globalData.VendorInfo.VendorFeatureSet
    if (str.indexOf("Membership") > -1) {//会员体系
      this.setData({
        isMembership: true
      })
    } else {
      this.setData({
        isMembership: false
      })
    }
    if (str.indexOf("ECashCard") > -1) {//储值
      this.setData({
        isECashCard: true
      })
      this.GetUserUsableECash()
    } else {
      this.setData({
        isECashCard: false
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
    this.GetUserMembershipSetting();
  },
  GetUserUsableECash: function () {
    var val3 = {
      userName: app.globalData.UserInfo.UserName,
      orderRealTotal: 0
    }
    var that = this
    $.xsr($.makeUrl(orderapi.GetUserUsableECash, val3), function (res) {
      that.setData({
        MaxUsableCash: res.Info[0].MaxUsableCash,
        MaxUsableECardCash: res.Info[0].MaxUsableECardCash,
        MaxUsableExtraCash: res.Info[0].MaxUsableExtraCash
      })
      if (res.Info[0].MaxUsableCash >= that.data.payment) {
        that.setData({
          balance: that.data.payment,
          realMoney: 0
        })
      } else {
        that.setData({
          balance: res.Info[0].MaxUsableCash,
          realMoney: (that.data.payment - res.Info[0].MaxUsableCash).toFixed(2)
        })
      }
    });
  },
  RefreshCoupon1: function (info) {//刷新优惠券
    this.setData({
      couponItemId: info.couponItemId,
      IsUseCoupon: info.IsUseCoupon,
      DiscountMoney: info.DiscountMoney,
      MoneyLimit: info.MoneyLimit
    });
    this.inputVal()
  },
  inputnum: function (e) {
    this.setData({
      money: e.detail.value,
    })
    this.inputVal()
  },
  count: function (e) {
    this.setData({
      integral: e.detail.value,

    })
    if (e.detail.value == 0) {
      this.setData({
        integral: ""
      })
    }
    if (e.detail.value > this.data.Info.UsablePoint) {
      this.setData({
        integral: "",
      })
      wx.showModal({
        title: '提示',
        content: '请输入正确积分额度',
      })
    }
    this.inputVal()
  },
  inputVal: function () {
    this.setData({
      membediscountmoney: ((this.data.money - this.data.DiscountMoney) * (1 - this.data.Info.MemberDiscount / 10)).toFixed(2),
    })
    if (this.data.Info.PointAsCashRate == 0) {
      this.setData({
        payment: ((this.data.money - this.data.DiscountMoney) * (this.data.Info.MemberDiscount / 10)).toFixed(2),
        totlemoney: ((this.data.money) * (this.data.Info.MemberDiscount / 10)).toFixed(2)
      })
    } else {
      this.setData({
        discount: (this.data.integral / this.data.Info.PointAsCashRate).toFixed(2),
        payment: (((this.data.money - this.data.DiscountMoney) * (this.data.Info.MemberDiscount / 10)).toFixed(2) - (this.data.integral / this.data.Info.PointAsCashRate).toFixed(2)).toFixed(2),
        totlemoney: ((this.data.money) * (this.data.Info.MemberDiscount / 10) - (this.data.integral / this.data.Info.PointAsCashRate)).toFixed(2),
      })
    }
    if (this.data.payment < 0) {
      this.setData({
        payment: 0
      })
    }
    if (this.data.membediscountmoney == 'NaN' || this.data.payment == 'NaN' || this.data.discount == 'NaN') {
      this.setData({
        membediscountmoney: 0,
        payment: 0,
        discount: 0
      })
    }
    if (this.data.membediscountmoney < 0) {
      this.setData({
        membediscountmoney: 0,
      })
    }
    if (this.data.MaxUsableCash >= this.data.payment) {
      this.setData({
        balance: this.data.payment,
        realMoney: 0
      })
    } else {
      this.setData({
        balance: this.data.MaxUsableCash,
        realMoney: (this.data.payment - this.data.MaxUsableCash).toFixed(2)
      })
    }
  },
  blur: function (e) {
    if (!(/^\d{1,10}(\.\d{1,2})?$/.test(e.detail.value))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确金额',
      })
    }
  },
  GetUserMembershipSetting: function () {
    var that = this
    var val = {
      userId: app.globalData.UserInfo.Id,
      vendorId: app.globalData.VendorInfo.Id,
    }
    $.xsr($.makeUrl(orderapi.GetUserMembershipSetting, val), function (data) {

      that.setData({
        Info: data.Info[0],
        membediscountmoney: (that.data.money * (1 - data.Info[0].MemberDiscount / 10)).toFixed(2),
        payment: (that.data.money * (data.Info[0].MemberDiscount / 10)).toFixed(2)
      })
      // if (that.data.MaxUsableCash >= that.data.payment) {
      //   that.setData({
      //     balance: that.data.payment,
      //     realMoney: 0
      //   })
      // } else {
      //   that.setData({
      //     balance: that.data.MaxUsableCash,
      //     realMoney: (that.data.payment - that.data.MaxUsableCash).toFixed(2)
      //   })
      // }
      that.inputVal()
      if (that.data.ECashCard) {
        that.GetUserUsableECash()
      }
    });
  },
  suitcouponlist: function () {//点击优惠券去可使用的优惠券列表
    var val = {
      userId: app.globalData.UserInfo.Id,
      vendorId: app.globalData.VendorInfo.Id,
      realMoney: this.data.totlemoney
    }
    var that = this
    $.xsr($.makeUrl(cartapi.GetUsableCouponItemListForQuickPay, val), function (data) {
      that.setData({
        info: data.Info
      })
      wx.navigateTo({
        url: '../favorablesuitcouponlist/favorablesuitcouponlist?val=' + JSON.stringify(data.Info) + "&id=" + that.data.couponItemId,
      })
    });
  },
  paysubmit: function (e) {
    var that = this;
    if ($.isNull(this.data.money)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确金额',
      });
      return false;
    }
    if (!(/^\d{1,10}(\.\d{1,2})?$/.test(that.data.money))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确金额',
      });
      return false;
    }
    if (this.data.isBalance) {
      if (this.data.MaxUsableCash == 0) {
        this.setData({
          eCardCash: (this.data.MaxUsableECardCash * 1).toFixed(2),
          extraCash: (this.data.MaxUsableExtraCash * 1).toFixed(2)
        })
      }
      if (this.data.MaxUsableCash != 0 && this.data.balance == 0) {
        this.setData({
          eCardCash: (this.data.MaxUsableECardCash * 1).toFixed(2),
          extraCash: (this.data.MaxUsableExtraCash * 1).toFixed(2)
        })
      }
      if (this.data.balance >= this.data.MaxUsableECardCash) {
        this.setData({
          eCardCash: (this.data.MaxUsableECardCash * 1).toFixed(2),
          extraCash: (this.data.balance - this.data.MaxUsableECardCash * 1).toFixed(2)
        })
      }
      if (this.data.balance < this.data.MaxUsableECardCash) {
        this.setData({
          eCardCash: (this.data.balance * 1).toFixed(2),
          extraCash: 0
        })
      }
    } else {
      this.setData({
        eCardCash: 0,
        extraCash: 0
      })
    }
    var val = {
      orderNum: this.data.orderNum,
      payTypeId: 9,
      couponItemId: this.data.couponItemId,
      vendorId: app.globalData.VendorInfo.Id,
      totalMoney: this.data.money,//总金额
      memberDiscount: this.data.Info.MemberDiscount,
      memberDiscountMoney: JSON.parse(this.data.membediscountmoney),
      usingPoint: this.data.integral || 0,
      pointAsCashMoney: JSON.parse(this.data.discount),
      eCardCash: this.data.eCardCash,
      extraCash: this.data.extraCash
    }
    $.xsr($.makeUrl(orderapi.PayMealOrder, val), function (data) {
      if (data.Code == 0) {
        that.setData({
          formId: e.detail.formId,
          orderNum: data.Info.OrderNum
        });
        if (data.Info.ActualPayPrice > 0) {
          that.gotopay();
        } else {
          $.alert("支付成功")
          setTimeout(function () {
            console.log("data.Info.OrderNum", data.Info.OrderNum)

            that.returnUrl(data.Info.OrderNum);
          }, 1000)
        }
      } else {
        wx.showToast({
          title: data.Msg
        })
      }
    });
  },
  gotopay: function () { //去支付
    var that = this
    var val = {
      OrderNum: this.data.orderNum,
      OpendId: app.globalData.UserInfo.WeiXinOpenId,
      VendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(cartapi.GetWeiXinPrePayNum, val), function (data) {
      wx.requestPayment({
        'timeStamp': data.Info.timeStamp,
        'nonceStr': data.Info.nonceStr,
        'package': data.Info.package,
        'signType': data.Info.signType,
        'paySign': data.Info.paySign,
        'success': function (res) {
          that.returnUrl(val.OrderNum);
        },
        'fail': function (res) {
       
          $.gopage('../orderMessageDetail/orderMessageDetail?orderNum=' + val.OrderNum);
        },
        'complete': function (res) {
          if (res.errMsg == "requestPayment:cancel") {
            $.gopage('../orderMessageDetail/orderMessageDetail?orderNum=' + val.OrderNum);
            that.sendMessage(val.OrderNum, 1);
          }
        }
      })
    });
  },
  returnUrl: function (OrderNum) {
    var that = this;
    if (!$.isNull(that.data.spinfo)) {
      var json = JSON.parse(that.data.spinfo);
      if (json.isFightGroup == 2) {
        if (json.isOwner) {
          //$.gopage('../orderMessageDetail/orderMessageDetail?orderNum=' + OrderNum);
           $.gotopage('../orderMessageDetail/orderMessageDetail?orderNum=' + OrderNum);
          return;
        } else {
          $.backpage(1, function () {
            notice.postNotificationName("RefreshFG");
          });
          return;
        }
      } else {
       // $.gopage('../orderMessageDetail/orderMessageDetail?orderNum=' + OrderNum);
        $.gotopage('../orderMessageDetail/orderMessageDetail?orderNum=' + OrderNum);
        return;
      }
    } else {
      //$.gopage('../orderMessageDetail/orderMessageDetail?orderNum=' + OrderNum);
       $.gotopage('../orderMessageDetail/orderMessageDetail?orderNum=' + OrderNum);
      return;
    }
  },
  switchChange: function (e) {
    if (e.detail.value) {
      this.setData({
        realMoney: this.data.realMoney,
        isBalance: true
      })
    } else {
      this.setData({
        payment: this.data.payment,
        isBalance: false
      })
    }
  },
})
