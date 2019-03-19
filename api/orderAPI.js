var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  SubmitOrders: { //提交订单信息
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/AddOrderDetail',
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
      eCardCash: "?",// 使用的储值余额
      extraCash: "?",// 使用的储值赠送余额
      estimatedArriveTime: "?",
      preferredStoreId:"?",
      arriveTimeType:"?"
    }
  },
  GetOrderList: { //获取订单列表
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/GetOrderByCreateTimeV2NoEncry',
    post: {
      VendorId: '?',
      userName: '?',
      num: 1,
      currentPage: '?',
      pageSize: '?',
      type: '?',
      isCache: true
    }
  },
  GetOrderInfo: { //获取订单详情
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/GetOrderByOrderNum',
    post: {
      orderNum: '?',
      userId: '?'
    }
  },
  CloseOrderByOrderNum: { //取消订单
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/CloseOrderByOrderNum',
    post: {
      orderNum: '?'
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
  UpdateOrdersbyOrderNum: { //确认收货
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/UpdateOrdersbyOrderNum',
    post: {
      orderNum: "?"
    }
  },
  ExpressQuery: {//查询物流进度
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/ExpressQuery',
    post: {
      OrderNum: "?"
    }
  },
  OrderSubmitMessage: {//订单提交成功生成模版信息
    url: cf.config.configUrl + 'WXTmessageWS.asmx/OrderSubmitMessage',
    post: {
      VendorId: "?",
      OrderNum: "?"
    }
  },
  OrderPaySuccessWXMessage: {//支付成功生成模版信息
    url: cf.config.configUrl + 'WXTmessageWS.asmx/OrderPaySuccessWXMessage',
    post: {
      VendorId: "?",
      OrderNum: "?"
    }
  },
  getProductComment: {//查询评论
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/getProductComment',
    post: {
      OrderNum: '?',
      VendorId: '?',
      UserId: '?'
    }
  },
  getServiceProductComment: {//查询服务商品评论
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/getServiceProductComment',
    post: {
      OrderNum: '?',
      VendorId: '?',
      UserId: '?'
    }
  },
  upProductCommentImg: {//上传评论图片
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/upProductCommentImg' + "?GUID=" + cf.config.GUID
  },
  sendProductComment: {//发表评论
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/sendProductComment',
    post: {
      Logisticsservice: '?',
      OrderNum: '?',
      UserId: '?',
      VendorId: '?',
      VendorScore: '?',
      ProductCommentList: []
    }
  },
  selectAddressInfo: {//选择地址
    url: cf.config.configUrl + 'ProudctWebService.asmx/selectAddressInfo',
    post: {
      cityName: "?",
      countyName: "?",
      provinceName: "?",
      detailInfo: "?",
      errMsg: "?",
      userName: "?",
      nationalCode: "?",
      postalCode: "?",
      telNumber: "?",
      UserId: "?"
    }
  },
  ServiceOrderWebService: { //提交订单信息
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/AddServiceOrderDetail',
    post: {
      userName: '?',
      ShoppingCartList: '?',
      ShoppingCartVendorList: '?',
      couponItemId: '?',
      payTypeId: '?',
      // addressId: '?',
      remark: '?',
      invoiceTitle: '?',
      orderType: "?",
      marketingEventId: "?",
      isOwner: "?",
      ownGroupId: "?",
      isFightGroup: "?",
      servicePlaceCode: "?",
      payMehodCode: "?",
      physicalStoreId: "?",
      reservingTime: "?",
      userAddress: "?",
      userTel: "?",
      consignee: "?",
      memberDiscount: "?",
      memberDiscountMoney: "?",
      usingPoint: "?",
      pointAsCashMoney: "?",
      marktingEventId: "?",
      sponsorId: "?",
      firstType: "?",
      eCardCash: "?",// 使用的储值余额
      extraCash: "?",// 使用的储值赠送余额
      CustomRequiredOne: '?',
      CustomRequiredOneLabel: '?',
      CustomRequiredTwo: '?',
      CustomRequiredTwoLabel: '?',
      CustomRequiredThree: '?',
      CustomRequiredThreeLabel: '?',
      CustomOptionalOne: '?',
      CustomOptionalOneLabel: '?',
      CustomOptionalTwo: '?',
      CustomOptionalTwoLabel: '?',
      CustomOptionalThree: '?',
      CustomOptionalThreeLabel: '?',

    }
  },
  GetServiceOrderList: { //获取服务订单列表
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/GetServiceOrderListNoEncry',
    post: {
      vendorId: '?',
      userName: '?',
      num: 1,
      pageSize: '?',
      type: '?',
      pageNumber: "?",
      isCache: true
    }
  },
  GetServiceOrder: { //获取服务订单详情
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/GetServiceOrder',
    post: {
      orderNum: '?'
    }
  },
  CloseOrder: { //取消订单
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/CloseOrder',
    post: {
      orderNum: '?',
      vendorId: "?"
    }
  },
  WriteOffServiceOrderUsedByUser: { //核销订单
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/WriteOffServiceOrderUsedByUser',
    post: {
      orderNum: '?',
      userId: "?"
    }
  },


  // GetVendorSetting: { //优惠买单折扣
  //   url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorSetting',
  //   post: {
  //     vendorId: "?",
  //     category: 'QuickPayDiscount'
  //   }
  // },
  GetPreferentialPaySetting: { //优惠买单折扣
    url: cf.config.configUrl + 'VendorWebService.asmx/GetPreferentialPaySetting',
    post: {
      vendorId: "?"
    }
  },

  AddPreferentialOrder: { //优惠买单折扣
    url: cf.config.configUrl + 'PreferentialOrderWebService.asmx/AddPreferentialOrder',
    post: {
      userName: "?",//用户名称
      payTypeId: "?",//支付方式
      couponItemId: "?",//使用的优惠券Id
      vendorId: "?",//商家Id
      totalMoney: "?",//总金额
      preferential: "?",//优惠折扣（几折）
      preferentialMoney: "?",//折扣金额
      nonPreferentialMoney: "?",//不参与折扣金额
      realMoney: "?",//实付款金额
      firstType: "?",
      eCardCash: "?",
      extraCash: "?",
      storeId: "?"
    }
  },



  
  GetLatestServiceOrderContactInfo: { //会员最近服务预约的联系信息
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/GetLatestServiceOrderContactInfo',
    post: {
      userId: "?",
      vendorId: "?",
    }
  },
  GetMealOrder: {
    url: cf.config.configUrl + 'MealOrderWebService.asmx/GetMealOrder',
    post: {
      orderNum: "?",
      vendorId: "?",
    }
  },
  GetUserMembershipSetting: {
    url: cf.config.configUrl + 'MealOrderWebService.asmx/GetUserMembershipSetting',
    post: {
      userId: "?",
      vendorId: "?",
    }
  },
  GetLastMealOrderNum: {//点餐是否显示提示
    url: cf.config.configUrl + 'MealOrderWebService.asmx/GetLastMealOrderNum',
    post: {
      userId: "?",
      vendorId: "?",
    }
  },
  AddMealOrderDetail: { //点餐下单
    url: cf.config.configUrl + 'MealOrderWebService.asmx/AddMealOrderDetail',
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
      firstType: "?"
    }
  },
  PayMealOrder: { //点餐支付
    url: cf.config.configUrl + 'MealOrderWebService.asmx/PayMealOrder',
    post: {
      orderNum: "?",
      payTypeId: "?",
      couponItemId: "?",
      vendorId: "?",
      totalMoney: "?",//总金额
      memberDiscount: "?",
      memberDiscountMoney: "?",
      usingPoint: "?",
      pointAsCashMoney: "?",
      eCardCash: "?",
      extraCash: "?"
    }
  },
  AppendMealOrderDetail: { //加菜下单
    url: cf.config.configUrl + 'MealOrderWebService.asmx/AppendMealOrderDetail',
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
      orderNum: "?"
    }
  },
  ECashRecharge: { //储值下单
    url: cf.config.configUrl + 'ECashOrderWebService.asmx/ECashRecharge',
    post: {
      eCashCardId: "?",
      userId: "?",
      vendorId: "?"
    }
  },
  GetECashOrderDetail: { //储值下单详情
    url: cf.config.configUrl + 'ECashOrderWebService.asmx/GetECashOrderDetail',
    post: {
      orderNum: "?",
    }
  },
  GetUserUsableECash: { //获取会员可用储值余额  
    url: cf.config.configUrl + 'ECashWebService.asmx/GetUserUsableECash',
    post: {
      userName: "?",
      orderRealTotal: "?"
    }
  },
  GetShipmentStakeholders: { //获取达达配送订单详情信息  
    url: cf.config.configUrl + 'CityDistribution.asmx/GetShipmentStakeholders',
    post: {
      orderNum: "?",
      vendorId: "?"
    }
  },
  GetShipmentDetailList: { //获取配送单详情  
    url: cf.config.configUrl + 'CityDistribution.asmx/GetShipmentDetailList',
    post: {
      orderNum: "?",
      vendorId: "?"
    }
  },
  ShareLuckyRedPacket: { //分享红包  
    url: cf.config.configUrl + 'LuckyRedPacketWebService.asmx/ShareLuckyRedPacket',
    post: {
      vendorId: '?',   //商家Id
      sponsorId: '?',//用户的Id
      path:'?',
      isCache: true,
      luckyOrder: '?'  //第几个人领取红包最大
    }
  },
  PrepareShareLuckyRedPacket: { //分享红包  
    url: cf.config.configUrl + 'LuckyRedPacketWebService.asmx/PrepareShareLuckyRedPacket',
    post: {
      vendorId: '?',   //商家Id
      sponsorId: '?',//用户的Id
      orderNum: '?'  
    }
  }, 
  DrawLuckyRedPacket   : { //分享红包  
    url: cf.config.configUrl + 'LuckyRedPacketWebService.asmx/DrawLuckyRedPacket',
    post: {
      activityGroupId: '?',   //商家Id
      participantId: '?',//用户的Id
      isNewUser: '?'
    }
  },
  MoreLuckyRedPacketActivityList: { //分享红包  
    url: cf.config.configUrl + 'LuckyRedPacketWebService.asmx/MoreLuckyRedPacketActivityList',
    post: {
      activityGroupId: '?'   //商家Id
    }
  },
  ShareCount: { //分享红包
    url: cf.config.configUrl + 'LuckyRedPacketWebService.asmx/ShareCount',
    post: {
      sponsorId: '?',   //商家Id
      audienceType:'?',
      audienceId:'?',
      contentType:'?',
      contentId:'?'
    }
  },
  luckyShareCount: { //分享红包
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/ShareCount',
    post: {
      sponsorId: '?',   //商家Id
      audienceType: '?',
      audienceId: '?',
      contentType: '?',
      contentId: '?'
    }
  }
}