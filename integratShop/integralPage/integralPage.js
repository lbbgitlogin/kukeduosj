// integratShop/integralPage/integralPage.js
var app = getApp()
var $ = require('../../utils/util.js');
var integraiAPI = require('../../api/integratShop.js');
var userapi = require('../../api/userAPI.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scposition: 0, //滚动条位置
    screenHeight: 37,
    nextflg: true, //是否可以进行下次分页
    // swiper组件控制
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    flag4:false,
    duration: 500,
    flag1:false,
    showHide: "", //控制轮播图显示
    three: "", //超值兑换和积分兑换
    forGoods: "", //仅有商品
    forConvertible: "", //仅有兑劵
    tabTrue: true, //超值与兑券切换
    commodityBox: "",
    couponItem: "none",
    sizerIsShow: "-1", //筛选
    hideShow: "hidden",
    IsTab: false,
    vipInfo: "", //会员信息
    mostParticipants: "", //最多参与人
    sizer: ["默认", "人气", "积分", "新品"], //筛选条件
    swithType: 1, //筛选条件默认值
    commodityList: [], //兑换商品列表
    Info: "", //获取商家积分兑换设置
    couponListityList: [], //积分兑券列表
    pageIndex: 1, //商品页数
    commodityPageIndex: 1, //兑换券商品
    minNum: null, //最小积分
    maxNUm: null, //最大积分
    flag: true, //优惠券弹窗
    Coupons: "", //优惠券详细信息
    Id: "", //优惠券id
    ispage: true, //商品是否还有数据
    ispageCon:true,//优惠券是否还有数据
    isquicknav: false,
    isnav: true,
    isShow: false,
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if ($.isNull(app.globalData.UserInfo)) {
    //   app.GetUserInfo(function() {
    //     that.setData({
    //       Currency: app.globalData.VendorInfo.Currency
    //     });
    //   }, options.uid, options.sid)
    // }


    var that = this;
    that.load()
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.onPullDownRefresh();
        that.findUsablePoint();
      }, options.uid, options.sid)
    } else {
      that.onPullDownRefresh();
       that.findUsablePoint();
    }

  },

  initialize: function() { // 获取商家积分兑换设置
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
    };
    $.xsr($.makeUrl(integraiAPI.GetVendorEPointSetting, val), function(res) {
      if (res.Code == 0) {
        if (res.Info.EPointSlideList.length <= 0) {
          that.setData({
            showHide: "none"
          })
        }
        var switchState = res.Info.ExchangeSwitchState;
        var forGoods = (switchState & 1) == 1; //仅有商品
        var forConvertible = (switchState & 2) == 2; //仅有兑劵
        var three = forGoods && forConvertible; //两个都有
        if (forGoods == false) {
          that.setData({
            tabTrue: false
          })
        }
        that.setData({
          Info: res.Info,
          forGoods: forGoods,
          forConvertible: forConvertible,
          three: three,
          isShow: true
        })

      } else {
        that.setData({
          isShow: true
        })
      }
    })
  },
  findUsablePoint: function() { //根据当前账户查询可用积分
    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id,
    };
    $.xsr($.makeUrl(integraiAPI.findUsablePoint, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          vipInfo: res.Info
        })
      }
    })
  },
  GetFavoriteEPointEventList: function() { //获取参与人次最多的兑换活动列表
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id
    };
    $.xsr($.makeUrl(integraiAPI.GetFavoriteEPointEventList, val), function(res) {
      console.log("res",res)
      if (res.Code == 0) {
        that.setData({
          mostParticipants: res.Info
        })
      }
    })
  },




  GetEPointProductList: function(pageIndex) { //获取积分兑换商品列表
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      swithType: that.data.swithType,
      minPoint: that.data.minNum,
      maxPoint: that.data.maxNum,
      pageSize: 10,
      pageIndex: pageIndex
    };
    $.xsr1($.makeUrl(integraiAPI.GetEPointProductList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          commodityList: that.data.commodityList.concat(res.Info),
          ispage: true
        })
      }
      if (res.Code == 1) {
        if (that.data.pageIndex > 1) {
          var pageIndex = that.data.pageIndex;
          pageIndex--;

        }
        that.setData({
          pageIndex: pageIndex,
          ispage: false
        })
      }
    })
  },

  GetEPointCouponList: function(commodityPageIndex) { //获取积分兑换优惠券列表
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      swithType: that.data.swithType,
      minPoint: that.data.minNum,
      maxPoint: that.data.maxNum,
      pageSize: 10,
      pageIndex: commodityPageIndex
    };
    $.xsr1($.makeUrl(integraiAPI.GetEPointCouponList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          couponListityList: that.data.couponListityList.concat(res.Info),
          ispageCon: true
        })
      } else {
        if (that.data.commodityPageIndex > 1) {
          var commodityPageIndex = that.data.commodityPageIndex;
          commodityPageIndex--;
        }
        that.setData({
          commodityPageIndex: commodityPageIndex,
          ispageCon: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      scposition: 0, //滚动条位置
      screenHeight: 37,
      nextflg: true, //是否可以进行下次分页
      // swiper组件控制
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      showHide: "", //控制轮播图显示
      three: "", //超值兑换和积分兑换
      forGoods: "", //仅有商品
      forConvertible: "", //仅有兑劵
      tabTrue: true, //超值与兑券切换
      commodityBox: "",
      couponItem: "none",
      sizerIsShow: "-1", //筛选
      hideShow: "hidden",
      IsTab: false,
      vipInfo: "", //会员信息
      mostParticipants: "", //最多参与人
      swithType: 1, //筛选条件默认值
      commodityList: [], //兑换商品列表
      Info: "", //获取商家积分兑换设置
      couponListityList: [], //积分兑券列表
      pageIndex: 1, //商品页数
      commodityPageIndex: 1, //兑换券商品
      minNum: null, //最小积分
      maxNUm: null, //最大积分
      flag: true, //优惠券弹窗
      Coupons: "", //优惠券详细信息
      Id: "", //优惠券id
      ispage: true, //是否还有数据
      isquicknav: false,
      isnav: true,
      isShow: false,
    })
    that.initialize();
    that.findUsablePoint();
    that.GetFavoriteEPointEventList();
    that.GetEPointCouponList(that.data.commodityPageIndex);
    that.GetEPointProductList(that.data.pageIndex);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.nextflg) { //判断是否可以进行下次分页
      var that = this;
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        if (that.data.tabTrue == true) {
          var pageIndex = that.data.pageIndex;
          pageIndex++
          that.setData({
            pageIndex: pageIndex
          });
          that.GetEPointProductList(that.data.pageIndex);
        }
        if (that.data.tabTrue == false) {
          var commodityPageIndex = that.data.commodityPageIndex;
          commodityPageIndex++
          that.setData({
            commodityPageIndex: commodityPageIndex
          });
          that.GetEPointCouponList(that.data.commodityPageIndex);
        }
      }, 500);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.ShareTitle,
      imageUrl: this.data.ShareImg || "",
      path: '/integratShop/integralPage/integralPage?uid=' + app.globalData.UserInfo.Id
    }
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
      that.details(e)
    } else {

    }
  },

  //商品详情
  details: function(e) {
    wx.navigateTo({
      url: '/integratShop/commodityDetails/commodityDetails?pid=' + e.currentTarget.id,
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
      that.exchangeCoupon(e)
    } else {

    }
  },

  /**兑换优惠劵 */
  exchangeCoupon: function(e) {
    var that = this;
    var couponId = e.currentTarget.dataset.id;
    that.setData({
      Id: couponId
    })
    if (e.currentTarget.dataset.showsucessbutton) {
      $.alert("来晚了，已兑完")
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认兑换？',
        success: function(res) {
         
          if (res.confirm) {
          
            var val = {
              vendorId: app.globalData.VendorInfo.Id,
              userId: app.globalData.UserInfo.Id,
              couponId: couponId
            }
            //积分兑换优惠券接口
            $.xsr($.makeUrl(integraiAPI.ExchangeCoupon, val), function(res) {
          
              if (res.Code == 0) {
                var couponListityList = that.data.couponListityList;
                for (var i = 0, len = couponListityList.length;i<len;i++){
                  if (couponId === couponListityList[i].CouponId){
                    couponListityList[i].Percentage =  res.Info[0].Percentage;
                  }
                }
                
                that.setData({
                  Coupons: res.Info[0],
                  couponListityList: couponListityList,
                  flag: false
                })

              } else {
                $.alert(res.Msg)
              }
            })
          }
        }
      })
    }

  },
  /** 筛选条件 */
  sizerCondition: function(e) {
    var that = this;
    that.setData({
      swithType: e.currentTarget.dataset.index
    })
  },

  /**帅选条件确定 */
  confirm: function(e) {
    var that = this;
    if (parseInt(e.detail.value.minNum) > parseInt(e.detail.value.maxNum)) {
      $.alert("请输入正确的积分区间")
      return
    }
    that.setData({
      IsTab: false,
      sizerIsShow: "-2",
      hideShow: "hidden",
      pageIndex: 1,
    })
    if (that.data.tabTrue == true) {
      var val = {
        vendorId: app.globalData.VendorInfo.Id,
        swithType: that.data.swithType,
        minPoint: parseInt(e.detail.value.minNum),
        maxPoint: parseInt(e.detail.value.maxNum),
        pageSize: 10,
        pageIndex: that.data.pageIndex
      }
      $.xsr($.makeUrl(integraiAPI.GetEPointProductList, val), function(res) {
        if (res.Code == 0) {
          if (res.Info.length > 0) {
            that.setData({
              commodityList: []
            })
          }
          if (res.Info.length > 0) {
            that.setData({
              commodityList: that.data.commodityList.concat(res.Info),
              minNum: parseInt(e.detail.value.minNum),
              maxNum: parseInt(e.detail.value.maxNum)
            })
          }
        } else {
          setTimeout(function() {
            wx.showModal({
              title: '提示',
              content: "抱歉，没有找到符合条件的商品，请重新筛选",
              showCancel: false,
            })
          }, 650)
        }
      })
    }
    if (that.data.tabTrue == false) {
      var val = {
        vendorId: app.globalData.VendorInfo.Id,
        swithType: that.data.swithType,
        minPoint: parseInt(e.detail.value.minNum),
        maxPoint: parseInt(e.detail.value.maxNum),
        pageSize: 10,
        commodityPageIndex: that.data.pageIndex
      }
      that.setData({
        commodityPageIndex: 1,
      })

      $.xsr($.makeUrl(integraiAPI.GetEPointCouponList, val), function(res) {
        if (res.Code == 0) {
          if (res.Info.length > 0) {
            that.setData({
              couponListityList: []
            })
          }
          if (res.Info.length > 0) {
            that.setData({
              couponListityList: that.data.couponListityList.concat(res.Info),
              minNum: parseInt(e.detail.value.minNum),
              maxNum: parseInt(e.detail.value.maxNum)
            })
          }
        } else {
          setTimeout(function() {
            wx.showModal({
              title: '提示',
              content: "抱歉，没有找到符合条件的优惠券，请重新筛选",
              showCancel: false,
            })
          }, 650)
        }
      })
    }
  },

  /**重置 */
  reset: function() {
    this.setData({
      swithType: 1,
      minNum: null,
      maxNum: null
    })
    this.GetEPointProductList(this.data.pageIndex)
    this.GetEPointCouponList(this.data.commodityPageIndex)
  },


  outertouch: function() { //关闭优惠券弹窗
    this.setData({
      flag: true
    });
  },
  vipImg: function() {
    wx.navigateTo({
      url: '/pages/member/member',
    })
  },
  innertouch: function() { //打开优惠券弹窗
    this.setData({
      flag: false
    });
  },

  /**轮播图页面跳转 */
  skip: function(e) {
    if (e.currentTarget.dataset.imgurl != "") {
      var that = this;
      var imgUrl = e.currentTarget.dataset.imgurl
      $.goToTabBar(null, "../../" + e.currentTarget.dataset.imgurl);
    }
  },

  /**sizeTab 筛选 */
  sizeTab: function() {
    if (this.data.IsTab) {
      this.setData({
        IsTab: false,
        sizerIsShow: "-2",
        hideShow: "hidden"
      })
    } else {
      this.setData({
        IsTab: true,
        sizerIsShow: "2",
        hideShow: ""
      })
    }
  },

  /**tab切换 */
  forTab: function(e) {
    var tabTrue = this.data.tabTrue;
    var dataType = e.currentTarget.dataset.type;
    if (dataType == 1) {
      this.setData({
        tabTrue: true
      })
    }
    if (dataType == 2) {
      this.setData({
        tabTrue: false
      })
    }
    if (tabTrue && dataType == 1) {
      this.setData({
        commodityBox: "none",
        couponItem: "",
      })
    }
    if (tabTrue == false && dataType == 2) {
      this.setData({
        commodityBox: "",
        couponItem: "none",
      })
    }
  },
  onGotUserInfo9: function (e) {

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
      that.click()
    } else {

    }
  },
  click: function () {

    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id
    }
    console.log("签到", val)
    $.xsr1($.makeUrl(userapi.settingAttendancePoint, val), function (data) {
      console.log("签到", data)
      that.setData({
        Info1: data.Info
      });
      if (data.Info.flag) {
        that.setData({
          flag3: true
        })
        setTimeout(function () {
          that.setData({
            flag3: false
          })
        }, 2000);
        that.findUsablePoint();
      } else {
        that.setData({
          flag4: true
        })
        setTimeout(function () {
          that.setData({
            flag4: false
          })
        }, 2000);
      }
      that.load()
    });
  },
  load: function () {
    var that = this
    that.setData({
      UserInfo: app.globalData.UserInfo,
    })
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id,
    }
    $.xsr1($.makeUrl(userapi.findUsablePoint, val), function (data) {
      console.log("基本信息", data);
      that.setData({
        message: data.Info,
        isColor: data.Info.HasRegisteredAttendance
      });
    });
  },
  scrollbottom: function(even) { //滚动到底部进行分页
    if (this.data.nextflg) { //判断是否可以进行下次分页
      var that = this;
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        if (that.data.tabTrue == true) {
          var pageIndex = that.data.pageIndex;
          pageIndex++
          that.setData({
            pageIndex: pageIndex
          });
          that.GetEPointProductList(that.data.pageIndex);
        }
        if (that.data.tabTrue == false) {
          var commodityPageIndex = that.data.commodityPageIndex;
          commodityPageIndex++
          that.setData({
            commodityPageIndex: commodityPageIndex
          });
          that.GetEPointCouponList(that.data.commodityPageIndex);
        }
      }, 500);
    }
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

  //快捷导航
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
    }, 250)
  },

})