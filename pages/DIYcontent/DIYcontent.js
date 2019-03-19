var app = getApp();
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');
var urlmap = require('../../utils/urlmap.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    NIndex: [],
    indexArray: [],
    MemberPostsList: [],
    shareTitle: '',
    shareImg: '',
    isClose: true, //判断当前页面是打开还是返回页，false为返回页
    scposition: "", //滚动条位置
    top: "",
    flag: true,
    tag: true,
    IsPage: true,
    pageIndex: 1,
    pageSize: 10,
    uid: 0,
    sousuovalue: '',
    opacity: 0,
    background: 'fafafa',
    BgConfig: [],
    uid: 0,
    istop: false,
    sousuovalue2: '',
    screenHeight: 0,
    isCancelSuccess: true, //新手礼包领取成功取消
    isquicknav: false
  },
  onLoad: function(options) {
    var that = this;
    // that.GetCommunityHome();
    // that.GetPostsList();
    that.setData({
      uid: options.id || 0,
    })
    /**
     * 生命周期函数--监听页面卸载
     */
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
    if (!this.data.isClose) {
      console.log('重新打开')
      // 获取缓存距离
      wx.getStorage({
        key: 'key',
        success: function(res) {
          that.setData({
            top: res.data[0],
          });
        }
      })
    }
    var that = this;
    that.setData({
      flag: true,
      indexArray: [],
      IsPage: true,
      pageIndex: 1,
    })
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.InitData();
      }, that.data.uid, 0);
    } else {
      that.InitData();
    }
  },
  //onUnload用户退出页面时发生
  onUnload: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        isClose: true
      })
    }, 200)

  },
  moNitor: function() {
    this.setData({
      isClose: false
    })
  },
  onShow: function() {


  },
  InitData: function() {
    var that = this;
    that.setData({
      uid: app.globalData.UserInfo.Id,
      photo: app.globalData.UserInfo.Photo
    })
    that.GetCommunityHome();
    that.GetPostsList();
    that.returnTop();
  },

  onGotUserInfo2: function (e) {
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
      that.txt_book()
    } else {

    }
  },
  txt_book:function(){
    wx.navigateTo({
      url: '../../community/Publishedarticles/Publishedarticles'
    })
  },
  GetCommunityHome: function() { //获取社区首页DIY内容
    var val = {
      operateId: app.globalData.VendorInfo.Id
    }
    var that = this;
    $.xsr($.makeUrl(capi.GetCommunityHome, val), function(data) {
      if (data.Code == 0) {
        var DivContent = $.parseJSON(data.Info.DivContent),
          DiyContentConfig = $.parseJSON(data.Info.DiyContentConfig),
          PageConfig = $.parseJSON(data.Info.PageConfig);
        that.getActiveInfo(DivContent).then(function(data) { //有活动，查询活动信息
          DivContent.forEach(function(item, i) {
            if (parseInt(item.adType) == 16) { //查找活动模块
              for (var info of item.ad16obj.data) { //查找出活动商品列表
                for (var obj of data.Info) { //查找出活动商品列表
                  if (info.did === obj.ProductId && info.mid === obj.MarketingEventId) { //商品Id相等
                    info.EndTimeStr = obj.EndTime;
                    info.StartTimeStr = obj.StartTime;
                    info.name = obj.ProductName;
                    info.SalePrice = obj.SaleMoney;
                    info.MarketPice = obj.MarketPice;
                    info.path = obj.ProductPic;
                    info.UserLimit = obj.UserLimit;
                    info.OrderCount = obj.Count;
                    info.id = obj.MarketingEventId;
                  }
                }
              }
            }
          })
          that.setData({
            NIndex: DivContent
          });
        }).catch(function() { //没有活动
          that.setData({
            NIndex: DivContent
          });
        });

        that.setData({
          pageId: data.Info.Id,
          BgConfig: DiyContentConfig,
          PageConfig: PageConfig,
          ShareImg: data.Info.ShareImg,
          ShareTitle: data.Info.ShareTitle
        });
        wx.setNavigationBarTitle({
          title: data.Info.PageTitle || app.globalData.VendorInfo.ShopName
        });
        wx.setNavigationBarColor({
          frontColor: that.data.PageConfig.window.navigationBarTextStyle == 'white' ? '#ffffff' : '#000000',
          backgroundColor: that.data.PageConfig.window.navigationBarBackgroundColor
        })
      }

    });
  },
  getActiveInfo: function(DivContent) { //获取活动商品信息
    return new Promise(function(resolve, reject) {
      var val = {
        productId: []
      };
      for (var item of DivContent) {
        if (parseInt(item.adType) == 16) { //查找后台设置活动的，商品ID
          for (var info of item.ad16obj.data) {
            val.productId.push(info.did);
          };
        }
      }
      if (val.productId.length > 0) { //存在活动商品
        $.xsr($.makeUrl(api.GetMiniAppComponentSaleList, val), function(data) {
          if (data.Code == 0) {
            resolve(data);
          } else {
            reject();
          }
        });
      } else { //表示不存在活动商品
        reject();
      }
    });
  },
  GetPostsList: function() { //分页获取版块页面帖子列表接口
    var val = {
      operateId: app.globalData.VendorInfo.Id,
      pageIndex: this.data.pageIndex,
      userId: app.globalData.UserInfo.Id,
    }
    var that = this;
    $.xsr($.makeUrl(capi.GetPostsList, val), function(res) {
      if (res.Code == 0) {
        if (that.data.pageIndex == 1) {
          that.setData({
            MemberPostsList: res.Info,
            flag: true
          })
        } else {
          that.setData({
            MemberPostsList: that.data.MemberPostsList.concat(res.Info),
            flag: true
          })
        }
      } else {
        that.setData({
          flag: true,
          IsPage: false
        })
      }

    });
  },
  tplGoToPage: function(e) {
    var dataset = e.currentTarget.dataset;
    switch (parseInt(dataset.type)) {
      case 0: //预览图片
        console.log(dataset.imgurl);
        if (dataset.imgurl) {
          wx.previewImage({
            urls: [dataset.imgurl]
          })
        }
        break;
      case 1: //表示跳转到商品详情
        $.gopage('../productdetail/productdetail?pid=' + dataset.id);
        break;
      case 2: //表示跳转到分类页
        $.gopage('../productlist/productlist?cid=' + (dataset.id || 0) + '&cname=' + dataset.name);
        break;
      case 3: //搜索
        $.gopage('../productlist/productlist?pname=' + dataset.keyword);
        break;
      case 4: //直接跳地址
        //$.gopage(dataset.appurl);
        urlmap.urlmap(dataset.appurl);
        break;
      case 5: //直接跳地址
        //$.gopage(dataset.appurl);
        urlmap.urlmap(dataset.appurl);
        break;
      case 6: //直接跳地址
        //$.gopage(dataset.appurl);
        urlmap.urlmap(dataset.appurl);
        break;
      case 7: //跳转到小程序
        wx.navigateToMiniProgram({
          appId: dataset.appid,
          path: dataset.appurl || ""
        })
        break;
      case 8: //跳转二级页面
        $.gopage('../SecondaryPage/SecondaryPage?id=' + dataset.id);
        break;
      case 9:
        $.gopage('../webpage/webpage?u=' + dataset.appurl + "&tn=" + dataset.name + "&tc=" + dataset.appid + "&tb=" + dataset.keyword);
        break;
      case 10:
        $.gopage('../../community/plate/plate?id=' + dataset.id);
        break;
      case 11:
        $.gopage('../../community/tzparticulars/tzparticulars?id=' + dataset.id);
        break;
      case 12:
        wx.makePhoneCall({
          phoneNumber: dataset.name
        })
        break;
      case 17:
        this.getCoupon(dataset.id);
        break;
    }
  },
  returnTop: function() { //返回顶部
    this.setData({
      scposition: 0
    });
  },
  onShareAppMessage: function() {
    return {
      title: this.data.shareTitle,
      desc: this.data.shareImg,
      path: '/pages/DIYcontent/DIYcontent?id=' + app.globalData.UserInfo.Id
    }
  },
  scrollbottom: function(even) { //滚动到底部进行分页
 
    if (this.data.flag && this.data.IsPage) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        flag: true
      });
      // clearTimeout(time);
      // var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
      //   that.setData({
      //     pageIndex: parseInt(that.data.pageIndex) + 1
      //   });
      //   console.log("传入：", that.data.pageIndex);
      //   that.GetPostsList();
      // }, 500);
      that.setData({
        pageIndex: parseInt(that.data.pageIndex) + 1
      });
      // console.log("传入：", that.data.pageIndex);
      that.GetPostsList();
    }
  },
  searchinput: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../../community/Postalist/Postalist?sousuovalue=' + this.data.sousuovalue,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    that.setData({
      sousuovalue: ''
    });
  },
  sousuovalue: function(e) {
    var that = this;
    that.setData({
      sousuovalue: e.detail.value
    });
  },
  sousuobind: function(e) {
    var that = this;
    that.setData({
      sousuovalue2: that.data.sousuovalue
    });
  },
  bindscroll: function(e) {
    console.log(e.detail.scrollTop)
    var that = this;
    if (e.detail.scrollTop != 0) {
      //设置缓存
      wx.setStorage({
        key: 'key',
        //    缓存滑动的距离
        data: [e.detail.scrollTop],

      })
    }
    if (e.detail.scrollTop > 100) {
      that.setData({
        opacity: 1,
        background: "f1f1f1",
        istop: true
      });
    } else {
      that.setData({
        opacity: 0,
        background: 'fff',
        istop: false
      });
    }
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
      that.dianzan(e)
    } else {

    }
  },

  dianzan: function(e) { //帖子点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.dataset.id,
      niceName: app.globalData.UserInfo.NickName,
      userPhotoPath: app.globalData.UserInfo.Photo
    }
    // console.log(val);
    $.clearxsr($.makeUrl(capi.MemberPostsFabulous, val), function(res) {
      console.log(res)
      if (res.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.MemberPostsList.length; i++) {
          if (that.data.MemberPostsList[i].Id == e.currentTarget.dataset.id) {
            var thatObj = that.data.MemberPostsList[i];
            if (that.data.MemberPostsList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.MemberPostsList[i]);
          }
        }
        that.setData({
          MemberPostsList: newArray
        });
      }
    });
  },
  onGotUserInfo1: function (e) {
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
      that.canceldianzan(e)
    } else {

    }
  },

  canceldianzan: function(e) { //帖子取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      memberPostsId: e.currentTarget.dataset.id
    }
    $.clearxsr($.makeUrl(capi.CancelMemberPostsFabulous, val), function(res) {
      if (res.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.MemberPostsList.length; i++) {
          if (that.data.MemberPostsList[i].Id == e.currentTarget.dataset.id) {
            var thatObj = that.data.MemberPostsList[i];
            if (that.data.MemberPostsList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.MemberPostsList[i]);
          }
        }
        that.setData({
          MemberPostsList: newArray
        });
      }
    });
  },
  getCoupon: function(id) { //领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: id,
      UserId: app.globalData.UserInfo.Id,
      Code: 0,
      IsNewUser: 0
    }
    var that = this;
    if (id) {
      $.xsr($.makeUrl(userapi.UserReceiveCoupon, val), function(data) {
        if (data.Code == 0) {
          that.setData({
            isCancelSuccess: false,
            mskType: 2,
            Coupons: data.Info
          });
          wx.showToast({
            title: '领取成功！',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: data.Msg,
            icon: 'none'
          })
        }
      })
    }
  },
  cancelsuccess: function() { //领券成功取消
    this.setData({
      isCancelSuccess: true
    });
  }

})