// var app = getApp();
// var $ = require('../../utils/util.js');
// var userapi = require('../../api/userAPI.js');
// var notice = require('../../utils/notice.js');
// Page({
// 	data: {
// 		addresslist: {},
// 		isdata: false, //是否存在数据
// 		spid:"",
// 		adid: 0 //表示是从提交页进入
// 	},
// 	onLoad:function(options) {
// 		this.setData({
// 			adid: options.adid || 0, //判断是否是从订单提交页过来的
// 			spid:options.spid || ""
// 		});
// 		this.GetAddressList();
// 		var that=this;
// 		notice.addNotification("Refresh",that.RefreshMethod,that);
// 	},
// 	RefreshMethod:function(){//刷新通知
// 		this.GetAddressList();
// 	},
// 	GetAddressList:function() {
// 		//获取地址列表
// 		var thisObj = this;
// 		var val = {
// 			userName: app.globalData.UserInfo.UserName
// 		}
// 		$.xsr($.makeUrl(userapi.GetAddressList, val), function(data) {
// 			if($.isNull(data) || $.isNull(data.Info)) {
// 				thisObj.setData({
// 					isdata: false
// 				});
// 			} else {
// 				thisObj.setData({
// 					isdata: true,
// 					addresslist: data.Info
// 				});
// 			}
// 		});
// 	},
// 	SelectAddress:function(even) { //选择地址【只用是从提交页面过来的才可以选择】
// 		var that=this;
// 		$.backpage(1,function(){
// 			var val={
// 				adid:even.currentTarget.dataset.adid,
// 				spid:that.data.spid
// 			}
// 			notice.postNotificationName("RefreshOrder",val);
// 		});
// 	},
// 	EditAddress:function(even) { //编辑地址,跳转到地址编辑页【判断情况：1直接进入，2：从订单提交页进入】
// 		var that=this;
// 		if(this.data.adid != 0) {
// 			wx.redirectTo({ //表示是从提交页面进入
// 				url: '../addressmanage/addressmanage?adid=' + even.currentTarget.dataset.adid + "&issub=true"+(that.data.spid==""?"":"&spid="+that.data.spid)
// 			});
// 		} else {
// 			wx.navigateTo({ //表示是从个人中心进入
// 				url: '../addressmanage/addressmanage?adid=' + even.currentTarget.dataset.adid + "&issub=false"
// 			});
// 		}
// 	},
// 	AddAddress:function() { //添加地址，跳转到地址添加页【判断情况：1.直接从地址管理进入，2.从提交订单进入】
// 		var that=this;
// 		if(this.data.adid != 0) {
// 			wx.redirectTo({ //表示是从提交页面进入添加页面
// 				url: "../addressmanage/addressmanage?issub=true"+(that.data.spid==""?"":"&spid="+that.data.spid)
// 			});
// 		} else {
// 			wx.navigateTo({ //表示是从个人中心进入添加页面
// 				url: "../addressmanage/addressmanage?issub=false"
// 			});
// 		}
// 	},
// 	DelAddress:function(even) { //删除地址
// 		var thisObj = this;
// 		wx.showModal({
// 			title: "提示",
// 			content: "确认删除这个地址吗？",
// 			showCancel: true,
// 			success: function(res) {
// 				if(res.confirm) {
// 					var val = {
// 						Id: even.currentTarget.dataset.adid
// 					}
// 					$.xsr($.makeUrl(userapi.DelAddress, val), function(data) {
// 						wx.showToast({
// 							title: "删除成功！"
// 						});
// 						notice.postNotificationName("RefreshOrder",0);
// 						thisObj.GetAddressList();
// 					});
// 				}
// 			}
// 		})
// 	}
// })
var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
var notice = require('../../utils/notice.js');
var actapi = require('../../api/activityAPI.js');
Page({
  data: {
    addresslist: {},
    isdata: false, //是否存在数据
    spid: "",
    adid: 0, //表示是从提交页进入
    Prize: false,   //表示从领奖品页面跳转
    tel: '',  //电话 
    username: '',  //领奖人姓名
    PrizePic: '',  //奖品的图片地址
    prizename: '',  //奖品的名称
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      adid: options.adid || 0, //判断是否是从订单提交页过来的
      spid: options.spid || "",
      Prize: options.Prize,
      prizeId: options.prizeId,
      PrizePic: options.img,
      prizename: options.prizename
    });
    if (options.Prize == 'true') {
      this.setData({
        Prize: true
      });
    } else {
      this.setData({
        Prize: false
      });
    }

    this.GetAddressList();
    var that = this;
    notice.addNotification("Refresh", that.RefreshMethod, that);
  },
  RefreshMethod: function () {//刷新通知
    this.GetAddressList();
  },
  GetAddressList: function () {
    //获取地址列表
    var thisObj = this;
    var val = {
      userName: app.globalData.UserInfo.UserName
    }
    $.xsr($.makeUrl(userapi.GetAddressList, val), function (data) {
      if ($.isNull(data) || $.isNull(data.Info)) {
        thisObj.setData({
          isdata: false
        });
      } else {
        thisObj.setData({
          isdata: true,
          addresslist: data.Info
        });
      }
    });
  },
  SelectAddress: function (even) { //选择地址【只用是从提交页面过来的才可以选择】
    console.log(even)
    var that = this;
    if (that.data.Prize == false) {
      $.backpage(1, function () {
        var val = {
          adid: even.currentTarget.dataset.adid,
          spid: that.data.spid
        }
        notice.postNotificationName("RefreshOrder", val);
      });
    } else {

      that.setData({
        address: even.currentTarget.dataset.address,
        username: even.currentTarget.dataset.consignee,
        tel: even.currentTarget.dataset.tel
      });
      wx.showModal({
        title: '提示',
        content: '是否确认该地址为奖品收货地址',
        success: function (res) {
          if (res.confirm) {
            that.UpdatePrizeRecord()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  EditAddress: function (even) { //编辑地址,跳转到地址编辑页【判断情况：1直接进入，2：从订单提交页进入】
    var that = this;
    if (this.data.adid != 0) {
      wx.redirectTo({ //表示是从提交页面进入
        url: '../addressmanage/addressmanage?adid=' + even.currentTarget.dataset.adid + "&issub=true" + (that.data.spid == "" ? "" : "&spid=" + that.data.spid)
      });
    } else {
      wx.navigateTo({ //表示是从个人中心进入
        url: '../addressmanage/addressmanage?adid=' + even.currentTarget.dataset.adid + "&issub=false"
      });
    }
  },
  AddAddress: function () { //添加地址，跳转到地址添加页【判断情况：1.直接从地址管理进入，2.从提交订单进入】
    var that = this;
    if (this.data.adid != 0) {
      wx.redirectTo({ //表示是从提交页面进入添加页面
        url: "../addressmanage/addressmanage?issub=true" + (that.data.spid == "" ? "" : "&spid=" + that.data.spid)
      });
    } else {
      wx.navigateTo({ //表示是从个人中心进入添加页面
        url: "../addressmanage/addressmanage?issub=false"
      });
    }
  },
  DelAddress: function (even) { //删除地址
    var thisObj = this;
    wx.showModal({
      title: "提示",
      content: "确认删除这个地址吗？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var val = {
            Id: even.currentTarget.dataset.adid
          }
          $.xsr($.makeUrl(userapi.DelAddress, val), function (data) {
            wx.showToast({
              title: "删除成功！"
            });
            notice.postNotificationName("RefreshOrder", 0);
            thisObj.GetAddressList();
          });
        }
      }
    })
  },
  UpdatePrizeRecord: function () {   //2.1.6领取自定义奖品接口
    var that = this;
    var val = {
      // operateId: app.globalData.OperateInfo.OperateId,
      // userId: app.globalData.UserInfo.Id,
      id: that.data.prizeId,
      address: that.data.address,
      tel: that.data.tel,
      consignee: that.data.username,
    }
    console.log(val)
    $.xsr($.makeUrl(actapi.UpdatePrizeRecord, val), function (data) {
      console.log(data)
      if (data.Code == 0) {
        wx.redirectTo({
          url: '../../game/mythePrize/mythePrize?img=' + that.data.PrizePic + '&prize=' + that.data.prizename,
        })
      }
    })
  }
})