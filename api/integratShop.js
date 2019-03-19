var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetVendorEPointSetting: { //获取商家积分兑换设置
    url: cf.config.configUrl + 'Epoint.asmx/GetVendorEPointSetting',
    post: {
      vendorId: "?"
    }
  },
  findUsablePoint: { // 查询可用积分，积分，成长值，传值
    url: cf.config.configUrl + 'UserWebService.asmx/findUsablePoint',
    post: {
      UserId: '?',
      VendorId: "?"
    }
  },
  GetFavoriteEPointEventList: { //  获取参与人次最多的兑换活动列表
    url: cf.config.configUrl + 'Epoint.asmx/GetFavoriteEPointEventList',
    post: {
      vendorId: "?"
    }
  },
  GetEPointCouponList: { //  获取积分兑换优惠券列表
    url: cf.config.configUrl + 'Epoint.asmx/GetEPointCouponList',
    post: {
      vendorId: "?",
      swithType: 1,
      minPoint: "?",
      maxPoint: "?",
      pageSize: "?",
      pageIndex: "?"
    }
  },
  GetEPointProductList: { //  获取积分兑换商品列表
    url: cf.config.configUrl + 'Epoint.asmx/GetEPointProductList',
    post: {
      vendorId: "?",
      swithType: 1,
      minPoint: "?",
      maxPoint: "?",
      pageSize: "?",
      pageIndex: "?"
    }
  },
  ExchangeCoupon: { //  获取积分兑换优惠券
    url: cf.config.configUrl + 'Epoint.asmx/ExchangeCoupon',
    post: {
      vendorId: "?",
      userId: "?",
      couponId: "?"
    }
  },

  GetMemberExchangeActivityList: { //  获取会员兑换记录列表
    url: cf.config.configUrl + 'Epoint.asmx/GetMemberExchangeActivityList',
    post: {
      vendorId: "?",
      userId: '?',
      pageSize: "?",
      pageIndex: "?"
    }
  },
  GetPointProductBaseInfo: { //积分商品详情 基本信息接口
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetPointProductBaseInfoNoEncry',
    post: {
      productId: '?',
      isCache: true
    }
  },
  GetPointProductCommentInfo: { //获取商品详情非核心数据接口
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetPointProductCommentInfoNoEncry',
    post: {
      productId: '?',
      userName: '?',
      isCache: true
    }
  },
  GetPointProductSKUAndPriceList: { //获取商品价格详细数据
    url: cf.config.configUrl + 'ProudctWebService.asmx/GetPointProductSKUAndPriceListNoEncry',
    post: {
      productId: '?',
      isCache: true
    }
  },

  GoSettlement: { //去结算
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/AddPointOrderInformation',
    post: {
      userAccount: "?", //用户名
      couponItemId: '?', //优惠券ID
      IsUseCoupon: '?', // 0：表示用户不想使用优惠券  1;表示用户想使用优惠券
      addressId: '?', //地址ID
      ShoppingCartList: '?', //要结算的购物车数据
      isFightGroup: '?', //是否使用活动价格
      shipMethod: "?",
      marktingEventId: "?",
      sponsorId: "?"
    }
  },
  SubmitOrders: { //提交订单信息
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/AddPointOrderDetail',
    post: {
      userName: '?',
      ShoppingCartList: '?',
      ShoppingCartVendorList: '?',
      couponItemId: '?',
      payTypeId: '?',
      addressId: '?',
      remark: '?',
      invoiceTitle: '?',
      orderType: "?",
      marketingEventId: "?",
      isOwner: "?",
      ownGroupId: "?",
      isFightGroup: "?",
      memberDiscount: "?",
      memberDiscountMoney: "?",
      usingPoint: "?",
      pointAsCashMoney: "?",
      shipMethod: "?",
      reservationDate: "?",
      reservationStoreId: "?",
      consignee: "?",
      userTel: "?",
      marktingEventId: "?",
      sponsorId: "?",
      tableNum: "?",
      guestCount: "?",
      firstType: "?",
      eCardCash: "?", // 使用的储值余额
      extraCash: "?", // 使用的储值赠送余额
      estimatedArriveTime: "?",
      preferredStoreId: "?"
    }
  },
  GetWeiXinPrePayNum: { //获取预支付单号
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/GetWeiXinPrePayNum',
    post: {
      OrderNum: "?",
      VendorId: '?',
      OpendId: '?'
    }
  },


  GetMemberPointContent: { //  获取积分解读数据
    url: cf.config.configUrl + 'Epoint.asmx/GetMemberPointContent',
    post: {
      vendorId: "?",
    }
  },
}