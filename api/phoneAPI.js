var cfExt = wx.getExtConfigSync ? wx.getExtConfigSync() : require('../config.js');
var cf = cfExt.config ? wx.getExtConfigSync() : require('../config.js');
module.exports = {
	SendMessage: { //发送短信
		url: cf.config.configUrl + 'UserWebService.asmx/WeiXinSendMessage',
		post: {
			Phone: '?',
			UserName: '?',
			NickName: '?'
		}
	},
	BindPhone: { //绑定手机
		url: cf.config.configUrl + 'UserWebService.asmx/VerificationPhone',
		post: {
			Phone: '?',
			UserName: '?',
			Code: '?'
		}
	}
}