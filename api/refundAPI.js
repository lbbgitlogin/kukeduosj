var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
  GetPostSaleRecordList: { //获取申请记录
    url: cf.config.configUrl + 'PostSaleWebService.asmx/GetPostSaleRecordList',
    post: {
      userName: '?',
      vendorId: '?',
      pageIndex: '?',
      pageSize: '?',
    }
  },
  GetSoldServiceOrderList: { //售后服务订单列表
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/GetSoldServiceOrderList',
    post: {
      userName: '?',
      vendorId: '?',
      currentPage: '?',
      pageSize: '?',
      isCache: true
    }
  },

  GetReturnProductList: { //申请售后服务
    url: cf.config.configUrl + 'PostSaleWebService.asmx/GetReturnProductList',
    post: {
      orderNum: "?"
    }
  },
  GetReturnOrderReson: { //申请原因
    url: cf.config.configUrl + 'PostSaleWebService.asmx/GetReturnOrderReson',
    post: {}
  },
  OrganizationReturnGoods: { //添加售后服务申请记录
    url: cf.config.configUrl + 'PostSaleWebService.asmx/OrganizationReturnGoods',
    post: {
      VendorId:"?",
      UserName: "?",
      OrderNum: "?",
      RefundGoodInfo: "?",
      ReasonId: "?",
      ReasonName: "?",
      Remark: "?",
      Contact: "?",
      UserPhone: "?",
      GoodsImgslList: "?"
    }
  },
  EditSendOrderInfo: {
    url: cf.config.configUrl + 'PostSaleWebService.asmx/EditSendOrderInfo',
    post: {
      userName: "?",
      goodsReturnNum: "?",
      expressCompany: "?",
      logisticsNum: "?"
    }
  },
  GetSendOrderInfo: {
    url: cf.config.configUrl + 'PostSaleWebService.asmx/GetSendOrderInfo',
    post: {
      goodsReturnNum: "?",
    }
  },
  GetPostSaleOrderInfo: {
    url: cf.config.configUrl + 'PostSaleWebService.asmx/GetPostSaleOrderInfo',
    post: {
      goodsReturnNum: "?",
    }
  },

  GetPostSaleSchedule: {
    url: cf.config.configUrl + 'PostSaleWebService.asmx/GetPostSaleSchedule',
    post: {
      goodsReturnNum: "?",
    }
  },
  CancelPostSaleApplication: {
    url: cf.config.configUrl + 'PostSaleWebService.asmx/CancelPostSaleApplication',
    post: {
      userName:"?",
      goodsReturnNum: "?"
    }
  },
}