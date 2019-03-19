var app = getApp()
var $ = require('../../utils/util.js');
var fgapi = require('../../api/fightGroups.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data: {
    tapindex: 1, //当前项
    pageindex: 1,
    pagesize: 10,
    ispage: true,
    flag: true, //是否可以进行下次分页
    Status: 0,
    orderlist: [],
    isData:true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      Currency: app.globalData.VendorInfo.Currency,
    })
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          pageindex: 1,
          pagesize: 10,
          orderlist: [],
          isData: true
        });
        that.getOrderlist();
      }, options.uid);
    } else {
      that.setData({
        pageindex: 1,
        pagesize: 10,
        orderlist: [],
        isData: true
      });
      that.getOrderlist();
    }
    
  },
  allOrders: function () { //全部订单
    this.setData({
      tapindex: 1,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      Status: 0,
      isData: true
    });
    this.getOrderlist();
  },
  toBePaid: function () { //待支付
    this.setData({
      tapindex: 2,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      Status: 1,
      isData: true
    });
    this.getOrderlist();
  },
  receiptOfGoods: function () { //待收货
    this.setData({
      tapindex: 3,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      Status: 2,
      isData: true
    });
    this.getOrderlist();
  },
  toBeEvaluated: function () { //待评价
    this.setData({
      tapindex: 4,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      Status: 3,
      isData: true
    });
    this.getOrderlist();
  },
  scrollbottom: function () { //进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          type: thisobj.data.type,
          pageindex: parseInt(thisobj.data.pageindex) + 1,
          pagesize: 10
        });
        thisobj.getOrderlist(); //根据价格排序
      }, 500);
    }
  },
  getOrderlist: function () { //统一获取订单列表
    var val = {
      UserInfoId: app.globalData.UserInfo.Id,
      pageSize: this.data.pagesize,
      PageIndex: this.data.pageindex,
      Status: this.data.Status
    }
    var thisobj = this;
    $.xsr($.makeUrl(fgapi.GetMyGroupEvents, val), function (res) {
      console.log("统一获取订单列表",res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        thisobj.setData({
          isData: true
        });
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
            ispage: false
          });
          thisobj.setData({
            orderlist: thisobj.data.orderlist.concat(res.Info)
          });
        } else {
          thisobj.setData({
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
  gotopay: function (e) { //去支付
    var val = {
      OrderNum: e.currentTarget.dataset.on,
      OpendId: app.globalData.UserInfo.WeiXinOpenId,
      VendorId: app.globalData.VendorInfo.Id
    }
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetWeiXinPrePayNum, val), function (data) {
      if (data.Code == 0) {
        wx.requestPayment({
          'timeStamp': data.Info.timeStamp,
          'nonceStr': data.Info.nonceStr,
          'package': data.Info.package,
          'signType': data.Info.signType,
          'paySign': data.Info.paySign,
          'success': function (res) {
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
      } else {
        $.alert(data.Msg)
      }

    });
  }
})