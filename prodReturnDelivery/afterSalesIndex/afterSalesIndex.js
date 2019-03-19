var app = getApp()
var $ = require('../../utils/util.js')
var refundAPI = require('../../api/refundAPI.js')
var orderapi = require('../../api/orderAPI.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabNav: 1, //1 售后管理  2 申请记录
    pageIndex1: 1, //申请记录 当前页数
    pageSize1: 10, //申请记录 每页多少
    pageIndex: 1, //售后管理 当前页数
    pageSize: 10, //售后管理 每页多少
    serviceOrderList: [], //售后管理返回 初始数据
    show: false,
    lshow: false,
    Info: "",
    serviceShow: false,
    siteShow: false, //地址
    ispage: true, //商品是否还有数据
    recordList: [], //申请记录列表
    recordShow: false,
    recordpage: true,
    isnav: true, //悬浮导航字段
    isquicknav: false,
    isBack: false, //页面返回是否请求数据

  },








  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      tabNav: 1, //1 售后管理  2 申请记录
      pageIndex1: 1, //申请记录 当前页数
      pageSize1: 10, //申请记录 每页多少
      pageIndex: 1, //售后管理 当前页数
      pageSize: 10, //售后管理 每页多少
      serviceOrderList: [], //售后管理返回 初始数据
      show: false,
      lshow: false,
      Info: "",
      serviceShow: false,
      siteShow: false, //地址
      ispage: true, //商品是否还有数据
      recordList: [], //申请记录列表
      recordShow: false,
      recordpage: true,
    })

    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })

        that.GetSoldServiceOrderList()
        that.GetPostSaleRecordList()
      }, options.uid, options.sid)
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.GetSoldServiceOrderList()
      that.GetPostSaleRecordList()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (that.data.isBack) {
      that.setData({
        pageIndex1: 1, //申请记录 当前页数
        pageSize1: 10, //申请记录 每页多少
        pageIndex: 1, //售后管理 当前页数
        pageSize: 10, //售后管理 每页多少
        serviceOrderList: [], //售后管理返回 初始数据
        show: false,
        lshow: false,
        Info: "",
        serviceShow: false,
        siteShow: false, //地址
        ispage: true, //商品是否还有数据
        recordList: [], //申请记录列表
        recordShow: false,
        recordpage: true,
        isBack: false,
      })
      wx.pageScrollTo({
        scrollTop: 0
      })
      that.GetSoldServiceOrderList()
      that.GetPostSaleRecordList()
    }
  },

  onPageScroll: function(e) {
    if (e.scrollTop > 100) {
      this.setData({
        isquicknav: true
      })
    } else {
      this.setData({
        isquicknav: false
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    clearTimeout(time);
    var time = setTimeout(function() {
      that.setData({
        // scposition: 1, //滚动条位置
        // screenHeight: 37,
        pageIndex1: 1, //申请记录 当前页数
        pageSize1: 10, //申请记录 每页多少
        pageIndex: 1, //售后管理 当前页数
        pageSize: 10, //售后管理 每页多少
        serviceOrderList: [], //售后管理返回 初始数据
        show: false,
        Info: "",
        serviceShow: false,
        siteShow: false, //地址
        ispage: true, //商品是否还有数据
        recordList: [], //申请记录列表
        recordShow: false,
        recordpage: true,
      })
      that.GetPostSaleRecordList()
      that.GetSoldServiceOrderList()
      wx.stopPullDownRefresh()
    }, 500)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (that.data.tabNav == 1) {
      var pageIndex = that.data.pageIndex;
      pageIndex++;
      that.setData({
        pageIndex: pageIndex,
      })

      that.GetSoldServiceOrderList();
    }
    if (that.data.tabNav == 2) {
      var pageIndex1 = that.data.pageIndex1;
      pageIndex1++;
      that.setData({
        pageIndex1: pageIndex1,
      })
      that.GetPostSaleRecordList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.ShareTitle,
      imageUrl: this.data.ShareImg || "",
      path: '/prodReturnDelivery/afterSalesIndex/afterSalesIndex?uid=' + app.globalData.UserInfo.Id
    }
  },
  /**nav切换 */
  navTap: function(e) {
    var that = this;
    var IsType = parseInt(e.currentTarget.dataset.type);
    if (IsType == 1) {
      that.setData({
        tabNav: 1,
      })
    }
    if (IsType == 2) {
      that.setData({
        tabNav: 2,
      })
    }
  },
  GetSoldServiceOrderList: function() { //售后管理
    var that = this;
    var val = {
      userName: app.globalData.UserInfo.UserName,
      vendorId: app.globalData.VendorInfo.Id,
      currentPage: that.data.pageIndex,
      pageSize: that.data.pageSize
    }
    console.log("售后管理", val)
    $.xsr($.makeUrl(refundAPI.GetSoldServiceOrderList, val), function(res) {
      console.log("售后管理", res)
      if (res.Code == 0 && res.Info != null) {
        that.setData({
          serviceOrderList: that.data.serviceOrderList.concat(res.Info),
          serviceShow: true,
          ispage: true
        })
      } else {
        var pageIndex = that.data.pageIndex;
        if (pageIndex > 1) {
          pageIndex--
        }
        that.setData({
          pageIndex: pageIndex,
          serviceShow: true,
          ispage: false
        })
      }
    })
  },

  GetPostSaleRecordList: function() { //申请记录列表
    var that = this;
    var val = {
      userName: app.globalData.UserInfo.UserName,
      vendorId: app.globalData.VendorInfo.Id,
      pageIndex: that.data.pageIndex1,
      pageSize: that.data.pageSize1
    }
    $.xsr($.makeUrl(refundAPI.GetPostSaleRecordList, val), function(res) {
      console.log("申请记录列表", res)
      if (res.Code == 0 && res.Info != null) {
        that.setData({
          recordList: that.data.recordList.concat(res.Info),
          recordShow: true,
          recordpage: true,
        })
      } else {
        var pageIndex1 = that.data.pageIndex1;
        if (pageIndex1 > 1) {
          pageIndex1--;
        }
        that.setData({
          pageIndex1: pageIndex1,
          recordpage: false,
          recordShow: true,
        })

      }
    })
  },
  confirmReceipt: function(e) { //确认收货
    var thisobj = this
    var val = {
      orderNum: e.currentTarget.dataset.on
    }
    $.confirm("是否确认收货？", function(res) {
      if (res.confirm) {
        $.xsr1($.makeUrl(orderapi.UpdateOrdersbyOrderNum, val), function(data) {
          thisobj.setData({
            serviceOrderList: [],
            serviceShow: false,
            currentPage: 1,
            Info: data.Msg,
          });
          if (!$.isNull(data.Msg)) {
            thisobj.setData({
              show: true
            })
            setTimeout(function() {
              thisobj.setData({
                show: false
              })
            }, 2000);
          }

          thisobj.GetSoldServiceOrderList();
        });
      }
    }, true);
  },
  linkService: function() { //联系客服弹窗
    this.setData({
      lshow: true
    })
  },
  closeService: function() {
    this.setData({
      lshow: false
    })
  },

  makeTap: function() { //打开地址窗口
    var that = this;
    that.setData({
      siteShow: true
    })
  },
  closesp: function() {
    var that = this;
    that.setData({
      siteShow: false
    })
  },
  cancelTap: function(e) {
    var that = this;
    wx.showModal({
      content: '确定要取消本次售后申请吗？',
      confirmText: '确定',
      confirmColor: '#3cc51e',
      success: function(res) {
        if (res.confirm) {
          var val = {
            userName: app.globalData.UserInfo.UserName,
            goodsReturnNum: e.currentTarget.dataset.returnnum
          }
          $.xsr1($.makeUrl(refundAPI.CancelPostSaleApplication, val), function(res) {
            console.log(res)
            if (res.Code == 0) {
              var recordList = that.data.recordList;

              for (var i = 0, len = recordList.length; i < len; i++) {
                if (val.goodsReturnNum == recordList[i].GoodsReturnNum) {
                  recordList[i].Status = 8;
                  recordList[i].StatusStr = "已取消";
                  recordList[i].StatusExplain = "您的售后订单已由您取消";
                }
              }
              that.setData({
                recordList: recordList
              })
            }
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

})