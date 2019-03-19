var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetUserAttention: { //获取用户收藏商品
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserAttentionNoEncry',
    post: {
      userName: '?',
      currentPage: '?', 
      pageSize: '?',
      isCache: true
    }
  },
  GetAddressList: { //查看所有地址
    url: cf.config.configUrl + 'UserWebService.asmx/GetAddresslistByUsername',
    post: {
      userName: '?'
    }
  },
  GetAddressDetail: { //获取地址详情
    url: cf.config.configUrl + 'UserWebService.asmx/GetAddressById',
    post: {
      Id: '?'
    }
  },
  AddAddress: { //新增地址地址
    url: cf.config.configUrl + 'UserWebService.asmx/InserAddressById',
    post: {
      userName: '?',
      consignee: '?',
      province: '?',
      city: '?',
      district: '?',
      isDefault: false,
      detail: '?',
      phone: '?'
    }
  },
  EditAddress: { //修改地址
    url: cf.config.configUrl + 'UserWebService.asmx/UpdateAddressById',
    post: {
      id: '?',
      userName: '?',
      consignee: '?',
      province: '?',
      city: '?',
      district: '?',
      detail: '?',
      isDefault: false,
      phone: '?'
    }
  },
  DelUserAttention: { //取消收藏
    url: cf.config.configUrl + 'UserWebService.asmx/DeleteUserAttentionById',
    post: {
      Id: '?',
      UserName: '?'
    }
  },
  DelAddress: { //删除地址
    url: cf.config.configUrl + 'UserWebService.asmx/DeleteAddressById',
    post: {
      Id: '?'
    }
  },
  EditUserInfo: { //更新用户资料
    url: cf.config.configUrl + 'UserWebService.asmx/UpdateUserInfo',
    post: {
      Id: '?',
      RealName: '?',
      identityCardNo: '?',
      Email: '?',
      Birthday: '?'
    }
  },
  GetAllPCDList: {//获取所有的省市区
    url: cf.config.configUrl + 'UserWebService.asmx/GetAllPCDList',
    isCache: true
  },
  GetUserCashInfo: {//小程序获取我的账户中心
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserCashInfo',
    post: {
      UserId: "",
    }
  },
  GetPageQRCode: {//获取代言二维码
    url: cf.config.configUrl + 'UserWebService.asmx/GetPageQRCode',
    post: {
      UserId: "?",
      VendorId: "?",
      path: "?",
      width: "?"
    }
  },
  GetUserFans: {//获取我的推荐客户
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserFans',
    post: {
      UserId: "?",
      Level: "?",
      PageIndex: "?"
    }
  },
  getDistributionRankingList: {//查询商户排行榜
    url: cf.config.configUrl + 'UserWebService.asmx/getDistributionRankingListNoEncry',
    post: {
      isCache: true,
      vendorId: "?",
      timeType: "?"//1.总 2.周 3.月
    }
  },
  GetUserCashBonusesDetail: {//获取我的奖金明细
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserCashBonusesDetail',
    post: {
      UserId: "?",
      TimeSpan: "?",
      PageIndex: "?"
    }
  },
  SelectUserCashAccount: {//获取我的奖金明细
    url: cf.config.configUrl + 'UserWebService.asmx/SelectUserCashAccount',
    post: {
      ChangeType: "?",
      userName: "?",
      PageIndex: "?"
    }
  },
  ApplyToCashNew: {//申请提现
    url: cf.config.configUrl + 'UserWebService.asmx/ApplyToCashNew',
    post: {
      userAccount: "?",
      Price: "?",
      WXCode: "?",
      Phone: "?",
      nickName: "?",
      BankAccount:"?",//银行卡号
      AlipayAccount:"?",//支付宝账号
      UesrRealName:"?",//真实姓名
      BankName:"?",
      WithdrawType: "?",//提现方式，1-微信零钱，2-支付宝，3-银行卡 
      type:""
    }
  },
  UserInfoPointTotalCashrealName: {//根据当前账户查询可用积分，现金账户可用余额，名称
    url: cf.config.configUrl + 'UserWebService.asmx/UserInfoPointTotalCashrealName',
    post: {
      userName: "?"
    }
  },
  SelectUserHaveCashAccount: {//账户提现申请明细
    url: cf.config.configUrl + 'UserWebService.asmx/SelectUserHaveCashAccount',
    post: {
      num: 0,
      userName: "?",
      PageIndex: "?"
    }
  },

  GetVendorCoupons: {//领券中心
    url: cf.config.configUrl + 'UserWebService.asmx/GetVendorCouponsNoEncry',
    post: {
      VendorId: '?',
      UserId: "?",
      isCache: true
    }
  },
  GetCouponInfo: {//优惠券详情  

    url: cf.config.configUrl + 'UserWebService.asmx/GetCouponInfo',
    post: {
      vendorId: "?",
      userId: "?",
      couponId: "?",
      couponItemId: "?"
    }
  }, 
  GetUserCouponItem: {//分页查询我的优惠劵信息
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserCouponItem',
    post: {
      UserId: "?",
      PageIndex: "?",
      Status: "?"
    }
  },

  GetVendorCouponList: {//分页查询领券中心
    url: cf.config.configUrl + 'UserWebService.asmx/GetVendorCouponList',
    post: {
      userId: "?",
      pageIndex: "?",
      vendorId: "?",
    }
  },


  GetCouponLimitProduct: {//获取优惠券适用商品
    url: cf.config.configUrl + 'UserWebService.asmx/GetCouponLimitProduct',
    post: {
      VendorId: "?",
      PageIndex: "?",
      CouponId: "?"
    }
  },

  UserReceiveCoupon: {//用户领取优惠券
    url: cf.config.configUrl + 'UserWebService.asmx/UserReceiveCoupon',
    post: {
      VendorId: "?",
      UserId: "?",
      CouponIds: "?",
      IsNewUser: "?",
      Code: "?"//微信领取时
    }
  },

  AddMiniUserSuggestion: {//一键反馈接口 
    url: cf.config.configUrl + 'UserWebService.asmx/AddMiniUserSuggestion',
    post: {
      UserName: "?",
      MiniAppVersion: "?",
      Wechat: "?",
      Suggestion: "?",
      Platform: "?",
      Email: "?"
    }
  },
  getDistributionRankingList: {//查询商户的分销排行榜
    url: cf.config.configUrl + 'UserWebService.asmx/getDistributionRankingList',
    post: {
      vendorId: "?",
      timeType: "?"//1.表示总排行，2.表示周排行，3.表示月排行
    }
  },
  receiveWeixinCoupons: {
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/receiveWeixinCoupons',
    post: {
      card_id: "?",
      vendorId: "?",
      openid: "?"
    }
  },
  codeDecode: {//解码Code码
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/codeDecode',
    post: {
      access_token: "?",
      code: "?"
    }
  },
  findUsablePoint: {// 查询可用积分，积分，成长值  传值
    url: cf.config.configUrl + 'UserWebService.asmx/findUsablePoint',
    post: {
      UserId: '?',
      VendorId:"?"
    }
  },
  settingAttendancePoint: {// 签到
    url: cf.config.configUrl + 'UserWebService.asmx/settingAttendancePoint',
    post: {
      UserId: '?',
      VendorId: '?'
    }
  },
  getMemberGrowthDetailList: {//  获取会员成长值明细列表
    url: cf.config.configUrl + 'UserWebService.asmx/getMemberGrowthDetailList',
    post: {
      UserId: '?',
      PageIndex: "?"
    }
  },
  getMemberPointDetailList: {//  获取会员积分明细列表
    url: cf.config.configUrl + 'UserWebService.asmx/getMemberPointDetailList',
    post: {
      UserId: '?',
      PageIndex: "?"
    }
  },
  getMemberHierarchySettingList: {//  商家会员等级对照表、等级设置参数列表
    url: cf.config.configUrl + 'UserWebService.asmx/getMemberHierarchySettingList',
    post: {
      VendorId: '?',
    }
  },
  getMemberGrowthSettingInfo: {//  获取会员成长值设置
    url: cf.config.configUrl + 'UserWebService.asmx/getMemberGrowthSettingInfo',
    post: {
      VendorId: '?',
    }
  },
  QRCodePoster:{
    url: cf.config.configUrl + 'UserWebService.asmx/QRCodePoster',
    post: {
      VendorId: '?',
      Path:'?',
      MainImg:'?',
      type: '?',// 拼团，抽奖团  ，正常和砍价不需要传值
      pCount: '?',//  几人团（拼团，抽奖团需传值）
      MainTitle:'?',
      userId: '?', // 用户id 
      orignPrice: '?', //  商品原价
      MainPrice:'?',
      isCache: true
    }
  },
  QRCouponCodePoster: {   //优惠券海报
    url: cf.config.configUrl + 'UserWebService.asmx/QRCouponCodePoster',
    post: {
      vendorId: '?',
      userId: '?',
      couponId: '?'
    }
  },
  QRCodePosterForGroupAndCutPrice: {
    url: cf.config.configUrl + 'UserWebService.asmx/QRCodePosterForGroupAndCutPrice',
    post: {
      VendorId: "?",
      Path: "?",
      MainImg: "?",
      MainTitle: "?",
      ProductId: "?",
      MarketingEventId: "?",
      SalePrice: "?",
      OriginalPrice: "?",
      GroupPersonAmout: "?",
      // LogoPath: "?",
      // NickName: "?",
      UserInfoId:"?",
      MarketingEventTime: "?",
      CutPrice: "?",
      isCache: true
    }
  },
  CommisionToECash: {//佣金转入余额
    url: cf.config.configUrl + 'ECashWebService.asmx/CommisionToECash',
    post: {
      userId: '?',
      totalBonusesCash: '?',
    }
  },
  GetPersonalCenter: {
    url: cf.config.configUrl + 'ShopWebService.asmx/GetPersonalCenter',
    post: {
      VendorId: '?',
      UserId: '?',
      isCache: true
    }
  },
  UpdateUserWexinMobile: {
    url: cf.config.configUrl + 'UserWebService.asmx/UpdateUserWexinMobile',
    post: {
      vendorId: '?',
      userId: '?',
      encryptData: '?',
      encryptDataIV: '?',
      code:"?"
    }
  },
  QRCodePosterForDistribution:{//分享图片
    url: cf.config.configUrl + 'UserWebService.asmx/QRCodePosterForDistribution',
    post:{
      isCache: true,
      VendorId:"?",
      UserId:"?",
      Path:"?"
    }
  },
  GetUserDistributionRuleDesc:{//佣金规则
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserDistributionRuleDesc',
    post: {
      vendorId: "?"
    }
  },
  GetUserDistributionProduct:{
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserDistributionProduct',
    post: {
      vendorId: "?",
      currentPage: 1, 
      pageSize: 500
    }
  },
  GetUserNickNameAndPhotoById :{
    url: cf.config.configUrl + 'UserWebService.asmx/GetUserNickNameAndPhotoById',
    post: {
      userId: "?"
    }
  },
  GetMemberCard: {      //会员卡信息
    url: cf.config.configUrl + 'MemberCardWebService.asmx/GetMemberCard',
    post: {
      userId: "?",
      vendorId: "?",
    }
  },
    GetMemberCardDetail: {      //会员卡详情
      url: cf.config.configUrl + 'MemberCardWebService.asmx/GetMemberCardDetail',
    post: {
      userId: "?",
      vendorId: "?"
    }
  },
  AddMemberCard: {      //会员领取会员卡
    url: cf.config.configUrl + 'MemberCardWebService.asmx/AddMemberCard',
    post: {
      userId: "?",
      vendorId: "?",
      cardId: "?",
      phone: "?",
    }
  },
    GetMemberCardPostInfo: {      //会员领取会员卡到卡包
      url: cf.config.configUrl +'MemberCardWebService.asmx/GetMemberCardPostInfo',
    post: {
      vendorId: "?",
      cardInfo: "?"
    }
  },
  GetMCardRelationInfo: {      //卡劵传递code cardid
    url: cf.config.configUrl + 'MemberCardWebService.asmx/GetMCardRelationInfo',
    post: {
      vendorId: "?",
      cCode: "?",
      userId:"?",
      cCard: "?" ,
      cardId: "?"
    }
  },
  UpdateUserPhotoAndNickName: {//新增修改用户头像和昵称接口
    url: cf.config.configUrl + 'UserWebService.asmx/UpdateUserPhotoAndNickName',
    post: {
      NickName: '?',
      Photo: '?',
      UserName: '?'
    }
  },
  GetWXPageCode: {//代言界面生成太阳码
    url: cf.config.configUrl + 'UserWebService.asmx/GetWXPageCode',
    post: {
      vendorId: "?",
      userId: "?",
      path: "?"
    }
  },
  GetShopNameDesc: {//代言界面信息
    url: cf.config.configUrl + 'UserWebService.asmx/GetShopNameDesc',
    post: {
      vendorId: "?",
    }
  },  
  DYPosterPic: {//代言海报
    url: cf.config.configUrl + 'UserWebService.asmx/DYPosterPic',
    post: {
      vendorId: "?",
      userId: "?",
      isCache:true,
      type: "" //1-自己代言，2-邀请代言
    }
  }
}
