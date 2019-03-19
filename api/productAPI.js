var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetProductInfo: { //获取商品信息
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductById',
    post: {
      proId: '?',
      userName: '?',
      eventId: '?'
    }
  },

  GetProductBaseInfo: { //商品详情 基本信息接口
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductBaseInfoNoEncry',
    post: {
      productId: '?',
      isCache: true
    }
  },

  GetProductSKUInfo: { //获取商品价格详细数据
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductNoEncrySKUAndPriceList',
    post: {
      productId: '?',
      isCache: true,
      eventId: "?",
      // specIdStr: '?',
    }
  },


  GetProductCommentInfo: { //获取商品详情非核心数据接口
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductCommentInfoNoEncry',
    post: {
      productId: '?',
      userName: '?',
      isCache: true,
    }
  },
  GetProductMarketingInfo: { //获取商品参与促销活动信息
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductMarketingInfoNoEncry',
    post: {
      productId: '?',
      eventId:"?",
      userId: "?",
      isCache: true,
    }
  },
  GetProductList: { //获取商品列表
    url: cf.config.configUrl + 'ShopWebService.asmx/GetProductListByPosition',
    post: {
      storeID: '?',
      cid: '?', //分类ID
      pname: '?', //商品名称
      orderby: '?', //排序条件
      sort: '?', //排序方式
      isnew: '?', //是否新品
      pageindex: '?', //当前页
    }
  },
  GetProductListByPositionForTakeAway: { //获取商品列表
    url: cf.config.configUrl + 'ShopWebService.asmx/GetProductListByPositionForTakeAwayNoEncry',
    post: {
      storeID: '?',
      cid: '?', //分类ID
      pname: '?', //商品名称
      orderby: '?', //排序条件
      sort: '?', //排序方式
      isnew: '?', //是否新品
      pageindex: '?', //当前页
      userAccount: '?',
      isCache: true
    }
  },
  GetTakeoutTemplateCouponList: { //外卖模板增加领取优惠券入口
    url: cf.config.configUrl + 'ShopWebService.asmx/GetTakeoutTemplateCouponList',
    post: {
      vendorId: '?',
      userId: '?', 
    }
  },

  // GetProductListByPositionForTakeAway: { //获取商品列表
  //   url: cf.config.configUrl + 'ShopWebService.asmx/GetProductListByPositionForTakeAway',
  //   post: {
  //     storeID: '?',
  //     cid: '?', //分类ID
  //     pname: '?', //商品名称
  //     orderby: '?', //排序条件
  //     sort: '?', //排序方式
  //     isnew: '?', //是否新品
  //     pageindex: '?', //当前页
  //     userAccount: '?',
  //   }
  // },
  GetProductlistSpc: { //根据规格筛选
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductByproidandSpecV2',
    post: {
      Spec: '?',
      userName: '?',
      eventId: '?',
      proId: '?'
    }
  },
  AddAttention: { //收藏商品
    url: cf.config.configUrl + 'UserWebService.asmx/AddUserAttention',
    post: {
      userName: '?',
      proId: '?'
    }
  },
  DelUserAttention: { //取消收藏
    url: cf.config.configUrl + 'UserWebService.asmx/DeleteUserAttentionById',
    post: {
      Id: '?',
      UserName: '?'
    }
  },
  GetSmallCategory: { //获取分类
    url: cf.config.configUrl + 'ShopWebService.asmx/GetSmallCategoryNoEncry',
    post: {
      storeID: '?',
      tableNum: '?',
      isCache: true
    }
  },
  getProductCommentList: {
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/getProductCommentList',
    post: {
      ProductNumber: '?',
      VendorId: '?',
      Grade: '?',
      pageIndex: '?'
    }
  },
  GetServiceProductList: {
    url: cf.config.configUrl + 'ServiceProudctWebService.asmx/GetServiceProductListNoEncry',
    post: {
      vendorId: '?',
      shopProductCategoryId: '?',
      productName: '?',
      isNew: '?',
      orderByType: '?',
      pageNumber: '?',
      sortDirection: '?',
      isCache: true
    }
  },
  GetServiceProduct: { //获取商品信息
    url: cf.config.configUrl + 'ServiceProudctWebService.asmx/GetServiceProduct',
    post: {
      productId: '?',
      userName: '?',
      eventId: '?',
    }
  },
  getProductType: { //获取商品类型
    url: cf.config.configUrl + 'ProudctWebService.asmx/getProductType',
    post: {
      productId: '?'
    }
  },
  GetVendorCutPriceEventDetail: { //获取商家砍价活动详情
    url: cf.config.configUrl + 'CutPriceEventWebService.asmx/GetVendorCutPriceEventDetail',
    post: {
      marketingEventId: '?',
      sponsorId: "?",
      participantId: "?",
      productSkuId:"?"
    }
  },
  GetOtherCutPriceActivityList: { //获取单个砍价活动帮砍人列表
    url: cf.config.configUrl + 'CutPriceEventWebService.asmx/GetOtherCutPriceActivityList',
    post: {
      marketingEventId: "?",
      sponsorId: "?",
      pageNumber: "?",
      pageSize: "?"
    }
  },
  GetUserCutPriceActivityList: { //获取会员发起或参与的砍价活动列表
    url: cf.config.configUrl + 'CutPriceEventWebService.asmx/GetUserCutPriceActivityListNoEncry',
    post: {
      vendorId: '?',
      sponsorId: "?",
      participantId: "?",
      pageNumber: "?",
      pageSize: "?",
      isCache: true
    }
  },
  CutPrice: { //砍价
    url: cf.config.configUrl + 'CutPriceEventWebService.asmx/CutPrice',
    post: {
      vendorId: '?',
      marketingEventId: "?",
      sponsorId: "?", //发起人
      participantId: "?", //帮砍人
      productSkuId:"?"
    }
  },
  GetServiceProductBaseInfo: { //服务商品详情 基本信息接口
    url: cf.config.configUrl + 'ServiceProudctWebService.asmx/GetServiceProductBaseInfoNoEncry',
    post: {
      productId: '?',
      isCache: true
    }
  },
  GetServiceProductSKUInfo: { //服务获取商品价格详细数据
    url: cf.config.configUrl + 'ServiceProudctWebService.asmx/GetServiceProductSKUInfo',
    post: {
      productId: '?',
      specIdStr: '?',
    }
  },
  GetServiceProductCommentInfo: { //服务获取商品详情非核心数据接口
    url: cf.config.configUrl + 'ServiceProudctWebService.asmx/GetServiceProductCommentInfoNoEncry',
    post: {
      productId: '?',
      userName: '?',
      isCache: true
    }
  },
  GetServiceProductMarketingInfo: { //服务获取商品参与促销活动信息
    url: cf.config.configUrl + 'ServiceProudctWebService.asmx/GetServiceProductMarketingInfoNoEncry',
    post: {
      productId: '?',
      eventId: "?",
      userId:"?",
      isCache: true
    }
  },
}