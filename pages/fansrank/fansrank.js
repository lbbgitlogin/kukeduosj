var app = getApp()
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    pageindex: 3,
    tapindex: 1,
    ispage: false,
    isShowMsk: false,
    RankList: [],
    timeType: 2,
    VendorDistributionDesc: '',
    uid: 0
  },
  onLoad: function(options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          uid: app.globalData.UserInfo.Id
        });
        that.getRanklist();
      }, options.uid);
    } else {
      that.setData({
        uid: app.globalData.UserInfo.Id
      });
      that.getRanklist();
    }

  },

  weekrank: function() { //周排行
    this.setData({
      tapindex: 1,
      RankList: [],
      timeType: 2,
      ispage: false
    });
    this.getRanklist();
  },
  monthrank: function() { //月排行
    this.setData({
      tapindex: 2,
      RankList: [],
      timeType: 3,
      ispage: false
    });
    this.getRanklist();
  },
  totalrank: function() { //总排行
    this.setData({
      tapindex: 3,
      RankList: [],
      timeType: 1,
      ispage: false
    });
    this.getRanklist();
  },
  getRanklist: function() {
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      timeType: this.data.timeType //1.总 2.周 3.月
    }
    var that = this;
    $.xsr($.makeUrl(userapi.getDistributionRankingList, val), function(data) {
      console.log(data)
      if (data.Code == 0) {
        that.setData({
          RankList: data.Info.DistributionRankingList,
          VendorDistributionDesc: data.Info.VendorDistributionDesc,
          ispage: true
        });
      } else {
        that.setData({
          ispage: true
        });
      }
    });
  },
  clickrule: function() {
    this.setData({
      isShowMsk: true
    });
  },
  closemsk: function() {
    this.setData({
      isShowMsk: false
    });
  }
})