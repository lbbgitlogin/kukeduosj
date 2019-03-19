var app = getApp()
var $ = require('../../utils/util.js');
var pdapi = require('../../api/productAPI.js');
var fgapi = require('../../api/fightGroups.js');

Page({
  data: {
    viewtype: 0,
    tapindex: 1,
    pdlist: [], //商品列表
    fglist: [],//已拼团商品列表
    flag: false, //是否可以进行下次分页
    ispage: false, //是否还有数据
    scposition: 0, //滚动条位置
    screenHeight: 37,
    PageIndex: 1,
    PageSize:10,
    PageIndex1: 1,
    PageSize1: 10,
    istop: false,
    isdata: false, //是否存在数据
    day: "",
    hours: "",
    minutes: "",
    seconds: "",
    flag1: false,
    ispage1: false,
    windowHeight: "",
    isData:true,
    isData1: true,
    isnav: true,
    isquicknav: false,
    PageQRCodeInfo: {//二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false
    },
  },
  onLoad: function (options) {
    
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.setData({
          tapindex: 1,
        })
        that.InitData();
        that.initialData()
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.setData({
        tapindex: 1,
      })
      that.InitData();
      that.initialData()
    }
    try {
      var res = wx.getSystemInfoSync()
      this.setData({
        windowHeight: res.windowHeight
      })
    } catch (e) {
      console.log(' Do something when catch error');
    }
    
  },
  allOrders: function () {
    this.setData({
      tapindex: 1,
      pdlist:[],
      PageSize: 10,
      PageIndex: 1,
    });
    this.InitData()
  },
  toBePaid: function () {
    this.setData({
      tapindex: 2,
      fglist: [],
      PageSize1: 10,
      PageIndex1: 1
    });
    this.initialData()
  },
  InitData: function () {
    var that = this;
    //表示展示的为拼团商品
    var obj = {
      StoreId: app.globalData.VendorInfo.Id,
      PageSize: this.data.PageSize,
      PageIndex: this.data.PageIndex,
    }
    $.xsr($.makeUrl(fgapi.MarketingEventGroupQuery, obj), function (res) {//未拼团
    console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        that.setData({
          isData: true
        })
        if (res.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            pdlist: that.data.pdlist.concat(res.Info)
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            pdlist: that.data.pdlist.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag: false,
          ispage: false,
        });
      }
      if ($.isNull(res.Info) && res.Code == 1 && that.data.PageIndex == 1) {
        that.setData({
          isData: false
        })
      }
    });
  },
  initialData: function () {
    var that = this;
    //表示展示的为拼团商品
    var obj = {
      StoreId: app.globalData.VendorInfo.Id,
      PageSize: this.data.PageSize1,
      PageIndex: this.data.PageIndex1,
    }
    $.xsr($.makeUrl(fgapi.MarketingEventImmediately, obj), function (res) {//未拼团

      if (!$.isNull(res.Info) && res.Code == 0) {
        that.setData({
          isData1: true
        })
        if (res.Info.length < 10) {
          that.setData({
            flag1: false,
            ispage1: false,
            fglist: that.data.fglist.concat(res.Info)
          });
        } else {
          that.setData({
            flag1: true,
            ispage1: true,
            fglist: that.data.fglist.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag1: false,
          ispage1: false,
        });
      }
      if ($.isNull(res.Info) && res.Code == 1 && that.data.PageIndex1 == 1) {
        that.setData({
          isData1: false
        })
      }
    });
  },
  scrollbottom: function (even) { //滚动到底部进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          PageIndex: parseInt(that.data.PageIndex) + 1
        });
        that.InitData();
        that.setData({
          flag: false
        })
      }, 500)
    }
  },
  scrollbottomtwo: function (even) { //滚动到底部进行分页
    if (this.data.flag1) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          PageIndex1: parseInt(that.data.PageIndex1) + 1
        });
        that.initialData();
        that.setData({
          flag1: false
        })
      }, 500)
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

  //快捷导航
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
    }, 250)
  },
  onShareAppMessage: function (res) {
    return {
      title: '限时拼团活动好火爆啊，优质商品等你来拿！',
      path: 'pages/fightgroupslist/fightgroupslist?uid=' + app.globalData.UserInfo.Id
    }
  }

})