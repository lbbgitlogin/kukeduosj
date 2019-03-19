var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var cartapi = require('../../api/cartAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
    money:"",//总金额
    nodiscount: "",//不含优惠金额
    discount:"",//优惠金额
    isshow:false,
    deliveryNum: '',//消费总金额
    isshow1: false,
    price:"",//折扣
    totalMoney:"",//折扣之后的金额
    payment:0.00,//实付款
    info:[],
    orderNum:"",
    formId:"",
    time:"",
    Description:"",
    MoneyLimit:"",
    CouponEnabeld:"",
    discountvalue:"",
    nodiscountvalue:"",
    DiscountMoney:"0.00",//优惠券金额
    couponItemId: 0,//使用优惠券id
    IsUseCoupon: 1,//表示用户是否使用优惠券
    MaxUsableCash: 0,
    MaxUsableECardCash: 0,
    MaxUsableExtraCash: 0,
    balance: 0,
    realMoney: 0.00,
    isBalance:true,
    eCardCash: 0,
    extraCash: 0,
    realPayMoney:0,
    isECashCard: true,
    isCoupon: true,
    isSubmit: true,//是否已经进行过订单提交
    storeId:0
	},
  onLoad: function (options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency,
          storeId: options.storeId 
        })
        that.load()
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency,
        storeId: options.storeId
      })
      that.load()
    }
	},


  //优惠买单  原接口
/*
  load:function(){
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      category: 'QuickPay.Discount',
    }
    var val1 = {
      vendorId: app.globalData.VendorInfo.Id,
      category: 'QuickPay.Description',
    }
    var val2 = {
      vendorId: app.globalData.VendorInfo.Id,
      category: 'QuickPay.CouponEnabeld',
    }
    var that = this;
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetVendorSetting, val), function (res) {
      console.log("优惠买单：",res);
      that.setData({
        price: res.Info
      })
      if (res.Info == 10) {
        that.setData({
          isshow1: false
        })
      } else {
        that.setData({
          isshow1: true
        })
      }
      that.inputVal()
    });
    $.xsr($.makeUrl(orderapi.GetVendorSetting, val1), function (res) {
      console.log("买单说明：",res);
      that.setData({
        Description: res.Info
      })
      that.inputVal()
    });
    $.xsr($.makeUrl(orderapi.GetVendorSetting, val2), function (res) {
      that.setData({
        CouponEnabeld: res.Info
      })
      that.inputVal();
    });
    notice.addNotification("RefreshCoupon1", that.RefreshCoupon1, that);
    var str = app.globalData.VendorInfo.VendorFeatureSet
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
  },
*/


  //优惠买单
  load: function () {
    var val = {
      vendorId: app.globalData.VendorInfo.Id
    }
    console.log("val+++++",val)
    var that = this;
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetPreferentialPaySetting, val), function (res) {
      console.log("优惠买单：", res);
      that.setData({
        price: res.Info[0].Discount,
        Description: res.Info[0].Description,
        CouponEnabeld: res.Info[0].CouponEnabeld
      })
      console.log("CouponEnabeld", that.data.CouponEnabeld)
      if (res.Info == 10) {
        that.setData({
          isshow1: false
        })
      } else {
        that.setData({
          isshow1: true
        })
      }
      that.inputVal()
    });

    notice.addNotification("RefreshCoupon1", that.RefreshCoupon1, that);
    var str = app.globalData.VendorInfo.VendorFeatureSet
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
  },


  clearnum: function (e) {
    this.setData({
      deliveryNum: ''
    });
  },




  GetUserUsableECash: function () {
    var val3={
      userName: app.globalData.UserInfo.UserName,
      orderRealTotal:0
    }
    var that=this
    $.xsr($.makeUrl(orderapi.GetUserUsableECash, val3), function (res) {
      that.setData({
        MaxUsableCash: res.Info[0].MaxUsableCash,
        MaxUsableECardCash: res.Info[0].MaxUsableECardCash,
        MaxUsableExtraCash: res.Info[0].MaxUsableExtraCash
      })
    });
  },
  RefreshCoupon1: function (info) {//刷新优惠券
    this.setData({
      couponItemId: info.couponItemId,
      IsUseCoupon: info.IsUseCoupon,
      DiscountMoney: info.DiscountMoney,
      MoneyLimit: info.MoneyLimit
    });
    this.inputVal();
  },
  inputnum:function(e){
    this.setData({
      money: e.detail.value,//输入的总金额
    })
    if ((parseFloat(e.detail.value) - (parseFloat(e.detail.value) - parseFloat(this.data.nodiscount || 0)) * (1 - this.data.price / 10)) < parseFloat(this.data.MoneyLimit)) {
      this.setData({
        couponItemId: 0,
        IsUseCoupon: 0,
        DiscountMoney: 0,
        MoneyLimit: 0
      })
    }
    if ($.isNull(e.detail.value)){
      this.setData({
        couponItemId: 0,
        IsUseCoupon: 0,
        DiscountMoney: 0,
        MoneyLimit: 0
      })
    }
    if (parseFloat(this.data.nodiscount) > parseFloat(e.detail.value)) {
      wx.showModal({
        title: '提示',
        content: '不参与优惠金额应小于总金额',
      })
      this.setData({
        nodiscount: 0,
        discount: 0,
      })
    } 
    this.inputVal();
  },
  nodiscount: function (e) {
    this.setData({
      nodiscount: e.detail.value,//输入不含优惠的金额
    })
    if ((parseFloat(this.data.money) - (parseFloat(this.data.money) - parseFloat(e.detail.value || 0)) * (1 - this.data.price / 10)) < parseFloat(this.data.MoneyLimit)) {
      this.setData({
        couponItemId: 0,
        IsUseCoupon: 0,
        DiscountMoney: 0,
        MoneyLimit: 0
      })
    }
    if (parseFloat(e.detail.value) > parseFloat(this.data.money)) {
      wx.showModal({
        title: '提示',
        content: '不参与优惠金额应小于总金额',
      })
      this.setData({
        nodiscount: 0,
        discount: 0,
        nodiscountvalue: ""
      })
    } 
    this.inputVal();
  },
  blur:function(e){
    if (!(/^\d{1,10}(\.\d{1,2})?$/.test(e.detail.value))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确金额',
      })
    }
    
  },
  blur1: function (e) {
    if (!(/^\d{1,10}(\.\d{1,2})?$/.test(e.detail.value))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确金额',
      })
    }
  },
  inputVal:function(){
    //计算值
    var thatobj = {
      money: this.data.money,
      nodiscount: this.data.nodiscount,
      price: this.data.price,
      discountmoney: this.data.DiscountMoney
    }
    this.setData({
      discount: ((thatobj.money - thatobj.nodiscount) * (1 - thatobj.price / 10)).toFixed(2),
      payment: (thatobj.money - (thatobj.money - thatobj.nodiscount) * (1 - thatobj.price / 10) - thatobj.discountmoney).toFixed(2)
    })
    if(this.data.payment<0){
      this.setData({
        payment:0
      })
    }
    if (isNaN(this.data.discount)) {
      this.setData({
        discount:0
      })
    }
    if (isNaN(this.data.payment)) {
      this.setData({
        payment: 0
      })
    }
    if (this.data.MaxUsableCash==0){
      this.setData({
        realPayMoney: this.data.payment
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
    this.setData({
      realPayMoney: this.data.realMoney,
    })
    if(this.data.isBalance==false){
      this.setData({
        realPayMoney: this.data.payment
      })
    }
  },
  suitcouponlist: function () {//点击优惠券去可使用的优惠券列表
    //调用优惠券接口
    var thatobj = {
      money: this.data.money,
      nodiscount: this.data.nodiscount,
      price: this.data.price
    }
    this.setData({
      discount: ((thatobj.money - thatobj.nodiscount) * (1 - thatobj.price/10)).toFixed(2),
    })
    var val = {
      userId: app.globalData.UserInfo.Id,
      vendorId: app.globalData.VendorInfo.Id,
      realMoney: (thatobj.money - (thatobj.money - thatobj.nodiscount) * (1 - thatobj.price/10)).toFixed(2)
    }
    var that = this
    $.xsr($.makeUrl(cartapi.GetUsableCouponItemListForQuickPay, val), function (data) {
      that.setData({
        info:data.Info
      })
      wx.navigateTo({
        url: "../favorablesuitcouponlist/favorablesuitcouponlist?val=" + JSON.stringify(data.Info) + "&id=" + that.data.couponItemId  
      });
    });
  },
  checkboxChange: function (e) {
    if (e.detail.value.length>0){
      this.setData({
        isshow: true
      })
    }else{
      this.setData({
        isshow: false,
        nodiscount:0
      })
    }
    this.inputVal()
   },
  paysubmit:function(e){
    var that=this;
    if ($.isNull(this.data.money) || this.data.money==0){
      wx.showModal({
        title: '提示',
        content: '请输入消费总金额',
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
    if (that.data.isshow && !(/^\d{1,10}(\.\d{1,2})?$/.test(that.data.nodiscount))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确金额',
       });
       return false;
    }
    if (parseFloat(that.data.nodiscount) > parseFloat(that.data.money)) {
      wx.showModal({
        title: '提示',
        content: '不参与优惠金额应小于总金额',
      });
      return false;
    }
    if (this.data.isBalance) {
      if (this.data.MaxUsableCash == 0) {
        this.setData({
          eCardCash: (this.data.MaxUsableECardCash*1).toFixed(2),
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
      userName: app.globalData.UserInfo.UserName,//用户名称
      payTypeId: 9,//支付方式
      couponItemId: this.data.couponItemId,//使用的优惠券Id
      vendorId: app.globalData.VendorInfo.Id,//商家Id
      totalMoney: this.data.money,//总金额
      preferential: this.data.price,//优惠折扣（几折）
      preferentialMoney: this.data.discount,//折扣金额
      nonPreferentialMoney: this.data.nodiscount || 0,//不参与折扣金额
      realMoney: this.data.realPayMoney,//实付款金额
      firstType: 2,
      eCardCash: this.data.eCardCash,
      extraCash: this.data.extraCash,
      storeId: this.data.storeId,
    }
    $.xsr($.makeUrl(orderapi.AddPreferentialOrder, val), function (data) {
      that.setData({
        orderNum: data.Info.OrderNum,
        isSubmit:false
      });
      if (data.Code == 0) {
        if (data.Info.RealTotal > 0) {
          that.gotopay()
        }
        else if (data.Info.RealTotal == 0) {
          $.alert("支付成功")
          setTimeout(function () {
          $.gotopage('../favorableorderdetail/favorableorderdetail?on=' + data.Info.OrderNum + '&type=' + '1');
          },1000)
        }
      }else{
        $.alert(data.Msg)
      }
    });
  },
  gotopay: function () { //去支付
  var that=this
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
          $.gotopage('../favorableorderdetail/favorableorderdetail?on=' + val.OrderNum);
        },
        'complete': function (res) {
          if (res.errMsg == "requestPayment:cancel") {
            $.gotopage('../favorableorderdetail/favorableorderdetail?on=' + val.OrderNum);
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
          $.gotopage('../fightgroupsdetail/fightgroupsdetail?on=' + OrderNum);
          return;
        } else {
          $.backpage(1, function () {
            notice.postNotificationName("RefreshFG");
          });
          return;
        }
      } else {
        $.gotopage('../favorableorderdetail/favorableorderdetail?on=' + OrderNum + '&type=' + '1');
        return;
      }
    } else {
      $.gotopage('../favorableorderdetail/favorableorderdetail?on=' + OrderNum + '&type=' + '1');
      return;
    }
  },
  switchChange: function (e) {
    if (e.detail.value) {
      this.setData({
        realPayMoney: this.data.realMoney,
        isBalance: true
      })
    } else {
      this.setData({
        realPayMoney: this.data.payment,
        isBalance: false
      })
    }
  },
})
