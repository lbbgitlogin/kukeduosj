var app = getApp()
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
	data: {
		pageindex: 1,
    ispage: false,
    flag: true, //是否可以进行下次分页
		Info: [],
		latitude:0,
		longitude:0,
		isdata:false,
    pageNumber: 1,
    pageSize: 10,
    isData:true
	},
	onLoad: function (options) {
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
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              isdata: true,
              issshow: false
            });
            that.getNearbylist();
          },
          fail: function () {
            that.setData({
              isdata: true,
              issshow: true
            });
          
          }
        })	
      }, options.uid);
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            isdata: true,
            issshow: false
          });
          that.getNearbylist();
        },
        fail: function () {
          that.setData({
            isdata: true,
            issshow: true
          });
       
        }
      })	
    }
	},


	getNearbylist: function () {
		var val = {
			VendorId: app.globalData.VendorInfo.Id,
			Latitude:this.data.latitude,
			Longitude:this.data.longitude,
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize
		}
	
		var thisobj = this;
		$.xsr($.makeUrl(vendorapi.GetVendorStores, val), function (res) {
      console.log(res)
			thisobj.setData({
				isData:true
			});
      if (!$.isNull(res.Info) && res.Code == 0) {
        if (res.Info.length < 10) {
          thisobj.setData({
            flag: false,
            Info: thisobj.data.Info.concat(res.Info)
          });
        } else {
          thisobj.setData({
            ispage: true,
            Info: thisobj.data.Info.concat(res.Info)
          });
        }
      } else {
        thisobj.setData({
          flag: false,
          ispage: true,
          // isData: false
        });
      }
      if (res.Code != 0 && thisobj.data.pageNumber == 1) {
        thisobj.setData({
          isData: false
        })
      }
      // if ($.isNull(res.Info) && res.Code == 0 && thisobj.data.pageNumber == 1) {
      //   thisobj.setData({
      //     isData: false
      //   })
      // }
		});
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
	// selectAddress: function () {//选择地址
  //   var that = this;
  //   wx.chooseAddress({
  //     success: function (res) {//授权成功，走调用地址
  //       var val = {
  //         cityName: res.cityName,
  //         countyName: res.countyName,
  //         provinceName: res.provinceName,
  //         detailInfo: res.detailInfo,
  //         errMsg: res.errMsg,
  //         userName: res.userName,
  //         nationalCode: res.nationalCode,
  //         postalCode: res.postalCode,
  //         telNumber: res.telNumber,
  //         UserId: app.globalData.UserInfo.Id
  //       }
  //       $.xsr($.makeUrl(orderapi.selectAddressInfo, val), function (data) {
  //         console.log("授权成功", data);
  //         that.setData({
  //           addressid: data.Info.id
  //         });
  //         that.getcartlist();
  //       });
  //     },
  //     fail: function (res) {//授权失败，继续走原来的
  //       // if (that.data.addressid > 0) {
  //       //   $.gopage("../addresslist/addresslist?adid=" + that.data.submitinfo.DeliveryAddress.id + (that.data.spinfo == '' ? '' : '&spid=' + that.data.spinfo));
  //       // } else {
  //       //   $.gopage("../addressmanage/addressmanage?adid=-1&issub=true" + (that.data.spinfo == '' ? '' : '&spid=' + that.data.spinfo));
  //       // }
  //     }
  //   })
  // }
  handler: function (e) {
var that=this;
    if (e.detail.authSetting["scope.userLocation"]) {//如果打开了地理位置，就会为true
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
            isdata: true,
            issshow: false
          });
          that.getNearbylist();
        },
        fail: function () {
          that.setData({
            isdata: true,
            issshow: true
          });

        }
      })	
    }else{
  
    }
    
  },
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  }
})