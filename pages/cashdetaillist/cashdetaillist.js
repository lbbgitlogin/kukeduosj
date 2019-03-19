var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    tapindex: 1,
    pageindex: 1,
    ChangeType: 0,
    ispage: true,
    flag: true, //是否可以进行下次分页
    CaseDetailList: []
  },
  onShow: function () {
    this.setData({
      CaseDetailList: []
    });
    // 生命周期函数--监听页面显示
    this.InitData();
  },
  InitData: function () {//初始化数据
    var val = {
      ChangeType: this.data.ChangeType,
      userName: app.globalData.UserInfo.UserName,
      PageIndex: this.data.pageindex
    }
    var that = this;
    $.xsr($.makeUrl(userapi.SelectUserCashAccount, val), function (data) {
      if (data.Info != null && data.Code != 1) {
        if (data.Info.length < 10) {
          that.setData({
            CaseDetailList: that.data.CaseDetailList.concat(data.Info),
            flag: false,
            ispage: false
          });
        } else {
          that.setData({
            CaseDetailList: that.data.CaseDetailList.concat(data.Info)
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
  allTypes: function () {
    this.setData({
      tapindex: 1,
      pageindex: 1,
      ispage: true,
      flag: true, //是否可以进行下次分页
      ChangeType: 0,
      CaseDetailList: []
    });
    this.InitData();
  },
  expenditure: function () {
    this.setData({
      tapindex: 2,
      pageindex: 1,
      ispage: true,
      flag: true, //是否可以进行下次分页
      ChangeType: 1,
      CaseDetailList: []
    });
    this.InitData();
  },
  income: function () {
    this.setData({
      tapindex: 3,
      pageindex: 1,
      ispage: true,
      ChangeType: 2,
      flag: true, //是否可以进行下次分页
      CaseDetailList: []
    });
    this.InitData();
  }
})