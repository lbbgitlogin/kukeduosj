var app = getApp()
var $ = require('../../utils/util.js')
var api = require('../../api/categoryAPI.js')
var vendorApi = require('../../api/vendorAPI.js')
Page({
	data: {
		fid: 0,
		Category: [], //一级分类
		CategoryTwo: [], //二级分类
    Info:[],
    isShow:true,
    isData: true
	},
	onLoad:function(options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.load();
      }, options.uid);
    } else {
      that.load();
    }
	},
  load:function(){
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      category: 'ShopCategory.ShowMode'
    }
    var that = this
  
// 修改接口

    $.xsr($.makeUrl(vendorApi.GetVendorSetting, val), function (data) {
      if (data.Info == 0) {
        that.setData({
          isShow: false
        })
      } else {
        that.setData({
          isShow: true
        })
      }
    });
    this.GetCategoryList();
    this.GetShopProductCategoryInfoTile()
  },
	ckCategoryitem:function(even) {
		this.setData({
			storeID: app.globalData.VendorInfo.Id,
			fid: even.currentTarget.dataset.id,
      CategoryTwo: null
		});
		this.GetCategoryList();
	},
	GetCategoryList:function() { //统一获取分类
		var thisobj = this;
		var val = { 
			storeID: app.globalData.VendorInfo.Id,
			fatherCategoryId: this.data.fid
		}
		$.xsr($.makeUrl(api.GetCategorylist, val), function(data) {
			if(val.fatherCategoryId == 0) {
				thisobj.setData({
					Category: data.Info
				});
				if(data.Info.length > 0) {
					thisobj.setData({
						fid: data.Info[0].Id
					});
					thisobj.GetCategoryList();
				}else{
          thisobj.setData({
            isData: false
          })
        }
			} else {
				thisobj.setData({
					CategoryTwo: data.Info
				});
			}
		});
	},
  GetShopProductCategoryInfoTile:function(){
    var thisobj = this;
    var val = {
      storeID: app.globalData.VendorInfo.Id,
    }
    $.xsr($.makeUrl(api.GetShopProductCategoryInfoTile, val), function (data) {
      console.log("分类：",data)
      if (data.Info.length > 0){
        thisobj.setData({
          Info: data.Info
        })
      }else{
        thisobj.setData({
          isData: false
        })
      }
    });
  }
})