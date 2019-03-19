var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
Page({
  data: {
    tapindex: 1, //当前项
    pageNumber: 1,
    pageSize: 10,
    flag: true,
    ispage: false,
    userType: 1,
    orderlist: [],
    width:100,
    sponsorId: 0,
    participantId: 0,
    isData: true
  },
  onLoad: function (options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          sponsorId: app.globalData.UserInfo.Id,
          participantId: 0,
          Currency: app.globalData.VendorInfo.Currency
        })
        that.GetUserCutPriceActivityList();
      }, options.uid);
    } else {
      that.setData({
        sponsorId: app.globalData.UserInfo.Id,
        participantId: 0,
        Currency: app.globalData.VendorInfo.Currency
      })
      that.GetUserCutPriceActivityList();
    }
  },
  allOrders: function () { //我发起的
    this.setData({
      tapindex: 1,
      pageNumber: 1,
      pageSize: 10,
      orderlist: [],
      sponsorId: app.globalData.UserInfo.Id,
      participantId:0
    });
    this.GetUserCutPriceActivityList();
  },
  toBePaid: function () { //我参与的
  
    this.setData({
      tapindex: 2,
      pageNumber: 1,
      pageSize: 10,
      orderlist: [],
      sponsorId: 0,
      participantId: app.globalData.UserInfo.Id
    });
    this.GetUserCutPriceActivityList();
  },
  GetUserCutPriceActivityList: function () { //统一获取订单列表
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      sponsorId: this.data.sponsorId,
      participantId: this.data.participantId,
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
    }
    var thisobj = this;
    $.xsr($.makeUrl(api.GetUserCutPriceActivityList, val), function (res) {
      console.log("砍价列表",res)
      if (!$.isNull(res.Info) && 　res.Code == 0) { 
        thisobj.setData({
          isData: true
        });
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
            ispage:false,
            orderlist: thisobj.data.orderlist.concat(res.Info)
          });
        }else{
          thisobj.setData({
            ispage: true,
            flag: true,
            orderlist: thisobj.data.orderlist.concat(res.Info)
          });
        }
      } else {
        thisobj.setData({
          flag: false,
          ispage: false,
        });
      }
      if ($.isNull(res.Info) && res.Code == 0 && thisobj.data.pageNumber == 1) {
        thisobj.setData({
          isData: false
        })
      }
    });
  },
  scrollbottom: function () {//滑动的底部加载下一页
    if (this.data.flag) {
      var thisobj = this;
      thisobj.setData({
        flag: false,
        ispage: true
      });
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          pageNumber: thisobj.data.pageNumber + 1
        })
        thisobj.GetUserCutPriceActivityList();
      }, 500);
    }
  }

})