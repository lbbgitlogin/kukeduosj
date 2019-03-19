var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    maxCount: "",
    maxAount: "",
    maxBount: "",
    isckall: false, //是否全选
    isck: false, //判断是否有选中值
    cartlist: {}, //购物车集合
    X_Start: 0, //开始滑动的位置
    X_End: 0, //滑动结束的位置
    T_Id: 0, //当前滑动的目标元素
    queding: "",
    Sel_Id: [], //选中的的ID
    isdata: true, //是否存在数据
    isShow: false
  },
  onLoad: function(options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        // that.getcartlist();
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      // that.getcartlist();
    }
  },
  onShow: function() {
    this.getcartlist();
  },
  onPullDownRefresh: function() {
    this.getcartlist();
  },
  ckalllength: function(data) { //判断是否全选
    var that = this;
    var selid = [];
    if (!$.isNull(data.Info.VendorList)) {
      var thisobj = data.Info.VendorList[0].ShoppingCartList;
      var cklength = 0; //选中的个数
      var cartlength = thisobj.length; //购物车的个数
      for (var x in thisobj) {
        if (thisobj[x].IsCheck) { //记录选择个数
          cklength++;
          selid.push(thisobj[x].Id)
        }
      }
      that.setData({
        Sel_Id: selid
      })
      if (cklength === cartlength) { //表示全选
        this.setData({
          isckall: true
        });
      } else {
        this.setData({
          isckall: false
        });
      }
      if (cklength > 0) {
        this.setData({
          isck: true
        });
      } else {
        this.setData({
          isck: false
        });
      }
    } else {
      this.setData({
        isdata: false
      });
    }
  },
  ckitem: function(even) { //勾选单个值
    var Ojb = even.currentTarget.dataset.ojb;
    var Ojf = even.currentTarget.dataset.ojf;
    var isck = even.currentTarget.dataset.isck;
    var Ojt = even.currentTarget.dataset.ojt;
    var Ojj = even.currentTarget.dataset.ojj;
    var val = {
      VID: app.globalData.VendorInfo.Id,
      UID: app.globalData.UserInfo.UserName,
      CID: even.currentTarget.dataset.id,
      IsCK: even.currentTarget.dataset.isck ? 'false' : 'true',
    }
    var thisobj = this;
    if (Ojb) {
      wx.showModal({
        title: '提示',
        content: "抱歉，该商品已失效，请重新选择",
        showCancel: false,
      });
      return false;
    }
    if (Ojj == "offline") {
      wx.showModal({
        title: '提示',
        content: "抱歉，该商已下架，请重新选择",
        showCancel: false,
      });
      return false;
    }
    $.xsr($.makeUrl(cartapi.CKCartItem, val), function(data) {
      if (data.Info[0]) { //如果执行成功成功，则再次查询购物车，进行数据绑定
        thisobj.getcartlist();
      }
    });

  },
  ckall: function(even) { //勾选所有值
    var val = {
      VID: app.globalData.VendorInfo.Id,
      UID: app.globalData.UserInfo.UserName,
      CID: "0",
      IsCK: even.currentTarget.dataset.isck ? 'false' : 'true'
    }
    var thisobj = this;
    $.xsr($.makeUrl(cartapi.CKCartItem, val), function(data) {
      if (data.Info[0]) { //如果执行成功成功，则再次查询购物车，进行数据绑定
        thisobj.getcartlist();
      }
    });
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
    var postval = {
      VID: app.globalData.VendorInfo.Id,
      UID: app.globalData.UserInfo.UserName,
      CID: val.CID,
      Num: thisobj.value
    }
    var thiso = this;
    $.xsr($.makeUrl(cartapi.SetSetCartNum, postval), function(data) {
      if (data.Info[0]) {
        thiso.getcartlist();
      }
    });
  },
  getcartlist: function() { //获取购物车

    var thisobj = this;
    var val = {
      storeID: app.globalData.VendorInfo.Id,
      userName: app.globalData.UserInfo.UserName
    }
    $.xsr($.makeUrl(cartapi.GetCartList, val), function(data) {

      thisobj.ckalllength(data);
      if (data.Code == 0) {
        thisobj.setData({
          isdata: true,
          isShow: true,
          cartlist: data.Info
        });
        wx.stopPullDownRefresh();
      } else {
        thisobj.setData({
          isdata: false
        })
      }
    });
  },
  removestart: function(even) { //触摸开始
    this.setData({
      X_Start: even.changedTouches[0].clientX
    });
  },
  removeload: function(even) { //触摸中
    this.setData({
      X_End: even.changedTouches[0].clientX
    });
  },
  removeend: function(even) { //触摸结束
    this.setData({
      X_End: even.changedTouches[0].clientX
    });
    this.direction(even.currentTarget.dataset.id);
  },
  direction: function(id) { //判断方向
    var val = {
      xstart: this.data.X_Start,
      xend: this.data.X_End
    }
    if (val.xstart > val.xend) { //表示左滑
      if ((val.xstart - val.xend) > 100) {
        this.setData({
          T_Id: id
        });
      }
    } else {
      this.setData({
        T_Id: 0
      });
    }
  },
  delcart: function(even) { //删除购物车
    var thisobj = this;
    wx.showModal({
      title: '提示',
      content: "确认要删除这个商品吗？",
      success: function(res) {
        if (res.confirm) {
          var val = {
            SptrId: even.currentTarget.dataset.id
          }
          $.xsr($.makeUrl(cartapi.DelCartItem, val), function(data) {
            thisobj.getcartlist();
          });
        }
      }
    });
  },
  tiaozhuan: function() {
    wx.showModal({
      title: '提示',
      content: "抱歉，该商品已失效",
      showCancel: false,
    });
  },
  submitorder: function(e) { //去结算
    if (this.data.isck) {
      var that = this;
      // that.getcartlist();
      var thisobj = this;
      var val = {
        storeID: app.globalData.VendorInfo.Id,
        userName: app.globalData.UserInfo.UserName
      }
      $.xsr($.makeUrl(cartapi.GetCartList, val), function(data) {
        thisobj.ckalllength(data);
        if (data.Code == 0) {
          thisobj.setData({
            isdata: true,
            isShow: true,
            cartlist: data.Info
          });
          wx.stopPullDownRefresh();
          var ckArray = [];
          //data.Info取出来，判断1，2，3商品就好了
          for (var item of data.Info.VendorList[0].ShoppingCartList) {
            if (item.IsCheck) { //1=>jin自提   2=>自提     3=》普通
              if (ckArray.indexOf(1) < 0 && item.IsSelfTakeOnly) {
                ckArray.push(1);
              } else if (ckArray.indexOf(2) < 0 && item.UserTakeEnabled) {
                ckArray.push(2);
              } else {
                if (ckArray.indexOf(3) < 0 && item.IsSelfTakeOnly != true && item.UserTakeEnabled != true ) {
                  ckArray.push(3);
                }
              }
              if (item.IsDelete){
                wx.showModal({
                  title: '提示',
                  content: "有商品失效，请重新选择",
                  showCancel: false,
                });
                return false;
              }
              if (item.ProductStatus == "offline") {
                wx.showModal({
                  title: '提示',
                  content: "有商品下架，请重新选择",
                  showCancel: false,
                });
                return false;
              }

            }
          }
          if (ckArray.indexOf(1) > -1 && ckArray.indexOf(3) > -1) {
            wx.showModal({
              title: '提示',
              content: "自提商品不能与普通商品共同结算，请区分结算",
              showCancel: false,
            });
          } else {
            wx.navigateTo({
              url: "../ordersubmit/ordersubmit"
            });
          }

        } else {
          thisobj.setData({
            isdata: false
          })
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: "请选择要结算的商品",
        showCancel: false,
      });
    }
  },
   onGotUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function(data) {
        
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.submitorder(e)
    } else {

    }
  },
  delAll: function() { //删除选中商品
    var that = this;
    if (that.data.Sel_Id.length <= 0) {
      $.confirm("请选择需要删除的商品！");
    } else {
      $.confirm("是否删除选中商品？", function(res) {
        if (res.confirm) {
          var val = {
            SptrId: that.data.Sel_Id.toString()
          }
          $.xsr($.makeUrl(cartapi.DelCartItem, val), function(data) {
            that.getcartlist();
          });
        }
      }, true);
    }
  }
})