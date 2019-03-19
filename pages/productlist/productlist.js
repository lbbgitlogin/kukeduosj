var app = getApp()
var $ = require('../../utils/util.js');
var pdapi = require('../../api/productAPI.js');
var fgapi = require('../../api/fightGroups.js');
Page({
  data: {
    viewtype: 1,
    pdlist: [], //商品列表
    fglist: [], //已拼团商品列表
    sort: 2, //排序方式
    flag: true, //是否可以进行下次分页
    ispage: true, //是否还有数据
    scposition: "", //滚动条位置
    istop: false,
    isdata: false, //是否存在数据
    isFG: false, //是否为拼团列表
    post: { //请求数据
      orderby: 1, //排序条件
      sort: 2, //排序方式方式，默认降序
      isnew: false, //是否是上新商品
      pname: "", //商品名称
      cid: 0, //分类ID
      pageindex: 1 //当前页
    },
    isData: true,
    isnav: true,
    screenHeight: 0,
    isquicknav: false
  },
  onLoad: function (options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.initData(options)
      }, options.uid, options.sid);
    } else {
      that.initData(options)
    }
  },
  initData: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.pname || options.cname
    })
    this.setData({
      post: {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 1, //排序条件
        sort: 2, //排序方式方式，默认降序
        pname: options.pname, //商品名称
        cid: options.cid, //分类ID
        pageindex: 1 //当前页
      }
    });
    this.GetPlist(function () {
      if (that.data.pdlist.length == 0) {
        that.setData({
          isdata: false,
          Currency: app.globalData.VendorInfo.Currency
        });
      } else {
        that.setData({
          isdata: true,
          Currency: app.globalData.VendorInfo.Currency
        });
      }
    });
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
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
  viewType: function (event) {
    if (this.data.viewtype == 0) {
      this.setData({
        viewtype: 1
      })
    } else {
      this.setData({
        viewtype: 0
      })
    }
  },
  sealnum: function () { //根据销量排序
    this.setData({
      pdlist: [],
      post: {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 1,
        sort: 2,
        pname: this.data.post.pname,
        cid: this.data.post.cid,
        pageindex: 1,
        isData: true
      }
    });
    this.GetPlist(); //根据销量查询商品
  },
  newpd: function () { //根据上架时间排序
    this.setData({
      pdlist: [],
      post: {
        storeID: app.globalData.VendorInfo.Id,
        orderby: 2,
        sort: 2,
        pname: this.data.post.pname,
        cid: this.data.post.cid,
        pageindex: 1,
        isData: true
      }
    });
    this.GetPlist(); //根据上架时间查询商品
  },
  pdprice: function () { //根据价格排序
    if (this.data.sort == 1) {
      this.setData({
        sort: 2,
        pdlist: [],
        post: {
          storeID: app.globalData.VendorInfo.Id,
          orderby: 3,
          sort: 2,
          pname: this.data.post.pname,
          cid: this.data.post.cid,
          pageindex: 1,
          isData: true
        }
      });
    } else {
      this.setData({
        pdlist: [],
        sort: 1,
        post: {
          storeID: app.globalData.VendorInfo.Id,
          orderby: 3,
          sort: 1,
          pname: this.data.post.pname,
          cid: this.data.post.cid,
          pageindex: 1,
          isData: true
        }
      });
    }
    this.GetPlist(); //根据价格排序
  },
  scrollbottom: function (even) { //滚动到底部进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
  
        thisobj.setData({

          post: {

            storeID: app.globalData.VendorInfo.Id,
            orderby: thisobj.data.post.orderby,
            sort: thisobj.data.post.sort,
            pname: thisobj.data.post.pname,
            cid: thisobj.data.post.cid,
            pageindex: parseInt(thisobj.data.post.pageindex) + 1
          }
        });
        thisobj.GetPlist(); //根据价格排序
      }, 500);
    }
  },
  GetPlist: function (callblack) { //获取商品列表统一方法
    this.setData({
      flag: false
    });
    var thisObj = this;
    $.xsr($.makeUrl(pdapi.GetProductList, this.data.post), function (res) {
      console.log(res)
      if (res.Info.length > 0) {
        thisObj.setData({
          isData: true
        })
        if (thisObj.data.post.pageindex == 1 && res.Info.length < 10) {
          thisObj.setData({
            pdlist: thisObj.data.pdlist.concat(res.Info),
            flag: false,
            ispage: false
          });
        } else {
          thisObj.setData({
            pdlist: thisObj.data.pdlist.concat(res.Info),
            flag: true,
            ispage: true
          });
        }
      } else {
        thisObj.setData({
          flag: false,
          ispage: false
        });
      }
      if (res.Info.length == 0 && res.Code == 0 && thisObj.data.post.pageindex == 1) {
        thisObj.setData({
          isData: false
        })
      }
      callblack && callblack();
    });
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
  }
})