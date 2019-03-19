var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
Page({
  data: {
    EventMainPic: "",
    Title: "",
    EventTime: "",
    EventId: "",
    UserName: "",
    UserPhone: "",
    UserCompany: "",
    UserPosition: "",
    formId: "",
    isPhone: true,
    isName: true,
    isFirm: true,
    isJob: true,
    source: '',
    EventAddress: "",
    EventInfo: {},
    isTmplMsg: true,
    IsJoin: null,
  },
  onLoad: function(options) {
    console.log("options++++", options)
    if (options.source == 'activity') { //活动详情页进来的
      var val = $.parseJSON(options.val);
      this.setData({
        EventMainPic: val.img,
        Title: val.title,
        EventTime: val.time,
        EventId: val.id,
        source: options.source
      });
      wx.setNavigationBarTitle({
        title: val.title + '报名页'
      });
      this.initData();
    } else if (options.source == 'qrCode') { //扫二维码进来的
      var that = this;
      if ($.isNull(app.globalData.UserInfo)) {
        app.GetUserInfo(function() {
          that.setData({
            EventId: options.eventId,
            source: options.source
          });
          that.initData();
        }, options.uid);
      } else {
        that.setData({
          EventId: options.eventId,
          source: options.source
        });
        that.initData();
      }
    }
    var str = app.globalData.VendorInfo.VendorFeatureSet
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

  initData: function() {
    var valdetail = {
      Id: this.data.EventId,
      UserId: app.globalData.UserInfo.Id
    };
    var thisobj = this;
    $.xsr($.makeUrl(activityapi.GetAdvertismentEventById, valdetail), function(res) {
      console.log(res, "baoming")
      if (!$.isNull(res.Info)) {
        thisobj.setData({
          EventMainPic: res.Info.EventMainPic,
          Title: res.Info.Title,
          EventInfo: res.Info,
          EventTime: res.Info.EventTime,
          IsJoin: res.Info.IsJoin
        });


        wx.setNavigationBarTitle({
          title: thisobj.data.Title + '报名页'
        });
        if (res.Info.IsJoin == 0) { //未报名
          // 改动报名代码  
          thisobj.setData({
            source: "activity"
          })
          //停留在报名页
        } else if (res.Info.IsJoin == 1) { //已结报名--跳转到签到页面
          wx.navigateTo({
            url: "../activitycheckin/activitycheckin?eventId=" + thisobj.data.EventId
          });
        } else if (res.Info.IsJoin == 2) { //已结截止--跳转到活动详情页面	
          wx.navigateTo({
            url: "../activity/activity?id=" + thisobj.data.EventId
          });
        }
      } else {
        $.alert("出错啦");
      }
    });
  },

  inputname: function(even) { //输入姓名
    this.setData({
      UserName: even.detail.value
    });
    if ($.isNull(even.detail.value)) {
      this.setData({
        isName: false
      });
    } else {
      this.setData({
        isName: true
      });
    }
  },
  inputphone: function(e) { //输入电话号码
    this.setData({
      UserPhone: e.detail.value
    });
    if ($.isNull(e.detail.value)) {
      this.setData({
        isPhone: false
      });
    } else if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
      this.setData({
        isPhone: false
      });
    } else {
      this.setData({
        isPhone: true
      });
    }
  },
  inputfirm: function(even) { //输入公司名称
    this.setData({
      UserCompany: even.detail.value
    });
    if ($.isNull(even.detail.value)) {
      this.setData({
        isFirm: false
      });
    } else {
      this.setData({
        isFirm: true
      });
    }
  },
  inputjob: function(even) { //输入职位
    this.setData({
      UserPosition: even.detail.value
    });
    if ($.isNull(even.detail.value)) {
      this.setData({
        isJob: false
      });
    } else {
      this.setData({
        isJob: true
      });
    }
  },

  signinnow: function(e) { //立刻报名
    console.log(e)
    if ($.isNull(this.data.UserName)) {
      this.setData({
        isName: false
      });
    }
    if ($.isNull(this.data.UserPhone)) {
      this.setData({
        isPhone: false
      });
    }

    if ($.isNull(this.data.UserCompany)) {
      this.setData({
        isFirm: false
      });
    }
    if ($.isNull(this.data.UserPosition)) {
      this.setData({
        isJob: false
      });
    }
    this.setData({
      formId: e.detail.formId
    });

    if (this.data.isName && this.data.isPhone && this.data.isJob && this.data.isFirm) {
      var val = {
        UserId: app.globalData.UserInfo.Id,
        EventId: this.data.EventId,
        UserName: this.data.UserName,
        UserPhone: this.data.UserPhone,
        UserCompany: this.data.UserCompany,
        UserPosition: this.data.UserPosition,
      }
      var that = this;

      $.xsr($.makeUrl(activityapi.JoinAdvertismentEvent, val), function(data) {
        console.log("报名：", data);
        if (data.Code == 0) {
          if (that.data.source == 'activity') {
            if (that.data.isTmplMsg) {
              that.sendMessage(data.Info);
            }
            $.alert("报名成功！");
            setTimeout(function() {
              // $.backpage(1, function() {});
              wx.redirectTo({
                url: '/news/activity/activity?id=' + that.data.EventId,
              })
            }, 1000);
          } else if (that.data.source == 'qrCode') {
            $.alert("签到成功");
            setTimeout(function() {
              wx.navigateTo({
                url: "../activitycheckin/activitycheckin?eventId=" + that.data.EventId
              });
            }, 1000);
          }
        } else {
          $.alert(data.Msg);
        }
      });
    }
  },
  sendMessage: function(time) { //发送模版消息
    var val = {
      FormId: this.data.formId,
      MessageType: 1,
      TplKey: "AT0027",
      PageUrl: 'pages/activity/activity?id=' + this.data.EventId,
      TplData: [this.data.EventInfo.Title, this.data.EventInfo.EventAddress, this.data.EventInfo.EventTime, this.data.UserPhone, this.data.UserName, time]
    }
    app.SendMessage(val)
  }
})