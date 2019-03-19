var app = getApp();
var $ = require('../../utils/util.js');
var actapi = require('../../api/activityAPI.js');
var venapi = require('../../api/vendorAPI.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProductList: [],  //商品数据
    flag: true, //是否可以进行下次分页
    ispage: true, //是否还有数据
    pageSize:10,
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      img: options.img,
      prize: options.prize,
      Currency: app.globalData.VendorInfo.Currency
    });
    this.GetRecommendedProductList()
  },
  homeindex: function () {
    wx.switchTab({
      url: '../../pages/index/index',
    })
  },
  GetRecommendedProductList: function () {
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageSize: this.data.pageSize,
      pageIndex: this.data.pageIndex,
    }
    console.log(val)
    $.xsr($.makeUrl(venapi.GetRecommendedProductList, val), function (res) {
      console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 6) {
          that.setData({
            flag: false,
            ispage: false
          });
          that.setData({
            ProductList: that.data.ProductList.concat(res.Info)
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            ProductList: that.data.ProductList.concat(res.Info)
          });
        }
      } else {
        that.setData({
          flag: false,
          ispage: false
        });
      }
    });
  },
  fightPage: function (e) {
    console.log(this.data.flag)
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1
        });
        that.GetRecommendedProductList();
        that.setData({
          flag: false
        })
      }, 500);
    }
  },
})