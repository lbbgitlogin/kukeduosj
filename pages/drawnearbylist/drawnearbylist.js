var app = getApp()
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		pageindex: 1,
		ispage: false,
		flag: true, //是否可以进行下次分页
		Info: [],
    tw:'',
		latitude: 0,
    issshow:true,
		longitude: 0,
    pid:0,//商品ID
		isdata: false,
    pageNumber: 1,
    pageSize: 10
	},
	onLoad: function (options) {
    console.log("订单传过来的：",options);
		this.setData({
			adid: options.adid || 0, //判断是否是从订单提交页过来的
      pid: options.pid || 0, //判断是否是从订单提交页过来的
			spid:options.spid || ""
		});
		var that = this;
    wx.getSetting({
      success: function (e) {
        if (!e.authSetting['scope.userLocation']) {// 未打开授权

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
          longitude: res.longitude,
          issshow: false
				});
				that.getNearbylist();
			},
			fail: function () {
				that.setData({
					isdata: true,
          issshow : true
				});
				// $.alert("授权失败");
			}
		})
	},
  handler: function (e) {
   var that=this
    if (e.detail.authSetting["scope.userLocation"]) {//如果打开了地理位置，就会为true
      this.setData({
        issshow: false,
        isdata:true,
   
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
      that.setData({
        isdata: true,
        issshow: true
      });
    }
    },
  // onReady: function () {
  //   var that = this;
  //   wx.getSetting({
  //     success: (res) => {
  //       console.log("re:",res);
  //       console.log(res.authSetting['scope.userLocation']);
  //       debugger
  //       if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
  //         console.log("44444")
  //       } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
  //         console.log("555555")
  //         village_LBS(that);
  //         that.onLoad()
  //       }
  //     }
  //   })
  // },
	getNearbylist: function () {
		var val = {
      vendorId: app.globalData.VendorInfo.Id,
      productIdSet: this.data.pid,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize
		}
    console.log(val)
		var thisobj = this;
    $.xsr($.makeUrl(vendorapi.GetPhysicalStoreListForUserTaking, val), function (res) {
      console.log(res)
      if (!$.isNull(res.Info) && res.Code == 0) {
        thisobj.setData({
          isdata: true,
        });
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
          ispage: false
        });
      } 
		});
	},
  // shezhi:function(){
  //   wx.openSetting({

  //   })
  // },
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
         tw:false
			}
      console.log("isv",isv)
			notice.postNotificationName("RefreshOrder1", isv);
      wx.setStorage({ //写入缓存
        key: "msk-ads",
        data: isv,
      });
		});
	},
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  }
})