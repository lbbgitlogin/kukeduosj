var app = getApp()
var $ = require('../../utils/util.js');
var actapi = require('../../api/activityAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    flag: true, //是否可以进行下次分页
    ispage: true, //是否还有数据
    isdata: true, //是否存在数据
    order: 0, //排序方式
    pageIndex: 1,
    ProductName: '',    //商品名字
    px: 1, //排序方式
    pdlist: [],
    prizeId: 0,  //奖品id
    address: '',  //地址
    tel: '',  //电话 
    username: '',  //领奖人姓名
    PrizePic: '',  //奖品的图片地址
    prize: '',  //奖品的名称
    isaddress: true,   //防止领奖品按钮多次点击
    show: true,
    discountmoney:'',
    name:'',
    strValidateEnd:'',
    islength:'',
    CouponMoneyLimitDec:'',
    CouponTypeDec:''
  },
  // onLoad: function (options) {
  //   var that = this;
  //   that.GetProductByOperateId()
  //   // notice.addNotification("prizeList", that.prizeList, that);
  // },
  onShow: function () {
    var that = this;
    that.setData({
      pdlist: [],
      pageIndex: 1,
      isaddress: true,
    })
    that.GetProductByOperateId()
  },
  submit: function () {
    var that = this
    that.setData({
      pdlist: [],
      pageIndex: 1,
      px: 1
    })
    that.GetProductByOperateId()
  },
  // prizeList: function (info) {//刷新订单
  // console.log(info)
  //   this.setData({
  //     address: info.address,
  //     consignee: info.consignee,
  //     tel: info.tel
  //   });
  // },
  GetProductByOperateId: function () { //5获取用户奖品列表接口
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      userId: app.globalData.UserInfo.Id,
      pageIndex: that.data.pageIndex,
    }
    console.log(val)
    $.xsr($.makeUrl(actapi.GetPrizesList, val), function (data) {
      console.log(data)
      if (data.Info != "") {
        if (data.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            pdlist: that.data.pdlist.concat(data.Info),
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            pdlist: that.data.pdlist.concat(data.Info),
          });
        }
        data.Info.forEach(function (val) {
          if (!$.isNull(val.CouponInfo)) {
            val.islength = val.CouponInfo.DiscountMoney
          }
        });
      } else if (that.data.pageIndex != 1) {
        that.setData({
          flag: false,
          ispage: false,
          isdata: true
        });
      } else {
        that.setData({
          flag: false,
          ispage: false,
          isdata: false
        });
      }
    })
  },
  scrollbottom: function (even) {  //滚动到底部进行分页
    var that = this
    if (this.data.flag) { //判断是否可以进行下次分页
      this.setData({
        flag: false
      })
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1,
        });
        that.GetProductByOperateId()
      }, 500);
    }
  },
  receive: function (e) {  //判断奖品发放类型
  console.log(e)
    if (e.currentTarget.dataset.type == 2) {
      this.setData({
        prizeId: e.currentTarget.dataset.id,
        PrizePic: e.currentTarget.dataset.url,
        prize: e.currentTarget.dataset.prizename
      });
      this.selectAddress()
    }
  },
  selectAddress: function () {//选择地址
    var that = this;
    if (that.data.isaddress == true) {
      that.setData({
        isaddress: false,
      });

      wx.chooseAddress({
        success: function (res) {//授权成功
          var address = res.provinceName + res.cityName + res.countyName + res.detailInfo
          that.setData({
            address: address,
            username: res.userName,
            tel: res.telNumber
          });
          wx.showModal({
            title: '提示',
            content: '是否确认该地址为奖品收货地址',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  isaddress: true,
                })
                that.UpdatePrizeRecord()
              } else if (res.cancel) {
                that.setData({
                  isaddress: true,
                })
              }
            }
          })
        },
        fail: function (res) {//授权失败，走调用地址
          $.gopage("../../pages/addresslist/addresslist?Prize=true&prizeId=" + that.data.prizeId + '&img=' + that.data.PrizePic + '&prizename=' + that.data.prize, );
        }
      })
    }

  },
  UpdatePrizeRecord: function () {   //2.1.6领取自定义奖品接口
    var that = this;
    var val = {
      // operateId: app.globalData.OperateInfo.OperateId,
      // userId: app.globalData.UserInfo.Id,
      id: that.data.prizeId,
      address: that.data.address,
      tel: that.data.tel,
      consignee: that.data.username,
    }
    console.log(val)
    $.xsr($.makeUrl(actapi.UpdatePrizeRecord, val), function (data) {
      console.log(data)
      if (data.Code == 0) {
        wx.navigateTo({
          url: '../mythePrize/mythePrize?img=' + that.data.PrizePic + '&prize=' + that.data.prize,
        })
      }
    })
  },
  homeindex: function () {
    wx.switchTab({
      url: '../../pages/index/index',
    })
  },
  drawcoupon: function (e) {
    console.log(e)
    this.setData({
      discountmoney: e.currentTarget.dataset.discountmoney,
      name: e.currentTarget.dataset.name,
      strValidateEnd: e.currentTarget.dataset.strvalidateend,
      CouponMoneyLimitDec: e.currentTarget.dataset.couponmoneylimitdec,
      CouponTypeDec: e.currentTarget.dataset.coupontypedec,
      islength: e.currentTarget.dataset.islength+'',
      couponId: e.currentTarget.dataset.couponid,
      show: false,
    })
    var val={
      id: e.currentTarget.dataset.id,
      couponId: e.currentTarget.dataset.couponid
    }
    console.log(val)
    $.xsr($.makeUrl(actapi.DrawCoupon, val), function (data) {
      console.log(data)
      if (data.Code == 0) {

      }
    })
  },
  outertouch: function () {//关闭
    this.setData({
      show: true,
      pdlist: [],
      pageIndex: 1,
      isaddress: true,
    });
    this.GetProductByOperateId()
  },
})