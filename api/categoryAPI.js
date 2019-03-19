var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetCategorylist: { //获取商家分类
    url: cf.config.configUrl + 'ShopWebService.asmx/GetShopProductCategoryInfoNoEncry',
    post: {
      isCache:true,
      storeID: '?',
      fatherCategoryId: '?'
    }
  },

  GetShopProductCategoryInfoTile: { //获取商家分类
    url: cf.config.configUrl + 'ShopWebService.asmx/GetShopProductCategoryInfoTileNoEncry',
    post: {
      storeID: '?',
      isCache: true,
    }
  }
}