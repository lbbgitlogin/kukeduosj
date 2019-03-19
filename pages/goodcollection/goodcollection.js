var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
var cartapi = require('../../api/cartAPI.js');
Page({
	data: {
		isdata: true, //是否存在数据
		PInfo: [],
		X_Start: 0, //开始滑动的位置
		X_End: 0, //滑动结束的位置
		T_Id: 0, //当前滑动的目标元素
		pageindex: 1, //当前页
		ispage: true, //是否还有数据
		flag: true //是否可以进行下次分页
	},
	onLoad:function() {
    var that = this
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.GetCollectionList(function () {
          if (that.data.PInfo.length == 0) {
            that.setData({
              isdata: false,
              Currency: app.globalData.VendorInfo.Currency
            });
          } else {
            that.setData({
              isdata: true,
              Currency: app.globalData.VendorInfo.Currency
            });
          }
        });
      }, options.uid);
    } else {
      that.GetCollectionList(function () {
        if (that.data.PInfo.length == 0) {
          that.setData({
            isdata: false,
            Currency: app.globalData.VendorInfo.Currency
          });
        } else {
          that.setData({
            isdata: true,
            Currency: app.globalData.VendorInfo.Currency
          });
        }
      });
    }
	},
	cancelCollection:function(even) { //取消收藏
		var thisobj = this;
		wx.showModal({
			title: "提示",
			content: "确认要取消这个商品吗？",
			showCancel: true,
			success: function(res) {
				if(res.confirm) {
					var val = {
						Id: even.currentTarget.dataset.id,
						UserName: app.globalData.UserInfo.UserName
					}
					$.xsr($.makeUrl(userapi.DelUserAttention, val), function(data) {
						thisobj.setData({
							PInfo:[],
							pageindex:1
						});
						thisobj.GetCollectionList();
					})
				}
			}
		});
	},
  tiaozhuan: function () {
    wx.showModal({
      title: '提示',
      content: "抱歉，该商品已失效",
      showCancel: false,
    });

  },
	GetCollectionList:function(callback) {
		this.setData({
			flag: false
		});
		var val = {
			userName: app.globalData.UserInfo.UserName,
			currentPage: this.data.pageindex,
			pageSize: 10
		}
		var that = this;
		$.xsr($.makeUrl(userapi.GetUserAttention, val), function(data) {
      console.log("收藏列表", data)
			if(data.Code == 0) {
				if(that.data.pageindex == 1 && data.Info.length < 8) {
					that.setData({
						PInfo: that.data.PInfo.concat(data.Info),
						flag: false,
						ispage: false
					});
				}else {
					that.setData({
						PInfo: that.data.PInfo.concat(data.Info),
						flag: true,
						ispage: true
					});
				}
			}else {
				that.setData({
					flag: false,
					ispage: false
				});
			}
			callback && callback();
		});
	},
	scrollbottom:function(even) { //滚动到底部进行分页
		if(this.data.flag) { //判断是否可以进行下次分页
			var that = this;
			clearTimeout(time);
			var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
				that.setData({
					pageindex: parseInt(that.data.pageindex) + 1
				});
				that.GetCollectionList();
			}, 500);
		}
	},
	gotoProduct:function(e) {
    if (e.currentTarget.dataset.ptype==2){
      $.gopage("../../server/productdetail/productdetail?pid=" + e.currentTarget.dataset.pid);
    }else{
      $.gopage("../productdetail/productdetail?pid=" + e.currentTarget.dataset.pid);
    }
	},
	removestart:function(even) { //触摸开始
		this.setData({
			X_Start: even.changedTouches[0].clientX
		});
	},
	removeload:function(even) { //触摸中
		this.setData({
			X_End: even.changedTouches[0].clientX
		});
	},
	removeend:function(even) { //触摸结束
		this.setData({
			X_End: even.changedTouches[0].clientX
		});
		this.direction(even.currentTarget.dataset.id);
	},
	direction:function(id) { //判断方向
		var val = {
			xstart: this.data.X_Start,
			xend: this.data.X_End
		}
		if(val.xstart > val.xend) { //表示左滑
			if((val.xstart - val.xend) > 100) {
				this.setData({
					T_Id: id
				});
			}
		} else {
			this.setData({
				T_Id: 0
			});
		}
	}
})