var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
var cartapi = require('../../api/cartAPI.js');
var fgapi = require('../../api/fightGroups.js');
var userapi = require('../../api/userAPI.js');
var notice = require('../../utils/notice.js');
var intervalDate;
var Interval;
Page({
  data: {
    selectsp: 0,
    selectct: 0,
    proId: 0,
    CommentImgList: [],
    splist: [], //选择的规格列表
    splistStr: [], //选择的规格列表名称
    numval: 1,
    stock: 1, //库存
    inputval: 1, //接收输入框输入的值
    skuid: 0, //SKUID
    selectimg: "", //选择的图片
    pname: "", //商品名称
    desc: "", //描述
    isCollection: false, //是否收藏
    MEID: 0,
    eventId: 0, //拼团ID
    Parameters: [], //规格参数
    isdata: true, //是否有数据
    tapindex: 1, //当前选中项目
    IsChannel: true, //是否展示技术支持
    FGInfo: {}, //拼团信息
    UDactivity: [], //正在进行的活动
    isAll: false, //是否查看所有拼团
    Time: {},
    ProductInfo: {},
    ProductInfoService: {},
    ProductPriceDetail: {},
    Coupons: [],
    isCancelSuccess: true, //新手礼包领取成功取消
    isCancel: true, //新手礼包取消
    CouponAmount: 0,
    IsNewUser: 0,
    flag: false,
    flag1: false,
    spellGroup: false, //多规格拼团标识
    infoid: null, //拼团的ownGroundId
    versionNumber: "",
    CashData: {}, //是否符合分销规则
    PageQRCodeInfo: { //二维码分享信息
      Path: '',
      IsShare: false,
      IsShareBox: false,
      IsJT: false
    },
    isModified: true,
    d: "",
    hour: "",
    min: "",
    sec: "",
    isShare: true,
    hide: false,
    hours: "",
    minutes: "",
    seconds: "",
    second: "",
    hoverLeft: false,
    SavePrice: "",
    FightGroup: false,
    orderType: 0,
    ownGroupId: 0,
    jiongroup: false,
    IsShowHDEndTime: false,
    isnav: true,
    screenHeight: 0,
    isquicknav: false,
    speclist: [],
    kucun: true,
    take: 0, //区别分享点击与主动点击
    // IsShowHDEndTime2: true,
    // Time2: "",
  },
  onLoad: function(options) {
    this.setData({
      versionNumber: app.globalData.versionNumber,
      ownGroupId: options.ownGroupId || 0,
      take: parseInt(options.take) || 0
    })
    var that = this;
    var val = {
      productId: options.pid
    }
    $.xsr1($.makeUrl(api.getProductType, val), function(data) {
      if (!$.isNull(data.Info)) {
        if (data.Info == 2) {
          $.gotopage("../../server/productdetail/productdetail?pid=" + (options.pid || 0) + "&MEId=" + (options.MEId || 0) + "&spid=" + (options.spid || 0) + "&orderType=" + (options.orderType || 0) + "&ownGroupId=" + (options.ownGroupId || 0) + "&take=" + (options.take || 0));
        } else {
          that.InitData(options);
        }
      } else {
        that.InitData(options);
      }
    });
    var str = typeof app.globalData.VendorInfo.VendorFeatureSet || "";
    if (str.indexOf("Share") > -1) {
      this.setData({
        isShare: true
      })
    } else {
      this.setData({
        isShare: false
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.screenHeight 
        })
      },
    })
  },
  InitData: function(options) {
    var that = this;
    this.setData({
      proId: options.pid,
      splistStr: [],
      eventId: options.MEId || 0
    })
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        if (options.ownGroupId > 0) {
          that.setData({
            jiongroup: true
          })
        } else {
          that.setData({
            jiongroup: false
          })
        }
        that.InitProduct();
        that.setData({
          IsChannel: app.globalData.VendorInfo.IsChannel //是否展示技术支持
        });
        that.setData({
          IsNewUser: app.globalData.UserInfo.IsNewUser,
          CouponAmount: app.globalData.UserInfo.CouponAmount
        });
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      if (options.ownGroupId > 0) {
        that.setData({
          jiongroup: true
        })
      } else {
        that.setData({
          jiongroup: false
        })
      }
      that.InitProduct();
    }
    notice.postNotificationName("RefreshProduct", false);
  },
  InitProduct: function() { //初始化商品
    var that = this;
    var valInfo = {
      productId: this.data.proId,
    }
    //获取商品基本信息
    $.xsr($.makeUrl(api.GetProductBaseInfo, valInfo), function(data) {
      if (data.Code == 0) {
        // pname: data.Info.ProductName + that.data.splistStr.join(" "),
        that.setData({
          ProductInfo: data.Info,
          pname: data.Info.ProductName,
          desc: data.Info.SellingPoints,
          selectimg: $.isNull(data.Info.ProductPicList[0]) ? '' : data.Info.ProductPicList[0].Path,
          Parameters: data.Info.ProductParameters ? that.Grouping(data.Info.ProductParameters) : [],
        });
        if (that.data.ProductInfo.IsDelete) {
          that.tishi();
        }
        wx.setNavigationBarTitle({
          title: that.data.pname
        })


      }
    });
    //获取价格信息
    that.getSkuPrice('');
    //获取商品促销信息
    var valEven = {
      productId: this.data.proId,
      eventId: this.data.eventId
    };
    $.xsr($.makeUrl(api.GetProductMarketingInfo, valEven), function(data) {
      console.log("促销信息:", data);
      if (data.Code == 0) {
        that.setData({
          ProductEventService: data.Info[0],
          hide: true
        });
        //LUCKYFIGHTGROUP 抽奖团
        if (data.Info[0].Type == 'LUCKYFIGHTGROUP' || data.Info[0].Type == 'FIGHTGROUP') {
          that.setData({
            FightGroup: true
          })
        } else {
          that.setData({
            FightGroup: false
          })
        }
        if (data.Info[0].GroupEventInfo.SavePrice < 0) {
          that.setData({
            SavePrice: 0
          })
        } else {
          that.setData({
            SavePrice: data.Info[0].GroupEventInfo.SavePrice
          })
        }
        //代码需要优化  执行太慢
        if (data.Info[0].Type == "FIGHTGROUP" || data.Info[0].Type == 'LUCKYFIGHTGROUP') {
          setInterval(function() {
            var timestamp = data.Info[0].GroupEventInfo.EventEndTimeStr;
            var date = data.Info[0].GroupEventInfo.EventEndTimeStr;
            date = date.substring(0, 19);
            date = date.replace(/-/g, '/');
            var timestamp = new Date(date).getTime();
            var t = data.Info[0].GroupEventInfo.DjsTime -= 1
            that.setData({
              second: t
            })
            if (t > 0) {
              var nowTime = new Date();
              var endTime = new Date(timestamp * 1000);
              t = t - 1;
              var d = Math.floor(t / 60 / 60 / 24 + 1);
              var hour = Math.floor(t / 60 / 60 % 24 + ((d - 1)) * 24);
              var min = Math.floor(t / 60 % 60);
              var sec = Math.floor(t % 60);
              if (hour < 10) {
                hour = "0" + hour;
              }
              if (min < 10) {
                min = "0" + min;
              }
              if (sec < 10) {
                sec = "0" + sec;
              }
              that.setData({
                d: d,
                hour: hour,
                min: min,
                sec: sec,
              });
            } else {
              that.setData({
                IsShowHDEndTime: false
              })
            }
            data.Info[0].GroupEventInfo.GroupUserInfo.forEach(function(val) {
              val.Time = $.FormatTime(val.EventEndTimeStr);
            });
            that.setData({
              Time: $.FormatTime(data.Info[0].GroupEventInfo.EventEndTimeStr),
              ProductEventService: data.Info[0],
            });
          }, 1000);
        }
        if (data.Info[0].Type == "PRODUCT") {
          setInterval(function() {
            var t = data.Info[0].GroupEventInfo.ShowCountdownMilliseconds -= 1000
            if (t < 0) {
              clearInterval()
              that.setData({
                hours: '00',
                minutes: '00',
                seconds: '00'
              })
            } else {
              that.setData({
                hours: $.doubleNum(Math.floor(t / 1000 / 60 / 60)),
                minutes: $.doubleNum(Math.floor(t / 1000 / 60 % 60)),
                seconds: $.doubleNum(Math.floor(t / 1000 % 60))
              })
            }
          }, 1000);
        }
      }
    });
    //获取商品业务信息
    var valser = {
      userName: app.globalData.UserInfo.UserName,
      productId: this.data.proId,
    };
    $.xsr($.makeUrl(api.GetProductCommentInfo, valser), function(data) {
      if (data.Code == 0) {
        that.setData({
          ProductInfoService: data.Info,
          isCollection: data.Info.IsUserAttention,
        });
      }
    });
  },
  tishi: function() {
    setTimeout(function() {
      wx.showToast({
        title: '该商品已经失效',
        icon: 'loading',
        duration: 2000
      });
    }, 2000)
    setTimeout(function() {
      wx.navigateTo({
        url: '../../pages/orderlist/orderlist'
      })
    }, 3000)
  },
  getSkuPrice: function(specIdStr) { //获取商品价格信息
    var valprice = {

      productId: this.data.proId,
    }
    var that = this;
    console.log("GetProductSKUInfo", valprice)
    $.xsr($.makeUrl(api.GetProductSKUInfo, valprice), function(data) {
      console.log("获取商品价格信息",data);
      var priceList = data.Info.PriceList
      var Speclist = [];
      for (var i in priceList) {
        Speclist.push(priceList[i].SpecIdList)
      }
      //价格集合
      that.setData({
        speclist: Speclist
      })
      if (data.Code == 0) {
        //规格信息
        if (!$.isNull(data.Info.SpecLst) && data.Info.SpecLst.length > 0) {
          for (var x in data.Info.SpecLst) { //筛选出已经选择的规格
            for (var m in data.Info.SpecLst[x].svLst) {
              if (data.Info.SpecLst[x].svLst[m].IsChecked) {
                data.Info.SpecLst[x].ckid = data.Info.SpecLst[x].svLst[m].Id; //保存选择的规格ID到最外面，后面对选择规格的替有用
                that.data.splist.push(data.Info.SpecLst[x].svLst[m].Id);
                that.data.splistStr.push(data.Info.SpecLst[x].svLst[m].Name);
                if (data.Info.SpecLst[x].svLst[m].imagePath != null && data.Info.SpecLst[x].svLst[m].imagePath != "") {
                  that.setData({
                    selectimg: data.Info.SpecLst[x].svLst[m].imagePath
                  })
                }
              };
            }
          }
          that.setData({
            SpecLst: data.Info.SpecLst,
          });

        }
        var Salepic = 0;
        Salepic = $.accSub(data.Info.SalePrice, data.Info.ShowPrice)
        that.setData({
          ProductPriceDetail: data.Info,
          skuid: data.Info.ProductSkuId,
          stock: data.Info.Stock,
          MEID: data.Info.EventId,
          Salepic: Salepic
        });
      }
    });
  },
  onGotUserInfo21: function (e) {
  
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.ckselectsp(e)
    } 
  },
  ckselectsp: function(e) { //打开选择规格面板
  
    this.setData({
      change: e.currentTarget.offsetLeft,
      selectsp: 1,
      selectct: 1,
      flag: true,
      flag1: false,
      Isckselectsp: false
    });
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        isModified: true
      })
    } else {
      this.setData({
        isModified: false,
      })
    }
  },
  onGotUserInfo22: function (e) {

    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.ckselectsp1(e)
    } else {

    }
  },
  ckselectsp1: function(e) { //打开选择规格面板
    this.setData({
      change: e.currentTarget.offsetLeft,
      selectsp: 1,
      selectct: 1,
      flag1: true,
      flag: false,
    });
  },
  closesp: function() { //关闭选择规格面板
    var thisval = this;
    thisval.setData({
      selectct: 0,
      flag: false,
      // ownGroupId: 0
    });
    if (thisval.data.take == 0) {
      if (thisval.data.ProductPriceDetail.SpecLst.length > 0 && thisval.data.jiongroup == true) {
        thisval.setData({
          jiongroup: false
        })
      }
    }
    setTimeout(function() {
      thisval.setData({
        selectsp: 0,
      });
    }, 650);







  },
  selectsp: function(even) {
    var spobj = {
      spid: even.target.dataset.spid,
      ckid: even.target.dataset.ckid
    };
    var sparray = [];
    var splistarray = [];
    var thissparray = this.data.splist;

    for (var x in thissparray) {
      if (thissparray[x] == spobj.ckid) {
        sparray.push(parseInt(spobj.spid))
      } else {
        sparray.push(parseInt(thissparray[x]))
      }
    }
    var that = this;
    that.updatePrice(sparray);
    var specList = that.data.SpecLst;
    for (var x in specList) {
      for (var m in specList[x].svLst) {
        for (var i in sparray) {
          if (specList[x].svLst[m].Id == sparray[i]) {
            specList[x].svLst[m].IsChecked = true;
            specList[x].ckid = specList[x].svLst[m].Id;
            splistarray.push(specList[x].svLst[m].Name);
            if (specList[x].svLst[m].imagePath != null && specList[x].svLst[m].imagePath != "" && specList[x].svLst[m].Id == spobj.spid) {
              that.setData({
                selectimg: specList[x].svLst[m].imagePath
              })
            }
            break
          } else {
            specList[x].svLst[m].IsChecked = false
          }
        }
      }
    }
    this.setData({
      splist: sparray,
      splistStr: splistarray,
      SpecLst: specList,
      // pname: that.data.ProductInfo.ProductName + splistarray.join(" "),
      pname: that.data.ProductInfo.ProductName
    })
    for (var i = 0; i < sparray.length - 1; i++) {
      for (var j = 0; j < sparray.length - 1 - i; j++) {
        if (sparray[j] > sparray[j + 1]) {
          var temp = sparray[j];
          sparray[j] = sparray[j + 1];
          sparray[j + 1] = temp;
        }
      }
    }
    if (this.data.speclist.join(",").indexOf(sparray.join(",")) > -1) {
      this.setData({
        kucun: true
      })
    } else {
      this.setData({
        kucun: false
      })
    }
  },
  updatePrice: function(sparray) {
    var priceVo = this.data.ProductPriceDetail;
    var priceList = this.data.ProductPriceDetail.PriceList;
    for (var i in priceList) {
      var flag = true;
      for (var j in priceList[i].SpecIdList) {
        var speFlag = false;
        for (var x in sparray) {
          if (priceList[i].SpecIdList[j] == sparray[x]) {
            speFlag = true;
            break
          }
        }
        if (!speFlag) {
          flag = false;
          break
        }
      }
      if (flag) {
        priceVo.ProductSkuId = priceList[i].ProductSkuId;
        priceVo.SalePrice = priceList[i].ShowPrice;
        if (priceList[i].EventId > 0) {
          priceVo.ShowPrice = priceList[i].PreferentialPrice
        } else {
          priceVo.ShowPrice = priceList[i].ShowPrice
        }
        priceVo.MarketPrice = priceList[i].MarketPrice;
        priceVo.Stock = priceList[i].Stock;
        priceVo.EventId = priceList[i].EventId;
        break
      }
    }
    var Salepic = 0;
    Salepic = $.accSub(priceVo.SalePrice, priceVo.ShowPrice);
    this.setData({
      ProductPriceDetail: priceVo,
      skuid: priceVo.ProductSkuId,
      stock: priceVo.Stock,
      MEID: priceVo.EventId,
      Salepic: Salepic
    })
  },
  sub: function() { //减数量
    this.unifiedNum(2);
  },
  add: function() { //加数量
    this.unifiedNum(1);
  },
  writenum: function(even) { //失去焦点时
    if (even.detail.value) {
      this.setData({
        inputval: even.detail.value
      });
    } else {
      this.setData({
        inputval: 1
      });
    }

    this.unifiedNum(3);
  },
  unifiedNum: function(btntype) { //统一判断
    var thisobj = { //接收的临时变量
      value: parseInt(this.data.numval),
      stock: parseInt(this.data.stock),
      inputval: parseInt(this.data.inputval)
    }
    if (thisobj.stock <= 0) {
      $.alert("亲~商品没有库存啦！");
      return;
    }
    if (btntype == 1) { //表示加数量
      thisobj.value = thisobj.value + 1;
    } else if (btntype == 2) { //表示减数量
      thisobj.value = thisobj.value - 1;
    } else {
      thisobj.value = thisobj.inputval;
      this.setData({
        numval: thisobj.inputval
      });
    }
    if (thisobj.value > thisobj.stock) { //是否大于最大值
      this.setData({
        numval: thisobj.stock
      });
      return;
    }
    if (thisobj.value <= 0) { //表示等于0
      this.setData({
        numval: 1
      });
      return;
    }
    this.setData({
      numval: thisobj.value
    });
  },
  addCard: function() { //加入购物车
    var val = {
      proId: this.data.proId,
      proName: this.data.pname,
      Amount: this.data.numval,
      UserAccount: app.globalData.UserInfo.UserName,
      SKU_Id: this.data.skuid
    }
    if (this.data.stock <= 0) {
      $.alert("亲~商品没有库存啦！");
      return;
    }
    var thisval = this;
    $.xsr($.makeUrl(cartapi.AddCart, val), function(data) {
      if (data.Code == 0) {
        notice.postNotificationName("RefreshProduct", true);
        $.alert("添加购物车成功");
        //加入购物车成功需要重置参数,防止重复添加时，累计上次选择的数量
        thisval.setData({
          numval: 1,
          inputval: 1
        });
      } else if (data.Code == 1) {
        notice.postNotificationName("RefreshProduct", false);
        $.alert(data.Msg);
      }
    });
    thisval.setData({
      selectct: 0
    });
    setTimeout(function() {
      thisval.setData({
        selectsp: 0
      });
    }, 1000);
  },
  PDCollection: function(even) { //收藏商品
    var thisobj = this;

    if (this.data.isCollection) {
      var val = {
        UserName: app.globalData.UserInfo.UserName,
        Id: this.data.proId
      }
      $.xsr($.makeUrl(api.DelUserAttention, val), function(data) {
        thisobj.setData({
          isCollection: false
        });
        $.alert("已取消收藏！");
      });
    } else {
      var val = {
        userName: app.globalData.UserInfo.UserName,
        proId: this.data.proId
      }
      $.xsr($.makeUrl(api.AddAttention, val), function(data) {
        thisobj.setData({
          isCollection: true
        });
        $.alert("已收藏！");
      });
    }
  },
  picDetail: function() { //图文详情
    this.setData({
      tapindex: 1
    });
  },
  spcParam: function() { //规格参数
    this.setData({
      tapindex: 2
    });
  },
  packingList: function() { //包装清单
    this.setData({
      tapindex: 3
    });
  },
  afterService: function() { //售后fuw
    this.setData({
      tapindex: 4
    });
  },
  Grouping: function(arr) { //进行分组
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = arr[i];
      if (!map[ai.ParameterGroupId]) {
        dest.push({
          ParameterGroupId: ai.ParameterGroupId,
          name: ai.ParameterGroupName,
          data: [ai]
        });
        map[ai.ParameterGroupId] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.ParameterGroupId == ai.ParameterGroupId) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  },
  onShareAppMessage: function() {
    var taht = this;
    return {
      imageUrl: $.isNull(taht.data.ProductPicList) ? '' : taht.data.ProductPicList[0].Path,
      title: this.data.pname,
      path: '/pages/productdetail/productdetail?pid=' + this.data.proId + "&uid=" + app.globalData.UserInfo.Id
    }
  },
  onGotUserInfo7: function (e) {
    var that = this;

    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.buynow(e)
    } else {

    }
  },


  buynow: function(e) { //立即购买

    var val = {
      Amount: this.data.numval,
      ProductId: this.data.proId,
      ProductSKU_Id: this.data.skuid,
      AddTime: getNowFormatDate(),
      orderType: 0, //普通订单
      ProductSaleName: this.data.pname,
      UserAccount: app.globalData.UserInfo.UserName,
      speStr: JSON.stringify(this.data.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    }
    wx.navigateTo({
      url: "../ordersubmit/ordersubmit?spid=" + encodeURIComponent(JSON.stringify(val)) + "&orderType=" + "0" //特殊字符转译
    });
    this.setData({
      selectct: 0
    });
    var that = this
    setTimeout(function() {
      that.setData({
        selectsp: 0
      });
    }, 1000);
  },
  ILObuynow: function(e) { //立即购买
    var val = {
      Amount: this.data.numval,
      ProductId: this.data.proId,
      ProductSKU_Id: this.data.skuid,
      AddTime: getNowFormatDate(),
      orderType: 0, //普通订单
      isFightGroup: '1', //拼团订单普通购买
      ProductSaleName: this.data.pname,
      UserAccount: app.globalData.UserInfo.UserName,
      speStr: JSON.stringify(this.data.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    }
    console.log("购买val", val)
    wx.navigateTo({
      url: "../ordersubmit/ordersubmit?spid=" + encodeURIComponent(JSON.stringify(val)) + "&orderType=" + "0"
    });
  },


  onGotUserInfo12: function (e) {
  
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.immediatelyOffered()
    } else {

    }
  },
  immediatelyOffered: function() { //立即开团
 
    var val = {
      Amount: 1,
      ProductId: this.data.proId,
      // orderType: 1,//拼团订单
      marketingEventId: this.data.MEID, //活动ID
      // isOwner: 'false',
      // isFightGroup: '2',
      ProductSKU_Id: this.data.skuid,

      AddTime: getNowFormatDate(),
      ownGroupId: this.data.ownGroupId || 0,
      ProductSaleName: this.data.pname,
      UserAccount: app.globalData.UserInfo.UserName,
      speStr: JSON.stringify(this.data.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    }
    console.log("val立即开团", val)
    if (this.data.ownGroupId > 0) {
      val.isOwner = 'false'
    } else {
      val.isOwner = 'true'
    }
    if (this.data.ProductEventService.Type == 'FIGHTGROUP') { //普通拼团
      val.orderType = 1;
      val.isFightGroup = 2;
      this.setData({
        orderType: 1
      })
    }
    if (this.data.ProductEventService.Type == 'LUCKYFIGHTGROUP') { //抽奖团
  
      val.orderType = 2;
      val.isFightGroup = 3;
      this.setData({
        orderType: 2
      })
    }
    if (this.data.ProductPriceDetail.SpecLst.length > 0 && this.data.jiongroup == true) {
      //防止返回
      this.closesp()
    }
    if (this.data.second > 0) {
      wx.navigateTo({
        url: "../ordersubmit/ordersubmit?spid=" + encodeURIComponent(JSON.stringify(val)) + "&type=" + this.data.ProductEventService.Type + "&orderType=" + this.data.orderType
      });
    } else {
      this.InitProduct()
    }

    var thisval = this;
    thisval.setData({
      selectct: 0,
      flag: false
    });
    setTimeout(function() {
      thisval.setData({
        selectsp: 0,
      });
    }, 1000);
  },

  
  onGotUserInfo212: function(e) {
    var that = this;
    if (e.detail.userInfo != null) { //用户点击允许授权
      var cal = {
        Photo: e.detail.userInfo.avatarUrl,
        NickName: e.detail.userInfo.nickName,
        UserName: app.globalData.UserInfo.UserName,
      }
      $.xsr($.makeUrl(userapi.UpdateUserPhotoAndNickName, cal), function (data) {
        console.log("个人信息111：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.groupBuying(e)
    } else {

    }
  },
  groupBuying: function(e) { //立即参团
    var that = this;
    var parameter = e;
    that.userFGType(e.currentTarget.dataset.infoid, function() {
      that.setData({
        infoid: e.currentTarget.dataset.infoid
      })
      console.log("that.data.ProductPriceDetail.SpecLst.length11", that.data.ProductPriceDetail.SpecLst.length)
      console.log(" that.data.jiongroup 22",that.data.jiongroup)
      if (that.data.ProductPriceDetail.SpecLst.length > 0 && that.data.jiongroup == false) {
        that.setData({
          spellGroup: true,
          jiongroup: true,
          ownGroupId: e.currentTarget.dataset.infoid
        })
        that.ckselectsp(parameter)
      } else {
        that.tuxedoImmediately();
      }
    });
    //   setTimeout(()=>{
    //     that.setData({
    //       Isckselectsp: true
    //     })
    //   },650)
    // }
    // console.log("that.data.Isckselectsp", that.data.Isckselectsp)
  },

  tuxedoImmediately: function() {
    console.log("1111111111111111++++++++")
    var that = this;
    // ownGroupId: e.currentTarget.dataset.infoid,
    var val = {
      Amount: 1,
      ProductId: that.data.proId,
      orderType: 1, //拼团订单
      marketingEventId: that.data.MEID, //活动ID
      isOwner: 'false',
      isFightGroup: '2',
      ProductSKU_Id: that.data.skuid,
      AddTime: getNowFormatDate(),
      ProductSaleName: that.data.pname,
      ownGroupId: that.data.infoid,
      UserAccount: app.globalData.UserInfo.UserName,
      speStr: JSON.stringify(that.data.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    }


    wx.navigateTo({
      url: "../ordersubmit/ordersubmit?spid=" + encodeURIComponent(JSON.stringify(val)) + "&orderType=" + "1" + "&type=" + that.data.ProductEventService.Type
    });

  },

  findOffered: function(EVId) { //参团需要查询
    var that = this;
    //正在拼的团
    $.xsr($.makeUrl(fgapi.GetGoingGroupEventByEventId, {
      EventId: EVId
    }), function(data) {
      if (data.Info.length > 0) {
        intervalDate = setInterval(function() { //倒计时
          data.Info.forEach(function(val) {
            val.Time = $.FormatTime(val.EventEndTimeStr);
          });
          that.setData({
            UDactivity: data.Info
          });
        }, 1000);
      }
    });
  },
  lookall: function() { //查看全部拼团
    if (this.data.isAll) {
      this.setData({
        isAll: false
      });
    } else {
      this.setData({
        isAll: true
      });
    }
  },
  userFGType: function(evenId, callback) { //用户的拼团状态


    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      OwnGroupId: evenId
    };
    $.xsr($.makeUrl(fgapi.IsUserJoinGroupEvnet, val), function(data) {
      console.log("参团情况",data)

      if ($.isNull(data)) {
        callback() || ''
      } else {
        if (data.Code != 1) {
          if (!data.Info[0].IsSuccess) {
            if (data.Info[0].IsPaySuccess) {
              $.alert("您已经参加过该团!");
            } else {
              $.alert("您已经参加过该团，请尽快支付!");
            }
          } else {
            $.alert("恭喜您已经参团成功!");
          }
        } else {
          callback() || ''
        }
      }
    });


  },

  receivenow: function() { //领取新手大礼包
    this.cancel();
    this.userReceiveCoupon();
  },


  cancel: function() { //新手礼包取消
    this.setData({
      isCancel: false,
    });
  },
  cancelsuccess: function() { //领券成功取消
    this.setData({
      isCancelSuccess: true,
    });
  },

  innertouch: function() {}, //事件拦截

  userReceiveCoupon: function() { //用户领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: '',
      UserId: app.globalData.UserInfo.Id,
      IsNewUser: this.data.IsNewUser //新用户为1 老用户为0 
    }
    var that = this;
    $.xsr($.makeUrl(userapi.UserReceiveCoupon, val), function(data) {
      if (data.Code == 0) {
        that.setData({
          isCancelSuccess: false,
          Coupons: data.Info
        });
      } else {
        $.alert(data.Msg);
      }
    })
  },
  ImgTap: function(e) {
    var that = this;
    var imageUrls = [];
    for (var j in this.data.ProductInfo.Productcommentpic) {
      imageUrls.push(this.data.ProductInfo.Productcommentpic[j].Path);
    }

    var nowImgUrl = e.target.dataset.src;
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: imageUrls // 需要预览的图片http链接列表
    })
  },
  goTabBar: function(e) { //跳转页面
    var that = this;
    $.goToTabBar(that, e.currentTarget.dataset.url);
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
        console.log("个人信息：", data)
      });

      app.imageUrl = e.detail.userInfo.avatarUrl,
        app.nickName = e.detail.userInfo.nickName,
        app.authorize = true;
      that.shareQRCode()
    } else {

    }
  },

  shareQRCode: function(e) {

    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      orignPrice: this.data.ProductPriceDetail.MarketPrice,
      VendorId: app.globalData.VendorInfo.Id,
      Path: '/pages/productdetail/productdetail?pid=' + this.data.proId + "&uid=" + app.globalData.UserInfo.Id,
      MainImg: this.data.ProductInfo.ProductPicList[0].Path,
      MainTitle: this.data.pname,
      MainPrice: this.data.ProductPriceDetail.ShowPrice
    }
    $.xsr($.makeUrl(userapi.QRCodePoster, val), function(data) {
      that.setData({
        PageQRCodeInfo: {
          Path: data.Info,
          IsShare: true,
          IsShareBox: false,
          IsJT: true
        }
      });
    });
  },
  shareBox: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: true,
        IsShareBox: true,
        IsJT: false
      }
    });
  },
  cancelShare: function() {
    this.setData({
      PageQRCodeInfo: {
        Path: '',
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      }
    });
  },
  saveImg: function() {
    var that = this;
    $.loading();
    wx.downloadFile({
      url: this.data.PageQRCodeInfo.Path, //仅为示例，并非真实的资源
      success: function(res) {
        $.hideloading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              PageQRCodeInfo: {
                Path: '',
                IsShare: false,
                IsShareBox: false,
                IsJT: false
              }
            });
            $.alert("保存图片成功！");
          },
          fail: function(e) {
            $.hideloading();
          }
        });
      },
      fail: function(e) { //下载图片出错
        $.hideloading();
      }
    })
  },
  showCodeImg: function() {
    wx.previewImage({
      current: this.data.PageQRCodeInfo.Path, // 当前显示图片的http链接
      urls: [this.data.PageQRCodeInfo.Path] // 需要预览的图片http链接列表
    })
  },
  scrolltoupper: function(e) {
    if (e.detail.scrollTop >= this.data.screenHeight) {
      this.setData({
        isquicknav: true
      })
    } else {
      this.setData({
        isquicknav: false
      })
    }
  },
  returnTop: function() { //返回顶部
    this.setData({
      scposition: 0
    });
  },
  nav: function() {
    this.setData({
      isnav: false,
      animation: false
    })
  },
  outnav: function() {
    var that = this;
    this.setData({
      animation: true
    })
    setTimeout(function() {
      that.setData({
        isnav: true
      })
    }, 250)
  }
})

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  return currentdate;
}