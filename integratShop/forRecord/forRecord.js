var app = getApp()
var $ = require('../../utils/util.js');
var integraiAPI = require('../../api/integratShop.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scposition: 0, //滚动条位置
    screenHeight: 37,
    nextflg: true, //是否可以进行下次分页
    notHasData: true,
    pageIndex: 1,
    record: [], //兑换记录返回的数据
    MEId: "",
    isquicknav: false,
    isnav: true,
    total: 0, //兑换总数
    ispage: true, //是否还有数据
  },

  returnTop: function() { //返回顶部
    this.setData({
      scposition: 0
    });
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


  scrollbottom: function(even) { //滚动到底部进行分页
    if (this.data.nextflg) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        nextflg: false
      })
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        let pageIndex = that.data.pageIndex;
        pageIndex++
        that.setData({
          pageIndex: pageIndex,
          nextflg:true
        });
        that.GetMemberExchangeActivityList(that.data.pageIndex);
      }, 500);
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.GetMemberExchangeActivityList(this.data.pageIndex);
  },

  GetMemberExchangeActivityList: function(Index) { //获取会员兑换记录列表
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
      pageSize: 10,
      pageIndex: Index
    };
    $.xsr($.makeUrl(integraiAPI.GetMemberExchangeActivityList, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          notHasData: false,
          ispage: true,
          record: that.data.record.concat(res.Info),
          total: res.Info[0].Total
        })
        if (that.data.record.length < 10) {
          that.setData({
            ispage: false,
          })
        }
      } else {
        that.setData({
          ispage: false,
        })
      }
    })
  },
  /**订单详情 */
  myorder: function(e) {
    $.gotopage('/integratShop/IntegralDetail/IntegralDetail?on=' + e.currentTarget.dataset.ordernum + '&type=' + e.currentTarget.dataset.type + "&MEId=" + this.data.MEId)
  },

  /**优惠券跳转 */
  myCoupon: function() {
    wx.navigateTo({
      url: '/pages/usercoupon/usercoupon',
    })
  },

  /** 跳转到主页 */
  goPage: function() {
    wx.navigateBack({
      url: '/integratShop/integralPage/integralPage',
    })
  },

})