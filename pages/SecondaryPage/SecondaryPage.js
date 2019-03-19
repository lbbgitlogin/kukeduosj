var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/indexAPI.js');
var urlmap = require('../../utils/urlmap.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    PageData: {},
    PageContent: [],
    BgConfig: {},
    ShareImg: '',
    ShareTitle: '',
    indexArray: [],
    VID: 0,
    PID: 0,
    PageConfig: {},
    formdate: "",
    isCancelSuccess: true, //新手礼包领取成功取消
    pageId: 0
  },
  onLoad: function(options) {
    var that = this;
    app.GetUserInfo(function() {
      that.setData({
        VID: app.globalData.VendorInfo.Id,
        PID: options.id || 0,
        Currency: app.globalData.VendorInfo.Currency
      });
      that.getPageInfo();
    }, options.uid, options.sid);
  },
  getPageInfo: function() {
    var that = this;
    var val = {
      VendorId: that.data.VID,
      Id: that.data.PID || 0,
    }
    $.xsr($.makeUrl(api.getUserSecondaryPage, val), function(data) {



      
      var DivContent = $.parseJSON(data.Info.DivContent);
      if (DivContent) {
        that.getActiveInfo(DivContent).then(function(data) { //有活动，查询活动信息
          DivContent.forEach(function(item, i) {
            if (parseInt(item.adType) == 16) { //查找活动模块
              for (var info of item.ad16obj.data) { //查找出活动商品列表
                for (var obj of data.Info) { //查找出活动商品列表
                  if (info.did === obj.ProductId && info.mid === obj.MarketingEventId) { //商品Id相等
                    info.EndTimeStr = obj.EndTime;
                    info.StartTimeStr = obj.StartTime;
                    info.name = obj.ProductName;
                    info.SalePrice = obj.SaleMoney;
                    info.MarketPice = obj.MarketPice;
                    info.path = obj.ProductPic;
                    info.UserLimit = obj.UserLimit;
                    info.OrderCount = obj.Count;
                    info.id = obj.MarketingEventId;
                  }
                }
              }
            }
          })
          that.setData({
            PageContent: DivContent
          });
        }).catch(function() { //没有活动
          that.setData({
            PageContent: DivContent
          });
        });

        that.setData({
          pageId: data.Info.Id,
          BgConfig: $.parseJSON(data.Info.DiyContentConfig),
          PageConfig: $.parseJSON(data.Info.PageConfig),
          ShareImg: data.Info.ShareImg,
          ShareTitle: data.Info.ShareTitle
        });
        wx.setNavigationBarTitle({
          title: data.Info.PageTitle
        });
        wx.setNavigationBarColor({
          frontColor: that.data.PageConfig.window.navigationBarTextStyle == 'white' ? '#ffffff' : '#000000',
          backgroundColor: that.data.PageConfig.window.navigationBarBackgroundColor
        });
      }
    });
  },
  onPullDownRefresh: function() {
    this.setData({
      PageContent: []
    });
    this.getPageInfo();
  },
  getActiveInfo: function(DivContent) { //获取活动商品信息
    return new Promise(function(resolve, reject) {
      var val = {
        productId: []
      };
      for (var item of DivContent) {
        if (parseInt(item.adType) == 16) { //查找后台设置活动的，商品ID
          for (var info of item.ad16obj.data) {
            val.productId.push(info.did);
          };
        }
      }
      if (val.productId.length > 0) { //存在活动商品
        $.xsr($.makeUrl(api.GetMiniAppComponentSaleList, val), function(data) {
          if (data.Code == 0) {
            resolve(data);
          } else {
            reject();
          }
        });
      } else { //表示不存在活动商品
        reject();
      }
    });
  },
  onShareAppMessage: function() {
    return {
      title: this.data.ShareTitle,
      imageUrl: this.data.ShareImg,
      path: '/pages/SecondaryPage/SecondaryPage?id=' + this.data.PID
    }
  },
  callTel: function(e) { //打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  tplGoToPage: function(e) {
    var dataset = e.currentTarget.dataset;
    switch (parseInt(dataset.type)) {
      case 0: //预览图片
        console.log(dataset.imgurl);
        if (dataset.imgurl) {
          wx.previewImage({
            urls: [dataset.imgurl]
          })
        }
        break;
      case 1: //表示跳转到商品详情
        $.gopage('../productdetail/productdetail?pid=' + dataset.id);
        break;
      case 2: //表示跳转到分类页
        $.gopage('../productlist/productlist?cid=' + (dataset.id || 0) + '&cname=' + dataset.name);
        break;
      case 3: //搜索
        $.gopage('../productlist/productlist?pname=' + dataset.keyword);
        break;
      case 4: //直接跳地址
        //$.gopage(dataset.appurl);
        urlmap.urlmap(dataset.appurl);
        break;
      case 5: //直接跳地址
        // $.gopage(dataset.appurl);
        urlmap.urlmap(dataset.appurl);
        break;
      case 6: //直接跳地址
        //$.gopage(dataset.appurl);
        urlmap.urlmap(dataset.appurl);
        break;
      case 7: //跳转到小程序
        wx.navigateToMiniProgram({
          appId: dataset.appid,
          path: dataset.appurl || ""
        })
        break;
      case 8: //跳转二级页面
        $.gopage('../SecondaryPage/SecondaryPage?id=' + dataset.id);
        break;
      case 9:
        $.gopage('../webpage/webpage?u=' + dataset.appurl + "&tn=" + dataset.name + "&tc=" + dataset.appid + "&tb=" + dataset.keyword);
        break;
      case 10:
        $.gopage('../../community/plate/plate?id=' + dataset.id);
        break;
      case 11:
        $.gopage('../../community/tzparticulars/tzparticulars?id=' + dataset.id);
        break;
      case 12:
        wx.makePhoneCall({
          phoneNumber: dataset.name
        })
        break;
      case 17:
        this.getCoupon(dataset.id);
        break;
    }
  },
  bindDateChange: function(e) {
    var that = this;
    var thatdata = that.data.PageContent;
    for (var i = 0; i < thatdata.length; i++) {
      if (thatdata[i].adType == 13) {
        var ad13objData = thatdata[i].ad13obj.data;
        for (var j = 0; j < ad13objData.length; j++) {
          if (ad13objData[j].id == e.target.dataset.id) {
            ad13objData[j].name = e.detail.value;
          }
        }
      }
    }
    this.setData({
      PageContent: thatdata
    })
  },
  formSubmit: function(e) {
    var that = this,
      num = 1;
    var subData = []; //需要提交的表单值
    for (var i = 0; i < that.data.PageContent.length; i++) {
      if (that.data.PageContent[i].adType == 13) {
        num = that.data.PageContent[i].ad13obj.submitNum;
        var ad13objData = that.data.PageContent[i].ad13obj.data;
        for (var j = 0; j < ad13objData.length; j++) {
          var thatVal = e.detail.value[ad13objData[j].id], //当前的值
            isFillIn = ad13objData[j].isFillIn, //是否必填
            thatKey = ad13objData[j].labelText,
            thatId = ad13objData[j].id,
            subObj = {}, //提交的值 {"键":"值"}
            flag = true;
          if (ad13objData[j].type == 2) {
            if (isFillIn) {
              if (!$.isNull(ad13objData[j].name)) {
                thatVal = ad13objData[j].name;
                flag = true;
              } else {
                $.confirm(ad13objData[j].placeholderText);
                flag = false;
                return false;
              }
            } else {
              if (!$.isNull(ad13objData[j].name)) {
                thatVal = ad13objData[j].name;
              }
              flag = true;
            }
          } else {
            if (isFillIn) {
              if (!$.isNull(thatVal)) { //检查是否为空
                if (ad13objData[j].isVerification > 0) { //是否开启验证
                  if (ad13objData[j].isVerification == 1) { //手机验证
                    if ((/^1[34578]\d{9}$/.test(thatVal))) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的手机号码！");
                      flag = false;
                      return false;
                    }
                  }
                  if (ad13objData[j].isVerification == 2) { //邮箱验证
                    if ((/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(thatVal)) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的邮箱地址！");
                      flag = false;
                      return false;
                    }
                  }
                } else {
                  flag = true;
                }
              } else {
                $.confirm(ad13objData[j].placeholderText);
                flag = false;
                return false;
              }
            } else {
              if (!$.isNull(thatVal)) { //检查是否为空
                if (ad13objData[j].isVerification > 0) { //是否开启验证
                  if (ad13objData[j].isVerification == 1) { //手机验证
                    if ((/^1[34578]\d{9}$/.test(thatVal))) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的手机号码！");
                      flag = false;
                      return false;
                    }
                  }
                  if (ad13objData[j].isVerification == 2) { //邮箱验证
                    if ((/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(thatVal)) {
                      flag = true;
                    } else {
                      $.confirm("请输入正确的邮箱地址！");
                      flag = false;
                      return false;
                    }
                  }
                } else {
                  flag = true;
                }
              }
              flag = true;
            }
          }
          if (flag) {
            subObj.id = thatId;
            subObj.key = thatKey;
            subObj.value = thatVal;
            subData.push(subObj);
          }
        }
      }
    }
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      UserId: app.globalData.UserInfo.Id,
      SubmitInfo: JSON.stringify(subData),
      SubmitNum: num || 0,
      PageId: that.data.pageId
    }
    $.xsr($.makeUrl(api.SubmitFormData, val), function(data) {
      if (data.Code == 0) {
        $.alert("提交信息成功！");
      } else {
        $.confirm("你已经提交信息，请勿重复提交！");
      }
    });
  },
  getCoupon: function (id) { //领取优惠券
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      CouponIds: id,
      UserId: app.globalData.UserInfo.Id,
      Code: 0,
      IsNewUser: 0
    }
    var that = this;
    if (id) {
      $.xsr($.makeUrl(userapi.UserReceiveCoupon, val), function (data) {
        if (data.Code == 0) {
          that.setData({
            isCancelSuccess: false,
            mskType: 2,
            Coupons: data.Info
          });
          wx.showToast({
            title: '领取成功！',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: data.Msg,
            icon: 'none'
          })
        }
      })
    }
  },
  cancelsuccess: function () { //领券成功取消
    this.setData({
      isCancelSuccess: true
    });
  }
})