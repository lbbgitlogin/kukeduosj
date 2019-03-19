var app = getApp()
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		pageindex: 1,
		ispage: true,
    issshow: true,
    addressidd:'',
		flag: true, //是否可以进行下次分页
		Info: [],
		latitude: 0,
		longitude: 0,
    pid:0,//商品ID
		isdata: false,
    pageNumber:1,
    pageSize:10
	},
	onLoad: function (options) {
		this.setData({
			adid: options.adid || 0, //判断是否是从订单提交页过来的
      pid: options.pid || 0, //判断是否是从订单提交页过来的
			spid:options.spid || ""
		});
		var that = this;
    wx.getSetting({
      success: function (e) {
        if (!e.authSetting['scope.userLocation']) {
        
          that.setData({

            isdata: true,
            issshow: true,
          });
        } else {
          that.setData({
            isdata: true,
            issshow: false,
          });
        };
      }
    })
		wx.getLocation({
			type: 'wgs84',
			success: function (res) {
				that.setData({
					latitude: res.latitude,
          issshow: false,
					longitude: res.longitude
				});
				that.getNearbylist();
			},
			fail: function () {
				that.setData({
					isdata: true,
          issshow: true,
				});
				// $.alert("授权失败");
			}
		})
	},


	getNearbylist: function () {
		var val = {
			VendorId: app.globalData.VendorInfo.Id,
			Latitude: this.data.latitude,
      ProductId: this.data.pid,
			Longitude: this.data.longitude,
      pageNumber: this.data.pageNumber,
      pageSize:this.data.pageSize
		}
		var thisobj = this;
    $.xsr($.makeUrl(vendorapi.GetServiceVendorStores, val), function (res) {
      console.log(res)
			thisobj.setData({
				isdata: true
			});
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
            ispage: false,
            Info: thisobj.data.Info.concat(res.Info)
          });
        } else {
          thisobj.setData({
            flag: true,
            ispage: true,
            Info: thisobj.data.Info.concat(res.Info)
          });
        }
      } else {
        thisobj.setData({
          flag: false,
          ispage: false,
        });
      }
      // if (res.Code != 0){
      //   thisobj.setData({
      //     isdata: false
      //   })
      // }
		});
	},
  handler: function (e) {
    var that = this
    if (e.detail.authSetting["scope.userLocation"]) {//如果打开了地理位置，就会为true
      console.log("1111111111111111111111111111111")
      that.setData({
        issshow: false,
        isdata: true,

      })
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            issshow: false
          });
          that.getNearbylist();
        },
        fail: function () {
          that.setData({
            isdata: true,
            issshow: true
          });
          // $.alert("授权失败");
        }
      })
    }else{
      console.log("22222222222222222222222222")
      that.setData({
        isdata: true,
        issshow: true
      });
    }
  },

	scrollbottom: function () { //进行分页
		if (this.data.flag) { //判断是否可以进行下次分页
			var thisobj = this;
			clearTimeout(time);
			var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
				thisobj.setData({
					type: thisobj.data.type,
          pageNumber: parseInt(thisobj.data.pageNumber) + 1,
          pageSize: 10
				});
				thisobj.getNearbylist();
			}, 500);
		}
	},
	gotomap: function (e) {
		var that = this;
		wx.openLocation({
			latitude: parseFloat(e.currentTarget.dataset.lat),
			longitude: parseFloat(e.currentTarget.dataset.lng),
			name: e.currentTarget.dataset.name,
			address: e.currentTarget.dataset.address,
			scale: 28
		})
	},
	selectAddress: function (e) {//选择地址

		var thatObj={};
		var thatInfo=this.data.Info;
		for(var i=0;i<thatInfo.length;i++){
			if(thatInfo[i].Id==e.currentTarget.dataset.adid){
				thatObj=thatInfo[i]
			}
		}
		var that=this;
		$.backpage(1, function () { 
			var isv = {
				addressid: that.data.adid,
				spinfo: that.data.spid,
				StoreId: thatObj,
        addressidd: thatObj.Id
			}
			notice.postNotificationName("RefreshOrder", isv);
      //存缓冲
      wx.setStorage({
        key: 'orderInfo',
        data: isv,
        success: function (res) {
          console.log('异步保存成功');
        },
        fail: function () {
          console.log('异步保存失败');
        }

      })
		});
	},
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  }
})