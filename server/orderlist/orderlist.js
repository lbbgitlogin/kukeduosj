var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		tapindex: 1, //当前项
		pageNumber: 1,
		pagesize: 10,
		ispage: true,
		flag: true, //是否可以进行下次分页
		type: 100,
		formId:"",
		orderlist: [],
    show: false,
    isData: true
	},
	onLoad:function(options) {
		// 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          tapindex: (typeof options.sl == "number") ? options.sl:1,
          type: (typeof options.type == "number") ? options.type:100
        })
        that.load()
      }, options.uid);
    } else {
      that.setData({
        tapindex: (typeof options.sl == "number") ? options.sl :1,
        type: (typeof options.type == "number") ? options.type : 100
      })
      that.load()
    }
	},
  onShow: function (){
    //this.load()
  },
  load: function (){
    this.setData({
      tapindex: this.data.tapindex,
      pageNumber: 1,
      pagesize: 10,
      orderlist: [],
      type: this.data.type,
      isData: true,
      Currency: app.globalData.VendorInfo.Currency
    });
    this.getOrderlist();
    var that = this;
    notice.addNotification("RefreshMessage", that.RefreshMessage, that);
  },
  RefreshMessage: function (info) {//刷新订单
    this.setData({
      tapindex: 1,
      pageNumber: 1,
      pagesize: 10,
      orderlist: [],
      ispage: true,
      flag: true, //是否可以进行下次分页
      type: 100,
      isData: true
    });
    this.getOrderlist();
  },
	allOrders:function() { //全部订单
		this.setData({
			tapindex: 1,
			pageNumber: 1,
			pagesize: 10,
			orderlist: [],
      ispage: true,
      flag: true, //是否可以进行下次分页
			type: 100,
      isData: true
		});
		this.getOrderlist();
	},
	toBePaid:function() { //待支付
		this.setData({
			tapindex: 2,
			pageNumber: 1,
			pagesize: 10,
			orderlist: [],
      ispage: true,
      flag: true, //是否可以进行下次分页
			type: 1,
      isData: true
		});
		this.getOrderlist();
	},
	receiptOfGoods:function() { //待服务
		this.setData({
			tapindex: 3,
			pageNumber: 1,
			pagesize: 10,
      ispage: true,
      flag: true, //是否可以进行下次分页
			orderlist: [],
			type: 2,
      isData: true
		});
		this.getOrderlist();
	},
	toBeEvaluated:function() { //已完成
		this.setData({
			tapindex: 4,
			pageNumber: 1,
			pagesize: 10,
      ispage: true,
      flag: true, //是否可以进行下次分页
			orderlist: [],
			type: 4,
      isData: true
		});
		this.getOrderlist();
	},
	scrollbottom:function() { //进行分页
		if(this.data.flag) { //判断是否可以进行下次分页
			var thisobj = this;
			clearTimeout(time);
			var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
				thisobj.setData({
					type: thisobj.data.type,
					pageNumber: parseInt(thisobj.data.pageNumber) + 1,
					pagesize: 10
				});
				thisobj.getOrderlist(); //根据价格排序
			}, 2000);
		}
	},
	getOrderlist:function() { //统一获取订单列表
		var val = {
			userName: app.globalData.UserInfo.UserName,
			vendorId:app.globalData.VendorInfo.Id,
			pageNumber: this.data.pageNumber,
			pageSize: this.data.pagesize,
			type: this.data.type,
		}
		var thisobj = this;
		$.xsr($.makeUrl(orderapi.GetServiceOrderList, val), function(res) {
      console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        thisobj.setData({
          isData: true
        });
				if(res.Info.length < 10) {
					thisobj.setData({
						flag: false,
						ispage: false
					});
					thisobj.setData({
						orderlist: thisobj.data.orderlist.concat(res.Info)
					});
				} else {
					thisobj.setData({
            flag: true,
            ispage: true,
						orderlist: thisobj.data.orderlist.concat(res.Info)
					});
				}
			} else {
				thisobj.setData({
					flag: false,
					ispage: false,
				});
			}
      if ($.isNull(res.Info) && res.Code == 0 && thisobj.data.pageNumber == 1) {
        thisobj.setData({
          isData: false
        })
      }
		});
	},
	cancelOrder:function(e) { //取消订单
		var that=this;
		var val = {
			orderNum: e.currentTarget.dataset.on,
      vendorId: app.globalData.VendorInfo.Id
		}
		$.confirm("是否取消订单", function(res) {
			if(res.confirm) {
				$.xsr($.makeUrl(orderapi.CloseOrder, val), function(data) {
          if (data.Code==0){
              that.setData({
                orderlist: [],
                pageNumber: 1
              });
              that.getOrderlist();
          }else{
            $.alert(data.Msg, function () {
              setTimeout(function () {
                that.setData({
                  orderlist: [],
                  pageNumber: 1
                });
                that.getOrderlist();
              }, 2000)
            });
          }
					
				});
			}
		}, true);
	},
  writeOrder: function (e) { //核销订单
  var that=this
    var val = {
      orderNum: e.currentTarget.dataset.on,
      userId: app.globalData.UserInfo.Id,
    }
    $.confirm("是否核销订单", function (res) {
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.WriteOffServiceOrderUsedByUser, val), function (data) {
            that.setData({
              orderlist: [],
              pageNumber: 1,
              Info: data.Msg,
            });
            if (!$.isNull(data.Msg)&&data.Msg!='ok') {
              that.setData({
                show: true
              })
              setTimeout(function () {
                that.setData({
                  show: false
                })
              }, 2000);
            }
            that.getOrderlist();
        });
      }
    }, true);
  },
	confirmReceipt:function(e){//确认收货
		var val = {
			orderNum: e.currentTarget.dataset.on
		}
		var thisobj = this;
		$.confirm("是否确认收货？",function(res){
			if(res.confirm) {
				$.xsr1($.makeUrl(orderapi.UpdateOrdersbyOrderNum, val), function(data) {
					$.alert("已确认收货！",function(){
						thisobj.setData({
							orderlist: [],
							pageNumber: 1
						});
						thisobj.getOrderlist();
					});
				});
			}
		},true);
	},
	gotopay:function(e) { //去支付
		this.setData({
			formId:e.detail.formId
		});
		var val = {
			OrderNum: e.currentTarget.dataset.on,
			OpendId: app.globalData.UserInfo.WeiXinOpenId,
			VendorId: app.globalData.VendorInfo.Id
		}
		var thisobj = this;
		$.xsr($.makeUrl(orderapi.GetWeiXinPrePayNum, val), function(data) {
			wx.requestPayment({
				'timeStamp': data.Info.timeStamp,
				'nonceStr': data.Info.nonceStr,
				'package': data.Info.package,
        'signType': data.Info.signType,
				'paySign': data.Info.paySign,
				'success': function(res) {
					thisobj.sendMessage(e.currentTarget.dataset.on);
					$.alert("支付成功！", function() {
						thisobj.setData({
							orderlist: [],
							currentPage: 1
						});
						thisobj.getOrderlist();
					});
				},
				'fail': function(res) {
					console.log("支付失败：", res);
				}
			})
		});
	},
	sendMessage:function(OrderNum){//发送模版消息
		var val={
			api:orderapi.OrderPaySuccessWXMessage,
			pages:'pages/orderdetail/orderdetail?on='+OrderNum,
			formId:this.data.formId,
			WeiXinOpenId:app.globalData.UserInfo.WeiXinOpenId,
			value:{
				vendorId:app.globalData.VendorInfo.Id,
				OrderNum:OrderNum
			}
		}
		$.sendTpl(val);
	}
})