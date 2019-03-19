var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
var userapi = require('../../api/userAPI.js');
var activityapi = require('../../api/activityAPI.js');
var venapi = require('../../api/vendorAPI.js');
var app = getApp();
var takeInterval;
var takeList;
Page({
  data: {
    Time: "",
    hours: "",
    show: false,
    showImg: false,
    showPrice: false,
    isCut: true, //true 可砍  false 到底价
    IshasCut: null,
    imgPath: "",
    NickName: "",
    MEId: 0, //砍价活动Id
    uid: 0,
    pid: 0,
    pageNumber: 1,
    pageSize: 6,
    Info: {},
    balance: "", //剩余余额
    end: 0,
    startTime: "",
    endTime: "",
    istrue: false, //true 发起人 false 帮砍人
    flag: false,
    ispage: false,
    width: 100,
    participantId: "",
    cutPriceActivityId: 0,
    money: 0, //砍掉的价格
    List: [], //帮砍人列表
    hour: 0,
    min: 0,
    sec: 0,
    num: 0,
    cutPricePartakeL: [],
    ishidden: false,
    bargainIndex: 1,
    ProductSKUId: null, //多规格id
    PageQRCodeInfo: { //二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false
    },
    isnav: true,
    screenHeight: 0,
    isquicknav: false,
    ProductList: [], //更多推荐
    size: 6, //推荐
    pageIndex: 6, //推荐页数
    jindu: 0,
    isshow: 0,
    isShow2: false, //帮砍人列表
    Iskanjia: false,
    Detail: [],
    splistStr: [],
    speStr: "", //规格
    DetailList: [],
    IsInitiator: true, //true  发起人   false帮砍人
    pageIndex2: 1, //列表弹窗
    pageNum: 1,
    oldMaxId: 0,
    newMaxId: 0
  },
  onLoad: function(options) {
    console.log("砍价options",options)
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })

    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        if (options.sid) {
          that.setData({
            imgPath: app.globalData.UserInfo.Photo,
            NickName: app.globalData.UserInfo.NickName,
            uid: options.sid,
            participantId: app.globalData.UserInfo.Id,
            pid: options.pid,
            MEId: options.MEId,
            ProductSKUId: options.ProductSKUId || '',
            Currency: app.globalData.VendorInfo.Currency
          })
        } else {
          that.setData({
            imgPath: app.globalData.UserInfo.Photo,
            NickName: app.globalData.UserInfo.NickName,
            uid: options.uid || app.globalData.UserInfo.Id,
            participantId: app.globalData.UserInfo.Id,
            pid: options.pid,
            MEId: options.MEId,
            ProductSKUId: options.ProductSKUId || '',
            Currency: app.globalData.VendorInfo.Currency
          })

        }

        that.setData({
          IsNewUser: app.globalData.UserInfo.IsNewUser,
          CouponAmount: app.globalData.UserInfo.CouponAmount,
          Currency: app.globalData.VendorInfo.Currency
        });
        if (that.data.uid == app.globalData.UserInfo.Id) {
          // IsInitiator: true,//true  发起人   false帮砍人
          that.setData({
            IsInitiator: true
          })
        } else {
          that.setData({
            IsInitiator: false
          })
        }
        // if (that.data.uid == app.globalData.UserInfo.Id) {
        //   that.CutPrice()
        // } else {
        //   that.GetVendorCutPriceEventDetail()
        //   that.GetOtherCutPriceActivityList()
        // }
        that.GetRecommendedProductList()

        that.strong()
      }, options.uid);
    } else {
      if (options.sid) {
        that.setData({
          imgPath: app.globalData.UserInfo.Photo,
          NickName: app.globalData.UserInfo.NickName,
          MEId: options.MEId,
          uid: options.sid,
          participantId: app.globalData.UserInfo.Id,
          pid: options.pid,
          ProductSKUId: options.ProductSKUId || '',
          cutPriceActivityId: options.cutPriceActivityId || 0,
          Currency: app.globalData.VendorInfo.Currency
        })
      } else {
        that.setData({
          imgPath: app.globalData.UserInfo.Photo,
          NickName: app.globalData.UserInfo.NickName,
          MEId: options.MEId,
          uid: options.uid || app.globalData.UserInfo.Id,
          ProductSKUId: options.ProductSKUId || '',
          participantId: app.globalData.UserInfo.Id,
          pid: options.pid,
          cutPriceActivityId: options.cutPriceActivityId || 0,
          Currency: app.globalData.VendorInfo.Currency
        })
      }
      if (that.data.uid == app.globalData.UserInfo.Id) {
        // IsInitiator: true,//true  发起人   false帮砍人
        that.setData({
          IsInitiator: true
        })
      } else {
        that.setData({
          IsInitiator: false
        })
      }

      // if (that.data.uid == app.globalData.UserInfo.Id) {
      //   that.CutPrice()
      // } else {
      //   that.GetVendorCutPriceEventDetail()
      //   that.GetOtherCutPriceActivityList()
      // }
      that.GetRecommendedProductList()


      that.strong()
    }
  },

  hiddenBind: function() {
    var that = this;
    if (that.data.ishidden == false) {
      that.setData({
        ishidden: true
      })
    } else {
      that.setData({
        ishidden: false
      })
    }
  },


  onShow: function() {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        if (that.data.uid == app.globalData.UserInfo.Id) {
          that.CutPrice()
        } else {
          that.GetVendorCutPriceEventDetail()
          that.GetOtherCutPriceActivityList()
        }
      })
    } else {
      if (that.data.uid == app.globalData.UserInfo.Id) {
        that.CutPrice()
      } else {
        that.GetVendorCutPriceEventDetail()
        that.GetOtherCutPriceActivityList()
      }
    }





    clearInterval(takeInterval)
    clearInterval(takeList)
    that.strong()
    takeInterval = setInterval(function() {
      clearInterval(takeList)
      that.strong()
    }, 60000)
  },
  strong: function() {
    var that = this;
    clearInterval(takeList);
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      PageNumber: that.data.pageNum,
      PageSize: 10,
      OldMaxId: that.data.oldMaxId,
      NewMaxId: that.data.newMaxId,
    }
    $.xsr1($.makeUrl(activityapi.GetCutPricePartakeList, val), function(res) {
      console.log("sssssss", res)
      if (res.Code == 0) {
        that.setData({
          cutPricePartakeL: res.Info[0].CutPricePartakeList,
        })
        takeList = setInterval(function() {
          var num = that.data.num;
          // that.setData({
          //   bargainIndex: that.data.cutPricePartakeL[num]
          // })
          if (num < that.data.cutPricePartakeL.length) {
            num++
            that.setData({
              num: num
            })
          } else {
            that.setData({
              num: 0
            })
          }
        }, 4000);
        var pageNum = that.data.pageNum + 1;
        var oldMaxId = res.Info[0].OldMaxId;
        var newMaxId = res.Info[0].NewMaxId;
        that.setData({
          pageNum: pageNum,
          oldMaxId: oldMaxId,
          newMaxId: newMaxId
        })
      }
    })
  },
  onHide: function() {
    clearInterval(takeInterval)
    clearInterval(takeList)
    wx.clearStorage();
  },
  onUnload: function() {
    clearInterval(takeInterval)
    clearInterval(takeList)
    wx.clearStorage();
  },



  GetVendorCutPriceEventDetail: function() { //获取砍价详情
    var that = this
    var val = {
      marketingEventId: that.data.MEId,
      sponsorId: that.data.uid, //发起人的Id
      participantId: app.globalData.UserInfo.Id, //帮砍人的Id
      productSkuId: that.data.ProductSKUId
    }
    if (val.sponsorId == val.participantId) {
      that.setData({
        istrue: true
      })
    } else {
      that.setData({
        istrue: false
      })
    }
    $.xsr($.makeUrl(api.GetVendorCutPriceEventDetail, val), function(res) { //基本数据接口

      console.log("基本数据接口", res)
      var balance = (res.Info.SalePrice - res.Info.TotalCutPrice).toFixed(2)
      that.setData({
        Info: res.Info,
        IshasCut: res.Info.HasCut,
        jindu: (1 - res.Info.CutPricePercent) * 100,
        ProductSKUId: res.Info.ProductSkuId,
        balance: balance,
        speStr: res.Info.speStr
      })
      that.getTime()
      if (res.Info.CutSpacePrice <= 0) {
        that.setData({
          isCut: false
        })
      } else {
        isCut: true
      }
    });
  },
  getTime: function() {
    var that = this
    var nowTime = new Date().getTime(); //当前时间
    var startdata = this.data.Info.StartTimeText;
    var startData = startdata.replace(/-/g, "/");
    var startTime = new Date(startData).getTime();
    var enddata = this.data.Info.EndTimeText;
    var endData = enddata.replace(/-/g, "/");
    var endTime = new Date(endData).getTime();
    if (startTime >= nowTime) {
      var intervalDate = setInterval(function() { //离活动开始时间倒计时倒计时
        that.setData({
          Time: $.Formattime1(that.data.Info.StartTimeText, intervalDate),
          end: 1
        });
        if (that.data.Time == undefined) {
          that.getTime()
        }
      }, 1000);
      return
    }
    if (endTime <= nowTime) {
      var intervalDate = setInterval(function() { //活动已结束
        that.setData({
          Time: $.Formattime(that.data.Info.EndTimeText, intervalDate),
          end: 3
        });

        if (that.data.Time == undefined) {
          that.getTime()
        }
      }, 1000);
      return
    }
    if (startTime < nowTime < endTime) {
      var intervalDate = setInterval(function() { //离活动结束时间倒计时倒计时
        that.setData({
          Time: $.FormatTime2(that.data.Info.EndTimeText, intervalDate),
          end: 2
        });
        if (that.data.Time == undefined) {
          that.getTime()
        }
      }, 1000);
      return
    }
  },
  GetOtherCutPriceActivityList: function() { //获取商家砍价活动帮砍人列表

    var val = {
      marketingEventId: this.data.MEId,
      sponsorId: this.data.uid,
      pageNumber: this.data.pageIndex2,
    }
    var thisobj = this;
    $.xsr($.makeUrl(api.GetOtherCutPriceActivityList, val), function(res) {
      console.log("帮砍人列表", res)

      if (!$.isNull(res.Info) && res.Code == 0) {
        thisobj.setData({
          isdata: true,
          DetailList: thisobj.data.DetailList.concat(res.Info),
        })
        if (res.Info.length < 10) {
          thisobj.setData({
            flag1: false,
            ispage: false,
          })
        } else {
          thisobj.setData({
            flag1: true,
            ispage: true,
          })
        }
      }
      var arr = thisobj.data.DetailList;
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        for (var j = i + 1; j < len; j++) {
          if (arr[i].Id == arr[j].Id) {
            arr.splice(j, 1);
            len--;
            j--;
          }
        }
      }
      thisobj.setData({
        DetailList: arr
      })

    });
  },
  close5: function() {
    this.setData({
      isShow2: false,
      sponsorName1: []
    })
  },
  openTap: function() {

    this.setData({
      isShow2: true,
      pageSize2: 10,
      pageIndex2: 1,
      sponsorName1: []
    })
  },
  scrollbottom2: function(even) {
    if (this.data.flag1) {
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() {
        that.setData({
          pageIndex2: parseInt(that.data.pageIndex2) + 1
        });
        that.GetOtherCutPriceActivityList();
        that.setData({
          flag1: false
        })
      }, 500)
    }
  },
  onGotUserInfo44: function(e) {
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

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.CutPrice()
    } else {

    }
  },

  CutPrice: function() { //砍价
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      sponsorId: this.data.uid,
      marketingEventId: this.data.MEId,
      participantId: app.globalData.UserInfo.Id,
      productSkuId: this.data.ProductSKUId
    }

    var thisobj = this;
    $.xsr1($.makeUrl(api.CutPrice, val), function(res) {
      console.log("kan:", res)
      thisobj.GetVendorCutPriceEventDetail()
      thisobj.GetOtherCutPriceActivityList() //帮砍人列表
      if (res.Code == 1) {
        return false
      }
      if (res.Code == 0) {
        thisobj.setData({
          money: res.Info[0],
          moneynum: res.Info[0].Amount,
          cutPriceActivityId: res.Info[0].Id,
          show: true,
          Iskanjia: true,
        })
        thisobj.bargin()
      } else {
        thisobj.setData({
          show: false
        })
        $.alert(res.Msg, function() {
          setTimeout(function() {
            wx.redirectTo({
              url: '../bargainlist/bargainlist',
            })
          }, 2000)
        }, 2000);
      }
    });
  },

  onShareAppMessage: function() { //分享
    return {
      title: this.data.Info.Name,
      path: '/pages/bargain/bargain?MEId=' + this.data.MEId + "&uid=" + this.data.uid + "&pid=" + this.data.pid + "&ProductSKUId=" + this.data.ProductSKUId + "&cutPriceActivityId=" + this.data.cutPriceActivityId
    }
  },
  bargin: function() { //进入砍价动画
    this.setData({
      show: true,
    })
    var that = this
    setInterval(function() {
      that.setData({
        showImg: true
      })
    }, 850)
    // this.CutPrice()
  },
  back: function() { //回到详情
    this.setData({
      show: false
    })
  },
  onGotUserInfo1: function(e) {
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

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.goshop()
    } else {

    }
  },
  goshop: function() {
    var that = this
    var val = {
      Amount: 1,
      ProductId: this.data.pid,
      orderType: 0,
      cutPriceActivityId: this.data.cutPriceActivityId, //砍价活动ID
      AddTime: getNowFormatDate(),
      ProductSaleName: this.data.Info.ProductName,
      UserAccount: app.globalData.UserInfo.UserName,
      ProductSKU_Id: that.data.ProductSKUId,
      speStr: JSON.stringify(this.data.speStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    }
    if (this.data.Info.ProductForm == 1 || this.data.Info.ProductForm == 0) {
      wx.navigateTo({
        url: "../ordersubmit/ordersubmit?spid=" + encodeURI(JSON.stringify(val)) + "&marktingEventId=" + this.data.MEId + "&sponsorId=" + this.data.uid
      });
    } else {
      wx.navigateTo({
        url: "../../server/ordersubmit/ordersubmit?spid=" + encodeURI(JSON.stringify(val)) + "&marktingEventId=" + this.data.MEId + "&sponsorId=" + this.data.uid + "&sp=" + this.data.Info.ServicePlaceCode + "&pm=" + this.data.Info.PayMethodCode + "&et=" + this.data.Info.BusinessHoursEnd + "&st=" + this.data.Info.BusinessHoursStart + "&showdate=" + this.data.Info.ReservationTimeEnabled + "&showname=" + this.data.Info.ContactEnabled
      });
    }
  },

  onGotUserInfo: function(e) {
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

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.shareQRCode()
    } else {

    }
  },



  shareQRCode: function(e) {
    var that = this;

    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      Path: '/pages/bargain/bargain?MEId=' + this.data.MEId + "&uid=" + this.data.uid + "&pid=" + this.data.pid + "&cutPriceActivityId=" + this.data.cutPriceActivityId,
      MainImg: this.data.Info.ProductPicture,
      MainTitle: this.data.Info.ProductName,
      ProductId: this.data.pid,
      MarketingEventId: this.data.MEId,
      SalePrice: this.data.Info.SalePrice,
      OriginalPrice: "",
      GroupPersonAmout: "",
      CutPrice: this.data.Info.TotalCutPrice,
      UserInfoId: this.data.uid,
      MarketingEventTime: this.data.Info.StartTimeText
    }
    //生成砍价二维码
    $.xsr($.makeUrl(userapi.QRCodePosterForGroupAndCutPrice, val), function(data) {
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
  onGotUserInfo66: function(e) {
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

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
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
  onGotUserInfo2: function(e) {
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

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.shareBox1()
    } else {

    }
  },
  shareBox1: function() {
    wx.showModal({            
      title:   '提示',
                  content:   '商品库存不足',
                  success:   function(res)  {                
        if  (res.confirm)  {                
          console.log('用户点击确定')                
        } 
        else 
          if  (res.cancel)  {                
            console.log('用户点击取消')                
          }            
      }        
    })


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
  //推荐
  GetRecommendedProductList: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageSize: this.data.pageSize,
      pageIndex: this.data.pageIndex,
    }
    console.log(val)
    $.xsr($.makeUrl(venapi.GetRecommendedProductList, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 6) {
          that.setData({
            flag2: false,
            ispage: false
          });
          that.setData({
            ProductList: that.data.ProductList.concat(res.Info)
          });
        } else {
          that.setData({
            flag2: true,
            ispage: true,
            ProductList: that.data.ProductList.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag2: false,
          ispage: false
        });
      }
    });
  },
  //推荐触底刷新
  fightPage: function(e) {
    console.log(this.data.flag)
    if (this.data.flag2) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1
        });
        that.GetRecommendedProductList();
        that.setData({
          flag2: false
        })
      }, 500);
    }
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
  scrolltoupper: function(e) {
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
  returnTop: function() { //返回顶部
    this.setData({
      scposition: 0
    });
  },
  nav: function() {
    this.setData({
      isnav: false,
      animation: false
    })
  },
  outnav: function() {
    var that = this;
    this.setData({
      animation: true
    })
    setTimeout(function() {
      that.setData({
        isnav: true
      })
    }, 400)
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