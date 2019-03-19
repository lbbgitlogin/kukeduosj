var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
    GetAdvertismentEvent: { //获取商家发布的活动
      url: cf.config.configUrl + 'AdvertismentEventWS.asmx/GetAdvertismentEvent',
      post: {
        VendorId: '?',
        PageIndex: '?'
      }
    },
    GetAdvertismentEventById: { //获取活动详情
      url: cf.config.configUrl + 'AdvertismentEventWS.asmx/GetAdvertismentEventById',
      post: {
      Id: '?',
      UserId: '?'
      }
    },
  JoinAdvertismentEvent: { //提交报名活动
    url: cf.config.configUrl + 'AdvertismentEventWS.asmx/JoinAdvertismentEvent',
    post: {
      EventId: '?',
      UserId: '?',
      UserName: '?',
      UserPosition: '?',
      UserCompany: '?',
      UserPhone: '?'
    }
  },

  EventCheckIn: { //活动签到
    url: cf.config.configUrl + 'AdvertismentEventWS.asmx/EventCheckIn',
    post: {
      EventId: '?',
      UserId: '?'
    }
  },

  GetUserAdvertismentEvent: { //获取我参加的活动
    url: cf.config.configUrl + 'AdvertismentEventWS.asmx/GetUserAdvertismentEvent',
    post: {
      VendorId: '?',
      UserId: '?',
      PageIndex: '?'
    }
  },

  EventJoinWXMessage: { //报名成功发送模板消息
    url: cf.config.configUrl + 'WXTmessageWS.asmx/EventJoinWXMessage',
    post: {
      VendorId: '?',
      UserId: '?',
      EventId: '?'
    }
  },


  GetLuckyDrawVO: { //获取抽奖活动与中奖人信息
    url: cf.config.configUrl + 'MarketingEventWS.asmx/GetLuckyDrawVO',
    post: {
      VendorId: '?',
      UserId: '?',
      Category: '?'
    }
  },

  GetLuckyDrawPrizeVOList: { //获取抽奖活动奖品列表
    url: cf.config.configUrl + 'MarketingEventWS.asmx/GetLuckyDrawPrizeVOList',
    post: {
      VendorId: '?',
      Category: '?'
    }
  },

  JoinLuckyDraw: { //参与抽奖，获取中奖奖品索引
    url: cf.config.configUrl + 'MarketingEventWS.asmx/JoinLuckyDraw',
    post: {
      VendorId: '?',
      UserId: '?',
      Category: '?'
    }
  },

  GetUserWinningPrizeVOList: { //获取用户已中奖奖品列表
    url: cf.config.configUrl + 'MarketingEventWS.asmx/GetUserWinningPrizeVOList',
    post: {
      VendorId: '?',
      UserId: '?',
      Category: '?'
    }
  },

  AddUpdateLuckyDrawRecipientInfo: { //新增或更新用户领奖联系人信息
    url: cf.config.configUrl + 'MarketingEventWS.asmx/AddUpdateLuckyDrawRecipientInfo',
    post: {
      LuckyDrawId: '?',
      LuckyDrawPrizeId: '?',
      UserId: '?',
      RecipientName: '?',
      RecipientMobile: '?',
      RecipientAddress: '?',
      Id: '?'
    }
  },
  GetLuckyDrawRecipientInfo: { //获取用户领奖联系人信息
    url: cf.config.configUrl + 'MarketingEventWS.asmx/GetLuckyDrawRecipientInfo',
    post: {
      LuckyDrawId: '?',
      LuckyDrawPrizeId: '?',
      UserId: '?',
      Id: '?'
    }
  },

  ShareLuckyDraw: { //用户分享抽奖活动，增加额外可抽奖次数
    url: cf.config.configUrl + 'MarketingEventWS.asmx/ShareLuckyDraw',
    post: {
      VendorId: '?',
      UserId: '?',
      Category: '?'
    }
  },
  GetNewsletterList: { //获取商家发布的资讯
    url: cf.config.configUrl + 'NewsletterWebService.asmx/GetNewsletterList',
    post: {
      vendorId: '?',
      pageNumber: '?',
      categoryId: '?',
      PageSize: '?'
    }
  },
  GetNewsletter: { //获取商家发布的咨询详情
    url: cf.config.configUrl + 'NewsletterWebService.asmx/GetHtmlDecodeNewsletterNoEncry',
    post: {
      vendorId: '?',
      id: '?',
      isCache: true
    }
  },
  GetNewsletterCategoryList: { //资讯分类接口
    url: cf.config.configUrl + 'NewsletterWebService.asmx/GetNewsletterCategoryList',
    post: {
      vendorId: '?',

    }
  },
  GetNewsletterCategory: { //获取资讯分类：
    url: cf.config.configUrl + 'NewsletterWebService.asmx/GetNewsletterCategory',
    post: {
      categoryId: '?',
    }
  },
  GetVendorCutPriceEventList: { //获取砍价活动列表：
    url: cf.config.configUrl + 'CutPriceEventWebService.asmx/GetVendorCutPriceEventList',
    post: {
      vendorId: '?',
      pageNumber: "?",
      PageSize: "?",
      sponsorId: "?",
      cutPriceType: "?",
    }
  },
  GetGameInfo: { //获取游戏详情
    url: cf.config.configUrl + 'GameService.asmx/GetGameInfo',
    post: {
      vendorId: '?',
      gameType: '?'
    }
  },
  GetUserGameCardInfo: { //获取用户集卡信息接口
    url: cf.config.configUrl + 'GameService.asmx/GetUserGameCardInfo',
    post: {
      userId: '?',
      gameId: '?'
    }
  },
  DrawCard: { //2.1.3抽卡接口
    url: cf.config.configUrl + 'GameService.asmx/DrawCard',
    post: {
      userId: '?',
      gameId: '?',
      vendorId: '?',
    }
  },
  OpenPrize: { //2.1.4开启礼包接口
    url: cf.config.configUrl + 'GameService.asmx/OpenPrize',
    post: {
      userId: '?',
      gameId: '?',
      vendorId: '?',
    }
  },
  AddGameUserAccess: { //2.1分享获取次数接口
    url: cf.config.configUrl + 'GameService.asmx/AddGameUserAccess',
    post: {
      userId: '?',
      gameId: '?',
      shareUserId: '?',
    }
  },
  UpdatePrizeRecord: { //2.1.6领取自定义奖品接口
    url: cf.config.configUrl + 'GameService.asmx/UpdatePrizeRecord',
    post: {
      // userId: '?',
      // operateId: '?',
      id: '?',
      address: '?',
      tel: '?',
      consignee: '?',
    }
  },
  GetPrizesList: { //2.1.5获取用户奖品列表接口
    url: cf.config.configUrl + 'GameService.asmx/GetPrizesList',
    post: {
      userId: '?',
      vendorId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  UpdatePrizeRecord: { //2.1.6领取自定义奖品接口
    url: cf.config.configUrl + 'GameService.asmx/UpdatePrizeRecord',
    post: {
      // userId: '?',
      // operateId: '?',
      id: '?',
      address: '?',
      tel: '?',
      consignee: '?',
    }
  },
  GetGameWinnerList: { //获取中奖人名单
    url: cf.config.configUrl + 'GameService.asmx/GetGameWinnerList',
    post: {
      vendorId: '?',
      gameId: '?',
      pageIndex: '?',
      pageSize: '?'
    }
  },
  GetGameSponsorList: { //获取助攻人名单
    url: cf.config.configUrl + 'GameService.asmx/GetGameSponsorList',
    post: {
      vendorId: '?',
      gameId: '?',
      userInfoId: '?',
      pageIndex: '?',
      pageSize: '?'
    }
  },
  DrawCoupon: { //集卡领取优惠券
    url: cf.config.configUrl + 'GameService.asmx/DrawCoupon',
    post: {
      id: '?',
      couponId: '?'
    }
  },
  GetCutPricePartakeList: {
    url: cf.config.configUrl + 'CutPriceEventWebService.asmx/GetCutPricePartakeList',
    post: {
      VendorId: '?',
      PageNumber: '?',
      PageSize: '?',
      OldMaxId: '?',
      NewMaxId: '?',
    }
  }
}