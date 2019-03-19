var app = getApp();
var $ = require('../../utils/util.js');
var url = require('../../utils/navigate.js');
var api = require('../../api/productAPI.js');
var orderapi = require('../../api/orderAPI.js');
var fgapi = require('../../api/fightGroups.js');
var notice = require('../../utils/notice.js');
var userapi = require('../../api/userAPI.js');
var venapi = require('../../api/vendorAPI.js');

Page({
  data: {
    Photo: "",
    UserName: "",
    splistStr: [], //选择的规格列表名称
    ispaysuccess: false,
    IsOwner: false,
    OrderNum: "",
    isfg: false,
    FGInfo: {}, //拼团活动信息
    isPage: true, //是否可以进行分页
    Coupons: [],
    isCancelSuccess: true, //新手礼包领取成功取消
    isCancel: true, //新手礼包取消
    CouponAmount: 0,
    IsNewUser: 0,
    userInfoId: 0,
    GroupUsers: [],
    show: false,
    day: "",
    hours: "",
    minutes: "",
    seconds: "",
    time: "",
    colonel: "",
    isShow: false,
    scposition: "", //滚动条位置
    pageSize1: 10,
    pageIndex1: 1,
    pageSize: 6,
    pageIndex: 1,
    type: "",
    flag1: false,
    ispage1: false,
    flag: false,
    ispage: false,
    participant: [],
    isFightGroup: 0,
    ProductList: [],
    isnav: true,
    screenHeight: 0,
    isquicknav: false,
    take: "1",
    MEId: "0"
  },
  onLoad: function (options) {
    console.log("打印options：",options)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          IsNewUser: app.globalData.UserInfo.IsNewUser,
          CouponAmount: app.globalData.UserInfo.CouponAmount,
          Currency: app.globalData.VendorInfo.Currency,
          MEId: options.MEId,
          type: options.type || ""
        });
        that.InitData(options);
        that.GetRecommendedProductList()
      }, options.uid);
    } else {
      that.setData({
        IsNewUser: app.globalData.UserInfo.IsNewUser,
        CouponAmount: app.globalData.UserInfo.CouponAmount,
        Currency: app.globalData.VendorInfo.Currency,
        MEId: options.MEId,
        type: options.type || ""
      });
      that.InitData(options);
      that.GetRecommendedProductList()
    }
    //刷新
    notice.addNotification("RefreshFG", that.RefreshFG, that);
  },
  InitData: function (options) {
    var that = this;
    that.setData({
      Photo: app.globalData.UserInfo.Photo,
      UserName: app.globalData.UserInfo.NickName,
      isfg: options.isfg || false,
      type: options.type
    });
    var obj = {
      InfoId: options.MEId || "",
      OrderNum: options.on || "",
      type: options.type,
      userId: app.globalData.UserInfo.Id
    }
    //拼团信息
    console.log(obj);
    $.xsr($.makeUrl(fgapi.GetGroupInfoByEventId, obj), function (data) {
      console.log("cnayuan:",data)
      that.setData({
        show: true
      })
      if (data.Info.length > 0) {
        data.Info[0].GroupUsers.forEach(function (val) {
          if (val.IsOwner) {
            that.setData({
              userInfoId: val.UserInfoId,
            })
          }
          if (val.UserInfoId == app.globalData.UserInfo.Id) {
            that.setData({
              ispaysuccess: true,
              IsOwner: val.IsOwner,
              OrderNum: val.OrderNum,
            });
          }
        });
        that.setData({
          FGInfo: data.Info[0],
        });
        setInterval(function () {


          
          var t = data.Info[0].ShowCountdownMilliseconds -= 1000
          if (t < 0) {
            clearInterval()
            var d = "00",
              h = "00",
              m = "00",
              s = "00"
            if (d == '00') {
              that.setData({
                time: h + ":" + m + ":" + s
              });
            } else {
              that.setData({
                time: d + "天" + h + ":" + m + ":" + s
              });
            }
          } else {
            var
              d = $.doubleNum(Math.floor(t / 1000 / 60 / 60 / 24)),
              h = $.doubleNum(Math.floor(t / 1000 / 60 / 60 % 24)),
              m = $.doubleNum(Math.floor(t / 1000 / 60 % 60)),
              s = $.doubleNum(Math.floor(t / 1000 % 60))

            if (d == '00') {
              that.setData({
                time: h + ":" + m + ":" + s
              });
            } else {
              that.setData({
                time: d + "天" + h + ":" + m + ":" + s
              });
            }
          }
        }, 1000);
        var GroupUser = data.Info[0].GroupUsers;
        that.setData({
          GroupUsers: GroupUser,
          colonel: GroupUser[0]
        })
      }
    });
    if (options.type == 'FIGHTGROUP') {
      wx.setNavigationBarTitle({
        title: '拼团详情',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '抽奖团详情',
      })
    }
  },

  onShareAppMessage: function (res) {
    var that = this
    var UserNum = that.data.FGInfo.UserLimit - that.data.FGInfo.UserNum;
    var title;
    if (that.data.type == 'FIGHTGROUP') {
      console.log("Renming:", app.globalData.UserInfo.NickName)
      //拼团类型
      title = UserNum > 0 ? ("【还差" + (that.data.FGInfo.UserLimit - that.data.FGInfo.UserNum) + "人】" + app.globalData.UserInfo.NickName + "邀请您参加拼团！立省" + app.globalData.VendorInfo.Currency + (that.data.FGInfo.SalePrice - that.data.FGInfo.PreferentialPrice).toFixed(2)) :
        app.globalData.UserInfo.NickName + "拼团成功！ta已节省" + app.globalData.VendorInfo.Currency + (that.data.FGInfo.SalePrice - that.data.FGInfo.PreferentialPrice).toFixed(2) + "赶快来拼团吧!";
    } else {
      console.log("Renming1:", app.globalData.UserInfo.NickName)
      // { { Currency } } </label>{{FGInfo.PreferentialPrice}}
      //抽奖团
      title = UserNum > 0 ? ("【" + that.data.FGInfo.PreferentialPrice + "元抽奖还差" + (that.data.FGInfo.UserLimit - that.data.FGInfo.UserNum) + "人】" + app.globalData.UserInfo.NickName + "邀请您参加抽奖团！立省" + app.globalData.VendorInfo.Currency + (that.data.FGInfo.SalePrice - that.data.FGInfo.PreferentialPrice).toFixed(2)) :
        app.globalData.UserInfo.NickName + "拼团成功！ta已节省" + app.globalData.VendorInfo.Currency + (that.data.FGInfo.SalePrice - that.data.FGInfo.PreferentialPrice).toFixed(2) + "赶快来拼团吧!";
    }

    return {
      title: title,
      desc: that.data.FGInfo.ProductName,
      path: '/pages/fightgroupsdetail/fightgroupsdetail?MEId=' + that.data.FGInfo.OwnGroupId + "&pid=" + that.data.FGInfo.ProductId + "&uid=" + app.globalData.UserInfo.Id + "&type=" + that.data.type,
      success: function () {
        $.xsr1($.makeUrl(orderapi.luckyShareCount, {
          sponsorId: app.globalData.UserInfo.Id,
          audienceType: 1,
          audienceId: 0,
          contentType: 23,
          contentId: that.data.FGInfo.OwnGroupId
        }), function (data) { });
      }
    }
  },
  RefreshFG: function () {
    var that = this;
    var options = {
      MEId: that.data.FGInfo.InfoId
    }
    // if (options.type == 'FIGHTGROUP') {
    //   MEId: that.data.FGInfo.InfoId
    // } else {
    //   MEId: that.data.FGInfo.ownGroupId
    // }
    that.InitData(options);
  },
  immediatelyOffered: function () { //立即开团
    var val = {
      Amount: 1,
      ProductId: this.data.FGInfo.ProductId,
      // orderType: 1,//拼团订单
      marketingEventId: this.data.FGInfo.MarketingEventId, //活动ID
      isOwner: 'false',
      // isFightGroup: '2',
      ProductSKU_Id: this.data.FGInfo.ProductSkuId,
      AddTime: getNowFormatDate(),
      ProductSaleName: this.data.FGInfo.ProductName,
      ownGroupId: this.data.FGInfo.InfoId,
      UserAccount: app.globalData.UserInfo.UserName,
      speStr: JSON.stringify(this.data.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    }
    if (this.data.type == 'FIGHTGROUP') { //普通拼团
      val.orderType = 1;
      val.isFightGroup = 2;
      this.setData({
        orderType: 1
      })
    }
    if (this.data.type == 'LUCKYFIGHTGROUP') { //抽奖团
      val.orderType = 2;
      val.isFightGroup = 3;
      this.setData({
        orderType: 2
      })
    }
    wx.navigateTo({
      url: "../productdetail/productdetail?spid=" + JSON.stringify(val) + "&type=" + this.data.type + "&orderType=" + this.data.orderType + "&ownGroupId=" + this.data.FGInfo.InfoId + "&MEId=" + this.data.FGInfo.MarketingEventId + "&pid=" + this.data.FGInfo.ProductId + "&take=" + this.data.take
    })
  },
  receivenow: function () { //领取新手大礼包
    this.cancel();
    this.userReceiveCoupon();
  },


  cancel: function () { //新手礼包取消
    this.setData({
      isCancel: false,
    });
  },
  cancelsuccess: function () { //领券成功取消
    this.setData({
      isCancelSuccess: true,
    });
  },

  innertouch: function () { }, //事件拦截

  userReceiveCoupon: function () { //用户领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: '',
      UserId: app.globalData.UserInfo.Id,
      IsNewUser: this.data.IsNewUser //新用户为1 老用户为0 
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
      that.shareQRCode()
    } else {

    }
  },
  shareQRCode: function (e) {
    var that = this;
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      Path: '/pages/fightgroupsdetail/fightgroupsdetail?MEId=' + this.data.FGInfo.OwnGroupId + "&pid=" + this.data.FGInfo.ProductId + "&uid=" + app.globalData.UserInfo.Id + "&type=" + this.data.type,
      MainImg: this.data.FGInfo.ProductPic,
      MainTitle: this.data.FGInfo.ProductName,
      ProductId: this.data.FGInfo.ProductId,
      MarketingEventId: this.data.FGInfo.MarketingEventId,
      SalePrice: this.data.FGInfo.SalePrice,
      OriginalPrice: this.data.FGInfo.PreferentialPrice,
      GroupPersonAmout: this.data.FGInfo.UserLimit,
      CutPrice: "",
      // LogoPath:app.globalData.UserInfo.Photo,
      // NickName: app.globalData.UserInfo.NickName,
      UserInfoId: this.data.userInfoId,
      MarketingEventTime: this.data.FGInfo.EndTimeStr
    }
    $.xsr($.makeUrl(userapi.QRCodePosterForGroupAndCutPrice, val), function (data) {
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
  shareBox: function () {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function () {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function () {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function (res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
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
          fail: function (e) {
            $.hideloading();
            console.log("保存图片失败：", e)
          }
        });
      },
      fail: function (e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  showCodeImg: function () {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  open: function () {
    this.setData({
      isShow: true,
      participant: [],
      pageSize: 10,
      pageIndex1: 1
    })
    this.participant()
  },
  participant: function () {
    var that = this
    var val = {
      marketingEventId: this.data.FGInfo.MarketingEventId,
      pageSize: this.data.pageSize1,
      pageIndex: this.data.pageIndex1,
      type: this.data.type,
      groupId: this.data.FGInfo.OwnGroupId
    }
    $.xsr($.makeUrl(fgapi.GetParticipantList, val), function (res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 10) {
          that.setData({
            flag1: false,
            ispage1: false
          });
          that.setData({
            participant: that.data.participant.concat(res.Info)
          });
        } else {
          that.setData({
            flag1: true,
            participant: that.data.participant.concat(res.Info)
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

  close: function () {
    this.setData({
      isShow: false
    })
  },
  innertouch: function () { }, //事件拦截
  gotodetail: function () {
    var that = this
    wx.navigateTo({
      url: '../winningdetails/winningdetails?groupId=' + that.data.FGInfo.OwnGroupId + '&OrderNum=' + that.data.OrderNum
    })
  },
  scrollbottom: function (even) { //滚动到底部进行分页
    if (this.data.flag1) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex1: parseInt(that.data.pageIndex1) + 1
        });
        that.participant();
        that.setData({
          flag1: false
        })
      }, 500)
    }
  },
  GetRecommendedProductList: function () {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageSize: this.data.pageSize,
      pageIndex: this.data.pageIndex,
    }
    $.xsr($.makeUrl(venapi.GetRecommendedProductList, val), function (res) {
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
  fightPage: function (e) {
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
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
  scrolltoupper: function (e) {
    if (e.detail.scrollTop >= this.data.screenHeight) {
      this.setData({
        isquicknav: true
      })
    } else {
      this.setData({
        isquicknav: false
      })
    }
  },
  returnTop: function () { //返回顶部
    this.setData({
      scposition: 0
    });
  },
  nav: function () {
    this.setData({
      isnav: false,
      animation: false
    })
  },
  outnav: function () {
    var that = this;
    this.setData({
      animation: true
    })
    setTimeout(function () {
      that.setData({
        isnav: true
      })
    }, 400)
  },
  goToUrl: function (e) {
    url.redirectTo(e.currentTarget.dataset.url);
  }
})

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  return currentdate;
}