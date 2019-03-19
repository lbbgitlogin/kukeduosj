var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		Pindex: 0,
		Cindex: 0,
		Dindex: 0,
		PCDlist: {}, //缓存数据
		Province: {}, //省份列表
		City: {}, //城市列表
		District: {}, //获取区县列表
		selectProId: 0, //选择的省份ID
		selectCid: 0, //选择的城市城市ID
		selectDid: 0, //选择的区县
		adid: 0, //地址ID
		spid:"",
		addressinfo: {},
		seladstr:"",//选择地址的字符串
		isShow: false, //是否展示地址列表
		isDefault: false, //是否为默认地址
		showconsignee:'',//初始化值
		showdetail:'',//初始化值
		showphone:'',//初始化值
		showisDefault:'',//初始值
		consignee: '', //收件人人
		detail: '', //详细地址
		value: [0, 0, 0],
		phone: '', //联系电话
		isre: true, //电话正则
		issub: false //是否提交订单过来的
	},
	onLoad:function(options) {
		var thisobj = this;
		this.setData({
			issub: options.issub,
			adid: options.adid || 0,
			spid:options.spid || ""
		});
		var thisdata = this;
		if(options.adid > 0) {
			wx.setNavigationBarTitle({
				title: "修改地址"
			});
			var val = {
				Id: options.adid
			}
			$.xsr($.makeUrl(userapi.GetAddressDetail, val), function(data) {
        console.log(data)
				thisdata.setData({
					addressinfo: data.Info[0],
					selectProId: data.Info[0].province,
					selectCid: data.Info[0].city,
					selectDid: data.Info[0].district,
					showconsignee:data.Info[0].consignee,
					showdetail:data.Info[0].detail,
					showphone:data.Info[0].phone,
					showisDefault:data.Info[0].isDefault,
					consignee: data.Info[0].consignee,
					detail: data.Info[0].detail,
					isDefault: data.Info[0].isDefault,
					phone: data.Info[0].phone
				});
				thisdata.GetAllPCDList(function() {
					thisobj.seladress();
				});
			});
		} else {
			thisdata.GetAllPCDList(function() {
				thisobj.seladress();
			});
		}
	},
	GetAllPCDList:function(callback) {
		var that = this;
		$.getCache("pcdlist", function(res) { //看是否存在缓存，存在缓存直接读取缓存
			that.setData({ 
				PCDlist: res.data
			});
			callback();
		}, function(res) {
			$.xsr(userapi.GetAllPCDList, function(data) {
        console.log(data)
				$.setCache("pcdlist", data, function() {
					that.setData({
						PCDlist: data
					});
					callback();
				});
			})
		});
	},
	GetProvince:function() {
		var that = this.data.PCDlist.PList;
		var pname = [];
		var pid = [];
		for(var x in that) {
			pname.push(that[x].ProvinceName);
			pid.push(that[x].ProvinceID);
			if(this.data.selectProId == that[x].ProvinceID) {
				this.setData({
					Pindex: x
				});
			}
		};
		this.setData({
			Province: {
				pname: pname,
				pid: pid
			}
		});
	},
	inputconsignee:function(even) { //输入收件人时
		this.setData({
			consignee: even.detail.value
		});
	},
	inputdetail:function(even) { //输入详细地址
		this.setData({
			detail: even.detail.value
		});
		return even.detail.value;
	},
	inputphone:function(even) { //输入手机
		this.setData({
			phone: even.detail.value
		});
		if(!(/^1[34578]\d{9}$/.test(even.detail.value))) {
			this.setData({
				isre: false
			});
		} else {
			this.setData({
				isre: true
			});
		}
	},
	ckDefault:function(e) { //设置默认地址
		this.setData({
			isDefault: e.detail.value
		});
	},
	submitinfo:function() { //提交数据
		if($.isNull(this.data.consignee)) {
			return;
		}
		if($.isNull(this.data.detail)) {
			return;
		}
		if($.isNull(this.data.phone)) {
			return;
		}
		if(!this.data.isre) {
			return;
		}
		if(this.data.selectCid<=0){
			$.alert("请选择省市区！");
			return;
		}
		var val = {
			userName: app.globalData.UserInfo.UserName,
			consignee: this.data.consignee,
			province: this.data.selectProId,
			city: this.data.selectCid,
			district: this.data.selectDid,
			detail: this.data.detail,
			isDefault: this.data.isDefault,
			phone: this.data.phone
		}
		var thisval = this;
		if(this.data.adid <= 0) { //表示添加
			$.xsr($.makeUrl(userapi.AddAddress, val), function(data) {
				if(data.Code == 0) {
					wx.showToast({
						title: '添加成功',
						icon: 'success',
						duration: 2000,
						success: function() {
							if(thisval.data.issub === 'true') {
								if(thisval.data.adid < 0) {
									$.backpage(1, function() {
										var isv={
											adid:data.Info[0],
											spid:thisval.data.spid
										}
										notice.postNotificationName("RefreshOrder",isv);
									});
								} else {
									$.backpage(1, function() {
										var isv={
											adid:data.Info[0],
											spid:thisval.data.spid
										}
										notice.postNotificationName("RefreshOrder",isv);
									});
								}
							} else {
								$.backpage(1, function() {
									notice.postNotificationName("Refresh", "发送消息！");
								});
							}
						}
					})
				}
			});
		} else { //表示修改
			val.id = this.data.adid;
			$.xsr($.makeUrl(userapi.EditAddress, val), function(data) {
				if(data.Code == 0) {
					wx.showToast({
						title: '修改成功',
						icon: 'success',
						duration: 2000,
						success: function() {
							if(thisval.data.issub === 'true') {
								$.backpage(1, function() {
									var isv={
										adid:thisval.data.adid,
										spid:thisval.data.spid
									}
									notice.postNotificationName("RefreshOrder",isv);
								});
							} else {
								$.backpage(1, function() {
									notice.postNotificationName("Refresh", "发送消息！");
								});
							}
						}
					})
				}
			});
		}
	},
	bindChange:function(e) {
		if(e.detail.value[0]!=this.data.value[0]){
			this.setData({
				value:[e.detail.value[0],0,0]
			});
		}else if(e.detail.value[1]!=this.data.value[1]){
			this.setData({
				value:[e.detail.value[0],e.detail.value[1],0]
			});
		}else{
			this.setData({
				value:[e.detail.value[0],e.detail.value[1],e.detail.value[2]]
			});
		}
		this.seladress(this.data.value[0], this.data.value[1], this.data.value[2]);
		this.setData({
			Pindex:this.data.value[0],
			selectProId: this.data.Province.pid[this.data.value[0]],
			selectCid: this.data.City.cid[this.data.value[1]],
			selectDid: this.data.District.did[this.data.value[2]]
		});
	},
	seladress:function(p, c, d) {
		var that = this;
		var pname = [];
		var pid = [];
		for(var x in this.data.PCDlist.PList) {
			pname.push(this.data.PCDlist.PList[x].ProvinceName);
			pid.push(this.data.PCDlist.PList[x].ProvinceID);
		};
		this.setData({
			Province: {
				pname: pname,
				pid: pid
			}
		});
		var cname = [];
		var cid = [];
		this.data.PCDlist.CList.map(function(item) {
			if(item.ProvinceID ==(that.data.Province.pid[p || 0]?that.data.Province.pid[p || 0]:that.data.Province.pid[0])) {
				cname.push(item.CityName);
				cid.push(item.CityID);
			}
		});
		this.setData({
			City: {
				cname: cname,
				cid: cid
			}
		});
		var dname = [];
		var did = [];
		this.data.PCDlist.DList.map(function(item) {
			if(item.CityID ==(that.data.City.cid[c || 0]?that.data.City.cid[c || 0]:that.data.City.cid[0])) {
				dname.push(item.DistrictName);
				did.push(item.DistrictID);
			}
		});

		that.setData({
			District: {
				dname: dname,
				did: did
			}
		});

		var name=[];
		if($.isNull(that.data.Province.pname[p])){
			this.data.PCDlist.PList.map(function(item) {
				if(item.ProvinceID==that.data.selectProId){
					name.push(item.ProvinceName);
				}
			});
		}else{
			name.push(that.data.Province.pname[p]);
		}
		if($.isNull(that.data.City.cname[c])){
			this.data.PCDlist.CList.map(function(item) {
				if(item.CityID==that.data.selectCid){
					name.push(item.CityName);
				}
			});
		}else{
			name.push(that.data.City.cname[c]);
		}
		if($.isNull(that.data.District.dname[d])){
			this.data.PCDlist.DList.map(function(item) {
				if(item.DistrictID==that.data.selectDid){
					name.push(item.DistrictName);
				}
			});
		}else{
			name.push(that.data.District.dname[d]);
		}
		this.setData({
			seladstr:$.isNull(name.toString())?'请选择地址':name.toString()
		});
	},
	closead:function(){//关闭地址
		this.setData({
			isShow:false
		});
	},
	showbox:function(){
		this.setData({
			isShow:true
		});
	}
})