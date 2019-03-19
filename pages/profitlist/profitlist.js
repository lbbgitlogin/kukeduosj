var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    tapindex: 1,
    pageindex: 1,
    TimeSpan: 1,
    ispage: true,
    flag: true, //是否可以进行下次分页
    UserFans: []
  },
  onLoad: function (options) {
    if (!$.isNull(options.tp)) {
      this.setData({
        tapindex: 2,
        pageindex: 1,
        TimeSpan: 2,
        ispage: true,
        flag: true, //是否可以进行下次分页
      });
    }
  },
  onShow: function () {
    this.setData({
      UserFans: [],
      Currency: app.globalData.VendorInfo.Currency
    });
    // 生命周期函数--监听页面显示
    this.InitData();
  },
  InitData: function () {//初始化数据
    var val = {
      UserId: app.globalData.UserInfo.Id,
      TimeSpan: this.data.TimeSpan,
      PageIndex: this.data.pageindex
    }
    var that = this;
    $.xsr($.makeUrl(userapi.GetUserCashBonusesDetail, val), function (data) {
      if (data.Info != null && data.Code != 1) {
        if (data.Info.length < 10) {
          that.setData({
            UserFans: that.data.UserFans.concat(data.Info),
            flag: false,
            ispage: false
          });
        } else {
          that.setData({
            UserFans: that.data.UserFans.concat(data.Info)
          });
        }
      } else {
        that.setData({
          flag: false,
          ispage: false
        });
      }
    });
  },
  scrollbottom: function () { //进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageindex: parseInt(that.data.pageindex) + 1
        });
        that.InitData(); //根据价格排序
      }, 500);
    }
  },
  earningsToday: function () {//今日收益
    this.setData({
      tapindex: 1,
      pageindex: 1,
      TimeSpan: 1,
      ispage: true,
      flag: true, //是否可以进行下次分页
      UserFans: []
    });
    this.InitData();
  },
  nearlyAMonth: function () {//近一个月
    this.setData({
      tapindex: 2,
      pageindex: 1,
      TimeSpan: 2,
      ispage: true,
      flag: true, //是否可以进行下次分页
      UserFans: []
    });
    this.InitData();
  },
  nearlyThreeMonths: function () {//近三个月
    this.setData({
      tapindex: 3,
      pageindex: 1,
      TimeSpan: 3,
      ispage: true,
      flag: true, //是否可以进行下次分页
      UserFans: []
    });
    this.InitData();
  },
  allDay: function () {//全部
    this.setData({
      tapindex: 4,
      pageindex: 1,
      TimeSpan: 0,
      ispage: true,
      flag: true, //是否可以进行下次分页
      UserFans: []
    });
    this.InitData();
  }
})