 var app = getApp();
 var $ = require('../../utils/util.js');
 var cartapi = require('../../api/cartAPI.js');
 var integraiAPI = require('../../api/integratShop.js');
 var orderapi = require('../../api/orderAPI.js');
 var notice = require('../../utils/notice.js');
 var vendorapi = require('../../api/vendorAPI.js');
 var myinterval
 Page({
   data: {
     AddressInfo: {},
     cartinfo: {}, //提交的购物车信息
     addressid: 0, //地址ID
     spinfo: "",
     remark: "",
     remarkLength: 0,
     formId: "",
     submitinfo: {}, //提交信息
     isSubmit: false, //是否已经进行过订单提交
     couponItemId: 0, //使用优惠券id
     orderNum: "",
     integral: "", //积分
     discount: 0, //积分抵现
     disbursements: "", //实付款
     IsUseCoupon: 1, //表示用户是否使用优惠券
     flag: true,
     flag1: false,
     date: "",
     starttime: "",
     pid: "",
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
     estimatedArriveTime: ''
   },
   onLoad: function(options) {
     clearInterval(myinterval)
     if (options.spid) {
       this.setData({
         spinfo: (decodeURIComponent(options.spid)), //解码特殊字符
         type: options.type,
         MEId: options.MEId || "",
         orderType: options.orderType,
         img: JSON.parse(decodeURIComponent(options.spid)).img,
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
       marktingEventId: options.marktingEventId,
       sponsorId: options.sponsorId,
     });
     var that = this;
     notice.addNotification("RefreshOrder", that.RefreshOrder, that);
     notice.addNotification("RefreshOrder1", that.RefreshOrder1, that);
     notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);
     this.getcartlist(); //获取购物车集合
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
   },
   inputconsignee: function(even) { //输入收件人时
     this.setData({
       consignee: even.detail.value
     });
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
   RefreshOrder: function(info) { //刷新订单
     clearInterval(myinterval)
     this.setData({
       addressid: info.adid || 0,
       spinfo: info.spid,
       addInfo1: this.data.addInfo
     });
     this.getcartlist();
   },
   RefreshOrder1: function(info) { //刷新订单
     clearInterval(myinterval)
     this.setData({
       AddressInfo: info.StoreId,
       physicalStoreId: info.StoreId.Id,
     });
     this.getcartlist();
   },
   RefreshCoupon: function(info) { //刷新优惠券
     clearInterval(myinterval)
     this.setData({
       couponItemId: info.couponItemId,
       IsUseCoupon: info.IsUseCoupon,
     });
     this.getcartlist();
   },
   getcartlist: function() { //获取购物车
     clearInterval(myinterval)
     var thisobj = this;
     var vals = {
       storeID: app.globalData.VendorInfo.Id,
       userName: app.globalData.UserInfo.UserName
     }
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
     }
     val.ShoppingCartList.push(JSON.parse(thisobj.data.spinfo));
     thisobj.setData({
       cartinfo: val.ShoppingCartList
     });

     $.xsr($.makeUrl(integraiAPI.GoSettlement, val), function(data) {
       if (data.Code == 0) {
         var date = new Date();
         var date2 = new Date(date);
         date2.setDate(date.getDate() + (parseInt(data.Info.ShoppingCartHeaderInfo.UserTakeDateSpan)));
         var starttime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
         var endtime = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
         thisobj.setData({
           addressid: $.isNull(data.Info.DeliveryAddress) ? 0 : data.Info.DeliveryAddress.id,
           submitinfo: data.Info,
           eddate: endtime,
           starttime: starttime,
           ShoppingCartHeaderInfo: data.Info.ShoppingCartHeaderInfo
         });
         myinterval = setInterval(function() {
           thisobj.time(data.Info.ShoppingCartHeaderInfo.EstimatedArriveTimeInMinute + 1);
         }, 1000);
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
     var that = this;
     if ($.isNull(that.data.orderNum)) {
       if (that.data.addressid == 0 && that.data.flag) {
         wx.showModal({
           title: '提示',
           showCancel: false,
           content: '请选择你的收货地址！'
         });
         return;
       }
       if ($.isNull(that.data.consignee) && that.data.flag1) {
         wx.showModal({
           title: '提示',
           showCancel: false,
           content: '请填写提货人姓名!'
         });
         return;
       }
       if ($.isNull(that.data.phone) && that.data.flag1) {
         wx.showModal({
           title: '提示',
           showCancel: false,
           content: '请填写提货人手机号码!'
         });
         return;
       }
       if (!(/^1[34578]\d{9}$/.test(that.data.phone)) && that.data.flag1) {
         wx.showModal({
           title: '提示',
           showCancel: false,
           content: '手机号有误!'
         });
         return;
       }
       // that.setData({
       //   balance: that.data.submitinfo.ShoppingCartHeaderInfo.FreightPrice
       // })


       if (that.data.isBalance) {
         if (that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash == 0) {
           that.setData({
             eCardCash: that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash,
             extraCash: that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableExtraCash
           })
         }
         if (that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableCash != 0 && that.data.balance == 0) {
           that.setData({
             eCardCash: that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash,
             extraCash: that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableExtraCash
           })
         }
         if (that.data.balance >= that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash) {
           that.setData({
             eCardCash: that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash,
             extraCash: that.data.balance - that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash
           })
         }
         if (that.data.balance < that.data.submitinfo.ShoppingCartHeaderInfo.MaxUsableECardCash) {
           that.setData({
             eCardCash: that.data.balance,
             extraCash: 0
           })
         }
       } else {
         that.setData({
           eCardCash: 0,
           extraCash: 0
         })
       }

       var val = {
         userName: app.globalData.UserInfo.UserName,
         ShoppingCartList: that.data.cartinfo,
         ShoppingCartVendorList: [{
           VendorId: app.globalData.VendorInfo.Id,
           Remark: that.data.remark
         }],
         remark: that.data.remark,
         addressId: that.data.addressid || 0,
         couponItemId: that.data.couponItemId,
         payTypeId: 9,
         memberDiscount: !$.isNull(that.data.submitinfo.UserMembership) ? parseFloat(that.data.submitinfo.UserMembership.MemberDiscount) : 0,
         memberDiscountMoney: !$.isNull(that.data.submitinfo.UserMembership) ? parseFloat(that.data.submitinfo.UserMembership.MemberDiscountMoney) : 0,
         usingPoint: !$.isNull(that.data.integral) ? parseFloat(that.data.integral) : 0,
         pointAsCashMoney: !$.isNull(that.data.discount) ? parseFloat(that.data.discount) : 0,
         shipMethod: that.data.shipMethod,
         reservationDate: that.data.date || that.data.starttime,
         reservationStoreId: that.data.physicalStoreId,
         consignee: that.data.consignee,
         userTel: that.data.phone,
         marktingEventId: that.data.marktingEventId,
         sponsorId: that.data.sponsorId,
         firstType: 0,
         eCardCash: that.data.eCardCash, // 使用的储值余额
         extraCash: that.data.extraCash, // 使用的储值赠送余额
         estimatedArriveTime: that.data.estimatedArriveTime,
         preferredStoreId: that.data.submitinfo.ShoppingCartHeaderInfo.PreferredStoreId
       }
       if (!$.isNull(that.data.spinfo)) {
         var spinfoobj = JSON.parse(that.data.spinfo);
         val.orderType = this.data.orderType;
         val.isFightGroup = spinfoobj.isFightGroup;
         val.marketingEventId = spinfoobj.marketingEventId; //活动ID
         val.isOwner = spinfoobj.isOwner;
         val.ownGroupId = spinfoobj.ownGroupId;
       }
       $.xsr($.makeUrl(integraiAPI.SubmitOrders, val), function(data) {
         if (data.Code == 0) {
           that.setData({
             formId: e.detail.formId,
             orderNum: data.Info.OrderNum
           });
           if (data.Info.ActualPayPrice > 0) {
             that.gotopay(data.Info);
           } else {
             $.alert("兑换成功")
             setTimeout(function() {
               that.sendMessage(data.Info, 2, 1);
               //that.returnUrl(data.Info.OrderNum);
               //  $.gotopage('/integratShop/IntegralDetail/IntegralDetail?on=' + data.Info.OrderNum + '&type=' + that.data.type + "&MEId=" + that.data.MEId);
               $.gotopage('/pages/orderdetail/orderdetail?on=' + data.Info.OrderNum + '&type=' + that.data.type + "&MEId=" + that.data.MEId);
             }, 1000)
           }
         } else {
           $.alert(data.Msg)
         }
       });
     } else {
       //that.gotopay();
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
           $.gotopage('/pages/orderdetail/orderdetail?on=' + val.OrderNum + "&orderType=" + val.orderType);

         },
         'complete': function(res) {
           if (res.errMsg == "requestPayment:cancel") {
             $.gotopage('/pages/orderdetail/orderdetail?on=' + val.OrderNum + "&orderType=" + val.orderType);
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
   returnUrl: function(OrderNum) {
     var that = this;
     if (!$.isNull(that.data.spinfo)) {
       var json = JSON.parse(that.data.spinfo);
       if (json.isFightGroup == 2 || json.isFightGroup == 3) {
         if (json.isOwner) {
           $.gotopage('/pages/fightgroupsdetail/fightgroupsdetail?on=' + OrderNum + '&type=' + that.data.type + "&MEId=" + that.data.MEId);
           return;
         } else {
           $.backpage(1, function() {
             notice.postNotificationName("RefreshFG");
           });
           return;
         }
       } else {
         $.gotopage('/pages/orderdetail/orderdetail?on=' + OrderNum + '&type=' + that.data.type);
         return;
       }
     } else {
       $.gotopage('/pages/orderdetail/orderdetail?on=' + OrderNum + '&type=' + that.data.type);
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
             addressid: data.Info.id
           });
           that.getcartlist();
         });
       },
       fail: function(res) { //授权失败，继续走原来的
         if (that.data.addressid > 0) {
           $.gopage("/pages/addresslist/addresslist?adid=" + that.data.submitinfo.DeliveryAddress.id + (that.data.spinfo == '' ? '' : '&spid=' + that.data.spinfo));
         } else {
           $.gopage("/pages/addressmanage/addressmanage?adid=-1&issub=true" + (that.data.spinfo == '' ? '' : '&spid=' + that.data.spinfo));
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
       pageNumber: 1,
       pageSize: 10
     }
     for (var i in this.data.cartinfo) {
       val.productIdSet.push(this.data.cartinfo[i].ProductId);
     }
     this.setData({
       productIdSet: val.productIdSet
     })
     var that = this;
     val.productIdSet = val.productIdSet.join(",");
     $.xsr($.makeUrl(vendorapi.GetPhysicalStoreListForUserTaking, val), function(res) {
       if (!$.isNull(res.Info) && res.Code == 0) {
         if (res.Info.length > 0) {
           that.setData({
             addInfo: res.Info,
             AddressInfo: res.Info[0],
             ProductId: val.ProductId,
             physicalStoreId: res.Info[0].Id
           });
         }
       }
     });
   },
   express: function() {
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
     this.getcartlist()
   },
   draw: function() { //上门自提
     var that = this
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
     this.getcartlist()
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
   },
 })