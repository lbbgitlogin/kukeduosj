var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
	MarketingEventGroupQuery: { //查询商家已发布的拼团活动
    url: cf.config.configUrl + 'MarketingEventWS.asmx/MarketingEventGroupQueryNoEncry',
		post: {
			StoreId: '?',
      PageSize:'?',
      PageIndex:'?',
      isCache: true
		}
	},
  GetCountdownPromotionList: { //查询商家已发布的秒杀活动
    url: cf.config.configUrl + 'MarketingEventWS.asmx/GetCountdownPromotionListNoEncry',
    post: {
      vendorId: '?',
      pageSize  : '?',
      pageIndex: '?',
      type:'',
      isCache: true
    }
  },
  
  MarketingEventImmediately: { //查询商家即将开始拼团
    url: cf.config.configUrl + 'MarketingEventWS.asmx/MarketingEventImmediatelyNoEncry',
    post: {
      StoreId: '?',
      PageSize: '?',
      PageIndex: '?',
      isCache: true
    }
  },
	MarketingEventGroupGoing: { //查询已经进行的拼团活动
		url: cf.config.configUrl + 'MarketingEventWS.asmx/MarketingEventGroupGoing',
		post: {
			StoreId: '?',
			PageIndex:'?'
		}
	},
	GetGroupInfoByEventId: { //根据活动id获取拼团活动详情
		url: cf.config.configUrl + 'MarketingEventWS.asmx/GetGroupInfoByEventIdNew',
		post: {
			InfoId: '?',
			OrderNum:'?',
      type:"?",
      userId:"?"
		}
	},
	GetGroupMarketingEventUsersByPage:{//分页查询参团人数
		url: cf.config.configUrl + 'MarketingEventWS.asmx/GetGroupMarketingEventUsersByPage',
		post: {
			EventId:'?',
			InfoId: '?',
			PageIndex:'?'
		}
	},
	GetGoingGroupEventByEventId: { //根据活动id查询正在开的团
		url: cf.config.configUrl + 'MarketingEventWS.asmx/GetGoingGroupEventByEventId',
		post: {
			EventId: '?'
		}
	},
	GetMyGroupEvents:{//获取我参加的拼团活动
    url: cf.config.configUrl + 'MarketingEventWS.asmx/GetMyGroupEventsNoEncry',
		post: {
			UserInfoId: '?',
			PageSize:"?",
			PageIndex:"?",
			Status:"?",//0:查全部 1：进行中的 2：成功的  3：失败的
      isCache: true
		}
	},
	IsUserJoinGroupEvnet:{//查询当前用户拼团状态
		url: cf.config.configUrl + 'MarketingEventWS.asmx/IsUserJoinGroupEvnet',
		post: {
			UserId: '?',
			OwnGroupId:"?"//0:查全部 1：进行中的 2：成功的  3：失败的
		}
	},
  GetOngoingLuckyEventList: { //抽奖团开始拼团
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/GetOngoingLuckyEventListNoEncry',
    post: {
      vendorId: '?',
      pageSize: '?',
      pageIndex: '?',
      isCache: true
    }
  },
  GetUpcomingLuckyEventList: { //抽奖团即将拼团
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/GetUpcomingLuckyEventListNoEncry',
    post: {
      vendorId: '?',
      pageSize: '?',
      pageIndex: '?',
      isCache: true
    }
  },
  GetParticipantList: { //参与人列表
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/GetParticipantList',
    post: {
      marketingEventId: '?',
      pageSize: '?',
      pageIndex: '?',
      type:"?",
      groupId:"?"
    }
  },
  GetWinnerList: { //中奖人名单
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/GetWinnerList',
    post: {
      groupId: '?',
      orderNum: '?',
      pageSize: '?',
      pageIndex: "?",
    }
  },
  GetLuckyInfoByEvent: { //中奖人详情
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/GetLuckyInfoByEvent',
    post: {
      groupId: '?',
      orderNum: '?',
      pageSize: '?',
      pageIndex: "?",
    }
  },
  DrawCoupon: { //领取优惠券
    url: cf.config.configUrl + 'LuckyFightGroupWebService.asmx/DrawCoupon',
    post: {
      groupId: '?',
      marketingEventId: '?',
      pageSize: '?',
      pageIndex: "?",
      userId:'?',
    }
  },
}