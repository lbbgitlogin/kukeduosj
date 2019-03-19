var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetAdContent: { //获取首页广告版位
    url: cf.config.configUrl + 'ShopWebService.asmx/ShopHomeTemplate',
    post: {
      StoreID: '?',
      Platform: 'MiniApp'
    }
  },
  NewAdContent: {
    url: cf.config.configUrl + 'ShopWebService.asmx/NewAdContent',
    post: {
      VendorId: '?'
    }
  },
  NewAdContentTow: {
    url: cf.config.configUrl + 'ShopWebService.asmx/NewAdContentTow',
    post: {
      VendorId: '?',
      isCache: true
    }
  },
  getUserSecondaryPage: {//获取用户信息及获取店铺信息
    url: cf.config.configUrl + 'userWebService.asmx/getUserSecondaryPage',
    post: {
      VendorId: '?',
      Id: '?',
      isCache: true
    }
  },
  SubmitFormData: { //获取店铺信息
    url: cf.config.configUrl + 'ShopWebService.asmx/NewSubmitFormData',
    post: {
      VendorId: "?",
      UserId: "?",
      SubmitInfo: "?",
      SubmitNum: '?',
      PageId: "?"
    }
  },
  GetShopInfo: { //获取店铺信息
    url: cf.config.configUrl + 'UserWebService.asmx/GetShopInfo',
    postData: {
      GUID: cf.config.GUID
    }
  },
  AddNewUser: {//添加小程序用户
    url: cf.config.configUrl + 'UserWebService.asmx/AddNewUser',
    post: {
      NickName: '?',
      sex: '?',
      photo: '?',
      WXCountry: '?',
      WXCity: '?',
      code: '?',
      WXProvince: '?',
      Uid: '?',
      storeId: '?',
      VendorId: '?'
    }
  },
  NewSendTemplateMessage: {
    url: cf.config.configUrl + 'WXTmessageWS.asmx/NewSendTemplateMessage',
    post: {
      VendorId: "?",
      UserId: "?",
      FormId: "?",
      MessageType: "?",
      TplKey: "?",
      WXOpendId: "?",
      PageUrl: "?",
      TplData: "?"
    }
  },
  GetVendorLogisticsSetting: {//获取商家配送设置（快递发货/同城配送）
    url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorLogisticsSetting',
    post: {
      vendorId: "?",
    }
  },
  UserLogin: { //用户登录，看是否新商家
    url: cf.config.configUrl + 'UserWebService.asmx/UserLogin',
    post: {
      code: '?',
      NickName: '?',
      sex: '?',
      photo: '?',
      WXCountry: '?',
      WXCity: '?',
      code: '?',
      WXProvince: '?',
      Uid: '?',
      storeId: '?'
    }
  },
  GetVendorMiniAppAdSetting: {//获取首页广告
    url: cf.config.configUrl + 'MiniAppAdWebService.asmx/GetVendorMiniAppAdSetting',
    post: {
      vendorId: "?",
    }
  },
  UserClickMiniAppAd: {//点击广告
    url: cf.config.configUrl + 'MiniAppAdWebService.asmx/UserClickMiniAppAd',
    post: {
      userId: "?",
      adId: "?"
    }
  },
  GetMiniAppComponentSaleList: {
    url: cf.config.configUrl + 'MiniAppComponentWebService.asmx/GetMiniAppComponentSaleList',
    post: {
      productId: []
    }
  },
  GetMinAppHomeTemplate: {
    url: cf.config.configUrl + 'ShopWebService.asmx/GetMinAppHomeTemplate',
    post: {
      StoreID: '?',
      Platform: 'MiniApp',
      isCache: true
    }
  }

}