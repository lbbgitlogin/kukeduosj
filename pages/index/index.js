var app = getApp()
var $ = require('../../utils/util.js');
var pdapi = require('../../api/productAPI.js');
var userapi = require('../../api/userAPI.js');
var api = require('../../api/indexAPI.js');
var cartapi = require('../../api/cartAPI.js');
var notice = require('../../utils/notice.js');
var urlmap = require('../../utils/urlmap.js');
var homeads = require('../../utils/home-ads.js');
var thatProm = {
  ProductInfo: {},
  addCar: false,
  count: 0,
  windowHeight: 0, //获取窗口高度
  categoryname: '', // 分类第六套模板
  click6: true, //点击购物车 第六套模板
  cid: 0, //第六套模板保存当前分类id
  cartlist: {}, //第六套模板购物车
  isdata: false, //是否加载第六套bottombar
  Sel_Id: [], //选中的的ID
  tapindex: 1, //当前选项
  viewtype: 0, //视图展示方式
  shopinfo: {}, //店铺信息
  pdlist: [], //商品列表
  sort: 2, //排序方式
  ispage: true, //是否还有数据 
  flag: true, //是否可以进行下次分页
  distance: 0,
  istop: false,
  TemplateKey: "",
  smallCategory: {},
  AdContent: {},
  couponlist: {},
  post: { //请求数据
    storeID: 0,
    orderby: 1, //排序条件
    sort: 2, //排序方式方式，默认降序
    isnew: false, //是否是上新商品
    pageindex: 1 //当前页
  },
  formdate: "",
  pageId: 0,
  sendInfo: {},
}

Page({
  data: {
    Coupons: [],
    isCancelSuccess: true, //新手礼包领取成功取消
    isCancel: true, //新手礼包取消
    CouponAmount: 0,
    IsNewUser: 0,
    NIndex: [],
    BgConfig: {},
    TemplateKey: "",
    commonTPL: thatProm,
    indexArray: [],
    splist: [], //选择的规格列表
    splistStr: [], //选择的规格列表名称
    pid: 0,
    index: 0,
    ShareImg: '', //分享的图片
    ShareTitle: '', //分享的标题
    refresh: true,
    homeAds: null,
    mskAds: null,
    mskType: 1,
    TotalPrice: 0
  },

  onLoad: function(options) {
   
    var that = this;
    wx.hideTabBar();
    app.GetUserInfo(function() {
      thatProm.shopinfo = app.globalData.VendorInfo;
      that.setData({
        IsNewUser: app.globalData.UserInfo.IsNewUser,
        CouponAmount: app.globalData.UserInfo.CouponAmount,
        Currency: app.globalData.VendorInfo.Currency,
        commonTPL: thatProm
      });
      that.GetTakeoutTemplateCouponList()
      //获取店铺信息
      wx.setNavigationBarTitle({
        title: app.globalData.VendorInfo.ShopName
      });
      console.log(app.globalData.UserInfo.IsNewUser);
    }, options.uid, options.sid, function() {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      });
      that.GetAdContent();
      homeads.homeAdvertising(that);
    });
    notice.addNotification("RefreshProduct", that.RefreshProduct, that);
    try {
      thatProm.windowHeight = wx.getSystemInfoSync().windowHeight - 50;
      this.setData({
        commonTPL: thatProm
      })
    } catch (e) {
      console.log(' Do something when catch error', e);
    }
  },
  ckLabel: function(e) {

  },
  getDivModel: function(res) {
    var that = this;
    var DivContent = $.parseJSON(res.DivContent),
      DiyContentConfig = $.parseJSON(res.DiyContentConfig),
      PageConfig = $.parseJSON(res.PageConfig);

    that.getActiveInfo(DivContent).then(function(data) { //有活动，查询活动信息
      wx.stopPullDownRefresh();
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
      pageId: res.Id,
      BgConfig: DiyContentConfig,
      PageConfig: PageConfig,
      ShareImg: res.ShareImg,
      ShareTitle: res.ShareTitle
    });
    wx.setNavigationBarTitle({
      title: res.PageTitle || app.globalData.VendorInfo.ShopName
    });
    wx.setNavigationBarColor({
      frontColor: that.data.PageConfig.window.navigationBarTextStyle == 'white' ? '#ffffff' : '#000000',
      backgroundColor: that.data.PageConfig.window.navigationBarBackgroundColor
    })
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
        $.clearxsr($.makeUrl(api.GetMiniAppComponentSaleList, val), function(data) {
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
  RefreshProduct: function(e) {
    if (e) {
      this.setData({
        refresh: true
      });
    } else {
      this.setData({
        refresh: false
      });
    }
  },
  initData: function() {
    var thisobj = this;
    var val = {
      storeID: app.globalData.VendorInfo.Id
    }
    $.clearxsr($.makeUrl(pdapi.GetSmallCategory, val), function(data) {
      console.log("测试",data)
      thatProm.smallCategory = data.Info;
      if (thatProm.smallCategory.length > 0) {
        thatProm.cid = thatProm.smallCategory[0].id;
        thatProm.categoryname = thatProm.smallCategory[0].name;
      }
      thisobj.setData({
        commonTPL: thatProm
      });
      if (thatProm.TemplateKey == "shop6") {
        thisobj.ckallPD();
        thisobj.getcartlist(); //第六套模板刷新界面
      }

      wx.stopPullDownRefresh();
    });
  },
  GetVendorLogisticsSetting: function() {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id
    }
    $.clearxsr($.makeUrl(api.GetVendorLogisticsSetting, val), function(data) {
      thatProm.sendInfo = data.Info;
      that.setData({
        commonTPL: thatProm,
      })
    });
  },
  onShow: function() {
    if (thatProm.TemplateKey == "shop6" && this.data.refresh) {
      this.getcartlist(); //第六套模板刷新界面
      this.ckallPD();
      thatProm.click6 = true;
    }

    if (!this.data.refresh) {
      this.setData({
        refresh: true
      });
    }
    // this.GetVendorLogisticsSetting()
  },
  ckhome: function() { //点击首页
    thatProm.tapindex = 1;
    this.setData({
      commonTPL: thatProm
    });
  },


  ckallPD6: function(e) { //全部商品第六套模板获取数据 和上新 点击左侧小分类获取数据 
    thatProm.pdlist = [];
    var isnew6;
    if (thatProm.tapindex == 2) { //全部商品
      isnew6 = false;
    } else if (thatProm.tapindex == 3) { //上新
      isnew6 = true;
    }
    thatProm.categoryname = e.target.dataset.name;
    thatProm.cid = e.target.dataset.id;
    thatProm.post = {
      cid: e.target.dataset.id,
      storeID: app.globalData.VendorInfo.Id,
      orderby: 1,
      sort: 2,
      isnew: isnew6,
      pageindex: 1,
      userAccount: app.globalData.UserInfo.UserName
    }

    this.setData({
      commonTPL: thatProm
    });
    this.GetPlistTakeAway();
  },

  ckallPD: function() { //点击全部商品
    thatProm.tapindex = 2;
    thatProm.pdlist = [];
    if (thatProm.TemplateKey == "shop6") {
      thatProm.post = {
        cid: thatProm.cid,
        storeID: app.globalData.VendorInfo.Id,
        orderby: 1,
        sort: 2,
        isnew: false,
        pageindex: 1,
        userAccount: app.globalData.UserInfo == null ? '' : app.globalData.UserInfo.UserName
      }
      this.setData({
        commonTPL: thatProm
      });
      this.GetPlistTakeAway();
    } else {
      thatProm.post = {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 1,
        sort: 2,
        isnew: false,
        pageindex: 1
      }
      this.setData({
        commonTPL: thatProm
      });
      this.GetPlist();
    }

  },

  cknewPD: function() { //点击上新
    thatProm.tapindex = 3;
    thatProm.pdlist = [];
    if (thatProm.TemplateKey == "shop6") {
      thatProm.post = {
        cid: thatProm.cid,
        storeID: app.globalData.VendorInfo.Id,
        orderby: 1,
        sort: 2,
        isnew: true,
        pageindex: 1,
        userAccount: app.globalData.UserInfo.UserName,
        storeID: app.globalData.VendorInfo.Id
      }
      this.setData({
        commonTPL: thatProm
      });
      this.GetPlistTakeAway(); //根据上新时间查询商品
    } else {
      thatProm.post = {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 2,
        sort: 2,
        isnew: true,
        pageindex: 1
      }
      this.setData({
        commonTPL: thatProm
      });
      this.GetPlist(); //根据上新时间查询商品
    }
  },
  ckinfo: function() { //点击店铺介绍
    thatProm.tapindex = 4;
    this.setData({
      commonTPL: thatProm
    });
  },
  viewType: function() { //切换商品列表展示方式
    if (thatProm.viewtype == 0) {
      thatProm.viewtype = 1;
    } else {
      thatProm.viewtype = 0;
    }
    this.setData({
      commonTPL: thatProm
    });
  },
  sealnum: function() { //根据销量排序
    thatProm.pdlist = [];
    thatProm.post = {
      storeID: app.globalData.VendorInfo.Id,
      orderby: 1,
      sort: 2,
      isnew: false,
      pageindex: 1
    }
    this.setData({
      commonTPL: thatProm
    });
    this.GetPlist(); //根据销量查询商品
  },
  newpd: function() { //根据上架时间排序
    thatProm.pdlist = [];
    thatProm.post = {
      storeID: app.globalData.VendorInfo.Id,
      orderby: 2,
      sort: 2,
      isnew: false,
      pageindex: 1
    }
    this.setData({
      commonTPL: thatProm
    });
    this.GetPlist(); //根据上架时间查询商品
  },
  pdprice: function() { //根据价格排序
    if (thatProm.sort == 1) {
      thatProm.pdlist = [];
      thatProm.sort = 2;
      thatProm.post = {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 3,
        sort: 2,
        isnew: false,
        pageindex: 1
      }
    } else {
      thatProm.pdlist = [];
      thatProm.sort = 1;
      thatProm.post = {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 3,
        sort: 1,
        isnew: false,
        pageindex: 1
      }
    }
    this.setData({
      commonTPL: thatProm
    });
    this.GetPlist(); //根据价格排序
  },
  scrollbottom: function(even) { //滚动到底部进行分页
    if (thatProm.flag) { //判断是否可以进行下次分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        thatProm.post.pageindex = thatProm.post.pageindex + 1;
        thisobj.setData({
          commonTPL: thatProm
        });

        if (thatProm.TemplateKey == "shop6") {
          thisobj.GetPlistTakeAway(); //第六套模板全部商品
        } else {
          thisobj.GetPlist(); //其他情况
        }

      }, 500);
    }
  },
  GetPlist: function() { //获取商品列表统一方法
    thatProm.flag = false;
    this.setData({
      commonTPL: thatProm
    });
    var that = this;
    $.clearxsr($.makeUrl(pdapi.GetProductList, thatProm.post), function(res) {
      if (res.Info.length > 0) {
        if (thatProm.post.pageindex == 1 && res.Info.length < 10) {
          thatProm.pdlist = thatProm.pdlist.concat(res.Info);
          thatProm.flag = false;
          thatProm.ispage = false;
        } else {
          thatProm.pdlist = thatProm.pdlist.concat(res.Info);
          thatProm.flag = true;
          thatProm.ispage = true;
        }
      } else {
        thatProm.flag = false;
        thatProm.ispage = false;
      }
      that.setData({
        commonTPL: thatProm
      });
    });
  },
  GetTakeoutTemplateCouponList:function() {//外卖模板  获取优惠券信息
    var thisobj = this;
    thisobj.setData({
      commonTPL: thatProm
    })
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
    }
    $.clearxsr($.makeUrl(pdapi.GetTakeoutTemplateCouponList, val), function (data) {
     console.log("领取信息：",data)
      thatProm.couponlist = data.Info;

    });
  },
  nav_co:function(){ //外卖模板跳转领券中心
    wx.navigateTo({
      url: '../receivecontent/receivecontent'
    
    })

  },
  GetPlistTakeAway: function() { //获取商品列表统一方法 第六套模板
    thatProm.flag = false;
    thatProm.isNull=0;
    this.setData({
      commonTPL: thatProm
    });
    var that = this;
    $.xsr1($.makeUrl(pdapi.GetProductListByPositionForTakeAway, thatProm.post), function(res) {
      if (res.Info.length > 0) {
        if (thatProm.post.pageindex == 1 && res.Info.length < 10) {
          thatProm.pdlist = thatProm.pdlist.concat(res.Info);
          thatProm.flag = false;
          thatProm.ispage = false;
        } else {
          thatProm.pdlist = thatProm.pdlist.concat(res.Info);
          thatProm.flag = true;
          thatProm.ispage = true;
        }
        thatProm.isNull = 1;
      } else {
        thatProm.flag = false;
        thatProm.ispage = false;
        thatProm.isNull = 2;
      }
      that.setData({
        commonTPL: thatProm
      });
    });
  },
  scrollView: function(e) { //滚动到顶部
    if (e.detail.deltaY < -305) {
      thatProm.distance = e.detail.deltaY;
      thatProm.istop = true;
      this.setData({
        commonTPL: thatProm
      });
    }
  },
  scrollTop: function() {
    thatProm.istop = false;
    this.setData({
      commonTPL: thatProm
    });
  },
  retruntop: function() {
    thatProm.distance = 0;
    this.setData({
      commonTPL: thatProm
    });
  },
  onShareAppMessage: function() {
    return {
      title: this.data.ShareTitle,
      imageUrl: this.data.ShareImg || "",
      path: '/pages/index/index?uid=' + app.globalData.UserInfo.Id
    }
  },
  onPullDownRefresh: function() {
    thatProm.pdlist = [];
    this.setData({
      indexArray: []
    });
    // this.initData();
    this.GetAdContent();
  },
  GetAdContent: function() { //获取店铺模版
    var that = this;
    this.GetMinAppHomeTemplate().then(function(res) {
      thatProm.TemplateKey = res.TemplateKey;
      thatProm.AdContent = res.TemplateData.HomeContents || '';
      that.setData({
        AdContent: res.TemplateData.HomeContents || '',
        TemplateKey: res.TemplateKey,
        commonTPL: thatProm,
      });
      // if (thatProm.smallCategory.length > 0 && thatProm.TemplateKey == "shop6") {
      //   thatProm.tapindex = 2;
      //   that.ckallPD();
      // }
      if (thatProm.TemplateKey == "shop6" || thatProm.TemplateKey == "shop1") {
        that.initData();
      }
      if (thatProm.TemplateKey == "shop6") { //获取购物车信息--》shop6
        that.getcartlist();
      }
      if (thatProm.TemplateKey == "shop7") {
        that.getDivModel(res.TemplateData);
      }
      wx.stopPullDownRefresh();
    });
  },
  sao: function() {
    wx.scanCode({
      success: function(data) {

        var resultsp = data.result.split("=");
        if (resultsp.length > 2 || resultsp.length < 2) {
          $.alert("无法识别")
        } else {
          if (resultsp[0] == "productId") {
            if ($.isNull(resultsp[1])) {
              $.alert("无法识别")
            } else {
              $.gopage("../productdetail/productdetail?pid=" + resultsp[1]);
            }
          } else if (resultsp[0] == "eventId") {
            if ($.isNull(resultsp[1])) {
              $.alert("无法识别")
            } else {
              $.gopage("../activitycheckin/activitycheckin?eventId=" + resultsp[1]);
            }
          } else {
            $.alert("无法识别")
          }
        }
      },
      fail: function(data) {
        $.alert("无法识别")
      }
    });
  },

  receivenow: function() { //领取新手大礼包
    this.setData({
      isCancel: false
    });
    this.userReceiveCoupon();
  },
  cancel: function() { //新手礼包取消
    this.setData({
      isCancel: false,
      IsNewUser: 0
    });
  },
  cancelsuccess: function() { //领券成功取消
    this.setData({
      isCancelSuccess: true,
      IsNewUser: 0
    });
  },

  innertouch: function() {}, //事件拦截

  userReceiveCoupon: function() { //用户领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: '',
      UserId: app.globalData.UserInfo.Id,
      IsNewUser: app.globalData.UserInfo.IsNewUser //新用户为1 老用户为0 
    }
    var that = this;
    $.clearxsr($.makeUrl(userapi.UserReceiveCoupon, val), function(data) {
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

  shoppingcarclicked: function() {
    if (thatProm.cartlist.Total > 0) {
      thatProm.click6 = !thatProm.click6;
      this.setData({
        commonTPL: thatProm
      });
    }

  },
  cancelwindow: function() {
    thatProm.click6 = true;
    this.setData({
      commonTPL: thatProm
    });
  },


  getcartlist: function() { //获取购物车
    var thisobj = this;
    var val = {
      storeID: app.globalData.VendorInfo.Id,
      userName: app.globalData.UserInfo.UserName
    }
    $.clearxsr($.makeUrl(cartapi.GetCartList, val), function(data) {
      // thisobj.ckalllength(data);
      thatProm.cartlist = data.Info;
      thatProm.isdata = true;
      thisobj.setData({
        commonTPL: thatProm,
        // TotalPrice: data.Info.TotalPrice
      });
    });
    this.GetVendorLogisticsSetting()
  },
  sub: function(even) { //减数量
    var val = {
      btntype: 2,
      numval: even.currentTarget.dataset.num,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock,
      pid: even.currentTarget.dataset.pid
    }
    this.unifiedNum(val);
  },
  add: function(even) { //加数量
    var val = {
      btntype: 1,
      numval: even.currentTarget.dataset.num,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock,
      pid: even.currentTarget.dataset.pid
    }
    this.unifiedNum(val);
  },

  unifiedNum: function(val) { //统一判断
    var thisobj = { //接收的临时变量
      value: parseInt(val.numval),
      stock: parseInt(val.stock)
    }
    if (val.btntype == 1) { //表示加数量
      thisobj.value = thisobj.value + 1;
    }
    if (val.btntype == 2) { //表示减数量
      thisobj.value = thisobj.value - 1;
    }
    if (thisobj.value > thisobj.stock) { //是否大于最大值
      $.alert("没有库存啦");
      thisobj.value = thisobj.stock;
      return;
    }
    if (thisobj.value <= 0) { //表示等于0
      this.delcart(val);
      return;
    }
    var postval = {
      VID: app.globalData.VendorInfo.Id,
      UID: app.globalData.UserInfo.UserName,
      CID: val.CID,
      Num: thisobj.value
    }
    var thiso = this;
    $.xsr1($.makeUrl(cartapi.SetSetCartNum, postval), function(data) {
      if (data.Info[0]) {
        thiso.getcartlist();

        for (var i = 0; i < thatProm.pdlist.length; i++) {
          if (thatProm.pdlist[i].id == val.pid) {
            if (val.btntype == 1) { //加
              thatProm.pdlist[i].UserShoppingCartCount = thatProm.pdlist[i].UserShoppingCartCount + 1;
              break;
            } else if (val.btntype == 2) { //减
              thatProm.pdlist[i].UserShoppingCartCount = thatProm.pdlist[i].UserShoppingCartCount - 1;
              break;
            }
          }
        }
        thiso.setData({
          commonTPL: thatProm
        });
      }
    });
  },

  subcontent: function(even) { //减数量
    var val = {
      amount: -1,
      productId: even.currentTarget.dataset.pid,
      productName: even.currentTarget.dataset.pname,
      productSkuId: even.currentTarget.dataset.skuid,
      userAccount: app.globalData.UserInfo.UserName,
      vendorId: app.globalData.VendorInfo.Id,
      btntype: 2,
      index: even.currentTarget.dataset.index
    }
    this.addCard(val);
  },
  subcontentsp: function(even) { //减数量
    var val = {
      amount: -1,
      productId: even.currentTarget.dataset.pid,
      productName: even.currentTarget.dataset.pname,
      productSkuId: even.currentTarget.dataset.skuid,
      userAccount: app.globalData.UserInfo.UserName,
      vendorId: app.globalData.VendorInfo.Id,
      btntype: 2,
      index: this.data.index
    }
    this.addCard(val);
  },
  addcontent: function(even) { //加数量
    var val = {
      amount: 1,
      productId: even.currentTarget.dataset.pid,
      productName: even.currentTarget.dataset.pname,
      productSkuId: even.currentTarget.dataset.skuid,
      userAccount: app.globalData.UserInfo.UserName,
      vendorId: app.globalData.VendorInfo.Id,
      btntype: 1,
      index: even.currentTarget.dataset.index
    }
    if (even.currentTarget.dataset.stock == thatProm.pdlist[val.index].UserShoppingCartCount) {
      $.alert("没有库存啦");
      return;
    }
    this.addCard(val);
  },

  addcontentsp: function(even) { //加数量
    var val = {
      amount: 1,
      productId: even.currentTarget.dataset.pid,
      productName: even.currentTarget.dataset.pname,
      productSkuId: even.currentTarget.dataset.skuid,
      userAccount: app.globalData.UserInfo.UserName,
      vendorId: app.globalData.VendorInfo.Id,
      btntype: 1,
      index: this.data.index
    }
    if (even.currentTarget.dataset.stock == thatProm.pdlist[val.index].UserShoppingCartCount) {
      $.alert("没有库存啦");
      return;
    }
    this.addCard(val);
  },

  addCard: function(val) { //加入购物车
    var thisval = this;
    if (thatProm.pdlist[val.index].UserShoppingCartCount == 0 && val.btntype == 2) { //防止-1
      return;
    }
    $.xsr1($.makeUrl(cartapi.AddShoppingCartForTakeAway, val), function(data) {
      if (data.Code == 0) {
        if (val.btntype == 1) { //加
          thatProm.pdlist[val.index].UserShoppingCartCount = thatProm.pdlist[val.index].UserShoppingCartCount + 1;
          if (thatProm.count >= 0) {
            thatProm.count++;
          }
        } else if (val.btntype == 2) { //减
          thatProm.pdlist[val.index].UserShoppingCartCount = thatProm.pdlist[val.index].UserShoppingCartCount - 1;
          if (thatProm.count > 0) {
            thatProm.count--;
          }
        }
        thisval.setData({
          commonTPL: thatProm
        });
        thisval.getcartlist();
      } else {
        $.alert(data.Msg);
      }
    });
  },

  delcart: function(val) { //删除购物车
    if (thatProm.cartlist.Total == 1) {
      thatProm.click6 = true;
      this.setData({
        commonTPL: thatProm
      });
    }
    var thisobj = this;
    var val1 = {
      SptrId: val.CID
    }
    $.xsr1($.makeUrl(cartapi.DelCartItem, val1), function(data) {
      thisobj.getcartlist();
      for (var i = 0; i < thatProm.pdlist.length; i++) {
        if (thatProm.pdlist[i].id == val.pid) {
          thatProm.pdlist[i].UserShoppingCartCount = thatProm.pdlist[i].UserShoppingCartCount - 1;
          break;
        }
      }
      thisobj.setData({
        commonTPL: thatProm
      });
    });
  },
  delAll: function() { //删除选中商品
    this.clearshoppingcar();
    var val = {
      SptrId: thatProm.Sel_Id.toString()
    }
    var that = this;
    $.xsr1($.makeUrl(cartapi.DelCartItem, val), function(data) {
      that.getcartlist();
      for (var x in thatProm.pdlist) {
        thatProm.pdlist[x].UserShoppingCartCount = 0;
      }
      thatProm.count = 0;
      that.setData({
        commonTPL: thatProm
      });
    });
  },

  clearshoppingcar: function() {
    var that = this;
    var selid = [];
    var thisobj = thatProm.cartlist.VendorList[0].ShoppingCartList;
    for (var x in thisobj) {
      if (thisobj[x].IsCheck) { //记录选择个数
        selid.push(thisobj[x].Id);
      }
    }
    thatProm.Sel_Id = selid;
    thatProm.click6 = true;
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
      that.submitorder()
    } else {

    }
  },
  submitorder: function() { //去结算
    if (thatProm.cartlist.Total > 0) {
      wx.navigateTo({
        url: "../ordersubmit/ordersubmit"
      });
    } else {
      wx.showModal({
        title: '提示',
        content: "请选择需要结算商品！",
        showCancel: false,
      });
    }
  },
  selectsp: function(even) { //选择规格
    var spobj = {
      spid: even.target.dataset.spid, //此次选择的规格ID
      ckid: even.target.dataset.ckid //上次点击的规格规格ID
    }
    var sparray = []; //中间变量，最终接收到的是替换过后的数组
    var thissparray = this.data.splist; //初始保存的规格IDID
    for (var x in thissparray) {
      if (thissparray[x] == spobj.ckid) {
        sparray.push(parseInt(spobj.spid));
      } else {
        sparray.push(parseInt(thissparray[x]));
      }
    }
    this.setData({
      splist: sparray,
      splistStr: []
    });
    var val = {
      proId: this.data.pid,
      Spec: JSON.stringify(this.data.splist).replace("[", "").replace("]", ""),
      eventId: this.data.eventId
    }
    var that = this;
    //开始请求数据数据
    $.xsr1($.makeUrl(pdapi.GetProductlistSpc, val), function(data) {
      if (!$.isNull(data.Info[0].SpecLst)) {
        for (var x in data.Info[0].SpecLst) { //筛选出已经选择的规格
          for (var m in data.Info[0].SpecLst[x].svLst) {
            if (data.Info[0].SpecLst[x].svLst[m].IsChecked) {
              data.Info[0].SpecLst[x].ckid = data.Info[0].SpecLst[x].svLst[m].Id; //保存选择的规格ID到最外面，后面对选择规格的替有用
              that.data.splist.push(data.Info[0].SpecLst[x].svLst[m].Id);
              that.data.splistStr.push(data.Info[0].SpecLst[x].svLst[m].Name);
            };
          }
        }
      }
      thatProm.ProductInfo = data.Info[0];
      that.setData({
        commonTPL: thatProm
      });
      that.searchcarcount(thatProm.ProductInfo.ProductSKU_Id);

    });
  },

  InitProduct: function(even) { //初始化商品
    thatProm.addCar = true;
    this.setData({
      commonTPL: thatProm,
      pid: even.target.dataset.pid,
      index: even.target.dataset.index
    });
    var that = this;
    var val = {
      userName: app.globalData.UserInfo.UserName,
      proId: even.target.dataset.pid
    }
    this.setData({
      splist: [],
      splistStr: []
    })
    $.xsr1($.makeUrl(pdapi.GetProductInfo, val), function(data) {
      if (data.Code > 0) {
        that.setData({
          isdata: false
        });
      } else {
        if (data.Info[0].SpecLst.length > 0) {
          for (var x in data.Info[0].SpecLst) { //筛选出已经选择的规格
            for (var m in data.Info[0].SpecLst[x].svLst) {
              if (data.Info[0].SpecLst[x].svLst[m].IsChecked) {
                data.Info[0].SpecLst[x].ckid = data.Info[0].SpecLst[x].svLst[m].Id; //保存选择的规格ID到最外面，后面对选择规格的替有用
                that.data.splist.push(data.Info[0].SpecLst[x].svLst[m].Id);
                that.data.splistStr.push(data.Info[0].SpecLst[x].svLst[m].Name);
              };
            }
          }
        }
        thatProm.ProductInfo = data.Info[0];
        that.setData({
          commonTPL: thatProm
        });
        that.searchcarcount(thatProm.ProductInfo.ProductSKU_Id);

      }
    });
  },

  closeaddcar: function() { //关闭选规格
    thatProm.addCar = false;
    this.setData({
      commonTPL: thatProm
    });
  },

  searchcarcount: function(skuid) {
    if (!$.isNull(thatProm.cartlist.VendorList)) {
      thatProm.count = 0;
      for (var i = 0; i < thatProm.cartlist.VendorList[0].ShoppingCartList.length; i++) {
        if (thatProm.cartlist.VendorList[0].ShoppingCartList[i].ProductSKU_Id == skuid) {
          thatProm.count = thatProm.cartlist.VendorList[0].ShoppingCartList[i].Amount
        }
      }
      this.setData({
        commonTPL: thatProm
      });
    }
  },

  callTel: function(e) { //打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
      success: function(res) {

      },
      fail: function(res) {

      }
    })
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
  bindDateChange: function(e) {
    var that = this;
    var thatdata = that.data.NIndex;
    for (var i = 0; i < thatdata.length; i++) {
      if (thatdata[i].adType == 13) {
        var ad13objData = thatdata[i].ad13obj.data;
        for (var j = 0; j < ad13objData.length; j++) {
          if (ad13objData[j].id == e.target.dataset.id) {
            ad13objData[j].name = e.detail.value;
          }
        }
      }
    }
    this.setData({
      NIndex: thatdata
    })
  },
  formSubmit: function(e) {
    var that = this,
      num = 1;
    var subData = []; //需要提交的表单值
    for (var i = 0; i < that.data.NIndex.length; i++) {
      if (that.data.NIndex[i].adType == 13) {
        num = that.data.NIndex[i].ad13obj.submitNum;
        var ad13objData = that.data.NIndex[i].ad13obj.data;
        for (var j = 0; j < ad13objData.length; j++) {
          var thatVal = e.detail.value[ad13objData[j].id], //当前的值
            isFillIn = ad13objData[j].isFillIn, //是否必填
            thatKey = ad13objData[j].labelText,
            thatId = ad13objData[j].id,
            subObj = {}, //提交的值 {"键":"值"}
            flag = true;
          if (ad13objData[j].type == 2) {
            if (isFillIn) {
              if (!$.isNull(ad13objData[j].name)) {
                thatVal = ad13objData[j].name;
                flag = true;
              } else {
                $.confirm(ad13objData[j].placeholderText);
                flag = false;
                return false;
              }
            } else {
              if (!$.isNull(ad13objData[j].name)) {
                thatVal = ad13objData[j].name;
              }
              flag = true;
            }
          } else {
            if (isFillIn) {
              if (!$.isNull(thatVal)) { //检查是否为空
                if (ad13objData[j].isVerification > 0) { //是否开启验证
                  if (ad13objData[j].isVerification == 1) { //手机验证
                    if ((/^1[34578]\d{9}$/.test(thatVal))) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的手机号码！");
                      flag = false;
                      return false;
                    }
                  }
                  if (ad13objData[j].isVerification == 2) { //邮箱验证
                    if ((/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(thatVal)) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的邮箱地址！");
                      flag = false;
                      return false;
                    }
                  }
                } else {
                  flag = true;
                }
              } else {
                $.confirm(ad13objData[j].placeholderText);
                flag = false;
                return false;
              }
            } else {
              if (!$.isNull(thatVal)) { //检查是否为空
                if (ad13objData[j].isVerification > 0) { //是否开启验证
                  if (ad13objData[j].isVerification == 1) { //手机验证
                    if ((/^1[34578]\d{9}$/.test(thatVal))) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的手机号码！");
                      flag = false;
                      return false;
                    }
                  }
                  if (ad13objData[j].isVerification == 2) { //邮箱验证
                    if ((/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(thatVal)) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的邮箱地址！");
                      flag = false;
                      return false;
                    }
                  }
                } else {
                  flag = true;
                }
              }
              flag = true;
            }
          }
          if (flag) {
            subObj.id = thatId;
            subObj.key = thatKey;
            subObj.value = thatVal;
            subData.push(subObj);
          }
        }
      }
    }
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      UserId: app.globalData.UserInfo.Id,
      SubmitInfo: JSON.stringify(subData),
      SubmitNum: num || 0,
      PageId: that.data.pageId
    }
    $.clearxsr($.makeUrl(api.SubmitFormData, val), function(data) {
      if (data.Code == 0) {
        $.alert("提交信息成功！");
      } else {
        $.confirm("你已经提交信息，请勿重复提交！");
      }
    });
  },
  goHomeAds: function(e) {
    var that = this;
    this.setData({
      homeAds: null
    });
    var val = {
      userId: app.globalData.UserInfo.Id,
      adId: e.currentTarget.dataset.adid
    }
    $.xsr1($.makeUrl(api.UserClickMiniAppAd, val), function() {});
    if (!isNaN(e.currentTarget.dataset.url)) { //表示为优惠券，领取优惠券
      that.getCoupon(e.currentTarget.dataset.url);
    } else { //表示为普通连接
      $.goToTabBar(null, "../../" + e.currentTarget.dataset.url);
    }
    wx.showTabBar();
  },
  goMskAdsUrl: function(e) {
    var that = this;
    this.setData({
      mskAds: null
    });
    var val = {
      userId: app.globalData.UserInfo.Id,
      adId: e.currentTarget.dataset.adid
    }
    $.xsr1($.makeUrl(api.UserClickMiniAppAd, val), function() {});
    if (!isNaN(e.currentTarget.dataset.url)) { //表示为优惠券，领取优惠券
      that.getCoupon(e.currentTarget.dataset.url);
    } else { //表示为普通连接
      $.goToTabBar(null, "../../" + e.currentTarget.dataset.url);
    }
  },
  closeMskAds: function(e) {
    this.setData({
      mskAds: null
    });
  },
  getCoupon: function(id) { //领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: id,
      UserId: app.globalData.UserInfo.Id,
      Code: "",
      IsNewUser: 0
    }
    var that = this;
    if (id) {
      $.clearxsr($.makeUrl(userapi.UserReceiveCoupon, val), function(data) {
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
  GetMinAppHomeTemplate: function() {
    var val = {
      StoreID: app.globalData.VendorInfo.Id
    }
    return new Promise((resolve, reject) => {
      $.clearxsr($.makeUrl(api.GetMinAppHomeTemplate, val), function(data) {
        if (data.Code == 0) {
          resolve(data.Info);
        } else {
          reject(data);
        }
      });
    });
  }
})