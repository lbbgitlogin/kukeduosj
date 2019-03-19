var cf = require('../config.js');
module.exports = {
  GetPostsPlateList: { //获取版块
    url: cf.config.configUrl + 'PlateWebService.asmx/GetPostsPlateList',
    post: {
      OperateId: '?',
    }
  },
  UploadImgNew: { //发布帖子上传图片接口
    url: cf.config.configUrl + 'PlateWebService.asmx/UploadImgNew',
    post: {}
  },
  UploadImg: { //发布帖子上传图片接口
    url: cf.config.configUrl + 'PlateWebService.asmx/UploadImg',
    post: {}
  },
  AddMemberPosts: { //发布帖子接口
    url: cf.config.configUrl + 'PlateWebService.asmx/AddMemberPosts',
    post: {
      UserId: '?',
      OperateId: '?',
      PlateId: '?',
      PostTitle: '?',
      PostContent: '?',
      PostImgList: '?',
      SortList: '?',
      proList: '?'
    }
  },
  SaveDraft: { //发布帖子接口
    url: cf.config.configUrl + 'PlateWebService.asmx/SaveDraft',
    post: {
      UserId: '?',
      OperateId: '?',
      PlateId: '?',
      PostTitle: '?',
      PostContent: '?',
      PostImgList: '?',
      SortList: '?',
      proList: '?'

    }
  },
  GetPostsPlateDetail: { //获取版块基本信息接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetPostsPlateDetail',
    post: {
      PlateId: '?',
    }
  },
  GetPostsList: { //分页获取版块页面帖子列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetPostsList',
    post: {
      plateId: '?',
      operateId: 0,
      pageIndex: 1,
      userId: 1,
      pageSize: 10,
      postsTitle: '?',
    }
  },
  AddUserFollow: { //关注，取消关注用户接口
    url: cf.config.configUrl + 'PlateWebService.asmx/AddUserFollow',
    post: {
      CreateUserId: '?',
      OperateId: '?',
      ReplyUserId: '?',
    }
  },
  ReportNewLetter: { //举报资讯评论
    url: cf.config.configUrl + 'NewsletterWebService.asmx/ReportNewLetter',
    post: {
      newsletterId: '?', //帖子id 
      newsletterCommentId: '?', //评论id
      reportContent: '?', //举报内容
      reportUserId: '?', //举报用户id  
      vendorId: '?', //商家id
    }
  },
  EditSignature: { //修改用户个性签名接口
    url: cf.config.configUrl + 'PlateWebService.asmx/EditSignature',
    post: {
      UserId: '?',
      OperateId: '?',
      Signature: '?',
    }
  },
  DeleteMemberPosts: { //删除帖子接口
    url: cf.config.configUrl + 'PlateWebService.asmx/DeleteMemberPosts',
    post: {
      MemberPostsId: '?',
    }
  },
  GetUserSpace: { //获取用户空间页面接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetUserSpace',
    post: {
      UserId: '?',
      replyUserId: 0,
      operateId: 0
    }
  },
  GetCommunityHome: { //获取社区首页DIY内容
    url: cf.config.configUrl + 'PlateWebService.asmx/GetCommunityHome',
    post: {
      operateId: '?',
    }
  },
  GetMemberPostsByUserId: { //分页获取用户发布帖子列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetMemberPostsByUserId',
    post: {
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetCollectionPostsByUserId: { //分页获取用户收藏帖子列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetCollectionPostsByUserId',
    post: {
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetCommentPostsByUserId: { //分页获取用户评论帖子列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetCommentPostsByUserId',
    post: {
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetUserFollowList: { //分页获取用户评论帖子列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetUserFollowList',
    post: {
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetUserFansList: { //分页获取用户评论帖子列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetUserFansList',
    post: {
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetPostsCommentByPostsId: { //帖子详情分页获取帖子评论接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetPostsCommentByPostsId',
    post: {
      MemberPostsId: '?',
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetNewsCommentByPostsIdNotEncrypted: { //咨询详情分页获取帖子评论接口
    url: cf.config.configUrl + 'NewsletterWebService.asmx/GetNewsCommentByPostsIdNotEncrypted',
    post: {
      newsletterId: '?',
      UserId: '?',
      pageIndex: '?',
      pageSize: 10,
      isCache: true
    }
  },
  GetMemberPostsInfo: { //获取帖子详情内容接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetMemberPostsInfo',
    post: {
      UserId: '?',
      PostId: '?'
    }
  },
  GetMemberPostsServerData: { //获取帖子详情页面相关服务数据
    url: cf.config.configUrl + 'PlateWebService.asmx/GetMemberPostsServerData',
    post: {
      memberPostsId: '?',
      userId: '?',
      replyUserId: '?',
      operateId: 0
    }
  },
  MemberPostsCollection: { //收藏帖子
    url: cf.config.configUrl + 'PlateWebService.asmx/MemberPostsCollection',
    post: {
      userId: '?',
      memberPostsId: '?',
      operateId: '?'
    }
  },
  CancelMemberPostsCollection: { //取消收藏
    url: cf.config.configUrl + 'PlateWebService.asmx/CancelMemberPostsCollection',
    post: {
      userId: '?',
      memberPostsId: '?',
      operateId: '?'
    }
  },
  MemberPostsFabulous: { //帖子点赞
    url: cf.config.configUrl + 'PlateWebService.asmx/MemberPostsFabulous',
    post: {
      userId: '?',
      memberPostsId: '?',
      operateId: '?',
      niceName: '?',
      userPhotoPath: '?'
    }
  },
  CancelMemberPostsFabulous: { //取消点赞
    url: cf.config.configUrl + 'PlateWebService.asmx/CancelMemberPostsFabulous',
    post: {
      userId: '?',
      memberPostsId: '?'
    }
  },
  MemberPostsComment: { //会员帖子评论
    url: cf.config.configUrl + 'PlateWebService.asmx/MemberPostsComment',
    post: {
      userId: '?',
      commentContent: '?',
      createNiceName: '?',
      createPhotoPath: '?',
      memberPostsId: '?',
      operateId: '?',
      postCommentId: '?',
      replyCommentId: '?',
      replyUserId: '?'
    }
  },
  MemberNewsComment: { //咨询帖子评论
    url: cf.config.configUrl + 'NewsletterWebService.asmx/MemberNewsComment',
    post: {
      userId: '?',
      vendorId: '?',
      commentContent: '?',
      newsletterId: '?',
      postCommentId: '?',
      replyCommentId: '?',
      replyUserId: '?'
    }
  },
  GetMemberPostsComment: { //我的社区消息
    url: cf.config.configUrl + 'PlateWebService.asmx/GetMemberPostsComment',
    post: {
      userId: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
  GetReporContentByAllList: { //获取举报内容类型
    url: cf.config.configUrl + 'PlateWebService.asmx/GetReporContentByAllList',
    post: {}
  },
  MemberRepor: { //用户举报
    url: cf.config.configUrl + 'PlateWebService.asmx/MemberRepor',
    post: {
      memberPostsId: '?',
      operateId: '?',
      postsCommentId: '?',
      replyContent: '?',
      replyUserId: '?',
      reporContent: '?',
      reportType: '?',
      reportUserId: '?'
    }
  },
  MemberCommentFabulous: { //帖子评论点赞
    url: cf.config.configUrl + 'PlateWebService.asmx/MemberCommentFabulous',
    post: {
      userId: '?',
      postsCommentId: '?',
      operateId: '?'
    }
  },
  CancelMemberCommentFabulous: { //帖子评论取消点赞
    url: cf.config.configUrl + 'PlateWebService.asmx/CancelMemberCommentFabulous',
    post: {
      userId: '?',
      postsCommentId: '?'
    }
  },
  GetDraftDetail: { //2.1.33获取草稿箱详情接口
    url: cf.config.configUrl + 'PlateWebService.asmx/GetDraftDetail',
    post: {
      OperateId: '?',
      UserId: '?'
    }
  },
  GetVendorListByUserId: { //  入驻店铺列表
    url: cf.config.configUrl + 'ShopWebService.asmx/GetVendorListByUserId',
    post: {
      UserId: '?'
    }
  },
}