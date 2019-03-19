var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
var userapi = require('../../api/userAPI.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    index: -1,	//当前转动到哪个位置，起点位置
    count: 13,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 20,	//初始转动速度
    times: 0,	//转动次数
    cycle: 50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置
    click: false,
    clickmsk: false,
    clickshare: false,
    drawdesc: [],//解析过后的
    PrizeList: [],
    DrawInfo: {},
    RemainingCount: 0,
    PrizeResult: {},
    pageSize: [],
    Coupons: [],
    isCancelSuccess: true,//新手礼包领取成功取消
    isCancel: true,//新手礼包取消
    CouponAmount: 0,
    IsNewUser: 0,
    isPage: false,
    outdated: false
  },
  onLoad: function (options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          IsNewUser: app.globalData.UserInfo.IsNewUser,
          CouponAmount: app.globalData.UserInfo.CouponAmount
        });
        that.initData();
        that.initList();
      }, options.uid);
    } else {
      that.initData();
      that.initList();
    }
  },
  onShareAppMessage: function (res) {//分享
    var that = this
    that.sharefriend();
    this.setData({
      clickshare: false,
      click: false
    });
    return {
      title: '我已经中奖啦，你也赶紧来抽奖吧~',
      desc: '幸运大抽奖，快来参与吧~',
      path: '/pages/luckydraw/luckydraw?uid=' + app.globalData.UserInfo.Id,
    }
  },
  sharefriend: function () {//分享额外得一次机会
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      UserId: app.globalData.UserInfo.Id,
      Category: 1
    };
    var thisobj = this;
    $.xsr1($.makeUrl(activityapi.ShareLuckyDraw, val), function (res) {
      console.log("jihui:",res)
      if (res.Code == 0 && res.Info != null) {
        thisobj.setData({
          RemainingCount: thisobj.data.RemainingCount
        });
        thisobj.initData();//刷新页面
      }
    });
  },
  initData: function () {
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      UserId: app.globalData.UserInfo.Id,
      Category: 1
    };
    var thisobj = this;
    $.xsr1($.makeUrl(activityapi.GetLuckyDrawVO, val), function (res) {
      thisobj.setData({
        isPage: true
      });
      if (res.Code == 0 && !$.isNull(res.Info)) {
        thisobj.setData({
          DrawInfo: res.Info[0],
          RemainingCount: res.Info[0].RemainingCount,
          outdated: res.Info[0].Status
        });
        if (thisobj.data.DrawInfo.Winners.length > 0) {//如果中奖人数大于零
          var thispageindex = thisobj.data.DrawInfo.Winners.length % 3 > 0 ? parseInt(thisobj.data.DrawInfo.Winners.length / 3 + 1) : thisobj.data.DrawInfo.Winners.length / 3;
          var newthisobj = [];
          for (var i = 0; i < thispageindex; i++) {
            newthisobj.push(i);
          }
          thisobj.setData({
            pageSize: newthisobj
          });
        }
      } else {
        thisobj.setData({
          outdated: false
        });
      }
    });
  },
  initList: function () {
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      Category: 1
    };
    var thisobj = this;
    $.xsr($.makeUrl(activityapi.GetLuckyDrawPrizeVOList, val), function (res) {
      if (res.Info != null) {
        thisobj.setData({
          PrizeList: res.Info
        });
      } else {
        $.alert("奖品加载失败");
      }
    });
  },

  getPosition: function () {//获取中奖位置
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      UserId: app.globalData.UserInfo.Id,
      Category: 1
    };
    var thisobj = this;
    $.xsr1($.makeUrl(activityapi.JoinLuckyDraw, val), function (res) {
      if (res.Code == 0 && res.Info.length > 0) {
        thisobj.setData({
          prize: res.Info[0].WinningPrizeIndex,
          PrizeResult: res.Info[0]
        });
        thisobj.roll();
      } else {
        thisobj.setData({
          prize: -1,
          times: 0,
          click: false
        });
      }
    });
  },
  onGotUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.LuckDraw()
    } else {

    }
  },
  LuckDraw: function () {//点击抽奖
    if (!this.data.click) {
      this.setData({
        speed: 100,
        click: true
      });
      if (this.data.RemainingCount > 0) {
        this.getPosition();
      } else if (this.data.RemainingCount == 0) {
        this.setData({
          clickshare: true
        });
      }
    }

  },
  luckRoll: function () {
    var index = this.data.index;
    var count = this.data.count;
    index += 1;
    if (index > count - 1) {
      index = 0;
    };
    this.setData({
      index: index
    });
  },
  roll: function () {
    this.setData({
      times: this.data.times + 1
    });
    this.luckRoll();
    if (this.data.times > this.data.cycle + 10 && this.data.prize == this.data.index) {
      clearTimeout(this.data.timer);
      this.setData({
        prize: -1,
        times: 0,
        click: false
      });
      this.initData();//刷新页面
      var that = this;
      setTimeout(function () {
        that.setData({
          clickmsk: true
        });
      }, 800);
    } else {
      if (this.data.times < this.data.cycle) {
        this.setData({
          speed: this.data.speed - 10
        });
      } else if (this.data.times == this.data.cycle) {
        var index =this.data.prize + 1; //Math.random() * (this.data.count) | 0;
        this.setData({
          prize: index
        });
      } else {
        if (this.data.times > this.data.cycle + 10 && ((this.data.prize == 0 && this.data.index == 7) || this.data.prize == this.data.index + 1)) {
          this.setData({
            speed: this.data.speed + 110
          });
        } else {
          this.setData({
            speed: this.data.speed + 20
          });
        }
      }
      if (this.data.speed < 40) {
        this.setData({
          speed: this.data.speed + 40
        });
      };
      var that = this;
      this.data.timer = setTimeout(function () {
        that.roll();
      }, that.data.speed);
    }
    return false;
  },
  cancelprize: function () {//取消抽奖弹窗
    this.setData({
      clickmsk: false
    });
  },
  cancelshare: function () {//取消分享弹窗
    this.setData({
      clickshare: false
    });
    this.setData({
      prize: -1,
      times: 0,
      click: false
    });
  },
  nothing: function () { },//事件拦截
  receivenow: function () {//领取新手大礼包
    this.cancel();
    this.userReceiveCoupon();
  },
  cancel: function () {//新手礼包取消
    this.setData({
      isCancel: false,
    });
  },
  cancelsuccess: function () {//领券成功取消
    this.setData({
      isCancelSuccess: true,
    });
  },
  innertouch: function () { },//事件拦截
  userReceiveCoupon: function () {//用户领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: '',
      UserId: app.globalData.UserInfo.Id,
      IsNewUser: this.data.IsNewUser	//新用户为1 老用户为0 
    }
    var that = this;
    $.xsr($.makeUrl(userapi.UserReceiveCoupon, val), function (data) {
      if (data.Code == 0) {
        that.setData({
          isCancelSuccess: false,
          Coupons: data.Info
        });
      } else {
        $.alert(data.Msg);
      }
    })
  }
})

