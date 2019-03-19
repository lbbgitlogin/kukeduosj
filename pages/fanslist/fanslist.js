var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    pageindex: 1,
    tapindex: 1,
    ispage: true,
    flag: true, //是否可以进行下次分页
    UserFans: [],
    numFan1: 0,
    numFan2: 0,
    isData: true
  },
  onLoad: function (options) {
    this.setData({
      UserFans: [],
      Currency: app.globalData.VendorInfo.Currency
    });
    // 生命周期函数--监听页面加载
    this.getFunlist();
  },
  level1: function () { //一级粉丝
    this.setData({
      tapindex: 1,
      UserFans: [],
      pageindex: 1,
      isData: true
    });
    this.getFunlist();
  },
  level2: function () { //二级粉丝
    this.setData({
      tapindex: 2,
      UserFans: [],
      pageindex: 1,
      isData: true
    });
    this.getFunlist();
  },
  getFunlist: function () {
    var val = {
      UserId: app.globalData.UserInfo.Id,
      PageIndex: this.data.pageindex,
      Level: this.data.tapindex
    }
    console.log(val)
    var that = this;
    $.xsr($.makeUrl(userapi.GetUserFans, val), function (data) {
      console.log(data)
      if (!$.isNull(data.Info) && data.Code == 0) {
        if (data.Info.length < 10) {
          that.setData({
            UserFans: that.data.UserFans.concat(data.Info),
            flag: false,
            ispage: false
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            UserFans: that.data.UserFans.concat(data.Info)
          });
        }
        that.setData({
          numFan1: that.data.UserFans[0].Total,
          numFan2: that.data.UserFans[0].Total2,
          isData: true
        });

      } else {
        that.setData({
          flag: false,
          ispage: false,
        });
      }
      if (data.Code != 0 && that.data.pageindex == 1) {
        that.setData({
          isData: false
        })
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
        that.getFunlist();
      }, 500);
    }
  }
})