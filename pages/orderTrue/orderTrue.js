var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
var vendorapi = require('../../api/vendorAPI.js');

Page({
   data: {
      shoplogo:"",
      shopname:"",
     remark1:"",
      isTrue:false,
      isShow:false,
      height:0,
      index:0,
     num:1,
      peopleNum:0,
      remarkLength:0,
      array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      remark:"",
      couponItemId:0,
      IsUseCoupon:1,
      addressId:0,
      pid: "",
      isFightGroup:"",
      addressId:0,
      physicalStoreId:"",
      shipMethod:0,
      sponsorId:0,
      length:0,
      submitinfo:{},
      orderNum:"",
      tableNum:"",
      much:0
   },
   onLoad: function (options) {
 var that=this;
     var that = this;
     wx.getStorage({ //获取本地缓存商家名
       key: "IdEntity001",
       success: function (res) {
         if (res.data.nextname[0] != '') {
           that.setData({
             remark: res.data.sidname,
             remark1: res.data.nextname[0]
           })
         }
         console.log("res", res)
         that.setData({
           indexfirstname: res.data.sidname
         })
       },
     })
     that.setData({
       orderNum:options.orderNum,
       tableNum: options.tableNum,
       shoplogo: app.globalData.VendorInfo.WapLogoPath,
       shopname: app.globalData.VendorInfo.ShopName,
       Currency: app.globalData.VendorInfo.Currency
     })
     that.getcartlist()
     notice.addNotification("RefreshOrder5", that.RefreshOrder5, that);
   },
   more:function(){
    this.setData({
      isShow: false,
      height:this.data.length*100
    })
   },
  RefreshOrder5: function (info) { //刷新订单
    console.log("info1", info)
    var that = this;
    that.setData({
      remark: info.sidname,
      remark1: info.nextname[0]
    })
  },
   getcartlist: function () { //获取购物车
     var thisobj = this;
     var vals = {
       storeID: app.globalData.VendorInfo.Id,
       userName: app.globalData.UserInfo.UserName
     }
     $.xsr($.makeUrl(cartapi.GetCartList, vals), function (data) { //先查询出购物车中所有的商品

       var val = {
         userAccount: app.globalData.UserInfo.UserName,
         ShoppingCartList: [],
         couponItemId: thisobj.data.couponItemId,	//使用优惠券id
         IsUseCoupon: thisobj.data.IsUseCoupon,//表示用户是否使用优惠券
         isFightGroup: !$.isNull(thisobj.data.spinfo) ? JSON.parse(thisobj.data.spinfo).isFightGroup : "",
         addressId: thisobj.data.addressid || 0,
         physicalStoreId: thisobj.data.physicalStoreId,
         shipMethod: thisobj.data.shipMethod,
         marktingEventId: thisobj.data.marktingEventId,
         sponsorId: thisobj.data.sponsorId,
       }
       if ($.isNull(thisobj.data.spinfo)) {
         thisobj.setData({
           pid: data.Info.VendorList[0].ShoppingCartList.Id
         })
         var thisval = data.Info.VendorList[0].ShoppingCartList;
         for (var x in thisval) {
           if (thisval[x].IsCheck) {
             thisval[x].AddTime = thisobj.getLocalTime(thisval[x].AddTime);
             val.ShoppingCartList.push(thisval[x]);
           }
         }
       } else {
         val.ShoppingCartList.push(JSON.parse(thisobj.data.spinfo));
       }
       thisobj.setData({
         cartinfo: val.ShoppingCartList
       });
       $.xsr($.makeUrl(cartapi.GoSettlement, val), function (data) {
         if (data.Code == 0) {
           var much=0;
           for (var i in data.Info.VendorShoppingCartItemsList[0].ShoppingCartList){
              much += data.Info.VendorShoppingCartItemsList[0].ShoppingCartList[i].Amount
           }
           thisobj.setData({
             much:much
           })
           thisobj.setData({
             submitinfo: data.Info,
             length: data.Info.VendorShoppingCartItemsList[0].ShoppingCartList.length
           });
           if (data.Info.VendorShoppingCartItemsList[0].ShoppingCartList.length * 100 > 1000) {
             thisobj.setData({
               isShow: true,
               height: 1000,
             })
           } else {
             thisobj.setData({
               isShow: false,
               height: data.Info.VendorShoppingCartItemsList[0].ShoppingCartList.length * 100
             })
           }
         }
       });
     });
   },
   getLocalTime: function (dateText) { //时间处理
     dateText = dateText.replace("/Date(", "").replace(")/", "");
     var d = new Date(parseInt(dateText));
     return d;
   },
   bindPickerChange: function (e) {
     this.setData({
       index: e.detail.value,
       peopleNum: this.data.array[e.detail.value]
     })
   },
   remark:function(){
    this.setData({
      isTrue: true
    })
   },
  select: function () {
    wx.navigateTo({
      url: '../Flavorcho/Flavorcho',
    })

  },

   submitorder: function (e) { //提交订单
   if ($.isNull(this.data.peopleNum) && this.data.orderNum == 'undefined'){
        wx.showModal({
          title: '提示',
          content: '请选择就餐人数',
        })
        return
    }
    
     var that = this;
    if(this.data.orderNum&&this.data.orderNum!='undefined'){
    
      var val = {
        userName: app.globalData.UserInfo.UserName,
        ShoppingCartList: this.data.cartinfo,
        ShoppingCartVendorList: [{
          VendorId: app.globalData.VendorInfo.Id,
          Remark: this.data.remark + this.data.remark1 
        }],
        remark: this.data.remark + this.data.remark1 ,
        addressId: this.data.addressid || 0,
        couponItemId: this.data.couponItemId || 0,
        payTypeId: 9,
        memberDiscount: !$.isNull(this.data.submitinfo.UserMembership) ? parseFloat(this.data.submitinfo.UserMembership.MemberDiscount) : 0,
        memberDiscountMoney: !$.isNull(this.data.submitinfo.UserMembership) ? parseFloat(this.data.submitinfo.UserMembership.MemberDiscountMoney) : 0,
        usingPoint: !$.isNull(this.data.integral) ? parseFloat(this.data.integral) : 0,
        pointAsCashMoney: !$.isNull(this.data.discount) ? parseFloat(this.data.discount) : 0,
        shipMethod: this.data.shipMethod,
        reservationDate: this.data.date || this.data.starttime,
        reservationStoreId: this.data.physicalStoreId,
        consignee: this.data.consignee,
        userTel: this.data.phone,
        marktingEventId: this.data.marktingEventId || 0,
        sponsorId: this.data.sponsorId,
        tableNum: this.data.tableNum,
        guestCount: JSON.parse(this.data.peopleNum),
        firstType: 3,
        orderNum: this.data.orderNum
      }
     
      $.xsr($.makeUrl(orderapi.AppendMealOrderDetail, val), function (data) {
        console.log("data典藏",data)
        console.log("点餐val", val)
        if (data.Code == 0) {
          that.setData({
            orderNum: data.Info.OrderNum
          });
          // wx.navigateTo({
          //   url: '../orderMessageDetail/orderMessageDetail?peopleNum=' + that.data.peopleNum + "&remark=" + that.data.remark + "&orderNum=" + that.data.orderNum,
          // })
          wx.redirectTo({
            url: '../orderMessageDetail/orderMessageDetail?peopleNum=' + that.data.peopleNum + "&remark=" + that.data.remark + that.data.remark1 + "&orderNum=" + that.data.orderNum,
          })
        } else {
          wx.showToast({
            title: data.Msg
          })
        }
      });
    }else{
      
      var val = {
        userName: app.globalData.UserInfo.UserName,
        ShoppingCartList: this.data.cartinfo,
        ShoppingCartVendorList: [{
          VendorId: app.globalData.VendorInfo.Id,
          Remark: this.data.remark + this.data.remark1  
        }],
        remark: this.data.remark + this.data.remark1  ,
        addressId: this.data.addressid || 0,
        couponItemId: this.data.couponItemId || 0,
        payTypeId: 9,
        memberDiscount: !$.isNull(this.data.submitinfo.UserMembership) ? parseFloat(this.data.submitinfo.UserMembership.MemberDiscount) : 0,
        memberDiscountMoney: !$.isNull(this.data.submitinfo.UserMembership) ? parseFloat(this.data.submitinfo.UserMembership.MemberDiscountMoney) : 0,
        usingPoint: !$.isNull(this.data.integral) ? parseFloat(this.data.integral) : 0,
        pointAsCashMoney: !$.isNull(this.data.discount) ? parseFloat(this.data.discount) : 0,
        shipMethod: this.data.shipMethod,
        reservationDate: this.data.date || this.data.starttime,
        reservationStoreId: this.data.physicalStoreId,
        consignee: this.data.consignee,
        userTel: this.data.phone,
        marktingEventId: this.data.marktingEventId || 0,
        sponsorId: this.data.sponsorId,
        tableNum: this.data.tableNum,
        guestCount: JSON.parse(this.data.peopleNum),
        firstType: 3
      }
      if (!$.isNull(that.data.spinfo)) {
        var spinfoobj = JSON.parse(that.data.spinfo);
        val.orderType = spinfoobj.orderType;
        val.isFightGroup = spinfoobj.isFightGroup;
        val.marketingEventId = spinfoobj.marketingEventId;//活动ID
        val.isOwner = spinfoobj.isOwner;
        val.ownGroupId = spinfoobj.ownGroupId;
      }
      $.xsr($.makeUrl(orderapi.AddMealOrderDetail, val), function (data) {
        console.log("data典藏22", data)
        console.log("点餐val222", val)
        if (data.Code == 0) {
          that.setData({
            orderNum: data.Info.OrderNum
          });
          wx.redirectTo({
            url: '../orderMessageDetail/orderMessageDetail?peopleNum=' + that.data.peopleNum + "&remark=" + that.data.remark + that.data.remark1 + "&orderNum=" + that.data.orderNum,
          })
        } else {
          wx.showToast({
            title: data.Msg
          })
        }
      });
    }
       
   },
})