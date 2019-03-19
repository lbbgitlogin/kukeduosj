var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CommentList: [],
    CommentImgList: [],
    TapIndex: 1,
    sku: 0,
    flag: true, //是否可以进行下次分页
    ispage: true,
    PraiseNum:0,
    SatisfiedNum: 0,
    BadNum:0,
    pageIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sku: options.Id
    });
    this.initData();
  },
  picDetail: function () {
    this.setData({
      TapIndex: 1,
      pageIndex: 1,
      flag: true,
      ispage: true,
      CommentList: []
    });
    this.initData();
  },
  spcParam: function () {
    this.setData({
      TapIndex: 2,
      pageIndex: 1,
      flag: true,
      ispage: true,
      CommentList: []
    });
    this.initData();
  },
  packingList: function () {
    this.setData({
      TapIndex: 3,
      pageIndex: 1,
      flag: true,
      ispage: true,
      CommentList: []
    });
    this.initData();
  },
  initData: function () {
    var that = this;
    var val = {
      ProductNumber: this.data.sku,
      VendorId: app.globalData.VendorInfo.Id,
      Grade: this.data.TapIndex,
      pageIndex: this.data.pageIndex
    }
    $.xsr($.makeUrl(api.getProductCommentList, val), function (data) {
      that.setData({
        PraiseNum: data.Info.PraiseNum,
        SatisfiedNum: data.Info.SatisfiedNum,
        BadNum: data.Info.BadNum
      });
      if (data.Info != null) {
        if (data.Info.ProductCommentList.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            CommentList: that.data.CommentList.concat(data.Info.ProductCommentList)
          });
        } else {
          that.setData({
            flag: true,
            CommentList: that.data.CommentList.concat(data.Info.ProductCommentList)
          });
        }
      } else {
        that.setData({
          flag: false,
          ispage: false
        });
      }


    })
  },
  scrollPage: function (e) {
    if (this.data.flag) { //判断是否可以进行下次分页
      this.setData({
        flag: false
      });
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          pageIndex: parseInt(thisobj.data.pageIndex) + 1
        });
        thisobj.initData();
      }, 500);
    }
  },
  ImgTap: function (e) {
    var that = this;
    var imageUrls = [];
    for (var i in this.data.CommentList) {
      if (this.data.CommentList[i].ProductCommentId == e.target.dataset.id) {

        for (var j in this.data.CommentList[i].CommentPicList) {
          imageUrls.push(this.data.CommentList[i].CommentPicList[j].Path);
        }
      }
    }
    var nowImgUrl = e.target.dataset.src;
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: imageUrls // 需要预览的图片http链接列表
    })
  }
})