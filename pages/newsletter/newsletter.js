var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    pageNumber: 1,
    PageSize: 10,
    ispage: false,
    flag: true, //是否可以进行下次分页
    Info: [],
    currentTab: "",
    windowHeight: 0,
    categoryId: 0,
    Title: '',
    isData: true
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      categoryId: options.cid || 0, //分类ID
    });
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.GetNewsletterList();
        that.GetNewsletterCategoryList(); //加载分类
      }, options.uid);
    } else {
      that.GetNewsletterList();
      that.GetNewsletterCategoryList();
    }
    wx.setNavigationBarTitle({
      background: red,
    })
    notice.addNotification("Refresh", that.RefreshMethod, that);
  },
  RefreshMethod: function(e) {
    
    var thatInfo = this.data.Info;
    if (thatInfo.length > e.i) {
      if (thatInfo[e.i].Id == e.id) {
        thatInfo[e.i].ViewCounts = e.num;
      }

      this.setData({
        Info: thatInfo
      })
    }

  },
  GetNewsletterList: function() {

    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      pageNumber: this.data.pageNumber,
      PageSize: 10,
      categoryId: this.data.categoryId || 0
    }
    var thisobj = this;
    $.xsr($.makeUrl(activityapi.GetNewsletterList, val), function(res) {
console.log("res00",res)
      if (!$.isNull(res.Info) && 　res.Code == 0) {
        thisobj.setData({
          isData: true
        })
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
          });
        } else {
          thisobj.setData({
            flag: true,
          });
        }
        thisobj.setData({
          ispage: true,
          Info: thisobj.data.Info.concat(res.Info)
        });
      } else {
        thisobj.setData({
          flag: false,
          // isData: false,
          ispage: true,
        });
      }
      // if ($.isNull(res.Info) && res.Code == 0 && thisobj.data.pageNumber == 1) {
      //   thisobj.setData({
      //     isData: false
      //   })
      // }
      //   wx.setNavigationBarTitle({
      //     Title: res.Name || '企业资讯',
      // })
    });

  },

  classifyClick: function(e) { //切换分类

    var that = this;
    that.setData({
      categoryId: e.currentTarget.dataset.id,
      pageNumber: 1,
      Info: []
    })

    wx.setNavigationBarTitle({
      title: e.currentTarget.dataset.title,
    })
    that.GetNewsletterList();
  },
  GetNewsletterCategoryList: function() {
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
    }
    var thisobj = this;
    $.xsr($.makeUrl(activityapi.GetNewsletterCategoryList, val), function(res) {
      thisobj.setData({
        Classification: res.Info,

      });


    });
  },



  onReachBottom: function() { //滑动的底部加载下一页
    if (this.data.flag) {
      var thisobj = this;
      thisobj.setData({
        flag: true
      });
      thisobj.setData({
        pageNumber: thisobj.data.pageNumber + 1
      })
      thisobj.GetNewsletterList();
    }
  }
})