var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var user = require('../../api/userAPI.js');
Page({
	data: {
    list:[],
		tapindex: 1, //当前项
    PageIndex: 1,
    ispage: true,
		flag: true, //是否可以进行下次分页
    Info:"",
    growthvalue:"",
    windowHeight: 0
	},
	onLoad:function(options) {
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
      VendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(user.getMemberHierarchySettingList, val), function (data) {
      that.setData({
        Info: data.Info
      });
    });
    var val = {
      VendorId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(user.getMemberGrowthSettingInfo, val), function (data) {
      that.setData({
        growthvalue: data.Info
      });
    });
    this.getMemberGrowthDetailList()
	},
  getMemberGrowthDetailList:function(){
    var thisobj = this
    var val = {
      UserId: app.globalData.UserInfo.Id,
      PageIndex: this.data.PageIndex,
    }
    $.xsr($.makeUrl(user.getMemberGrowthDetailList, val), function (res) {
      if (res.Info != null) {
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
	allOrders:function() { 
		this.setData({ 
			tapindex: 1,
		});
	},
	toBePaid:function() { 
		this.setData({
			tapindex: 2,
		});
	},
  scrollbottom: function () {//滑动的底部加载下一页
    if (this.data.flag) {
      var thisobj = this;
      thisobj.setData({
        flag: false
      });
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          PageIndex: thisobj.data.PageIndex + 1
        })
        thisobj.getMemberGrowthDetailList();
      }, 500);
    }
  }
})