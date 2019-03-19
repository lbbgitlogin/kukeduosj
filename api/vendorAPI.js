var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
	GetVendorStores: { //获取商家门店信息
    url: cf.config.configUrl + 'ShopWebService.asmx/GetVendorStoresNoEncry',
		post: {
			VendorId: '?',
			Latitude  :'?',
			Longitude :'?',
      pageNumber:"?",
      pageSize:"?",
      isCache: true
		}
	},
  GetServiceVendorStores: { //获取商家门店信息
    url: cf.config.configUrl + 'ShopWebService.asmx/GetServiceVendorStores',
    post: {
      VendorId: '?',
      Latitude: '?',
      ProductId:'?',
      Longitude: '?',
      pageNumber: "?",
      pageSize: "?"
    }
  },
  GetServiceVendorStoreInfoByStoreId: { //获取商家门店信息
    url: cf.config.configUrl + 'ShopWebService.asmx/GetServiceVendorStoreInfoByStoreId',
    post: {
      VendorId: '?',
      Latitude: '?',
      ProductId: '?',
      Longitude: '?',
      storeId: '?' 
    }
  },
  ShopInfo: { //获取商家门店信息
    url: cf.config.configUrl + 'ShopWebService.asmx/ShopInfo',
    post: {
      GUID: cf.config.GUID
    }
  },
  GetPhysicalStoreListForUserTaking: { //获取商家门店信息
    url: cf.config.configUrl + 'PhysicalStoreWebService.asmx/GetPhysicalStoreListForUserTaking',
    post: {
      vendorId: '?',
      productIdSet:"?",
      latitude: "?",
      longitude: "?",
      pageNumber: "?",
      pageSize: "?"
    }
  },
  GetPhysicalStoreInfoByStoreId: { //获取商家门店信息
    url: cf.config.configUrl + 'PhysicalStoreWebService.asmx/GetPhysicalStoreInfoByStoreId',
    post: {
      vendorId: '?',
      productIdSet: "?",
      latitude: "?",
      longitude: "?",
      storeId : "?"
    }
  },
  GetVendorECashCardList: { //获取商家储值卡列表
    url: cf.config.configUrl + 'ECashWebService.asmx/GetVendorECashCardList',
    post: {
      vendorId: '?',
    }
  },
  GetVendorSetting: { //商家分类设置 
    url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorSetting',
    post: {
      vendorId : '?',
      category:"?"
    }
  },
  GetRecommendedProductList: { //为您推荐
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/GetRecommendedProductList',
    post: {
      vendorId: '?',
      pageSize:'?',
      pageIndex:'?' 
    }
  },
  QRGameCardCodePoster: { //集卡分享到朋友圈
    url: cf.config.configUrl + 'UserWebService.asmx/QRGameCardCodePoster',
    post: {
      VendorId: '?',
      UserInfoId: '?',
      Path: '?',
      GameName:"?",
      isCache: true,
      GamePic:'?',
      EndTime:'?',
      NCardTypeNum:'?'
    }
  },
}