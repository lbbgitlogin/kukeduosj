var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var venapi = require('../../api/vendorAPI.js');
Page({
	data: {
		OrderInfo: {},
		formId:"",
    showdate: "",
    showname: "",
    showRPK: true,
    ActivityGroupId: 0,
    maxRPK: 0,
    deduction: 0,
    type: 0,
    isnav: true,
    screenHeight: 0,
    isquicknav: false,
    ProductList: [],
    ispage: false,
    flag: false,
    pageSize: 6,
    pageIndex: 1,
	},
	onLoad:function(options) {
		var that=this;
    this.setData({
      showdate: options.showdate,
      showname: options.showname,
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
		// 页面初始化 options为页面跳转所带来的参数
		if ($.isNull(app.globalData.UserInfo)) {
			app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
				that.InitPage(options);
			},options.uid);
		} else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
			that.InitPage(options);
		}
    this.GetRecommendedProductList()
	},
	InitPage:function(options){
		var val = {
			orderNum: options.on
		}
		var thisobj = this;
		$.xsr($.makeUrl(orderapi.GetServiceOrder, val), function(data) {
      console.log("sssss",data)
			thisobj.setData({
				OrderInfo: data.Info[0]
			});
      
		});
	},
  call:function(){//联系商家
    wx.makePhoneCall({
      phoneNumber: this.data.OrderInfo.StorePhone,
    })
  },
  cancelOrder: function (e) { //取消订单
    var val = {
      orderNum: e.currentTarget.dataset.on
    }
    $.confirm("是否取消订单", function (res) {
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.CloseOrder, val), function (data) {
          $.alert("取消成功！", function () {
            $.backpage(1, function () {
              var isv = {

              }
              notice.postNotificationName("RefreshMessage", isv);
            });
          });
        });
      }
    }, true);
  },
  writeOrder: function (e) { //核销订单
    var val = {
      orderNum: e.currentTarget.dataset.on,
      userId: app.globalData.UserInfo.Id,
    }
    $.confirm("是否核销订单", function (res) {
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.WriteOffServiceOrderUsedByUser, val), function (data) {
          $.alert("核销成功！", function () {
            $.backpage(1, function () {
              var isv = {

              }
              notice.postNotificationName("RefreshMessage", isv);
            });
          });
        });
      }
    }, true);
  },
	sendMessage:function(OrderNum){//发送模版消息
		var val={
			api:orderapi.OrderPaySuccessWXMessage,
			pages:'pages/orderdetail/orderdetail?on='+OrderNum,
			formId:this.data.formId,
			WeiXinOpenId:app.globalData.UserInfo.WeiXinOpenId,
			value:{
				VendorId:app.globalData.VendorInfo.Id,
				OrderNum:OrderNum
			}
		}
		$.sendTpl(val);
  },
  onShareAppMessage: function () {//分享
    var that = this;
    return {
      title: "拼手气红包，第" + this.data.maxRPK + "个领取的红包最大!",
      imageUrl: 'http://kkdfile.kukeduo.cn/appicon/shareImg.png',
      path: 'pages/redpacket/redpacket?g=' + this.data.ActivityGroupId + "&n=" + this.data.maxRPK+"&uid="+app.globalData.UserInfo.Id,
      success: function () {
        var val = { sponsorId: app.globalData.UserInfo.Id, audienceType: 1, audienceId: 0, ContentType: 22, contentId: that.data.ActivityGroupId }
        $.xsr1($.makeUrl(orderapi.ShareCount, val), function (data) {
          console.log("分享:", val, data);
        });
      }
    }
  },
  shareQRCode: function (e) {
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      sponsorId: app.globalData.UserInfo.Id,
      imageUrl: 'http://kkdfile.kukeduo.cn/appicon/shareImg.png',
      path: 'pages/redpacket/redpacket?g=' + this.data.ActivityGroupId+ "&n=" + this.data.maxRPK+"&uid="+app.globalData.UserInfo.Id,
      luckyOrder: this.data.maxRPK
    }
    $.xsr($.makeUrl(orderapi.ShareLuckyRedPacket, val), function (data) {
      that.setData({
        PageQRCodeInfo: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT: true
        }
      });
    });
  },
  shareBox: function () {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function () {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function () {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function (res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            that.setData({
              PageQRCodeInfo: {
                Path: '',
                IsShare: false,
                IsShareBox: false,
                IsJT: false
              }
            });
            $.alert("保存图片成功！");
            $.xsr1($.makeUrl(orderapi.ShareCount, { sponsorId: app.globalData.UserInfo.Id, audienceType: 3, audienceId: 0, ContentType: 22, contentId: that.data.ActivityGroupId }));
          },
          fail: function (e) {
            $.hideloading();
            console.log("保存图片失败：", e)
          }
        });
      }, fail: function (e) {//下载图片出错
        $.hideloading();
      }
    })
  },
  showCodeImg: function () {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  IsShowRPK: function () {
    var that = this;
    if (that.data.showRPK) {
      setTimeout(function () {
        that.setData({
          showRPK: false
        });
      }, 250);
    } else {
      that.setData({
        showRPK: true
      });
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
    }, 400)
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