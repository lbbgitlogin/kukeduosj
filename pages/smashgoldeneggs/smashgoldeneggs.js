var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
var userapi = require('../../api/userAPI.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        click: false,
        clickmsk: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        clickshare: false,
        drawdesc: [],//解析过后的
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
        outdated: false,
        ImgPath:"",
        animationData: {},
        selectImg: 0,
        move: false
    },
    onLoad: function (options) {
      var that = this;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                ifsho: false
                console.log("授权：",res.userInfo)
                //用户已经授权过
              }
            })
          }else{
            that.setData({
            ifsho:true
                                   
            })
          }
        }
      })
   
      
      console.log("砸金蛋options", options)
       

        if ($.isNull(app.globalData.UserInfo)) {
            app.GetUserInfo(function () {
                that.setData({
                    IsNewUser: app.globalData.UserInfo.IsNewUser,
                    CouponAmount: app.globalData.UserInfo.CouponAmount
                });
                that.initData();
            }, options.uid);
        } else {
            that.initData();
        }
    },


    onShow: function () {
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        });
        this.animation = animation;
        this.animation.top(0).left(0).step()
        this.setData({
            animationData: this.animation.export()
        })
    },

  onGotUserInfo: function (e) {
    console.log("weizhi")
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
      that.knock(e)
    } else {

    }
  },
   onGotUserInfo13: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });
      that.setData({
        ifsho: false
      })
      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
       that.onLoad()
    } else {

    }
  },

    knock: function (e) {
        if (!this.data.click) {
            this.setData({
                click: true
            });
            if (this.data.RemainingCount > 0) {
                this.getPosition();
            } else if (this.data.RemainingCount == 0) {
                this.setData({
                    clickshare: true
                });
                return;
            }
            this.animation.top(e.changedTouches[0].pageY - 375).left(e.changedTouches[0].pageX - 75).step()
            this.setData({
                animationData: this.animation.export()
            })
            setTimeout(function () {

                this.animation.translateX(-25).rotate(-120).step()
                this.setData({
                    animationData: this.animation.export()
                })
            }.bind(this), 500);
            setTimeout(function () {
                this.animation.translateX(25).rotate(60).step()
                this.setData({
                    animationData: this.animation.export()
                })
            }.bind(this), 1000);
            setTimeout(function () {
                this.setData({
                    selectImg: e.target.dataset.num
                })
            }.bind(this), 1200);
        }

    },

    onShareAppMessage: function () {//分享
        var that=this
        this.setData({
            clickshare: false,
            click: false
        });
      that.sharefriend();
        return {
            title: '我已经中奖啦，你也赶紧来砸金蛋吧~',
            desc: '幸运砸金蛋，快来参与吧~',
            path: '/pages/smashgoldeneggs/smashgoldeneggs?uid=' + app.globalData.UserInfo.Id
        }
    },

    sharefriend: function () {//分享额外得一次机会
        var val = {
            VendorId: app.globalData.VendorInfo.Id,
            UserId: app.globalData.UserInfo.Id,
            Category: 2
        };
        var thisobj = this;
        $.xsr1($.makeUrl(activityapi.ShareLuckyDraw, val), function (res) {
          console.log("//分享额外得一次机会",res)
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
            Category: 2
        };
      console.log("GetLuckyDrawVO", val)
        var thisobj = this;
        $.xsr1($.makeUrl(activityapi.GetLuckyDrawVO, val), function (res) {
          console.log("GetLuckyDrawVO",res)
            thisobj.setData({
                isPage: true,
                ImgPath: app.globalData.ImgPath
            });
            if (res.Code == 0 && !$.isNull(res.Info)) {
                thisobj.setData({
                    DrawInfo: res.Info[0],
                    RemainingCount: res.Info[0].RemainingCount,
                    outdated: res.Info[0].Status
                });
                if (thisobj.data.DrawInfo.Winners.length > 0) {//如果中奖人数大于零
                    var thispageindex = thisobj.data.DrawInfo.Winners.length % 5 > 0 ? parseInt(thisobj.data.DrawInfo.Winners.length / 5 + 1) : thisobj.data.DrawInfo.Winners.length / 5;
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

    getPosition: function () {//获取中奖位置
        var val = {
            VendorId: app.globalData.VendorInfo.Id,
            UserId: app.globalData.UserInfo.Id,
            Category: 2
        };
        var thisobj = this;
        $.xsr1($.makeUrl(activityapi.JoinLuckyDraw, val), function (res) {
          console.log("获取中奖位置",res)
            if (res.Code == 0 && res.Info.length > 0) {
                thisobj.setData({
                    PrizeResult: res.Info[0]
                });
                setTimeout(function () {
                    thisobj.setData({
                        clickmsk: true
                    });
                }, 2000);
            } else {
                $.alert("抽奖失败");
                thisobj.setData({
                    click: false
                });
            }

        });
    },


    cancelprize: function () {//取消抽奖弹窗
        this.animation.top(0).left(0).translateX(0).rotate(0).step();

        this.setData({
            clickmsk: false,
            selectImg: 0,
            animationData: this.animation.export(),
            move: true
        });
        var thisobj = this;
        setTimeout(function () {
            thisobj.setData({
                move: false
            });
        }, 1000);
        setTimeout(function () {
            thisobj.setData({
                click: false
            });
        }, 1200);
        this.initData();//刷新页面
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
          console.log("用户领取优惠券",data)
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

