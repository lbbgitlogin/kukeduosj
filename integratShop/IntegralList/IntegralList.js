var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    tapindex: 1, //当前项
    pageindex: 1,
    pagesize: 10,
    ispage: true,
    flag: true, //是否可以进行下次分页
    type: 1,
    formId: "",
    orderlist: [],
    imgLogo: "",
    show: false,
    Info: "",
    isData: true
  },
  onLoad: function (options) { // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          tapindex: options.sl,
          pageindex: 1,
          pagesize: 10,
          orderlist: [],
          type: options.type,
          isData: true,
          imgLogo: app.globalData.VendorInfo.WapLogoPath,
          Currency: app.globalData.VendorInfo.Currency
        });
        notice.addNotification("RefreshMessage", that.RefreshMessage, that);
        that.getOrderlist();
      }, options.uid);
    } else {
      that.setData({
        tapindex: options.sl,
        pageindex: 1,
        pagesize: 10,
        orderlist: [],
        type: options.type,
        isData: true,
        imgLogo: app.globalData.VendorInfo.WapLogoPath,
        Currency: app.globalData.VendorInfo.Currency
      });
      notice.addNotification("RefreshMessage", that.RefreshMessage, that);
      that.getOrderlist();
    }

  },
  RefreshMessage: function (info) { //刷新订单
    this.setData({
      tapindex: 1,
      pageNumber: 1,
      pagesize: 10,
      orderlist: [],
      ispage: true,
      flag: true, //是否可以进行下次分页
      type: 1,
      isData: true,
    });
    this.getOrderlist();
  },
  allOrders: function () { //全部订单
    this.setData({
      tapindex: 1,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      ispage: true,
      flag: true, //是否可以进行下次分页
      type: 1,
      isData: true,
    });
    this.getOrderlist();
  },
  toBePaid: function () { //待支付
    this.setData({
      tapindex: 2,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      ispage: true,
      flag: true, //是否可以进行下次分页
      type: 2,
      isData: true,
    });
    this.getOrderlist();
  },
  receiptOfGoods: function () { //待收货
    this.setData({
      tapindex: 3,
      pageindex: 1,
      pagesize: 10,
      ispage: true,
      flag: true, //是否可以进行下次分页
      orderlist: [],
      type: 4,
      isData: true,
    });
    this.getOrderlist();
  },
  toBeEvaluated: function () { //待评价
    this.setData({
      tapindex: 4,
      pageindex: 1,
      pagesize: 10,
      ispage: true,
      flag: true, //是否可以进行下次分页
      orderlist: [],
      type: 5,
      isData: true,
    });
    this.getOrderlist();
  },
  scrollbottom: function () { //进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var thisobj = this;
      thisobj.setData({
        flag: false
      });
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          type: thisobj.data.type,
          flag: false,
          pageindex: parseInt(thisobj.data.pageindex) + 1,
          pagesize: 10
        });
        thisobj.getOrderlist(); //根据价格排序
      }, 500);
    }
  },
  getOrderlist: function () { //统一获取订单列表
    var val = {
      userName: app.globalData.UserInfo.UserName,
      VendorId: app.globalData.VendorInfo.Id,
      currentPage: this.data.pageindex,
      pageSize: this.data.pagesize,
      type: this.data.type
    }
   
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetOrderList, val), function (res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        thisobj.setData({
          isData: true
        });
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
            ispage: false,
            orderlist: thisobj.data.orderlist.concat(res.Info)
          });
        } else {
          thisobj.setData({
            flag: true,
            ispage: true,
            orderlist: thisobj.data.orderlist.concat(res.Info)
          });
        }
      } else {
        thisobj.setData({
          flag: false,
          ispage: false,
        });
      }
      if ($.isNull(res.Info) && res.Code == 0 && thisobj.data.pageindex == 1) {
        thisobj.setData({
          isData: false
        })
      }
    });
  },
  cancelOrder: function (e) { //取消订单
    var that = this;
    var val = {
      orderNum: e.currentTarget.dataset.on
    }
    $.confirm("是否取消订单", function (res) {
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.CloseOrderByOrderNum, val), function (data) {
          if (data.Code == 0) {
            that.setData({
              orderlist: [],
              currentPage: 1
            });
            that.getOrderlist();
          } else {
            $.alert(data.Msg, function () {
              setTimeout(function () {
                that.setData({
                  orderlist: [],
                  currentPage: 1
                });
                that.getOrderlist();
              }, 2000)
            });
          }
        });
      }
    }, true);
  },
  confirmReceipt: function (e) { //确认收货
    var val = {
      orderNum: e.currentTarget.dataset.on
    }
    var thisobj = this;
    $.confirm("是否确认收货？", function (res) {
      if (res.confirm) {
        $.xsr1($.makeUrl(orderapi.UpdateOrdersbyOrderNum, val), function (data) {

          thisobj.setData({
            orderlist: [],
            currentPage: 1,
            Info: data.Msg,
          });
          if (!$.isNull(data.Msg)) {
            thisobj.setData({
              show: true
            })
            setTimeout(function () {
              thisobj.setData({
                show: false
              })
            }, 2000);
          }

          thisobj.getOrderlist();
        });
      }
    }, true);
  },
  gotopay: function (e) { //去支付
    this.setData({
      formId: e.detail.formId
    });
    var val = {
      OrderNum: e.currentTarget.dataset.on,
      OpendId: app.globalData.UserInfo.WeiXinOpenId,
      VendorId: app.globalData.VendorInfo.Id
    }
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetWeiXinPrePayNum, val), function (data) {
      wx.requestPayment({
        'timeStamp': data.Info.timeStamp,
        'nonceStr': data.Info.nonceStr,
        'package': data.Info.package,
        'signType': data.Info.signType,
        'paySign': data.Info.paySign,
        'success': function (res) {
          thisobj.sendMessage(e.currentTarget.dataset.on, data.Info.PayTime);
          $.alert("支付成功！", function () {
            thisobj.setData({
              orderlist: [],
              currentPage: 1
            });
            thisobj.getOrderlist();
          });
        },
        'fail': function (res) {
          console.log("支付失败：", res);
        }
      })
    });
  },
  sendMessage: function (OrderNum, PayTime) { //发送模版消息
    var that = this;
    var OrderInfo = this.data.orderlist;

    for (var i = 0; i < OrderInfo.length; i++) {
      if (OrderInfo[i].OrderNum == OrderNum) {
        var plist = "";
        if (OrderInfo[i].OrderdetailList.length > 0) {
          for (var j = 0; j < OrderInfo[i].OrderdetailList.length; j++) {
            plist += OrderInfo[i].OrderdetailList[j].ProductName + "\\r\\n"
          }
        } else {
          plist = OrderInfo[i].OrderdetailList[0].ProductName
        }

        var val = {
          FormId: that.data.formId,
          MessageType: 2,
          TplKey: "AT0009",
          PageUrl: 'pages/orderdetail/orderdetail?on=' + OrderNum,
          TplData: [app.globalData.VendorInfo.Currency + OrderInfo[i].RealTotal, OrderInfo[i].StrCreateTime, PayTime, OrderInfo[i].OrderNum, plist, "您的订单已支付成功，感谢您的支持"]
        }
        app.SendMessage(val);
      }
    }

  }
})