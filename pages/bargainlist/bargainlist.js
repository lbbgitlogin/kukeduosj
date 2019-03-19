
var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
var takeInterval;
var takeList;
Page({
  data: {
    viewtype: 0,
    tapindex: 1,
    pdlist: [], //商品列表
    fglist: [], //已砍价商品列表
    flag: false, //是否可以进行下次分页
    ispage: false, //是否还有数据
    scposition: 0, //滚动条位置
    screenHeight: 37,
    PageIndex: 1,
    PageSize: 10,
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
    isData: true,
    isData1: true,
    isnav: true,
    isquicknav: false,
    cutPricePartakeList: [], //CutPricePartakeList返回数组
    num: 0, //循环个数
    bargainIndex: null, //CutPricePartakeList单个元素
    PageQRCodeInfo: { //二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false
    },
    pageNum:1,
    oldMaxId:0,
    newMaxId:0
  },
  onLoad: function(options) {
    var that = this;

    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.setData({
          tapindex: 1,
        })
        that.InitData();
        that.initialData()
        that.strong()
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
      that.strong()
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
  onShow: function() {
    var that = this;
    wx.clearStorage();
    clearInterval(takeInterval)
    clearInterval(takeList)
   
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
      PageSize: 15,
      OldMaxId: that.data.oldMaxId,
      NewMaxId: that.data.newMaxId,
    }
    $.xsr1($.makeUrl(activityapi.GetCutPricePartakeList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          cutPricePartakeList: res.Info[0].CutPricePartakeList,
        })
        takeList = setInterval(function() {
          var num = that.data.num;
          // that.setData({
          //   bargainIndex: that.data.cutPricePartakeList[num]
          // })
          // console.log("bargainIndex", that.data.bargainIndex)
          if (num < that.data.cutPricePartakeList.length) {
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
    console.log("1111111111")
    clearInterval(takeInterval)
    clearInterval(takeList)
    wx.clearStorage();
  },
  allOrders: function() {
    this.setData({
      tapindex: 1,
      pdlist: [],
      PageSize: 10,
      PageIndex: 1,
    });
    this.InitData()
  },
  toBePaid: function() {
    this.setData({
      tapindex: 2,
      fglist: [],
      PageSize1: 10,
      PageIndex1: 1
    });
    this.initialData()
  },
  InitData: function() {
    var that = this;
    //表示展示的为立即砍价商品列表
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageNumber: this.data.PageIndex,
      PageSize: this.data.PageSize,
      sponsorId: app.globalData.UserInfo.Id, //发起人的Id
      cutPriceType: 0,
    }
    console.log("val", val)
    $.xsr1($.makeUrl(activityapi.GetVendorCutPriceEventList, val), function(res) {
      console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        that.setData({
          isData: true,
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
  initialData: function() {
    var that = this;
    //表示展示的为砍价商品
    var obj = {
      vendorId: app.globalData.VendorInfo.Id,
      pageNumber: this.data.PageIndex1,
      PageSize: this.data.PageSize1,
      sponsorId: app.globalData.UserInfo.Id, //发起人的Id
      cutPriceType: 1,
    }
    $.xsr1($.makeUrl(activityapi.GetVendorCutPriceEventList, obj), function(res) { //未砍价
      if (!$.isNull(res.Info) && res.Code == 0) {
        that.setData({
          isData1: true,
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
  scrollbottom: function(even) { //滚动到底部进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
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
  scrollbottomtwo: function(even) { //滚动到底部进行分页
    if (this.data.flag1) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
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
  
  onShareAppMessage: function(res) {
    return {
      title: '小伙伴都在疯狂砍价，砍至底价真划算，心仪商品都拿到手软！',
      path: 'pages/bargainlist/bargainlist?uid=' + app.globalData.UserInfo.Id
    }
  }
})