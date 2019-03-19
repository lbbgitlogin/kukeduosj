var app = getApp();
var userapi = require('../../api/userAPI.js');
var $ = require('../../utils/util.js');
var actapi = require('../../api/activityAPI.js');
var venapi = require('../../api/vendorAPI.js');
var Interval;
Page({
  data: {
    ishidden: false, //显示隐藏
    isbaoxiang: false, //宝箱开启或关闭
    animation: false, //动画效果
    islijijika: 0, //集卡的弹窗  1.点击宝箱  2.点击立即集卡  3.获取到的奖品
    gameList: [], //活动信息
    Time: {
      day: '00',
      hour: '00',
      min: '00',
      sec: '00'
    },
    carsdList: [], //抽中的卡片信息
    usercardList: [], //用户已获得的卡片信息
    percent: 0, //进度条
    cardsfalse: true, //本次没有抽中卡片
    gid: 0, //分享进来的页面携带游戏id
    uid: 0, //分享进来的页面携带用户id
    isdata: true,
    isanimation: true, //开礼包防止多次点击
    isusercard: false, //用户集卡信息为空
    IsBegin: false, //游戏是否已经开始
    active: false,
    IsBegin2: false,
    isshare: false,
    PageQRCodeInfo: { //二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false,
    },
    fglist: [], //商品数据
    flag: true, //是否可以进行下次分页
    ispage: true, //是否还有数据
    pageSize: 6,
    pageIndex: 1,
    Status: 0,
    ProductList: [],
    luckyName: [],
    pageIndex1: 1,
    pageSize1: 8,
    pageIndex2: 1,
    pageSize2: 10,
    sponsorName: [],
    isShow: false,
    flag1: false,
    ispage1: false,
  },

  onLoad: function(options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.InitData(options);
        that.GetRecommendedProductList();
      }, options.id);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.GetRecommendedProductList();
      that.InitData(options);
    }
    this.setData({
      userImg: app.globalData.UserInfo.Photo,
      userName: app.globalData.UserInfo.NickName
    })
  },
  onShow: function() {
    var that = this;
    that.setData({
      ishidden: false, //显示隐藏
      isbaoxiang: false, //宝箱开启或关闭
      animation: false, //动画效果
      islijijika: 0, //集卡的弹窗  1.点击宝箱  2.点击立即集卡  3.获取到的奖品
      // carsdList: [],  //抽中的卡片信息
      usercardList: [], //用户已获得的卡片信息
      isanimation: true, //开礼包防止多次点击
      isusercard: false, //用户集卡信息为空
      fglist: [],
      Status: 0
    })
    if (!$.isNull(that.data.gameList)) {
      that.setInterval()
    }
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        if (that.data.gameList.Id != undefined) {
          that.GetUserGameCardInfo();
        }
      });
    } else {
      if (that.data.gameList.Id != undefined) {
        that.GetUserGameCardInfo();
      }
    }
  },
  close: function() { //遮罩层点击
    var that = this;
    if (that.data.ishidden == true) {
      that.setData({
        ishidden: false,
        isbaoxiang: false,
        animation: false,
        isanimation: true,
      })
    } else {
      that.setData({
        ishidden: true,
        isbaoxiang: false,
        animation: false,
        isanimation: true,
      })
    }
  },
  close2: function() { //遮罩层点击
    var that = this;
    if (that.data.isshare == true) {
      that.setData({
        isshare: false,
      })
    } else {
      that.setData({
        isshare: true,
      })
    }
  },
  animation: function() { //宝箱开启效果
    var that = this
    clearTimeout(time);
    that.setData({
      animation: true,
    })
    var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
      that.setData({
        isbaoxiang: true
      })
      if (that.data.isanimation == true) {
        that.setData({
          isanimation: false,
        })
        clearTimeout(time);
        var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
          that.OpenPrize()
        }, 1000);
      }
    }, 2000);
  },
  baoxiang: function(e) { //打开宝箱弹窗
    var that = this
    that.setData({
      ishidden: true,
      islijijika: e.currentTarget.dataset.id
    })
  },
  homeindex: function() {
    wx.switchTab({
      url: '../../pages/index/index',
    })
  },
  onShareAppMessage: function(res) {
    var that = this
    console.log('id=' + app.globalData.UserInfo.Id + ' &gid=' + that.data.gameList.Id, )
    return {
      title: app.globalData.UserInfo.NickName + "邀请你来领奖，集齐卡片就能领走~",
      path: '/game/setCards/setCards?id=' + app.globalData.UserInfo.Id + '&gid=' + that.data.gameList.Id,
      success: function(res) {
        // 转发成功
        that.setData({
          isshare: true,
        })
        that.setData({
          PageQRCodeInfo: { //二维码分享信息
            IsShare: false,
          },
        })
      },
    }
  },
  GetGameInfo: function() { //1获取游戏详情
    var that = this;
    if (that.data.isbaoxiang == true) {
      that.setData({
        isbaoxiang: false,
        animation: false
      })
    }
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      gameType: 1
    }
    $.xsr($.makeUrl(actapi.GetGameInfo, val), function(data) {
      ////console.log(data)
      if (data.Code == 0) {
        that.setData({
          isdata: true
        })
        wx.setNavigationBarTitle({
          title: data.Info.GameName
        })
        if (data.Info.IsBegin == true && that.data.IsBegin2 == true) {
          that.setData({
            IsBegin: true,
          })
        } else if (data.Info.IsBegin == false && that.data.IsBegin2 == true) {
          that.setData({
            IsBegin: true,
          })
        } else {
          that.setData({
            IsBegin: data.Info.IsBegin,
          })
        }
        that.setData({
          gameList: data.Info,
          Status: data.Info.Status
        })
        ////console.log(that.data.gameList)
        that.GetUserGameCardInfo()
        that.setInterval()
      } else {
        that.setData({
          isdata: false
        })
      }
      that.GetGameWinnerList();
      that.GetGameSponsorList()
    })
  },

  setInterval: function() { //倒计时
    clearInterval(Interval)
    var that = this;
    if (that.data.gameList.GameEventStatus == 2) {
      Interval = setInterval(function() {
        var t = that.data.gameList.ShowCountdownMilliseconds -= 1000
        if (t < 0) {
          clearInterval()
          that.setData({
            day: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          })
          that.GetGameInfo()
        } else {
          var day = parseInt(t / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
          var hours = parseInt(t / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
          var minutes = parseInt(t / 1000 / 60 % 60, 10); //计算剩余的分钟 
          var seconds = parseInt(t / 1000 % 60, 10); //计算剩余的秒数 
          that.setData({
            day: $.doubleNum(day),
            hours: $.doubleNum(hours),
            minutes: $.doubleNum(minutes),
            seconds: $.doubleNum(seconds),
          });
        }
      }, 1000);
    }
    if (that.data.gameList.GameEventStatus == 1) {
      Interval = setInterval(function() {
        var t = that.data.gameList.ShowStartCountdownMilliseconds -= 1000
        if (t < 0) {
          clearInterval()
          that.setData({
            day: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          })
          that.GetGameInfo()
        } else {
          var day = parseInt(t / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
          var hours = parseInt(t / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
          var minutes = parseInt(t / 1000 / 60 % 60, 10); //计算剩余的分钟 
          var seconds = parseInt(t / 1000 % 60, 10); //计算剩余的秒数 
          that.setData({
            day: $.doubleNum(day),
            hours: $.doubleNum(hours),
            minutes: $.doubleNum(minutes),
            seconds: $.doubleNum(seconds),
          });
        }
      }, 1000);
    }

  },

  GetUserGameCardInfo: function() { //2获取用户集卡信息接口
    var that = this;
    ////console.log(that.data.gameList)

    var val = {
      userId: app.globalData.UserInfo.Id,
      gameId: that.data.gameList.Id
    }
    //console.log(val)
    $.xsr1($.makeUrl(actapi.GetUserGameCardInfo, val), function(data) {
      //console.log(data)
      if (data.Code == 0) {
        var percent = (data.Info.AlreadyCount / 5) * 100
        that.setData({
          usercardList: data.Info,
          percent: percent,
        })
        if (data.Info.CardList == null) {
          that.setData({
            isusercard: false
          })
        } else {
          that.setData({
            isusercard: true
          })
        }
      }
    })
  },

  DrawCard: function() { //2.1.3抽卡接口
    var that = this;
    that.setData({
      ishidden: true,
    })
    var val = {
      userId: app.globalData.UserInfo.Id,
      gameId: that.data.gameList.Id,
      vendorId: app.globalData.VendorInfo.Id,
    }
    $.xsr1($.makeUrl(actapi.DrawCard, val), function(data) {
      if (data.Code == 0) {
        that.setData({
          carsdList: data.Info,
          cardsfalse: true,
        })
        that.GetUserGameCardInfo()
      } else {
        if (data.Msg != '本次没有获得卡片') {
          that.setData({
            ishidden: false,
          })
          $.alert(data.Msg)
          var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
            that.GetGameInfo()
          }, 1500);
        } else {
          if (data.Msg == '本次没有获得卡片') {
            that.setData({
              cardsfalse: false,
            })
            that.GetUserGameCardInfo()
          }
        }
      }
    })
  },

  OpenPrize: function(e) { //开启礼包接口
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      gameId: that.data.gameList.Id,
      vendorId: app.globalData.VendorInfo.Id,
    }
    $.xsr1($.makeUrl(actapi.OpenPrize, val), function(data) {
      if (data.Code == 0) {
        that.setData({
          islijijika: 3,
          prizeList: data.Info,
        })
        that.GetUserGameCardInfo()
      } else {
        if (data.Msg == '您抽中的奖品已发完') {
          that.setData({
            islijijika: 4,
          })
          that.GetUserGameCardInfo()
        } else {
          that.setData({
            ishidden: false,
            isanimation: true,
          })
          $.alert(data.Msg)
          var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
            that.GetGameInfo()
          }, 1500);
        }
      }
    })
  },

  OpenPrizeNow: function(e) { //立即开启礼包
    var that = this
    that.animation()
  },
  onGotUserInfo33: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl;
      app.nickName = e.detail.userInfo.nickName;
      app.authorize = true;
      that.button(e)
    } else {

    }
  },
  button: function(e) {
    var that = this
    if (e.currentTarget.dataset.type == '立即开启大礼包') {
      that.setData({
        ishidden: true,
        islijijika: 1
      })
      this.OpenPrizeNow()
    }
    if (e.currentTarget.dataset.type == '立即集卡') {
      that.setData({
        ishidden: true,
        islijijika: 2,
        carsdList: []
      })
      this.DrawCard()
    }
  },
  InitData: function(options) {
    var that = this;
    if (options.id != undefined) {
      if (options.id != app.globalData.UserInfo.Id) {
        that.setData({
          gid: options.gid,
          uid: options.id
        })
        that.AddGameUserAccess()
      }
    }
    that.GetGameInfo();
  },
  AddGameUserAccess: function() { //分享获取次数接口
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      gameId: that.data.gid,
      shareUserId: that.data.uid,
    }
    //console.log(val)
    $.xsr($.makeUrl(actapi.AddGameUserAccess, val), function(data) {
      //console.log(data)
    })
  },
  lookprize: function(e) { //查看奖品
    wx.navigateTo({
      url: '../thePrize/thePrize',
    })
  },
  chouka: function() { //抽卡测试
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      gameId: that.data.gameList.Id,
      vendorId: app.globalData.VendorInfo.Id
    }
    for (var i = 0; i < 5000; i++) {
      $.xsr1($.makeUrl(actapi.DrawCard, val), function(data) {
        //////console.log("code" + i);
      })
    }
  },
  choujiang: function() { //抽奖测试
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      gameId: that.data.gameList.Id,
      vendorId: app.globalData.VendorInfo.Id
    }
    for (var i = 0; i < 5000; i++) {
      $.xsr($.makeUrl(actapi.OpenPrize, val), function(data) {
        //////console.log("codess" + i);
      })
    }
  },
  // onHide: function () {
  //   clearInterval(Interval)
  // },

  onGotUserInfo22: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl;
        app.nickName = e.detail.userInfo.nickName;
        app.authorize = true;
      that.prompt()
    } else {

    }
  },
  prompt: function() {
    $.alert("活动暂未开始")
  },
  onGotUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function(data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl;
        app.nickName = e.detail.userInfo.nickName;
        app.authorize = true;
      that.shareQRCode(e)
    } else {

    }
  },
  shareQRCode: function(e) {
    var that = this;
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      Path: '/game/setCards/setCards?id=' + app.globalData.UserInfo.Id + '&gid=' + that.data.gameList.Id,
      GameName: that.data.gameList.GameName,
      UserInfoId: app.globalData.UserInfo.Id,
      GamePic: that.data.gameList.GameRule.GameBackImg,
      EndTime: that.data.gameList.EndTimeStr,
      NCardTypeNum: 5 - that.data.usercardList.AlreadyCount
    }
    ////console.log(val)
    $.xsr($.makeUrl(venapi.QRGameCardCodePoster, val), function(data) {
      that.setData({
        PageQRCodeInfo: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT: true
        }
      });
    });
  },
  onGotUserInfo11: function(e) {
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

      app.imageUrl = e.detail.userInfo.avatarUrl;
        app.nickName = e.detail.userInfo.nickName;
        app.authorize = true;
      that.shareBox()
    } else {

    }
  },
  shareBox: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function() {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function(res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              PageQRCodeInfo: {
                Path: '',
                IsShare: false,
                IsShareBox: false,
                IsJT: false
              }
            });
            $.alert("保存图片成功！");
          },
          fail: function(e) {
            $.hideloading();
            ////console.log("保存图片失败：", e)
          }
        });
      },
      fail: function(e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  showCodeImg: function() {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  GetRecommendedProductList: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageSize: this.data.pageSize,
      pageIndex: this.data.pageIndex,
    }
    $.xsr($.makeUrl(venapi.GetRecommendedProductList, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 6) {
          that.setData({
            flag: false,
            ispage: false
          });
          that.setData({
            ProductList: that.data.ProductList.concat(res.Info)
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            ProductList: that.data.ProductList.concat(res.Info)
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
  fightPage: function(e) {
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1
        });
        that.GetRecommendedProductList();
        that.setData({
          flag: false
        })
      }, 500);
    }
  },
  GetGameWinnerList: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      gameId: that.data.gameList.Id
    }
    $.xsr($.makeUrl(actapi.GetGameWinnerList, val), function(res) {
      ////console.log(res)
      if (res.Info.length > 0) {
        that.setData({
          luckyName: res.Info
        })
      }
    });
  },
  GetGameSponsorList: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      gameId: that.data.gameList.Id,
      userInfoId: app.globalData.UserInfo.Id,
      pageIndex: that.data.pageIndex1,
      pageSize: that.data.pageSize1
    }
    ////console.log(val)
    $.xsr($.makeUrl(actapi.GetGameSponsorList, val), function(res) {
      ////console.log(res)
      if (res.Info.length > 0) {
        that.setData({
          sponsorName: res.Info
        })
      }
    });
  },
  GetGameSponsorList1: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      gameId: that.data.gameList.Id,
      userInfoId: app.globalData.UserInfo.Id,
      pageIndex: that.data.pageIndex2,
      pageSize: that.data.pageSize2
    }
    ////console.log(val)
    $.xsr($.makeUrl(actapi.GetGameSponsorList, val), function(res) {
      ////console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 10) {
          that.setData({
            flag1: false,
            ispage1: false
          });
          that.setData({
            sponsorName1: that.data.sponsorName1.concat(res.Info)
          });
        } else {
          that.setData({
            flag1: true,
            sponsorName1: that.data.sponsorName1.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag1: false,
          ispage1: false
        });
      }
    });
  },
  scrollbottom: function(even) { //滚动到底部进行分页
    if (this.data.flag1) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex2: parseInt(that.data.pageIndex2) + 1
        });
        that.GetGameSponsorList1();
        that.setData({
          flag1: false
        })
      }, 500)
    }
  },
  open: function() {
    this.setData({
      isShow: true,
      pageSize2: 10,
      pageIndex2: 1,
      sponsorName1: []
    })
    this.GetGameSponsorList1()
  },
  close5: function() {
    this.setData({
      isShow: false
    })
  },
  innertouch: function() {}, //事件拦截
})