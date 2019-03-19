var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var user = require('../../api/userAPI.js');
var integraiAPI = require('../../api/integratShop.js');
Page({
  data: {
    Info: "",
    list: [],
    tapindex: 1, //当前项
    PageIndex: 1,
    ispage: false,
    flag: true, //是否可以进行下次分页
    windowHeight: 0,
    isTrue: true, //解读明细切换
    PointContent: "", //积分解读初始化数据
  },

  /** 积分解读切换 */
  navAnalysis: function(e) {
    var that = this;
    var tab = e.currentTarget.dataset.type;
    console.log("tab",e)
    if (tab == 1) {
      that.setData({
        isTrue: true,
      })
    }
    if (tab == 2) {
      that.setData({
        isTrue: false,
      })
    }
  },


  onLoad: function(options) {
    try {
      var res = wx.getSystemInfoSync()
      this.setData({
        windowHeight: res.windowHeight
      })
    } catch (e) {
      console.log(' Do something when catch error');
    }
    var that = this
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(user.findUsablePoint, val), function(data) {
      that.setData({
        Info: data.Info
      });
    });
    this.getMemberPointDetailList();
    this.GetMemberPointContent();
  },
  getMemberPointDetailList: function() {
    var thisobj = this
    var val = {
      UserId: app.globalData.UserInfo.Id,
      PageIndex: this.data.PageIndex,
    }
    $.xsr($.makeUrl(user.getMemberPointDetailList, val), function(res) {
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
            ispage: false,
            list: thisobj.data.list.concat(res.Info)
          });
        } else {
          thisobj.setData({
            flag: true,
            ispage: true,
            list: thisobj.data.list.concat(res.Info)
          });
        }
      } else {
        thisobj.setData({
          flag: false,
          ispage: false
        });
      }
    });
  },
  findUsablePoint: function() { //根据当前账户查询可用积分
    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      VendorId: app.globalData.VendorInfo.Id,
    };
    $.xsr($.makeUrl(integraiAPI.findUsablePoint, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          vipInfo: res.Info
        })
      }
    })
  },
  GetMemberPointContent: function() {
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
    };
    $.xsr($.makeUrl(integraiAPI.GetMemberPointContent, val), function(res) {
      if (res.Code == 0) {
        that.setData({
          PointContent: res.Info
        })
      }
    })
  },


  scrollbottom: function() { //滑动的底部加载下一页
    if (this.data.flag) {
      var thisobj = this;
      thisobj.setData({
        flag: false
      });
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          PageIndex: thisobj.data.PageIndex + 1
        })
        thisobj.getMemberPointDetailList();
      }, 500);
    }
  }
})