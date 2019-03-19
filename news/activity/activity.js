var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
Page({
  data: {
    Info: [],
    Id: 0,
    isVip1: true, //是否有嘉宾
    isVip2: true,
    isVip3: true,
    isVip4: true,
    isVip5: true,
    isEventDetail: true, //是否有会议详情
    isEventMainPic: true,
    isAgendaPlan: true,
    isPage: false,
    isGray: true, //报名按钮是否可用 控制样式
    content: "", //报名内容
    activitydetail: '', //解析过后的
    activityagenda: '' //解析过后的
  },
  onLoad: function(options) {
    this.setData({
      Id: options.id
    });

    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {

      }, options.uid);
    }
  },

  onShareAppMessage: function() {
    return {
      title: this.data.Info.Title,
      desc: this.data.Info.EventDesc,
      path: '/news/activity/activity?id=' + this.data.Id + "&uid=" + app.globalData.UserInfo.Id
    }
  },

  onShow: function() {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.initData();
      });
    } else {
      that.initData();
    }
  },
  initData: function() {
    var valdetail = {
      Id: this.data.Id,
      UserId: app.globalData.UserInfo.Id
    };
    var thisobj = this;
    $.xsr($.makeUrl(activityapi.GetAdvertismentEventById, valdetail), function(res) {
      if (!$.isNull(res.Info)) {
        thisobj.setData({
          Info: res.Info,
          isVip1: $.isNull(res.Info.VipGuestPic1),
          isVip2: $.isNull(res.Info.VipGuestPic2),
          isVip3: $.isNull(res.Info.VipGuestPic3),
          isVip4: $.isNull(res.Info.VipGuestPic4),
          isVip5: $.isNull(res.Info.VipGuestPic5),
          isEventDetail: $.isNull(res.Info.EventDetail),
          isEventMainPic: $.isNull(res.Info.EventMainPic),
          isAgendaPlan: $.isNull(res.Info.AgendaPlan),
          activityagenda: res.Info.AgendaPlan,
          activitydetail: res.Info.EventDetail,
          isPage: true,
          isSignIn: res.Info.IsJoin
        });
        if (res.Info.IsJoin == 0) { //未报名
          thisobj.setData({
            isGray: false,
            content: "立即报名"
          });
        } else if (res.Info.IsJoin == 1) { //已结报名
          thisobj.setData({
            isGray: true,
            content: "已报名"
          });
        } else if (res.Info.IsJoin == 2) { //已结截止
          thisobj.setData({
            isGray: true,
            content: "报名已截止"
          });
        }
      } else {
        thisobj.setData({
          isPage: false
        })
      }
    });
  },
  signinnow: function() { //立即报名
    var that = this;
    var date = new Date(that.data.Info.EndJoinTime.replace(/-/g, '/'));
    var EndJoinTime = date.getTime();
    console.log("date+++++++++++++++", EndJoinTime);
    var presentTime = Date.parse(new Date());
    console.log(presentTime)
    console.log(presentTime < EndJoinTime)
    if (presentTime > EndJoinTime) {
      $.alert("报名时间已结束");
      return;
    }


    if (this.data.isGray) {
      return;
    }
    var val = {
      img: this.data.Info.EventMainPic,
      title: this.data.Info.Title,
      time: this.data.Info.EventTime,
      id: this.data.Info.Id
    }
    console.log("val.id")
    wx.navigateTo({
      url: "../activitysignin/activitysignin?val=" + JSON.stringify(val) + '&source=activity'
    });
  }
})