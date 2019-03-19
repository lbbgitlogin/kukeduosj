var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
var vendorapi = require('../../api/vendorAPI.js');
var cartapi = require('../../api/cartAPI.js');
Page({
  data: {
    // 地图
    pageindex: 1,
    ispage: true,
    flag: true, //是否可以进行下次分页
    AddressInfo: {},
    latitude: 0,
    longitude: 0,
    isdata: false,
    // 地图
    cartinfo: {}, //提交的购物车信息
    addressid: "", //地址ID
    userAddress: "", //我的地址
    userTel: "", //我的手机号
    consignee: "", //我的姓名
    spinfo: "",
    remark: "",
    remarkLength: 0,
    formId: "",
    wishi: "",
    showModalStatus: false,
    submitinfo: {}, //提交信息
    isSubmit: false, //是否已经进行过订单提交
    couponItemId: 0, //使用优惠券id
    orderNum: "",
    date: "",
    time: "",
    index: 0,
    nowtime: "", //现在时间
    IsUseCoupon: 1, //表示用户是否使用优惠券
    sp: 0, //上门到店
    pm: 0, //线上线下支付
    st: "",
    et: "",
    caww: "",
    inoll: "",
    stdate: "",
    ProductId: 0, //商品名称
    eddate: "",
    reservingTime: "", //服务时间
    physicalStoreId: "",
    Amount: 1, //数量,
    showconsignee: "",
    showphone: "",
    integral: "", //积分
    discount: 0, //积分抵现
    disbursements: "", //实付款
    showdate: "",
    showname: "",
    marktingEventId: 0,
    sponsorId: 0,
    specification: false, //是否有规格
    balance: 0,
    realMoney: 0,
    isBalance: true,
    eCardCash: 0, // 使用的储值余额
    extraCash: 0, // 使用的储值赠送余额
    isMembership: true,
    isECashCard: true,
    isCoupon: true,
    isTmplMsg: true,
    CustomRequiredOne: '',
    CustomRequiredTwo: '',
    CustomRequiredThree: '',
    CustomOptionalOne: '',
    CustomOptionalTwo: '',
    CustomOptionalThree: '',
    type: '', //活动类型
    MEId: 0, //活动Id || 拼团ID
  },
  showLoading: function() {
    this.setData({
      showLoading: true
    })
  },
  // onShow:function(){
  // this.cail()
  // },
  onLoad: function(options) {
 console.log("数据：",options)
    var that = this;
    // that.cail();
    that.setData({
      addressid: parseInt(options.adid) || 0, //判断是否是从订单提交页过来的
      spinfo: (decodeURIComponent(options.spid)) || "",
      st: options.st || "",
      et: options.et || "",
      sp: parseInt(options.sp) || 0,
      pm: parseInt(options.pm) || 0,
      caww: parseInt(options.caww),
      showdate: options.showdate,
      showname: options.showname,
      ProductId: (decodeURIComponent(options.spid)).ProductId,
      marktingEventId: options.marktingEventId,
      sponsorId: options.sponsorId,
      Currency: app.globalData.VendorInfo.Currency,
      type: options.type || "",
      MEId: options.MEId || '',
    });
    notice.addNotification("RefreshOrder", that.RefreshOrder, that);
    notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);

    this.getcartlist(); //获取购物车集合
    // 地图
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
       
        that.getNearbylist();
       
      },
      fail: function() {
        that.setData({
          isdata: true
        });
        // $.alert("授权失败");
        that.getNearbylist();
      }
    })
    var val = {
      userId: app.globalData.UserInfo.Id,
      vendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(orderapi.GetLatestServiceOrderContactInfo, val), function(data) {
      console.log("wwwww", data)
      if (data.Code == 0) {
        that.setData({
          showconsignee: data.Info[0].Consignee,
          consignee: data.Info[0].Consignee,
          showphone: data.Info[0].Tel,
          phone: data.Info[0].Tel,
          isre: true
        })
      }
    });
    if (this.data.pm == 2) {
      this.setData({
        isBalance: false
      })
    }
    var str = app.globalData.VendorInfo.VendorFeatureSet
    console.log("str+++++++++++++++++++", str)
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
  },
  cail: function() {
    var that = this;
    //获取缓冲
    wx.getStorage({
      key: 'orderInfo',
      success: function(res) {
        console.log("cail res", res)
        that.setData({
          inoll: res.data.StoreId.Id
        })
      },
        fail: function (res) {
        console.log("获取数据失败",res);
      }

    })


  },
  RefreshOrder: function(info) { //刷新订单

    this.setData({
      addressid: info.adid,
      AddressInfo: info.StoreId,
      physicalStoreId: info.StoreId.Id,
      spinfo: info.spinfo
    });
    this.getcartlist();
  },
  RefreshCoupon: function(info) { //刷新优惠券
    this.setData({
      couponItemId: info.couponItemId,
      IsUseCoupon: info.IsUseCoupon
    });
    this.getcartlist();
  },
  getcartlist: function() { //获取购物车
    var thisobj = this;
    var vals = {
      storeID: app.globalData.VendorInfo.Id,
      userName: app.globalData.UserInfo.UserName
    }

    $.xsr($.makeUrl(cartapi.GetCartList, vals), function(data) { //先查询出购物车中所有的商品
      var val = {
        vendorId: app.globalData.VendorInfo.Id,
        userAccount: app.globalData.UserInfo.UserName,
        ShoppingCartList: [],
        couponItemId: thisobj.data.couponItemId, //使用优惠券id
        IsUseCoupon: thisobj.data.IsUseCoupon, //表示用户是否使用优惠券
        isFightGroup: !$.isNull(thisobj.data.spinfo) ? JSON.parse(thisobj.data.spinfo).isFightGroup : "",
        addressId: thisobj.data.addressid || 0,
        physicalStoreId: thisobj.data.physicalStoreId,
        marktingEventId: thisobj.data.marktingEventId,
        sponsorId: thisobj.data.sponsorId,
      }
      if ($.isNull(thisobj.data.spinfo)) {
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
        cartinfo: val.ShoppingCartList
      });
      $.xsr($.makeUrl(cartapi.GoSettlement, val), function(data) {
        console.log("初始化数据", data)
        if (data.Code == 0) {
          var prompt = data.Info.VendorShoppingCartItemsList[0].ShoppingCartList[0].KindlyRemind;
          var date1 = new Date();
          var date2 = new Date(date1);
          date2.setDate(date1.getDate() + parseInt(data.Info.ShoppingCartHeaderInfo.ReservationDateSpan));
          var starttime = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
          var endtime = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
          thisobj.setData({
            addressid: $.isNull(data.Info.DeliveryAddress) ? 0 : data.Info.DeliveryAddress.id,
            submitinfo: data.Info,
            stdate: starttime,
            eddate: endtime,
            wishi: prompt
          });
          if ($.isNull(data.Info.VendorShoppingCartItemsList[0].ShoppingCartList[0].speStr)) {
            thisobj.setData({
              specification: true
            })
          } else {
            thisobj.setData({
              specification: false
            })
          }
          if (data.Info.UserMembership.PointAsCashRate == 0) {
            thisobj.setData({
              disbursements: data.Info.ShoppingCartHeaderInfo.ActualPayPrice
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
        }
      });
    });
  },
  getLocalTime: function(dateText) { //时间处理
    dateText = dateText.replace("/Date(", "").replace(")/", "");
    var d = new Date(parseInt(dateText));
    return d;
  },
  inputconsignee: function(even) { //输入收件人时
    this.setData({
      consignee: even.detail.value
    });
  },
  inputdetail: function(even) { //输入详细地址
    this.setData({
      detail: even.detail.value
    });
    return even.detail.value;
  },
  inputphone: function(even) { //输入手机
    this.setData({
      phone: even.detail.value
    });
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
      wx.showModal({
        title: '提示',
        content: '请输入正确积分额度',
      })
      this.setData({
        integral: "",
        discount: 0,
        disbursements: this.data.submitinfo.ShoppingCartHeaderInfo.ActualPayPrice
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
  submitorder: function(e) { //提交订单
    var changetime = this.data.date + " " + this.data.time
    var changetime1 = changetime.replace(/-/g, "/")
    var date1 = new Date()
    var date2 = new Date(changetime1)
    var s1 = date1.getTime(),
      s2 = date2.getTime();
    if (s2 - s1 < 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您选择的预约时间已不在服务预约时间范围内!'
      });
      return;
    }
    if (this.data.showdate == 'true') {
      if ($.isNull(this.data.date) || $.isNull(this.data.time)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择预约服务日期与时间!'
        });
        return;
      }
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.phone)) && (this.data.showname == 'true')) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '手机号有误!'
      });
      return;
    }
    if (this.data.sp == 1) {
      if ($.isNull(this.data.consignee) && (this.data.showname == 'true')) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写预约人姓名!'
        });
        return;
      }
      if ($.isNull(this.data.phone) && (this.data.showname == 'true')) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写预约人手机号码!'
        });
        return;
      }
    } else {
      if ($.isNull(this.data.consignee) && (this.data.showname == 'true')) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写预约人姓名!'
        });
        return;
      }
      if ($.isNull(this.data.phone) && (this.data.showname == 'true')) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写预约人手机号码!'
        });
        return;
      }
      if ($.isNull(this.data.detail)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写预约人服务地址!'
        });
        return;
      }
    }
    if (!$.isNull(this.data.submitinfo.ServiceProductExtend.CustomRequiredOne && $.isNull(this.data.CustomRequiredOne))) {
      wx.showModal({
        title: '提示',
        content: '请填写' + this.data.submitinfo.ServiceProductExtend.CustomRequiredOne,
      })
      return;
    }
    if (!$.isNull(this.data.submitinfo.ServiceProductExtend.CustomRequiredTwo && $.isNull(this.data.CustomRequiredTwo))) {
      wx.showModal({
        title: '提示',
        content: '请填写' + this.data.submitinfo.ServiceProductExtend.CustomRequiredTwo,
      })
      return;
    }
    if (!$.isNull(this.data.submitinfo.ServiceProductExtend.CustomRequiredThree && $.isNull(this.data.CustomRequiredThree))) {
      wx.showModal({
        title: '提示',
        content: '请填写' + this.data.submitinfo.ServiceProductExtend.CustomRequiredThree,
      })
      return;
    }
    var that = this;
    if ($.isNull(that.data.orderNum)) {
      if (this.data.addressid == 0) {
        // wx.showModal({
        //   title: '提示',
        //   showCancel: false,
        //   content: '请选择你的服务地址!'
        // });
        // return;
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
      var val = {
        userName: app.globalData.UserInfo.UserName,
        ShoppingCartList: this.data.cartinfo,
        ShoppingCartVendorList: [{
          VendorId: app.globalData.VendorInfo.Id,
          Remark: that.data.remark
        }],
        remark: that.data.remark,
        addressId: this.data.addressid || 0,
        userAddress: this.data.detail,
        userTel: this.data.phone,
        consignee: this.data.consignee,
        couponItemId: this.data.couponItemId,
        servicePlaceCode: this.data.sp,
        payMehodCode: this.data.pm,
        // reservingTime: (that.data.date + " " + that.data.time),
        physicalStoreId: this.data.physicalStoreId,
        payTypeId: 9,
        memberDiscount: parseFloat(this.data.submitinfo.UserMembership.MemberDiscount),
        memberDiscountMoney: parseFloat(this.data.submitinfo.UserMembership.MemberDiscountMoney),
        usingPoint: parseFloat(this.data.integral) || 0,
        pointAsCashMoney: parseFloat(this.data.discount),
        marktingEventId: this.data.marktingEventId,
        sponsorId: this.data.sponsorId,
        firstType: 1,
        eCardCash: this.data.eCardCash, // 使用的储值余额
        extraCash: this.data.extraCash, // 使用的储值赠送余额
        CustomRequiredOne: this.data.CustomRequiredOne,
        CustomRequiredOneLabel: this.data.submitinfo.ServiceProductExtend.CustomRequiredOne,
        CustomRequiredTwo: this.data.CustomRequiredTwo,
        CustomRequiredTwoLabel: this.data.submitinfo.ServiceProductExtend.CustomRequiredTwo,
        CustomRequiredThree: this.data.CustomRequiredThree,
        CustomRequiredThreeLabel: this.data.submitinfo.ServiceProductExtend.CustomRequiredThree,
        CustomOptionalOne: this.data.CustomOptionalOne,
        CustomOptionalOneLabel: this.data.submitinfo.ServiceProductExtend.CustomOptionalOne,
        CustomOptionalTwo: this.data.CustomOptionalTwo,
        CustomOptionalTwoLabel: this.data.submitinfo.ServiceProductExtend.CustomOptionalTwo,
        CustomOptionalThree: this.data.CustomOptionalThree,
        CustomOptionalThreeLabel: this.data.submitinfo.ServiceProductExtend.CustomOptionalThree,
      }
      if (!$.isNull(that.data.spinfo)) {
        var spinfoobj = JSON.parse(that.data.spinfo);
        val.orderType = spinfoobj.orderType;
        val.isFightGroup = spinfoobj.isFightGroup || 0;
        val.marketingEventId = spinfoobj.marketingEventId || 0; //活动ID
        val.isOwner = spinfoobj.isOwner || false;
        val.ownGroupId = spinfoobj.ownGroupId || 0;
      }
      if ($.isNull(that.data.date)) {
        val.reservingTime = ""
      } else {
        val.reservingTime = (that.data.date + " " + that.data.time)
      }
      console.log("订单提交参数", val)
      $.xsr($.makeUrl(orderapi.ServiceOrderWebService, val), function(data) {
        if (data.Code == 0) {
          that.setData({
            formId: e.detail.formId,
            orderNum: data.Info.OrderNum
          });
          if (val.payMehodCode == 2) {
            if (that.data.type == "FIGHTGROUP" || that.data.type == "LUCKYFIGHTGROUP") {
              $.gotopage('/pages/fightgroupsdetail/fightgroupsdetail?on=' + data.Info.OrderNum + '&type=' + that.data.type + "&showdate=" + that.data.showdate + "&showname=" + that.data.showname);
            } else {
              $.gotopage('../offlineorderdetail/offlineorderdetail?on=' + data.Info.OrderNum + "&showdate=" + that.data.showdate + "&showname=" + that.data.showname);
            }
          } else {
            if (data.Info.ActualPayPrice > 0) {
              that.gotopay();
            } else {
              $.alert("支付成功")
              setTimeout(function() {
                that.sendMessage(data.Info, 2, 1);
                that.returnUrl(data.Info.OrderNum);
              }, 1000)
            }
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: data.Msg
          });
          // wx.showToast({
          //   title: data.Msg
          // })
        }
      });

    } else {
      that.gotopay();
    }
  },
  gotopay: function() { //去支付
    var that = this;
    var val = {
      OrderNum: this.data.orderNum,
      OpendId: app.globalData.UserInfo.WeiXinOpenId,
      VendorId: app.globalData.VendorInfo.Id,
    }
    if (!$.isNull(that.data.spinfo)) {
      var spinfoobj = JSON.parse(that.data.spinfo);
      val.orderType = spinfoobj.orderType;
      val.isFightGroup = spinfoobj.isFightGroup || 0;
      val.marketingEventId = spinfoobj.marketingEventId || 0; //活动ID
      val.isOwner = spinfoobj.isOwner || false;
      val.ownGroupId = spinfoobj.ownGroupId || 0;
    }
    this.data.isSubmit = true;
    $.xsr($.makeUrl(cartapi.GetWeiXinPrePayNum, val), function(data) {
      wx.requestPayment({
        'timeStamp': data.Info.timeStamp,
        'nonceStr': data.Info.nonceStr,
        'package': data.Info.package,
        'signType': data.Info.signType,
        'paySign': data.Info.paySign,
        'success': function(res) {
          if (that.data.isTmplMsg) {
            that.sendMessage(val.OrderNum, 2);
          }
          that.returnUrl(val.OrderNum);
        },
        'fail': function(res) {
          $.gotopage('../orderdetail/orderdetail?on=' + val.OrderNum + "&showdate=" + that.data.showdate + "&showname=" + that.data.showname);
          if (that.data.isTmplMsg) {
            that.sendMessage(val.OrderNum, 1);
          }
        },
        'complete': function(res) {
          if (res.errMsg == "requestPayment:cancel") {
            $.gotopage('../orderdetail/orderdetail?on=' + val.OrderNum + "&showdate=" + that.data.showdate + "&showname=" + that.data.showname);
            if (that.data.isTmplMsg) {
              that.sendMessage(val.OrderNum, 1);
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
  sendMessage: function(OrderNum, typeId) { //发送模版消息
    if (this.data.pm == 1) {
      this.setData({
        pages: 'server/orderdetail/orderdetail?on=' + OrderNum,
      })
    } else {
      this.setData({
        pages: 'server/offlineorderdetail/offlineorderdetail?on=' + OrderNum,
      })
    }
    var val = {
      api: typeId == 1 ? orderapi.OrderSubmitMessage : orderapi.OrderPaySuccessWXMessage,
      pages: this.data.pages,
      formId: this.data.formId,
      WeiXinOpenId: app.globalData.UserInfo.WeiXinOpenId,
      value: {
        VendorId: app.globalData.VendorInfo.Id,
        OrderNum: OrderNum
      }
    }
    $.sendTpl(val);
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
      // if (json.isFightGroup == 1) {
      if (json.isFightGroup == 2 || json.isFightGroup == 3) {
        // + "&MEId=" + that.data.MEId
        if (json.isOwner) {
          $.gotopage('/pages/fightgroupsdetail/fightgroupsdetail?on=' + OrderNum + '&type=' + that.data.type);
          return;
        } else {
          $.backpage(1, function() {
            notice.postNotificationName("RefreshFG");
          });
          return;
        }
      } else {
        $.gotopage('../orderdetail/orderdetail?on=' + OrderNum + "&type=" + "1");
        return;
      }
    } else {
      $.gotopage('../orderdetail/orderdetail?on=' + OrderNum + "&type=" + "1");
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
          that.setData({
            addressid: data.Info.id || 0
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
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 点击日期组件确定事件 
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
    })
  },
  //  地图
  getNearbylist: function() {
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      Latitude: this.data.latitude,
      ProductId: JSON.parse(this.data.spinfo).ProductId,
      Longitude: this.data.longitude,
      storeId: this.data.caww,
    }

    var that = this;
    $.xsr($.makeUrl(vendorapi.GetServiceVendorStoreInfoByStoreId, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length > 0) {
          that.setData({
            AddressInfo: res.Info[0],
            ProductId: val.ProductId,
            physicalStoreId: res.Info[0].Id
          });
        }
      }
    });
  },

  scrollbottom: function() { //进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          type: thisobj.data.type,
          pageindex: parseInt(thisobj.data.pageindex) + 1,
          pagesize: 10
        });
        thisobj.getNearbylist();
      }, 500);
    }
  },
  // 地图
  sub: function(even) { //减数量
    var val = {
      btntype: 2,
      numval: even.currentTarget.dataset.num,
      stock: even.currentTarget.dataset.stock
    }
    this.unifiedNum(val);
  },
  add: function(even) { //加数量
    var val = {
      btntype: 1,
      numval: even.currentTarget.dataset.num,
      stock: even.currentTarget.dataset.stock
    }
    this.unifiedNum(val);
  },
  writenum: function(even) { //失去焦点时
    var val = {
      btntype: 3,
      numval: even.detail.value,
      stock: even.currentTarget.dataset.stock,
    }
    this.unifiedNum(val);
  },
  unifiedNum: function(val) { //统一判断
    var thisobj = { //接收的临时变量
      value: parseInt(val.numval),
      stock: parseInt(val.stock)
    }
    if (isNaN(thisobj.value)) {
      thisobj.value = 1;
    } else {
      if (val.btntype == 1) { //表示加数量
        thisobj.value = thisobj.value + 1;
      }
      if (val.btntype == 2) { //表示减数量
        thisobj.value = thisobj.value - 1;
      }
      if (thisobj.value > 100) { //是否大于最大值
        thisobj.value = 100;
      }
      if (thisobj.value <= 0) { //表示等于0
        thisobj.value = 1;
      }
    }
    var amountNum = JSON.parse(this.data.spinfo);
    amountNum.Amount = thisobj.value;
    this.setData({
      spinfo: JSON.stringify(amountNum)
    });
    this.getcartlist();
  },
  switchChange: function(e) {
    if (e.detail.value && this.data.pm == 1) {
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
  CustomRequiredOne: function(e) {
    this.setData({
      CustomRequiredOne: e.detail.value
    })
  },
  CustomRequiredTwo: function(e) {
    this.setData({
      CustomRequiredTwo: e.detail.value
    })
  },
  CustomRequiredThree: function(e) {
    this.setData({
      CustomRequiredThree: e.detail.value
    })
  },
  CustomOptionalOne: function(e) {
    this.setData({
      CustomOptionalOne: e.detail.value
    })
  },
  CustomOptionalTwo: function(e) {
    this.setData({
      CustomOptionalTwo: e.detail.value
    })
  },
  CustomOptionalThree: function(e) {
    this.setData({
      CustomOptionalThree: e.detail.value
    })
  }
})