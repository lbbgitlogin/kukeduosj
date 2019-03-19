var app = getApp();
var $ = require('../../utils/util.js');
var cartapi = require('../../api/cartAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    isckall: false, //是否全选
    isckall1: false, //是否全选
    isck: false, //判断是否有选中值
    cartlist: [], //购物车集合
    X_Start: 0, //开始滑动的位置
    X_End: 0, //滑动结束的位置
    T_Id: 0, //当前滑动的目标元素
    Sel_Id: [], //选中的的ID
    ispage: false,//分页是否还有数据
    flag: true, //是否可以进行下次分页
    isdata: false,//是否存在数据
    pageIndex: 1,
    ProductName: '',
    objlist: [],
    value: '',
    num: 0,
    listlength: 0
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      num: options.num,
    });
    that.SelectProductList()
  },
  SelectProductList: function () { //获取购物车

    var that = this;
    that.setData({
      cartlist: [],
      pageIndex: 1
    });
    var val = {
      OperateId: app.globalData.VendorInfo.Id,
      ProductName: that.data.value || '',
      pageIndex: 1,
    }
    //console.log("a", val)
    $.xsr($.makeUrl(cartapi.SelectProductList, val), function (res) {
      //console.log(res);
      if (res.Code == 0) {
        if (res.Info != null) {
          if (res.Info.length > 0 && res.Info.length < 10) {
            that.setData({
              cartlist: res.Info,
              ispage: false
            });
          } else {
            that.setData({
              cartlist: res.Info,
              ispage: true
            });
          }
        } else {
          that.setData({
            ispage: false
          });
        }
        that.setData({
          isdata: true
        });
      } else {
        that.setData({
          ispage: false,
          isdata: false
        });
      }
      that.setData({
        flag: true
      });
      if (that.data.pageIndex == 1) {
        if (that.data.cartlist.length > 0) {
          that.setData({
            isdata: true
          });
        } else {
          that.setData({
            isdata: false
          });
        }
      }
    });
  },
  carlist: function () {
    var that = this;
    var val = {
      OperateId: app.globalData.VendorInfo.Id,
      ProductName: that.data.value,
      pageIndex: that.data.pageIndex,
    }
    if (that.data.pageIndex == 1) {
      that.setData({
        cartlist: [],
      });
    }
    $.xsr($.makeUrl(cartapi.SelectProductList, val), function (res) {
      //console.log(res)
      // cartlist: that.data.cartlist.concat(res.Info)
      if (res.Info != "") {
        that.setData({
          isdata: true
        })
        if (res.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            cartlist: that.data.cartlist.concat(res.Info),
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            cartlist: that.data.cartlist.concat(res.Info),
          });
        }
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

    });
  },
  quanbu: function (e) {
    var that = this;
    var newArray = [];

    that.setData({
      listlength: that.data.objlist.length
    });

    if (that.data.listlength < that.data.num) {
      for (var i = 0; i < that.data.cartlist.length; i++) {
        if (that.data.cartlist[i].ProductId == e.currentTarget.dataset.id) {
          var thatObj = that.data.cartlist[i];
          if (that.data.cartlist[i].checked) {
            thatObj.checked = false;
          } else {
            thatObj.checked = true;
          }
          newArray.push(thatObj);

        } else {
          newArray.push(that.data.cartlist[i]);
        }
      }

      ////console.log(newArray);
      that.setData({
        cartlist: newArray
      });
      var obj = []
      for (var i = 0; i < this.data.cartlist.length; i++) {
        if (this.data.cartlist[i].checked) {
          obj.push(this.data.cartlist[i])
        }
      }
      that.setData({
        objlist: obj
      })
    } else {
      

      for (var i = 0; i < that.data.cartlist.length; i++) {
        if (that.data.cartlist[i].ProductId == e.currentTarget.dataset.id) {
          var thatObj = that.data.cartlist[i];
          //console.log(that.data.cartlist[i].checked)
          if (that.data.cartlist[i].checked) {
            thatObj.checked = false;
            that.setData({
              listlength: that.data.listlength - 1,
            });
          }
          newArray.push(thatObj);
        } else {
          newArray.push(that.data.cartlist[i]);
        }
      }
      that.setData({
        cartlist: newArray
      });
      var obj = []
      for (var i = 0; i < this.data.cartlist.length; i++) {
        if (this.data.cartlist[i].checked) {
          obj.push(this.data.cartlist[i])
        }
      }
      that.setData({
        objlist: obj
      })
      if (that.data.listlength >= that.data.num) {
        $.alert("最多可添加4个")
      }
      //console.log(that.data.objlist)
    }
  },
  AddMemberPosts: function () {
    var that = this;
    $.backpage(1, function () {
      var isv = {
        couponItemId: that.data.objlist,
      }
      console.log('isv',isv)
      notice.postNotificationName("RefreshCoupon", isv);
    })
  },
  startinput: function (e) {
    var that = this;
    that.setData({
      value: e.detail.value
    })
  }
  ,
  scrollbottom: function (even) {  //滚动到底部进行分页
    var that = this
    //console.log(this.data.flag)
    if (this.data.flag) { //判断是否可以进行下次分页
      this.setData({
        flag: false
      })
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1,
        });
        //console.log("传入：", that.data.pageIndex);
        that.carlist()
      }, 500);
    }
  },
})