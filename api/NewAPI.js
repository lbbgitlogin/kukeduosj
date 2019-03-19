var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetBlessedGameInfo: { //2.1.1获取活动详情
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/GetBlessedGameInfo',
    post: {
      vendorId: '?',
    }
  },
  AddUserSendBlessedInfo: { //保存贺岁信息接口
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/AddUserSendBlessedInfo',
    post: {
      userId: '?',
      userCall: '?',
      // position: '?',
      congratulations: '?',
      // poster: '?',
      userPhotoPath: '?',
      userName: '?',
    }
  },
  AddBlessedGameRecord: { //2.1.3记录访问记录接口
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/AddBlessedGameRecord',
    post: {
      shareUserId: '?',
      sharePhoto: '?',
      userId: '?',
      photo: '?',
      gameId: '?',
      vendorId: '?',
      wordId: '?',
    }
  },
  GetBlessedGameMsg: { //2.1.4获取贺岁信息接口  
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/GetBlessedGameMsg',
    post: {
      Id: '?',
    }
  },
  QRBlessedGamePoster: { //2.1.5生成朋友圈图片接口
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/QRBlessedGamePoster',
    post: {
      vendorId: '?',
      path: '?',
      userCall: '?',
      position: '?',
      congratulations: '?',
      userImg: '?',
      userName: '?',
      isCache: true,
    }
  },
  AddForwardRecord: { //2.1.6记录转发记录接口
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/AddForwardRecord',
    post: {
      blessedGameId: '?',
      userId: '?',
      vendorId: '?',
    }
  },
  GetUserRanking: { //2.1.6记录转发记录接口
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/GetUserRanking',
    post: {
      gameId: '?',
      userId: '?',
      vid: '?',
    }
  },
  QRRankPoster: { //2.1.6记录转发记录接口
    url: cf.config.configUrl + 'BlessedGameWebService.asmx/QRRankPoster',
    post: {
      vendorId: '?',
      path: '?',
      userImg: '?',
      BlessedIndex: '?',
      BlessedCount: '?',
      RecordCount: '?',
      IsSF: '?',
      isCache: true,
    }
  },
}