var $ = require('../../utils/util.js');
Page({
	data: {
		val: ""
	},
	onShow:function() {

	},
	startinput:function(e) {
		this.setData({
			val: e.detail.value
		});
	},
	search:function() {
		var thisobj = this;
		if (!$.isNull(thisobj.data.val)) {
      $.golevelToTabBar(thisobj,"../../"+ thisobj.route, "../productlist/productlist?pname=" + thisobj.data.val);
		}else{
			$.confirm("请输入您要搜索的关键词!");
		}
	}
})