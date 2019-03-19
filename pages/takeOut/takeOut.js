var app = getApp()
var $ = require('../../utils/util.js');
var pdapi = require('../../api/productAPI.js');
var userapi = require('../../api/userAPI.js');
var api = require('../../api/indexAPI.js');
var cartapi = require('../../api/cartAPI.js');
var thatProm = {
  ProductInfo: {},
  addCar: false,
  count: 0,
  windowHeight: 0,//获取窗口高度
  categoryname: '',// 分类第六套模板
  click6: true,//点击购物车 第六套模板
  cid: 0,//第六套模板保存当前分类id
  cartlist: {},//第六套模板购物车
  isdata: false,//是否加载第六套bottombar
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
  isShow: 0,
  post: { //请求数据
    storeID: 0,
    orderby: 1, //排序条件
    sort: 2, //排序方式方式，默认降序
    isnew: false, //是否是上新商品
    pageindex: 1,//当前页

  }
}
// takeOut.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonTPL: thatProm,
    indexArray: [],
    splist: [],//选择的规格列表
    splistStr: [], //选择的规格列表名称
    pid: 0,
    index: 0,
    sendInfo:"",
    isShow: 0,
    TotalPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad:function(options){
 
     try {

       this.setData({
         commonTPL: thatProm,
         
       })
     
      thatProm.windowHeight = wx.getSystemInfoSync().windowHeight - 50;
      
    } catch (e) {
      console.log(' Do something when catch error', e);
      
    }
    this.setData({
      Currency: app.globalData.VendorInfo.Currency,
    })
    var that = this;
    that.initData();
    thatProm.click6 = true;
  },
  initData: function () {
    var thisobj = this;
    //获取店铺信息
    thatProm.shopinfo = app.globalData.VendorInfo;
    this.setData({
      commonTPL: thatProm,
      Currency: app.globalData.VendorInfo.Currency
    });
    wx.setNavigationBarTitle({
      title: app.globalData.VendorInfo.ShopName
    });
    var val = {
      storeID: app.globalData.VendorInfo.Id,
    }
    $.xsr($.makeUrl(pdapi.GetSmallCategory, val), function (data) {
      console.log("q11",data)
      thatProm.smallCategory = data.Info;
      if (thatProm.smallCategory.length > 0) {
        thatProm.cid = thatProm.smallCategory[0].id;
        thatProm.categoryname = thatProm.smallCategory[0].name;
      }
      thisobj.getcartlist();//第六套模板刷新界面
      thisobj.ckallPD();
      thisobj.setData({
        commonTPL: thatProm,
      });
    
      wx.stopPullDownRefresh();
    });
    this.GetVendorLogisticsSetting()
  },
  GetVendorLogisticsSetting:function () {
    var that=this
    var val={
      vendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(api.GetVendorLogisticsSetting, val), function (data) {
      console.log("q1",data)
      that.setData({
        sendInfo:data.Info
      })
    });
  },
  ckallPD6: function (e) {//全部商品第六套模板获取数据 和上新 点击左侧小分类获取数据 
    thatProm.pdlist = [];
    var isnew6;
    if (thatProm.tapindex == 2) {//全部商品
      isnew6 = false;
    } else if (thatProm.tapindex == 3) {//上新
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

  ckallPD: function () { //点击全部商品
    thatProm.tapindex = 2;
    thatProm.pdlist = [];
      thatProm.post = {
        cid: thatProm.cid,
        storeID: app.globalData.VendorInfo.Id,
        orderby: 1,
        sort: 2,
        isnew: false,
        pageindex: 1,
        userAccount: app.globalData.UserInfo.UserName
      }
      this.setData({
        commonTPL: thatProm
      });
      this.GetPlistTakeAway();
  },

  cknewPD: function () { //点击上新
    thatProm.tapindex = 3;
    thatProm.pdlist = [];
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
  },
  ckinfo: function () { //点击店铺介绍
    thatProm.tapindex = 4;
    this.setData({
      commonTPL: thatProm
    });
  },
  viewType: function () { //切换商品列表展示方式
    if (thatProm.viewtype == 0) {
      thatProm.viewtype = 1;
    } else {
      thatProm.viewtype = 0;
    }
    this.setData({
      commonTPL: thatProm
    });
  },
  sealnum: function () { //根据销量排序
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
  newpd: function () { //根据上架时间排序
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
  pdprice: function () { //根据价格排序
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
  scrollbottom: function (even) { //滚动到底部进行分页
    if (thatProm.flag) { //判断是否可以进行下次分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thatProm.post.pageindex = thatProm.post.pageindex + 1;
        thisobj.setData({
          commonTPL: thatProm
        });

          thisobj.GetPlistTakeAway(); //第六套模板全部商品
      }, 500);
    }
  },
  GetPlist: function () { //获取商品列表统一方法
    thatProm.flag = false;
    this.setData({
      commonTPL: thatProm
    });
    var that = this;
    $.loading();
    
    $.xsr($.makeUrl(pdapi.GetProductList, thatProm.post), function (res) {
      console.log("q12", res)
      $.hideloading();
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
  GetPlistTakeAway: function () { //获取商品列表统一方法 第六套模板
    thatProm.flag = false;
    this.setData({
      commonTPL: thatProm
    });
    var that = this;
    $.xsr1($.makeUrl(pdapi.GetProductListByPositionForTakeAway, thatProm.post), function (res) {
      console.log("q2",res)
      if (res.Info.length > 0) {
        that.setData({
          isShow: 1,

        })
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
  scrollView: function (e) { //滚动到顶部
    if (e.detail.deltaY < -305) {
      thatProm.distance = e.detail.deltaY;
      thatProm.istop = true;
      this.setData({
        commonTPL: thatProm
      });
    }
  },
  scrollTop: function () {
    thatProm.istop = false;
    this.setData({
      commonTPL: thatProm
    });
  },
  retruntop: function () {
    thatProm.distance = 0;
    this.setData({
      commonTPL: thatProm
    });
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.VendorInfo.ShopName,
      desc: app.globalData.VendorInfo.VendorInfo,
      path: '/pages/index/index?uid=' + app.globalData.UserInfo.Id
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      indexArray: []
    });
    this.getDivModel();
    this.initData();
  },
  cancelwindow: function () {
    thatProm.click6 = true;
    this.setData({
      commonTPL: thatProm
    });
  },


  getcartlist: function () { //获取购物车
    var thisobj = this;
    var val = {
      storeID: app.globalData.VendorInfo.Id,
      userName: app.globalData.UserInfo.UserName
    }
    $.xsr1($.makeUrl(cartapi.GetCartList, val), function (data) {
      console.log("q3",data)
      // thisobj.ckalllength(data);
      console.log("购物车:.",data);
      thatProm.cartlist = data.Info || {};
      thatProm.isdata = true;
      thisobj.setData({
        commonTPL: thatProm,
        TotalPrice: data.Info.TotalPrice ||0
      });
    });
  },
  sub: function (even) { //减数量
    var val = {
      btntype: 2,
      numval: even.currentTarget.dataset.num,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock,
      pid: even.currentTarget.dataset.pid
    }
    this.unifiedNum(val);
  },
  add: function (even) { //加数量
    var val = {
      btntype: 1,
      numval: even.currentTarget.dataset.num,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock,
      pid: even.currentTarget.dataset.pid
    }
    this.unifiedNum(val);
  },

  unifiedNum: function (val) { //统一判断
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
    $.xsr1($.makeUrl(cartapi.SetSetCartNum, postval), function (data) {
      console.log("q4",data)
      if (data.Info[0]) {
        thiso.getcartlist();

        for (var i = 0; i < thatProm.pdlist.length; i++) {
          if (thatProm.pdlist[i].id == val.pid) {
            if (val.btntype == 1) {//加
              thatProm.pdlist[i].UserShoppingCartCount = thatProm.pdlist[i].UserShoppingCartCount + 1;
              break;
            } else if (val.btntype == 2) {//减
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

  subcontent: function (even) { //减数量
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
  subcontentsp: function (even) { //减数量
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
  addcontent: function (even) { //加数量
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

  addcontentsp: function (even) { //加数量
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

  addCard: function (val) { //加入购物车
    var thisval = this;
    if (thatProm.pdlist[val.index].UserShoppingCartCount == 0 && val.btntype == 2) {//防止-1
      return;
    }
    $.xsr1($.makeUrl(cartapi.AddShoppingCartForTakeAway, val), function (data) {
      console.log("q5",data)
      if (data.Code == 0) {
        if (val.btntype == 1) {//加
          thatProm.pdlist[val.index].UserShoppingCartCount = thatProm.pdlist[val.index].UserShoppingCartCount + 1;
          if (thatProm.count >= 0) {
            thatProm.count++;
          }
        } else if (val.btntype == 2) {//减
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

  delcart: function (val) { //删除购物车
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
    $.xsr1($.makeUrl(cartapi.DelCartItem, val1), function (data) {
      console.log("q6",data)
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
  delAll: function () { //删除选中商品
    this.clearshoppingcar();
    var val = {
      SptrId: thatProm.Sel_Id.toString()
    }
    var that = this;
    $.xsr1($.makeUrl(cartapi.DelCartItem, val), function (data) {
      console.log("q7",data)
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

  clearshoppingcar: function () {
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
      that.submitorder()
    } else {

    }
  },
  submitorder: function () { //去结算
  var that=this;
    that.getcartlist()
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
  selectsp: function (even) { //选择规格
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
      Spec: this.data.splist.join(","),
      eventId: this.data.eventId
    }
    var that = this;
    //开始请求数据数据
    $.xsr1($.makeUrl(pdapi.GetProductlistSpc, val), function (data) {
      console.log("q8q9",data)
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

  InitProduct: function (even) { //初始化商品

    thatProm.addCar = true;
    this.setData({
      commonTPL: thatProm,
      pid: even.target.dataset.pid,
      index: even.target.dataset.index
    });
    var that = this;
    that.setData({
      splist:[]
    });
    var val = {
      userName: app.globalData.UserInfo.UserName,
      proId: even.target.dataset.pid
    }
    $.xsr1($.makeUrl(pdapi.GetProductInfo, val), function (data) {
      console.log("q10",data)
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

  closeaddcar: function () {//关闭选规格
    thatProm.addCar = false;
    this.setData({
      commonTPL: thatProm
    });
  },

  searchcarcount: function (skuid) {
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
  shoppingcarclicked: function () {
    if (thatProm.cartlist.Total > 0) {
      thatProm.click6 = !thatProm.click6;
      this.setData({
        commonTPL: thatProm
      });
    }

  }
})
