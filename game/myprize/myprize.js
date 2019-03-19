var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
Page({
	data: {
		Prize: [],
		Category:0,
		tip1:'',
		tip2:'',
    isLuckDraw: true,
    isGoldenEgg: true
	},
	onLoad: function (options) {
    var str = app.globalData.VendorInfo.VendorFeatureSet;
    if (str.indexOf("LuckDraw") > -1) {//抽奖
      this.setData({
        isLuckDraw: true
      })
    } else {
      this.setData({
        isLuckDraw: false
      })
    }
    if (str.indexOf("GoldenEgg") > -1) {//砸金蛋
      this.setData({
        isGoldenEgg: true
      })
    } else {
      this.setData({
        isGoldenEgg: false
      })
    }
		this.setData({
			Category:options.category
		});
		if(this.data.Category == 1){//幸运大抽奖
			wx.setNavigationBarTitle({
			title: "幸运大抽奖-我的奖品"
		});
		this.setData({
			tip1:'抽',
			tip2:'抽奖',
		});
		}else if(this.data.Category == 2){//砸金蛋
			wx.setNavigationBarTitle({
			title: "幸运砸金蛋-我的奖品"
		});
		this.setData({
			tip1:'砸',
			tip2:'砸金蛋',
		});
		}
	},

	onShow:function() {
    if (this.data.isGoldenEgg || this.data.isLuckDraw){
      this.getPrizelist();
    }
	},

	getPrizelist: function () {
		var val = {
			VendorId: app.globalData.VendorInfo.Id,
			UserId: app.globalData.UserInfo.Id,
			Category:this.data.Category
		}
		var thisobj = this;
		$.xsr($.makeUrl(activityapi.GetUserWinningPrizeVOList, val), function (res) {
			if (res.Code == 0 && res.Info.length>0) {
				thisobj.setData({
					Prize: res.Info
				});
			}
		});
	},

	buttonclicked: function (e) {
		if (e.target.dataset.issend) {//已经发放 返回
			return;
		}
		wx.navigateTo({
			url: "../receiveprize/receiveprize?id="+e.target.dataset.id+"&prizeid="+e.target.dataset.prizeid+"&uniqueid="+e.target.dataset.uniqueid
		});
	}

})