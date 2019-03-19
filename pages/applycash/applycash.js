var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');

Page({
  data: {
    cashType: 1, //提现类型：1、余额提现；2、佣金提现
    payType: 1, //提现方式：1、微信零钱；2、支付宝；3、银行卡
    money_one: 0, //余额
    money_tow: 0, //佣金
    total_price: 0, //展示金额
    verificationType: {}, //验证类型：0、表示通过可以提交，1、提现金额，2、支付宝账号，3、开户行，4、银行卡号，5、提现人姓名，6、联系人手机号
    isECashCard: true, //是否可以余额提现
    isMemDist: true, //是否可以佣金提现
    WithdrawThreshold:0,//提现金额限制
    ValidDays:0,
    WithdrawType:0//提现方式
  },
  onLoad: function(options) {
    var that = this;
    var val = {
      userName: app.globalData.UserInfo.UserName
    }
    $.xsr($.makeUrl(userapi.UserInfoPointTotalCashrealName, val), function(data) { //获取提现信息
    console.log(data);
      if (data.Code == 0 && data.Info instanceof Array) {
        if (data.Info.length > 0) {
          var obj = data.Info[0];
          that.setData({
            total_price: obj.AllowWithdraw ? obj.canUseCardCashAmount : obj.canUseCashAmount,
            money_one: obj.canUseCardCashAmount,
            money_tow: obj.canUseCashAmount,
            isECashCard: obj.AllowWithdraw,//是否开启余额提现
            cashType: obj.AllowWithdraw ? 1 : 2,
            payType: obj.AllowWithdraw ? 1 : 0,
            WithdrawThreshold: obj.WithdrawThreshold,
            ValidDays: app.globalData.VendorInfo.ValidDays,
            WithdrawType: obj.WithdrawType,
            isMemDist: obj.IsDistribution //是否开启分销
          });
        }
      }
    });
    var str = app.globalData.VendorInfo.VendorFeatureSet;

    if (str.indexOf("ECashCard") < 0) { //是否有储值权限,表示不可余额提现
      that.setData({
        isECashCard: false,
        cashType: 2
      })
    }
    if (str.indexOf("MemDist") < 0) { //是否有分销权限，表示不可以佣金提现
      that.setData({
        isMemDist: false,
        cashType: 1
      })
    }
  },
  cutType: function() { //切换类型
    if (this.data.isECashCard && this.data.isMemDist) {
      var _thatType = this.data.cashType == 1 ? 2 : 1;
      this.setData({
        cashType: _thatType,
        payType: _thatType == 2 ? 0 : 1, //重置默认选中提现类型：佣金提现默余额
        total_price: _thatType == 1 ? this.data.money_one : this.data.money_tow
      });
    }
  },
  cutPayType: function(e) { //切换支付方式
    this.setData({
      payType: e.currentTarget.dataset.t
    });
  },
  formSubmit: function(e) { //提交提现申请
    var formData = e.detail.value,
      that = this.data,
      flag = true; //是否可以提交
    this.verificationForm(formData); //验证表单
    for (var item in that.verificationType) {
      if (that.verificationType[item]) {
        flag = false;
      }
    }
    if (flag) { //验证通过，进行提交
      if (that.payType == 0) { //余额
        var val = {
          userId: app.globalData.UserInfo.Id,
          totalBonusesCash: formData.money
        }
        $.xsr($.makeUrl(userapi.CommisionToECash, val), function(data) {
          console.log(val,data);
          if (data.Code == 0) {
            wx.showToast({
              icon: "none",
              title: "已转入余额！"
            });
            setTimeout(function() {
              $.backpage(1, function() {});
            }, 2000);
          } else {
            $.alert(data.Msg);
          }
        });
      } else { //其他提现方式
        var val = {
          userAccount: app.globalData.UserInfo.UserName,
          Price: formData.money || that.total_price,
          Phone: formData.phone,
          nickName: app.globalData.UserInfo.NickName,
          BankAccount: formData.bank_num || "", //银行卡号
          AlipayAccount: formData.ali_account || "", //支付宝账号
          UesrRealName: formData.name || "", //真实姓名
          BankName: formData.bank_name || "",
          WithdrawType: that.payType ==3?4:that.payType,
          type: that.cashType == 2 ? 0 : 1
        }
        $.xsr($.makeUrl(userapi.ApplyToCashNew, val), function(data) {
          console.log("提现：",val,data);
          if (data.Code == 0) {
            wx.showToast({
              icon: "none",
              title: "已申请提现！"
            });
            setTimeout(function() {
              $.backpage(1, function() {});
            }, 2000);
          } else {
            wx.showToast({
              icon: "none",
              title: data.Msg
            });
          }
        });
      }
    }
  },
  verificationForm: function(e) { //验证form表单
    var that = this.data,
      vt = {};
    if (that.cashType == 2) { //佣金提现，需要验证提现金额
      vt["1"] = (!e.money || e.money < 0 || e.money > that.total_price) ? true : false;
      if (!vt["1"] && e.money<that.WithdrawThreshold) {
        wx.showToast({
          icon: "none",
          title: "亲~金额必须大于" + that.WithdrawThreshold+"才能提现哟！"
        });
        vt["1"] = true
      }
      console.log(vt["1"]);
    }
    if (that.payType == 2) { //支付宝
      //支付宝账号
      vt["2"] = !e.ali_account ? true : (/^0?(13[0-9]|15[012356789]|18[0123456789]|14[0123456789]|17[0123456789])[0-9]{8}$/.test(e.ali_account) || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e.ali_account)) ? false : true;
    }
    if (that.payType == 3) { //银行卡
      //银行名称
      vt["3"] = !e.bank_name ? true : false;
      //银行卡号
      vt["4"] = !e.bank_num ? true : false;
    }
    if (that.payType != 0) { //非余额提现
      //提现人姓名
      vt["5"] = !e.name ? true : false;

      //提现人手机
      vt["6"] = !e.phone ? true : !(/^1[34578]\d{9}$/.test(e.phone)) ? true : false;
    }

    this.setData({
      verificationType: vt
    });
  },
  inputVerification: function(e) { //输入验证
    var oldVt = this.data.verificationType,
      val = e.currentTarget.dataset.t;
    oldVt[val] = false;
    this.setData({
      verificationType: oldVt
    });
  }
})