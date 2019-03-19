var app = getApp()
var $ = require('../../utils/util.js')
var refundAPI = require('../../api/refundAPI.js')
var capi = require('../../api/community.js')
var picPath = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNum: 0, //订单变化
    Info: {},
    Isclosed:true,
    tel: 0, //商家电话
    valName: "", //联系人
    valTel: "", //联系人电话
    rangeArray: [],
    index: 0,
    IsChange: false, //申请原因选择
    ImgList: [],
    orderDetailList: [],
    textVal: "", //文本域内容
    inputLen: 0, //文本域字符长度
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    picPath = [];
    that.setData({
      orderNum: options.on || 0,
      Currency: app.globalData.VendorInfo.Currency
    })
    that.GetReturnProductList()
    that.GetReturnOrderReson()
  },
  GetReturnProductList: function() {
    var that = this;
    var val = {
      orderNum: that.data.orderNum
    }
    console.log("val", val)
    $.xsr($.makeUrl(refundAPI.GetReturnProductList, val), function(res) {
      console.log("++++++++", res)
      if (res.Code == 0) {
        // Info: res.Info,
        that.setData({
          orderDetailList: res.Info.ServeceOrderDetailList,
          tel: res.Info.Phone,
          valName: res.Info.Consignee,
          valTel: res.Info.Tel
        })
      }
    })
  },

  GetReturnOrderReson: function() { //申请原因
    var that = this;
    $.xsr($.makeUrl(refundAPI.GetReturnOrderReson), function(res) {
      console.log(res)
      if (res.Code == 0) {
        var rangeArray = that.data.rangeArray;
        for (var i = 0, len = res.Info.length; i < len; i++) {
          rangeArray.push(res.Info[i].ReasonText)
        }
        that.setData({
          rangeArray: rangeArray
        })
      }
    })
  },
  sub: function(even) { //减数量
    var val = {
      btntype: 2,
      numval: even.currentTarget.dataset.num,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock
    }
    this.unifiedNum(val);
  },
  add: function(even) { //加数量
    var val = {
      btntype: 1,
      numval: even.currentTarget.dataset.num,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock
    }
    this.unifiedNum(val);
  },
  writenum: function(even) { //失去焦点时
    var val = {
      btntype: 3,
      numval: even.detail.value,
      CID: even.currentTarget.dataset.cid,
      stock: even.currentTarget.dataset.stock
    }
    this.unifiedNum(val);
  },
  unifiedNum: function(val) { //统一判断
    var that = this;
    var thisobj = { //接收的临时变量
      value: parseInt(val.numval),
      stock: parseInt(val.stock)
    }
    if (val.btntype == 1) { //表示加数量
      thisobj.value = thisobj.value + 1;
    }
    if (val.btntype == 2) { //表示减数量
      thisobj.value = thisobj.value - 1;
    }
    if (thisobj.value > thisobj.stock) { //是否大于最大值
      thisobj.value = thisobj.stock;
    }
    if (thisobj.value <= 0) { //表示等于0
      thisobj.value = 1;
    }

    var parsem = {
      orderNum: that.data.orderNum
    }
    $.xsr($.makeUrl(refundAPI.GetReturnProductList, parsem), function(res) {
      if (res.Code == 0) {
        var resInfo = res.Info.ServeceOrderDetailList;
        for (var i = 0, len = resInfo.length; i < len; i++) {
          if (val.CID == resInfo[i].SkuId) {
            if (thisobj.value > resInfo[i].CanRefundAmount) { //表示等于0
              var orderDetailList = that.data.orderDetailList;
              thisobj.value = resInfo[i].CanRefundAmount;
              orderDetailList[i].CanRefundAmount = thisobj.value;
              that.setData({
                orderDetailList: orderDetailList
              })
              return
            }
          }

        }
      }
    })
    var that = this;
    var orderDetailList = that.data.orderDetailList;
    for (var i = 0, len = orderDetailList.length; i < len; i++) {
      if (val.CID == orderDetailList[i].SkuId) {
        orderDetailList[i].CanRefundAmount = thisobj.value
      }
    }
    that.setData({
      orderDetailList: orderDetailList
    })
  },
  // 申请原因
  bindPickerChange: function(e) {
    this.setData({
      IsChange: true,
      index: e.detail.value
    })
  },
  //拨打电话
  callUp: function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel
    })
  },
  UploadImg: function() { //发布帖子上传图片接口
    var that = this;
    var count = 9; //还可以上传图片数量
    if (!$.isNull(that.data.ImgList)) {
      count = 9 - that.data.ImgList.length;
    }
    console.log("that.data.ImgList.length", that.data.ImgList.length)
    if (count == 0) {
      $.alert("最多上传9张图片！");
      return;
    }
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        $.loading()
        console.log(res)
        var coun = that.data.ImgList.length
        var tempFilePaths = res.tempFilePaths; //这里是选好的图片的地址，是一个数组
        var arr = [];
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: capi.UploadImgNew.url, //仅为示例，非真实的接口地址
            method: "POST",
            filePath: tempFilePaths[i],
            name: 'filesBytes',
            formData: {
              'user': i + coun,
              'vendorId': app.globalData.VendorInfo.Id,
            },
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function(res) {
              var data = $.parseJSON(res.data);
              console.log("res.data", data);
              picPath.push(data.Info);
              var length = picPath.length;
              for (var i = length - 1; i > 0; i--) { //用于缩小范围
                for (var j = 0; j < i; j++) { //在范围内进行冒泡，在此范围内最大的一个将冒到最后面
                  if (picPath[j].order > picPath[j + 1].order) {
                    var temp = picPath[j];
                    picPath[j] = picPath[j + 1];
                    picPath[j + 1] = temp;
                  }
                }
              }
              that.setData({
                ImgList: picPath,
              });
              $.hideloading()
            },
            fail: function(res) {},
            complete: function(res) {}
          })

        }
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  delImg: function(e) { //删除图片
    var that = this;
    $.confirm("是否放弃上传本张图片?", function(res) {
      if (res.confirm) {
        var pPic = that.data.ImgList;
        var newArray = [];
        picPath = [];
        for (var j in pPic) {
          if (j != e.target.dataset.index) {
            newArray.push(pPic[j]);
            picPath.push(pPic[j]);
          }
        }
        that.setData({
          ImgList: newArray,
        });
      }
    }, true);
  },
  ckitem: function(even) { //勾选单个值
    var that = this;
    var orderDetailList = that.data.orderDetailList;
    for (var i = 0, len = orderDetailList.length; i < len; i++) {
      if (even.currentTarget.dataset.skuid == orderDetailList[i].SkuId) {
        if (orderDetailList[i].IsCheck == true) {
          orderDetailList[i].IsCheck = false
        } else {
          orderDetailList[i].IsCheck = true
        }

      }
    }
    that.setData({
      orderDetailList: orderDetailList
    })
  },

  // textVal
  txtVal: function(e) { //文本域操作
    this.setData({
      textVal: e.detail.value
    })
  },
  txtEven: function(even) {
    console.log(even)
    this.setData({
      inputLen: even.detail.cursor
    })
  },
  linkName: function(e) {
    console.log(e)
    this.setData({
      valName: e.detail.value
    })
  },
  linkTel: function(e) {
    this.setData({
      valTel: e.detail.value
    })
  },
  // 提交给后台
  affterTap: function() {

    var that = this;

    var time;
    clearTimeout(time)
    time = setTimeout(function() {
      var val = {
        VendorId: app.globalData.VendorInfo.Id,
        UserName: app.globalData.UserInfo.UserName,
        OrderNum: that.data.orderNum,
        ReasonId: (that.data.index) + 1,
        ReasonName: that.data.rangeArray[that.data.index],
        Remark: that.data.textVal,
        Contact: that.data.valName,
        UserPhone: that.data.valTel,
      }

      var refundGoodInfo = [];
      var orderDetailList = that.data.orderDetailList;
      for (var i = 0, len = orderDetailList.length; i < len; i++) {
        if (orderDetailList[i].IsCheck) {
          orderDetailList[i].ReturnCount = orderDetailList[i].CanRefundAmount
          refundGoodInfo.push(orderDetailList[i])
        }
      }

      val.RefundGoodInfo = refundGoodInfo;

      var ImgList = that.data.ImgList;
      var goodsImgslList = [];
      for (var j = 0; j < ImgList.length; j++) {
        goodsImgslList.push(ImgList[j].Url)
      }
      val.GoodsImgslList = goodsImgslList

      if (val.RefundGoodInfo.length == 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择你需要申请的商品！'
        });
        return;
      }

      if (that.data.IsChange == false) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择你的申请原因！'
        });
        return;
      }

      if (that.data.IsChange == false) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择你的申请原因！'
        });
        return;
      }
      if (that.data.valName == "") {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写联系人姓名'
        });
        return;
      }
      if (!(/^1[34578]\d{9}$/.test(that.data.valTel)) || that.data.valTel == "") {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请填写正确的手机号码'
        });
        return;
      }
      $.xsr($.makeUrl(refundAPI.OrganizationReturnGoods, val), function(res) {
        console.log(val)
        console.log(res)
        if (res.Code == 0) {
          that.setData({
            Isclosed:false
          })
          $.alert("提交成功")
          setTimeout(function() {
            var pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
            var prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
            prevPage.setData({
              tabNav: 2, 
              isBack:true
            }) 
            wx.navigateBack({
              delta: 1
            })
          }, 100)
        }
      })
    }, 0)
  },
})