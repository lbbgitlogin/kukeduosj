var app = getApp()
var $ = require('../../utils/util.js');
var pdapi = require('../../api/productAPI.js');
var fgapi = require('../../api/fightGroups.js');
Page({
  data: {
    viewtype: 0,
    tapindex: 1,
    pdlist: [], //商品列表
    fglist: [],//已拼团商品列表
    flag: false, //是否可以进行下次分页
    ispage: false, //是否还有数据
    scposition: "", //滚动条位置
    PageIndex: 1,
    PageSize: 10,
    PageIndex1: 1,
    PageSize1: 10,
    istop: false,
    isdata: false, //是否存在数据
    day: "",
    hours: "",
    minutes: "",
    seconds: "",
    flag1: false,
    ispage1: false,
    windowHeight: "",
    isData: true,
    isData1: true
  },
  onLoad: function (options) {

    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.setData({
          tapindex: 1,
        })
        that.InitData();
        //that.initialData()
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.setData({
        tapindex: 1,
      })
      that.InitData();
      //that.initialData()
    }
  },
  allOrders: function () {
    this.setData({
      tapindex: 1,
      pdlist:[],
      pageSize: 10,
      pageIndex: 1,
    });
    this.InitData()
  },
  toBePaid: function () {
    this.setData({
      tapindex: 2,
      fglist:[],
      PageSize1: 10,
      PageIndex1: 1,
    });
    this.initialData()
  },
  InitData: function () {
    var that = this;
    //表示展示的为拼团商品
    var obj = {
      vendorId : app.globalData.VendorInfo.Id,
      pageSize  : this.data.PageSize,
      pageIndex: this.data.PageIndex,
      type: 0,
    }
    $.xsr($.makeUrl(fgapi.GetCountdownPromotionList, obj), function (res) {//未拼团
      if (!$.isNull(res.Info) && res.Code == 0) {
        that.setData({
          isData: true
        })
        if (res.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            pdlist: that.data.pdlist.concat(res.Info)
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            pdlist: that.data.pdlist.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag: false,
          ispage: false,
        });
      }
      if ($.isNull(res.Info) && res.Code == 1 && that.data.PageIndex == 1) {
        that.setData({
          isData: false
        })
      }
    });
  },
  initialData: function () {
    var that = this;
    //表示展示的为拼团商品
    var obj = {
      vendorId : app.globalData.VendorInfo.Id,
      pageSize   : this.data.PageSize1,
      pageIndex: this.data.PageIndex1,
      type: 1,
    }
    console.log("传入数据：", obj)
    $.xsr($.makeUrl(fgapi.GetCountdownPromotionList, obj), function (res) {//未拼团
      console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        that.setData({
          isData1: true
        })
        if (res.Info.length < 10) {
          that.setData({
            flag1: false,
            ispage1: false,
            fglist: that.data.fglist.concat(res.Info)
          });
        } else {
          that.setData({
            flag1: true,
            ispage1: true,
            fglist: that.data.fglist.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag1: false,
          ispage1: false,
        });
      }
      if ($.isNull(res.Info) && res.Code == 1 && that.data.PageIndex1 == 1) {
        that.setData({
          isData1: false
        })
      }
    });
  },
  scrollbottom: function (even) { //滚动到底部进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          PageIndex: parseInt(that.data.PageIndex) + 1
        });
        that.InitData();
        that.setData({
          flag: false
        })
      }, 500)
    }
  },
  scrollbottomtwo: function (even) { //滚动到底部进行分页
    if (this.data.flag1) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          PageIndex1: parseInt(that.data.PageIndex1) + 1
        });
        that.initialData();
        that.setData({
          flag1: false
        })
      }, 500)
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '限时秒杀，优惠不等人，此时不买更待何时！',
      path: 'pages/Seconds/Seconds?uid=' + app.globalData.UserInfo.Id
    }
  }
})