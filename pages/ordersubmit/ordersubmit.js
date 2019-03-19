var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
var vendorapi = require('../../api/vendorAPI.js');
var myinterval
Page({
  data: {
    AddressInfo: {},
    cartinfo: {}, //提交的购coupon_img image物车信息
    cartinfo11: {}, //仅自提
    addressid: '', //地址ID
    spinfo: "",
    tw: "",
    onl: "",
    addressidd: "",
    tw_name: "",
    showphone: "",
    showconsignee: "",
    tw_pho: "",
    tw_ju: "",
    tw_wei: "",
    remark: "",
    remarkLength: 0,
    formId: "",
    submitinfo: {}, //提交信息
    isSubmit: false, //是否已经进行过订单提交
    couponItemId: 0, //使用优惠券id
    orderNum: "",
    integral: "", //积分
    discount: 0, //积分抵现
    ishide: true,
    disbursements: "", //实付款
    IsUseCoupon: 1, //表示用户是否使用优惠券
    flag: true,
    flag1: false,
    date: "",
    starttime: "",
    consignee: "",
    phone: "",
    eddate: "",
    time: "",
    addInfo: "",
    addInfo1: "",
    shipMethod: 0,
    physicalStoreId: "",
    productIdSet: [],
    marktingEventId: 0,
    sponsorId: 0,
    balance: 0,
    realMoney: 0,
    isBalance: true,
    eCardCash: 0,
    extraCash: 0,
    isMembership: true,
    isECashCard: true,
    isCoupon: true,
    isTmplMsg: true,
    type: "",
    MEId: 0,
    ShoppingCartHeaderInfo: [],
    hour: '',
    min: '',
    estimatedArriveTime: '',
    time: '',
    IsTime: true, //尽快到达与指定到达时间切换
    arriveTimeType: 0, //外卖时间类型  默认0   指定 1
    startGetTime: 0, //配送范围 最早时间戳
    endGetTime: 0, //配送范围 最晚时间戳
    setGetTime: 0, //配送范围 指定到达时间戳
    fastestTime: 0, //配送范围 最快到达时间戳
    startdate: 0, //可送达时间（最早时间）
    enddate: 0, //可送达时间（最晚时间）
  },
  onShow: function() {

  },
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: "msk-ads",
      success: function(res) {
        console.log("chong:", res.data)
        that.setData({
          // tw_name: res.data.StoreId.StoreName,
          // tw_pho: res.data.StoreId.StorePhone,
          // tw_ju: res.data.StoreId.Distance,
          // tw_wei: res.data.StoreId.AddressStr,
          addressidd: res.data.StoreId.Id
        })
      }
    })

    this.getcartlist(); //获取购物车集合

    clearInterval(myinterval)
    if (options.spid) {
      this.setData({
        spinfo: (decodeURIComponent(options.spid)), //解码特殊字符
        type: options.type || "",
        MEId: options.MEId || "",
        orderType: options.orderType || "",
        img: JSON.parse(decodeURIComponent(options.spid)).img || "",
        Currency: app.globalData.VendorInfo.Currency
      })
    } else {
      this.setData({
        spinfo: "",
        Currency: app.globalData.VendorInfo.Currency
      })
    }
    this.setData({
      addressid: parseInt(options.adid) || 0, //判断是否是从订单提交页过来的
      marktingEventId: options.marktingEventId || "",
      sponsorId: options.sponsorId || "",
    });
    var that = this;
    notice.addNotification("RefreshOrder", that.RefreshOrder, that);
    notice.addNotification("RefreshOrder1", that.RefreshOrder1, that);
    notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);


    // this.draw();
    var str = app.globalData.VendorInfo.VendorFeatureSet
    if (str.indexOf("Membership") > -1) { //会员体系
      this.setData({
        isMembership: true
      })
    } else {
      this.setData({
        isMembership: false
      })
    }
    if (str.indexOf("ECashCard") > -1) { //储值
      this.setData({
        isECashCard: true
      })
    } else {
      this.setData({
        isECashCard: false
      })
    }
    if (str.indexOf("Coupon") > -1) { //优惠券
      this.setData({
        isCoupon: true
      })
    } else {
      this.setData({
        isCoupon: false
      })
    }
    if (str.indexOf("TmplMsg") > -1) { //模板消息
      this.setData({
        isTmplMsg: true
      })
    } else {
      this.setData({
        isTmplMsg: false
      })
    }

    // if (onlyzt) {
    //   this.draw();
    // }

    console.log('重新打开01', this.data.isClose)
    wx.getStorage({
      key: 'key',
      success: function(res) {
        console.log("设置缓冲", res)
        that.setData({
          showconsignee: res.data[0],
          consignee: res.data[0],
        });
      }
    })

    wx.getStorage({
      key: 'keyq',
      success: function(res) {
        console.log("设置缓冲02", res)
        that.setData({
          showphone: res.data[0],
          phone: res.data[0],
        });
      }
    })




  },
  inputconsignee: function(even) { //输入收件人时
    this.setData({
      consignee: even.detail.value,
      showconsignee: even.detail.value
    });
    wx.setStorage({
      key: 'key',
      data: [even.detail.value],
    })
  },
  inputphone: function(even) { //输入手机
    console.log("手机号：", even)
    this.setData({
      phone: even.detail.value,
      showphone: even.detail.value
    });
    wx.setStorage({
      key: 'keyq',
      data: [even.detail.value],
    })
    if (!(/^1[34578]\d{9}$/.test(even.detail.value))) {
      this.setData({
        isre: false
      });
    } else {
      this.setData({
        isre: true
      });
    }
  },
  RefreshOrder: function(info) { //刷新订单
    clearInterval(myinterval)
    this.setData({
      addressid: info.adid || 0,
      spinfo: info.spid,
      addInfo1: this.data.addInfo
    });
    this.getcartlist01();
  },
  RefreshOrder1: function(info) { //刷新订单

    clearInterval(myinterval)
    this.setData({
      AddressInfo: info.StoreId,
      physicalStoreId: info.StoreId.Id,
    });
    this.getcartlist01();
  },
  RefreshCoupon: function(info) { //刷新优惠券
    clearInterval(myinterval)
    this.setData({
      couponItemId: info.couponItemId,
      IsUseCoupon: info.IsUseCoupon,
    });
    this.getcartlist01();
  },
  getcartlist: function() { //获取购物车
    clearInterval(myinterval)
    var thisobj = this;
    var vals = {
      storeID: app.globalData.VendorInfo.Id,
      userName: app.globalData.UserInfo.UserName,

    }
    $.xsr($.makeUrl(cartapi.GetCartList, vals), function(data) { //先查询出购物车中所有的商品
      console.log("查询", data)
      var val = {
        userAccount: app.globalData.UserInfo.UserName,
        ShoppingCartList: [],
        couponItemId: thisobj.data.couponItemId, //使用优惠券id
        IsUseCoupon: thisobj.data.IsUseCoupon, //表示用户是否使用优惠券
        isFightGroup: !$.isNull(thisobj.data.spinfo) ? JSON.parse(thisobj.data.spinfo).isFightGroup : "",
        addressId: thisobj.data.addressid || 0,
        physicalStoreId: thisobj.data.physicalStoreId,
        shipMethod: thisobj.data.shipMethod,
        marktingEventId: thisobj.data.marktingEventId,
        sponsorId: thisobj.data.sponsorId,
        vendorId: app.globalData.VendorInfo.Id,
      }
      if ($.isNull(thisobj.data.spinfo)) {

        // thisobj.setData({
        //   pid: data.Info.VendorList[0].ShoppingCartList.Id
        // })
        var thisval = data.Info.VendorList[0].ShoppingCartList;
        for (var x in thisval) {
          if (thisval[x].IsCheck) {
            thisval[x].AddTime = thisobj.getLocalTime(thisval[x].AddTime);
            val.ShoppingCartList.push(thisval[x]);
          }
        }
      } else {
        val.ShoppingCartList.push(JSON.parse(thisobj.data.spinfo));
      }
      thisobj.setData({
        cartinfo: val.ShoppingCartList,

      });

      console.log("购物车参数", val)
      $.xsr($.makeUrl(cartapi.GoSettlement, val), function(data) {
        console.log("购物车", data)
        var that = this;
        if (data.Code == 0) {

          var date = new Date();
          var onlyzt = data.Info.ShoppingCartHeaderInfo.IsSelfTakeOnly;

          console.log("ssssss", onlyzt)
          var date2 = new Date(date);
          date2.setDate(date.getDate() + (parseInt(data.Info.ShoppingCartHeaderInfo.UserTakeDateSpan)));
          var starttime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
          var endtime = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
          thisobj.setData({
            addressid: $.isNull(data.Info.DeliveryAddress) ? 0 : data.Info.DeliveryAddress.id,
            submitinfo: data.Info,
            eddate: endtime,
            starttime: starttime,
            cartinfo11: onlyzt,
            ishide: false,
            onl: data.Info.VendorShoppingCartItemsList[0].ShoppingCartList[0],
            ShoppingCartHeaderInfo: data.Info.ShoppingCartHeaderInfo,

          });
          clearInterval(myinterval)
          if (thisobj.data.submitinfo.VendorShoppingCartItemsList[0].ShoppingCartList[0].IsSelfTakeOnly) {
            //  thisobj.setData({
            //    flag1:true,
            //     flag:false
            //  })
            thisobj.draw();
          }
          myinterval = setInterval(function() {
            // clearInterval(myinterval)
            thisobj.time(thisobj.data.submitinfo.ShoppingCartHeaderInfo.EstimatedArriveTimeInMinute + 1);
          }, 1000);
          if (thisobj.data.submitinfo.VedorCityDisSetting.IsEnabled) {
            //开启同城配送
            setTimeout(function() {
              thisobj.timeDifference();
              thisobj.setData({
                time: thisobj.data.estimatedArriveTime
              })
            }, 1000)
          }

          if (data.Info.UserMembership.PointAsCashRate == 0) {
            thisobj.setData({
              disbursements: data.Info.ShoppingCartHeaderInfo.ActualPayPrice,
            })
          } else {
            thisobj.setData({
              disbursements: ((data.Info.ShoppingCartHeaderInfo.ActualPayPrice) - (thisobj.data.integral / data.Info.UserMembership.PointAsCashRate)).toFixed(2)
            })
          }
          if (thisobj.data.disbursements < 0) {
            thisobj.setData({
              disbursements: 0,
            })
          }
          if (!$.isNull(thisobj.data.submitinfo.ShoppingCartUsedCouponInfo)) {
            thisobj.setData({
              couponItemId: thisobj.data.submitinfo.ShoppingCartUsedCouponInfo.CouponItem.Id
            });
          }
          //快递发货，同城配送
          if (data.Info.ShoppingCartHeaderInfo.DistributionType == 2) {
            if (thisobj.data.flag1) {
              thisobj.setData({
                shipMethod: 1
              })
            } else {
              thisobj.setData({
                shipMethod: 3
              })
            }
          }
        } else {

          $.alert(data.Msg, function() {
            wx.navigateBack(1);

          })
        }
        if (data.Info.ShoppingCartHeaderInfo.MaxUsableCash >= thisobj.data.disbursements) {
          thisobj.setData({
            balance: thisobj.data.disbursements,
            realMoney: 0
          })
        } else {
          thisobj.setData({
            balance: data.Info.ShoppingCartHeaderInfo.MaxUsableCash,
            realMoney: (thisobj.data.disbursements - thisobj.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash).toFixed(2)
          })
        }
      });
    });
  },
  count: function(e) {
    this.setData({
      integral: e.detail.value,

    })
    if (e.detail.value == 0) {
      this.setData({
        integral: ""
      })
    }
    if (parseInt(e.detail.value) > parseInt(this.data.submitinfo.UserMembership.UsablePoint)) {
      this.setData({
        integral: "",
        discount: 0,
        disbursements: this.data.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice
      })
      wx.showModal({
        title: '提示',
        content: '请输入正确积分额度',
      })
    } else {
      this.setData({
        discount: (this.data.integral / this.data.submitinfo.UserMembership.PointAsCashRate).toFixed(2),
        disbursements: ((this.data.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice) - (this.data.integral / this.data.submitinfo.UserMembership.PointAsCashRate)).toFixed(2)
      })
    }
    if (this.data.disbursements < 0) {
      this.setData({
        disbursements: 0,
      })
    }
    if ((this.data.integral / this.data.submitinfo.UserMembership.PointAsCashRate).toFixed(2) > this.data.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice) {
      this.setData({
        discount: this.data.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice,
      })
    }
    if (this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash >= this.data.disbursements) {
      this.setData({
        balance: this.data.disbursements,
        realMoney: 0
      })
    } else {
      this.setData({
        balance: this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash,
        realMoney: (this.data.disbursements - this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash).toFixed(2)
      })
    }
  },
  getLocalTime: function(dateText) { //时间处理
    dateText = dateText.replace("/Date(", "").replace(")/", "");
    var d = new Date(parseInt(dateText));
    return d;
  },
  submitorder: function(e) { //提交订单

    console.log("提交前的点击", this.data.ShoppingCartHeaderInfo.IsSelfTakeOnly)
    if (this.data.ShoppingCartHeaderInfo.IsSelfTakeOnly) {
      if (this.data.flag1) {} else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择配送方式！'
        });
        return;
      }

    }
    var that = this;

    
    if ($.isNull(that.data.orderNum)) {
      if (this.data.addressid == 0 && this.data.flag) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择你的收货地址！'
        });
        return;
      }
      if ($.isNull(this.data.showconsignee) && this.data.flag1) {

        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写提货人姓名!'
        });
        return;
      }
      if ($.isNull(this.data.showphone) && this.data.flag1) {

        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写提货人手机号码!'
        });
        return;
      }
      if (!(/^1[34578]\d{9}$/.test(this.data.showphone)) && this.data.flag1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '手机号有误!'
        });
        return;
      }
      if (this.data.isBalance) {
        if (this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash == 0) {
          this.setData({
            eCardCash: this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash,
            extraCash: this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableExtraCash
          })
        }
        if (this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash != 0 && this.data.balance == 0) {
          this.setData({
            eCardCash: this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash,
            extraCash: this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableExtraCash
          })
        }
        if (this.data.balance >= this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash) {
          this.setData({
            eCardCash: this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash,
            extraCash: this.data.balance - this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash
          })
        }
        if (this.data.balance < this.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash) {
          this.setData({
            eCardCash: this.data.balance,
            extraCash: 0
          })
        }
      } else {
        this.setData({
          eCardCash: 0,
          extraCash: 0
        })
      }

      //是否开启可配送时间
      if (this.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanEnabled && this.data.flag1 == false) {
        //是否开启指定送达时间
        this.timeDifference();
        if (this.data.submitinfo.VedorCityDisSetting.CustomDeliverTimeEnabled) { //开启指定到达时间
          //尽快到达时间
          if (this.data.IsTime) {
            if (this.data.fastestTime < this.data.startGetTime || this.data.fastestTime > this.data.endGetTime) {
              wx.showModal({
                title: '提示',
                content: '不在商家配送时间段，你可提前预约下单，点击最快送达时间，选择指定时间在' + this.data.startdate + '-' + this.data.enddate + '之间送达可下单',
                showCancel: false,
              })
              return
            }
          } else {
            //指定到达时间
            if (this.data.setGetTime < this.data.startGetTime || this.data.setGetTime > this.data.endGetTime) {
              wx.showModal({
                title: '提示',
                content: '不在商家配送时间段，你可提前预约下单，点击最快送达时间，选择指定时间在' + this.data.startdate + '-' + this.data.enddate + '之间送达可下单',
                showCancel: false,
              })
              return
            }
          }
        } else { //未开启指定送达时间
          //开启预计到达时间
          if (this.data.submitinfo.VedorCityDisSetting.EstimatedArriveTimeEnabled) {
            if (this.data.fastestTime < this.data.startGetTime || this.data.fastestTime > this.data.endGetTime) {
              wx.showModal({
                title: '提示',
                content: '不在商家配送时间段，请在' + this.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanStart + '-' + this.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanEnd + '内下单可送达',
                showCancel: false,
              })
              return
            }
          } else {
            //未开启预计到达时间
            var date = new Date().getTime();
            if (date < this.data.startGetTime || date > this.data.endGetTime) {
              wx.showModal({
                title: '提示',
                content: '不在商家配送时间段，请在' + this.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanStart + '-' + this.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanEnd + '内下单可送达',
                showCancel: false,
              })
              return
            }
          }
        }
      }

      var val = {
        userName: app.globalData.UserInfo.UserName,
        ShoppingCartList: this.data.cartinfo,
        ShoppingCartVendorList: [{
          VendorId: app.globalData.VendorInfo.Id,
          Remark: that.data.remark
        }],
        remark: that.data.remark,
        addressId: this.data.addressid || 0,
        couponItemId: this.data.couponItemId,
        payTypeId: 9,
        memberDiscount: !$.isNull(this.data.submitinfo.UserMembership) ? parseFloat(this.data.submitinfo.UserMembership.MemberDiscount) : 0,
        memberDiscountMoney: !$.isNull(this.data.submitinfo.UserMembership) ? parseFloat(this.data.submitinfo.UserMembership.MemberDiscountMoney) : 0,
        usingPoint: !$.isNull(this.data.integral) ? parseFloat(this.data.integral) : 0,
        pointAsCashMoney: !$.isNull(this.data.discount) ? parseFloat(this.data.discount) : 0,
        shipMethod: this.data.shipMethod,
        reservationDate: this.data.date || this.data.starttime,
        reservationStoreId: this.data.physicalStoreId,
        consignee: this.data.consignee,
        userTel: this.data.phone,
        marktingEventId: this.data.marktingEventId,
        sponsorId: this.data.sponsorId,
        firstType: 0,
        eCardCash: this.data.eCardCash, // 使用的储值余额
        extraCash: this.data.extraCash, // 使用的储值赠送余额
        estimatedArriveTime: "",
        preferredStoreId: this.data.submitinfo.ShoppingCartHeaderInfo.PreferredStoreId,
        arriveTimeType: this.data.arriveTimeType //外卖时间类型
      }
      if (!$.isNull(that.data.spinfo)) {

        var spinfoobj = JSON.parse(that.data.spinfo);
        val.orderType = this.data.orderType;
        val.isFightGroup = spinfoobj.isFightGroup;
        val.marketingEventId = spinfoobj.marketingEventId; //活动ID
        val.isOwner = spinfoobj.isOwner;
        val.ownGroupId = spinfoobj.ownGroupId;
      }
      if (this.data.submitinfo.VedorCityDisSetting.EstimatedArriveTimeEnabled) {
        val.estimatedArriveTime = this.data.arriveTimeType == 1 ? this.data.time : this.data.estimatedArriveTime
      }
      notice.removeNotification("RefreshOrder", that);
      notice.removeNotification("RefreshOrder1", that);
      notice.removeNotification("RefreshCoupon", that);

      $.xsr($.makeUrl(orderapi.SubmitOrders, val), function(data) {
        console.log("表单提交++++++++++++++++++++++", val)
        if (data.Code == 0) {
          that.setData({
            formId: e.detail.formId,
            orderNum: data.Info.OrderNum
          });
          if (data.Info.ActualPayPrice > 0) {
            that.gotopay(data.Info);
          } else {
            $.alert("支付成功")

            setTimeout(function() {
              that.sendMessage(data.Info, 2, 1);
              that.returnUrl(data.Info.OrderNum);
            }, 1000)
          }
        } else {
          //拼团超出数量
          setTimeout(() => {
            wx.showModal({
              title: '提示',
              content: data.Msg,
              showCancel: false,
            })
          }, 500)
          // wx.showToast({
          //   title: data.Msg
          // })
        }
      });
    } else {
      that.gotopay();
    }
  },
  gotopay: function(OrderInfo) { //去支付
    var that = this;
    var val = {
      OrderNum: this.data.orderNum,
      orderType: this.data.orderType,
      OpendId: app.globalData.UserInfo.WeiXinOpenId,
      VendorId: app.globalData.VendorInfo.Id
    }
    this.data.isSubmit = true;
    $.xsr($.makeUrl(cartapi.GetWeiXinPrePayNum, val), function(data) {
      if (data.Code != 0 || $.isNull(data.Info)) {
        wx.showToast({
          title: '微信支付失败！'
        })
        return
      }
      wx.requestPayment({
        'timeStamp': data.Info.timeStamp,
        'nonceStr': data.Info.nonceStr,
        'package': data.Info.package,
        'signType': data.Info.signType,
        'paySign': data.Info.paySign,
        'success': function(res) {
          if (that.data.isTmplMsg) {
            that.sendMessage(OrderInfo, 2, 2);
          }
          that.returnUrl(val.OrderNum);
        },
        'fail': function(res) {
          if (that.data.isTmplMsg) {
            that.sendMessage(OrderInfo, 1, 1);
          }
          $.gotopage('../orderdetail/orderdetail?on=' + val.OrderNum + "&orderType=" + val.orderType);


        },
        'complete': function(res) {
          if (res.errMsg == "requestPayment:cancel") {
            $.gotopage('../orderdetail/orderdetail?on=' + val.OrderNum + "&orderType=" + val.orderType);
            if (that.data.isTmplMsg) {
              that.sendMessage(OrderInfo, 1, 2);
            }
          }
        }
      })

    });
  },
  inputRemark: function(e) { //输入参数
    this.setData({
      remark: e.detail.value,
      remarkLength: e.detail.value.length
    });
  },
  sendMessage: function(OrderInfo, typeId, MessageType) { //发送模版消息
    var val = {
      FormId: this.data.formId,
      MessageType: MessageType,
      TplKey: "",
      PageUrl: 'pages/orderdetail/orderdetail?on=' + OrderInfo.OrderNum,
      TplData: []
    }
    if (typeId == 1) {
      val.TplKey = "AT0210";
      val.TplData = [app.globalData.VendorInfo.Currency + OrderInfo.OrderNum, OrderInfo.ActualPayPrice, OrderInfo.ProductName, "您的订单已提交,请尽快完成支付"];
    }
    if (typeId == 2) {
      val.TplKey = "AT0009";
      val.TplData = [app.globalData.VendorInfo.Currency + OrderInfo.ActualPayPrice, OrderInfo.CreateTime, OrderInfo.PayTime, OrderInfo.OrderNum, OrderInfo.ProductName, "您的订单已支付成功，感谢您的支持"];
    }
    app.SendMessage(val);
  },
  suitcouponlist: function() { //点击优惠券去可使用的优惠券列表
    wx.navigateTo({
      url: "../suitcouponlist/suitcouponlist?val=" + JSON.stringify(this.data.submitinfo.ShoppingCartCouponInfoList) + "&id=" + this.data.couponItemId
    });
  },
  returnUrl: function(OrderNum) {
    var that = this;
    if (!$.isNull(that.data.spinfo)) {
      var json = JSON.parse(that.data.spinfo);
      if (json.isFightGroup == 2 || json.isFightGroup == 3) {
        if (json.isOwner) {
          $.gotopage('../fightgroupsdetail/fightgroupsdetail?on=' + OrderNum + '&type=' + that.data.type + "&MEId=" + that.data.MEId);
          return;
        } else {
          $.backpage(1, function() {
            notice.postNotificationName("RefreshFG");
          });
          return;
        }
      } else {
        $.gotopage('../orderdetail/orderdetail?on=' + OrderNum + '&type=' + '1');
        return;
      }
    } else {
      $.gotopage('../orderdetail/orderdetail?on=' + OrderNum + '&type=' + '1');
      return;
    }
  },
  selectAddress: function() { //选择地址
    var that = this;
    wx.chooseAddress({
      success: function(res) { //授权成功，走调用地址
        var val = {
          cityName: res.cityName,
          countyName: res.countyName,
          provinceName: res.provinceName,
          detailInfo: res.detailInfo,
          errMsg: res.errMsg,
          userName: res.userName,
          nationalCode: res.nationalCode,
          postalCode: res.postalCode,
          telNumber: res.telNumber,
          UserId: app.globalData.UserInfo.Id
        }
        $.xsr($.makeUrl(orderapi.selectAddressInfo, val), function(data) {
          console.log("dizhi :", data)
          that.setData({
            addressid: data.Info.id
          });
          that.getcartlist();
        });
      },
      fail: function(res) { //授权失败，继续走原来的
        if (that.data.addressid > 0) {
          $.gopage("../addresslist/addresslist?adid=" + that.data.submitinfo.DeliveryAddress.id + (that.data.spinfo == '' ? '' : '&spid=' + that.data.spinfo));
        } else {
          $.gopage("../addressmanage/addressmanage?adid=-1&issub=true" + (that.data.spinfo == '' ? '' : '&spid=' + that.data.spinfo));
        }
      }
    })
  },
  getNearbylist: function() {

    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      productIdSet: [],
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      storeId: this.data.addressidd,
    }
    for (var i in this.data.cartinfo) {
      val.productIdSet.push(this.data.cartinfo[i].ProductId);
    }
    this.setData({
      productIdSet: val.productIdSet
    })
    var that = this;
    val.productIdSet = val.productIdSet.join(",");

    $.xsr($.makeUrl(vendorapi.GetPhysicalStoreInfoByStoreId, val), function(res) {
      console.log("自提订单：",res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        var ProductId = val.ProductId
        if (res.Info.length > 0) {
          that.setData({
            addInfo: res.Info,
            AddressInfo: res.Info[0],
            physicalStoreId: res.Info[0].Id
          });
        }
      }
    });
  },
  express: function() { //切换
    this.setData({
      flag: true,
      flag1: false,
      consignee: "",
      phone: ""
    })
    if (this.data.flag) {
      this.setData({
        shipMethod: 0
      })
    } else {
      this.setData({
        shipMethod: 1
      })
    }
    this.getcartlist();
  },
  draw: function() { //上门自提
  debugger
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log("地理位置查询",res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });

        that.getNearbylist();
      },
      fail: function() {
        that.setData({
          isdata: true
        });
        $.alert("授权失败");

        that.getNearbylist();
      }
    })
    this.setData({
      flag1: true,
      flag: false,
      addressid: 0
    })
    if (this.data.flag1) {
      this.setData({
        shipMethod: 1
      })
    } else {
      this.setData({
        shipMethod: 0
      })
    }

    this.getcartlist01()
    this.getNearbylist();
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
    })
  },
  switchChange: function(e) {
    if (e.detail.value) {
      this.setData({
        realMoney: this.data.realMoney,
        isBalance: true
      })
    } else {
      this.setData({
        disbursements: this.data.disbursements,
        isBalance: false
      })
    }
  },
  time: function(mins) {
    var that = this;
    var myDate = new Date();
    var hour = myDate.getHours();
    var min = myDate.getMinutes();
    var hour1 = parseInt((min + mins - 1) / 60)
    var min1 = (min + mins - 1) % 60
    if (hour + hour1 > 24) {
      that.setData({
        hour: '00',
        min: min1 < 10 ? '0' + min1 : min1
      })
    } else {
      that.setData({
        hour: parseInt(hour) + hour1,
        min: min1 < 10 ? '0' + min1 : min1
      })
    }
    that.setData({
      estimatedArriveTime: that.data.hour + ':' + that.data.min,
    })
    // wx.setStorageSync("estimatedArriveTime", that.data.estimatedArriveTime)
  },
  //外卖类型切换
  // timeTab: function() {
  //   if (this.data.submitinfo.VedorCityDisSetting.CustomDeliverTimeEnabled) {
  //     if (this.data.IsTime) {
  //       this.setData({
  //         IsTime: false,
  //         arriveTimeType: 1,
  //         time: this.data.estimatedArriveTime,
  //       })
  //     } else {
  //       this.setData({
  //         IsTime: true,
  //         arriveTimeType: 0,

  //       })
  //       // estimatedArriveTime: wx.getStorageSync("estimatedArriveTime")
  //     }
  //   }
  // },
  /**时间选择器 */
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      IsTime: false,
      arriveTimeType: 1,
    })
  },

  getcartlist01: function() { //获取购物车
    clearInterval(myinterval)
    var thisobj = this;
    var vals = {
      storeID: app.globalData.VendorInfo.Id,
      userName: app.globalData.UserInfo.UserName,

    }
    $.xsr($.makeUrl(cartapi.GetCartList, vals), function(data) { //先查询出购物车中所有的商品
      console.log("查询", data)
      var val = {
        userAccount: app.globalData.UserInfo.UserName,
        ShoppingCartList: [],
        couponItemId: thisobj.data.couponItemId, //使用优惠券id
        IsUseCoupon: thisobj.data.IsUseCoupon, //表示用户是否使用优惠券
        isFightGroup: !$.isNull(thisobj.data.spinfo) ? JSON.parse(thisobj.data.spinfo).isFightGroup : "",
        addressId: thisobj.data.addressid || 0,
        physicalStoreId: thisobj.data.physicalStoreId,
        shipMethod: thisobj.data.shipMethod,
        marktingEventId: thisobj.data.marktingEventId,
        sponsorId: thisobj.data.sponsorId,
        vendorId: app.globalData.VendorInfo.Id,
      }
      if ($.isNull(thisobj.data.spinfo)) {

        // thisobj.setData({
        //   pid: data.Info.VendorList[0].ShoppingCartList.Id
        // })
        var thisval = data.Info.VendorList[0].ShoppingCartList;
        for (var x in thisval) {
          if (thisval[x].IsCheck) {
            thisval[x].AddTime = thisobj.getLocalTime(thisval[x].AddTime);
            val.ShoppingCartList.push(thisval[x]);
          }
        }
      } else {
        val.ShoppingCartList.push(JSON.parse(thisobj.data.spinfo));
      }
      thisobj.setData({
        cartinfo: val.ShoppingCartList,

      });

      console.log("购物车参数", val)
      $.xsr($.makeUrl(cartapi.GoSettlement, val), function(data) {
        console.log("购物车", data)
        var that = this;
        if (data.Code == 0) {

          var date = new Date();
          var onlyzt = data.Info.ShoppingCartHeaderInfo.IsSelfTakeOnly;

          console.log("ssssss", onlyzt)
          var date2 = new Date(date);
          date2.setDate(date.getDate() + (parseInt(data.Info.ShoppingCartHeaderInfo.UserTakeDateSpan)));
          var starttime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
          var endtime = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
          thisobj.setData({
            addressid: $.isNull(data.Info.DeliveryAddress) ? 0 : data.Info.DeliveryAddress.id,
            submitinfo: data.Info,
            eddate: endtime,
            starttime: starttime,
            cartinfo11: onlyzt,
            ishide: false,
            onl: data.Info.VendorShoppingCartItemsList[0].ShoppingCartList[0],
            ShoppingCartHeaderInfo: data.Info.ShoppingCartHeaderInfo,

          });
          clearInterval(myinterval)

          myinterval = setInterval(function() {
            // clearInterval(myinterval)
            thisobj.time(thisobj.data.submitinfo.ShoppingCartHeaderInfo.EstimatedArriveTimeInMinute + 1);
          }, 1000);
          if (thisobj.data.submitinfo.VedorCityDisSetting.IsEnabled) {
            //开启同城配送
            setTimeout(function() {
              thisobj.timeDifference();
              thisobj.setData({
                time: thisobj.data.estimatedArriveTime
              })
            }, 1000)
          }

          if (data.Info.UserMembership.PointAsCashRate == 0) {
            thisobj.setData({
              disbursements: data.Info.ShoppingCartHeaderInfo.ActualPayPrice,
            })
          } else {
            thisobj.setData({
              disbursements: ((data.Info.ShoppingCartHeaderInfo.ActualPayPrice) - (thisobj.data.integral / data.Info.UserMembership.PointAsCashRate)).toFixed(2)
            })
          }
          if (thisobj.data.disbursements < 0) {
            thisobj.setData({
              disbursements: 0,
            })
          }
          if (!$.isNull(thisobj.data.submitinfo.ShoppingCartUsedCouponInfo)) {
            thisobj.setData({
              couponItemId: thisobj.data.submitinfo.ShoppingCartUsedCouponInfo.CouponItem.Id
            });
          }
          //快递发货，同城配送
          if (data.Info.ShoppingCartHeaderInfo.DistributionType == 2) {
            if (thisobj.data.flag1) {
              thisobj.setData({
                shipMethod: 1
              })
            } else {
              thisobj.setData({
                shipMethod: 3
              })
            }
          }
        } else {

          $.alert(data.Msg, function() {
            wx.navigateBack(1);

          })
        }
        if (data.Info.ShoppingCartHeaderInfo.MaxUsableCash >= thisobj.data.disbursements) {
          thisobj.setData({
            balance: thisobj.data.disbursements,
            realMoney: 0
          })
        } else {
          thisobj.setData({
            balance: data.Info.ShoppingCartHeaderInfo.MaxUsableCash,
            realMoney: (thisobj.data.disbursements - thisobj.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash).toFixed(2)
          })
        }
      });
    });
  },



  /**外卖指定时间计算 */
  timeDifference: function() {
    var that = this;
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    //计算外卖所需的时间
    var needTime = that.data.ShoppingCartHeaderInfo.EstimatedArriveTimeInMinute + 1;
    //配送范围最早时间
    var startTime = that.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanStart;
    var start = year + "-" + month + "-" + day + " " + startTime;
    var startDate = new Date(start.replace(/-/g, '/'));
    var startGetTime = startDate.getTime() + (needTime * 60 * 1000); //最早可送达时间戳

    var startNewDate = new Date(startGetTime);
    var startHours = startNewDate.getHours();
    var startMinutes = startNewDate.getMinutes();
    var startM = startMinutes < 10 ? "0" + startMinutes : startMinutes;
    var startdate = startHours + ":" + startM; //最早可送达时间



    //配送范围最晚时间
    var endTime = that.data.submitinfo.VedorCityDisSetting.DeliverTimeSpanEnd;
    var end = year + "-" + month + "-" + day + " " + endTime;
    var endDate = new Date(end.replace(/-/g, '/'));
    var endGetTime = endDate.getTime() + (needTime * 60 * 1000);

    var endNewDate = new Date(endGetTime);
    var endHours = endNewDate.getHours();
    var endMinutes = endNewDate.getMinutes();
    var endM = endMinutes < 10 ? "0" + endMinutes : endMinutes;
    var enddate = endHours + ":" + endM; //最晚可送达时间


    //指定时间
    var setTimeDate = that.data.time;
    var setTime = year + "-" + month + "-" + day + " " + setTimeDate;
    var setDate = new Date(setTime.replace(/-/g, '/'));
    var setGetTime = setDate.getTime();

    //最快到达时间

    var fastest = that.data.estimatedArriveTime;
    var setfastestTime = year + "-" + month + "-" + day + " " + fastest;
    var fastestDate = new Date(setfastestTime.replace(/-/g, '/'));
    var fastestTime = fastestDate.getTime();

    that.setData({
      startGetTime: startGetTime,
      endGetTime: endGetTime,
      setGetTime: setGetTime,
      fastestTime: fastestTime,
      startdate: startdate,
      enddate: enddate,
    })
  }
})