var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data:{
    orderNum:"",
    Logistics:{},
    markers: [],
    Info:[],
    DLogistics:[],
    LogisticName:"",
    path:""
  },
  onLoad(options){
    this.setData({
      orderNum:options.on,
      LogisticName: options.LogisticName
    })
    this.GetShipmentStakeholders();
    if (options.LogisticName == '达达配送' || options.LogisticName == 'UU配送'){
      this.GetShipmentDetailList()
    }else{
      this.ExpressQuery(options.on);
    }
  },
  ExpressQuery(on) {//查询物流进度
		var that=this;
		var val = {
			OrderNum: on
		}
		$.xsr($.makeUrl(orderapi.ExpressQuery, val), function(data) {
      console.log("快递物流状态",data)
      if (data.Info.Traces){
        data.Info.Traces.reverse()
      }
			that.setData({
				Logistics:data.Info
			});
		});
	},
  
  GetShipmentStakeholders: function () {//获取达达配送订单详情信息
    var that= this;
    var val = {
      orderNum : this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id
    }
    var that = this
    $.xsr($.makeUrl(orderapi.GetShipmentStakeholders, val), function (data) {
      that.setData({
        Info:data.Info
      })
      that.getImageInfo()
    });
  },
  GetShipmentDetailList: function () {//获取配送单详情
    var that = this;
    var val = {
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id
    }
    var that = this
    $.xsr($.makeUrl(orderapi.GetShipmentDetailList, val), function (data) {
      if (data.Info.Traces) {
        data.Info.Traces.reverse()
      }
      that.setData({
        DLogistics: data.Info
      });
    });
  },
  getImageInfo:function(){
    var obj = [];
    var that=this;
    wx.getImageInfo({
      src: that.data.Info.LogoPath,
      success: function (res) {
        that.setData({
          path: res.path
        })
      }
    })
    var merchant = {
      latitude: that.data.Info.StoreAddressLat,
      longitude: that.data.Info.StoreAddressLng,
      width: 50,
      height: 60,
      iconPath: 'http://appicon-1253690476.file.myqcloud.com/img/merchant.png'
    }
    var horseman = {
      latitude: that.data.Info.TransporterLat,
      longitude: that.data.Info.TransporterLng,
      width: 50,
      height: 60,
      iconPath: 'http://appicon-1253690476.file.myqcloud.com/img/horseman.png'
    }
    var person = {
      latitude: that.data.Info.OrderAddressLat,
      longitude: that.data.Info.OrderAddressLng,
      width: 50,
      height: 60,
      iconPath: 'http://appicon-1253690476.file.myqcloud.com/img/person.png'
    }
    obj.push(merchant)
    obj.push(horseman)
    obj.push(person)
    that.setData({
      markers: obj
    })
  },
  
  call: function () {
    var that=this
    wx.makePhoneCall({
      phoneNumber: that.data.Info.TransporterPhone
    })
  },
})