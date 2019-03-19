var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
	AddCart: { //加入购物车
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/AddShoppingCart',
		post: {
			proId: '?',
			proName: '?',
			Amount: '?',
			UserAccount: '?',
			SKU_Id: '?'
		}
	},
	AddShoppingCartForTakeAway: { //加入购物车第六套模板（外卖类专用）
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/AddShoppingCartForTakeAway',
		post: {
			productId: '?',
			productName: '?',
			amount: '?',
			userAccount: '?',
			productSkuId: '?',
			vendorId: '?'
		}
	},
	GetCartList: { //查询购物车
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/GetShoppingCartListByUserAccount',
		post: {
			storeID: '?',
			userName: '?'
		}
	},
	CKCartItem: { //勾选购物车
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/CKCartItem',
		post: {
			VID: '?', //商户ID
			UID: "?", //用户名
			CID: '?', //购物车ID
			IsCK: '?' //是否选中
		}
	},
	SetSetCartNum: { //更新数量
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/SetCartNumber',
		post: {
			VID: '?', //商户ID
			UID: '?', //用户名
			CID: '?', //购物车ID
			Num: '?' //购物车数量
		}
	},
	GoSettlement: { //去结算
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/AddOrderInformation',
		post: {
			userAccount: "?", //用户名
			couponItemId: '?', //优惠券ID
			IsUseCoupon : '?', // 0：表示用户不想使用优惠券  1;表示用户想使用优惠券
			addressId: '?', //地址ID
			ShoppingCartList: '?', //要结算的购物车数据
			isFightGroup:'?',//是否使用活动价格
      shipMethod:"?",
      marktingEventId  :"?",
      sponsorId :"?",
      vendorId:"?"
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
	DelCartItem: { //删除购物车
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/DeleteShoppingCart',
		post: {
			SptrId: "?"
		}
	},
  GetUsableCouponItemListForQuickPay: { //优惠买单可用优惠券
    url: cf.config.configUrl + 'CouponWebService.asmx/GetUsableCouponItemListForQuickPay',
    post: {
      userId: "?",
      vendorId: "?",
      realMoney: "?"
    }
  },
  SelectProductList: { //2.1.31获取商品列表接口
    url: cf.config.configUrl + 'PlateWebService.asmx/SelectProductList',
    post: {
      OperateId: "?",
      ProductName: '?',
      pageIndex: '?',
      pageSize: 10,
    }
  },
}