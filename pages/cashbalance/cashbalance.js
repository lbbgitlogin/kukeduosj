var app = getApp();
Page({
  data: {
    TotalWealth: 0,
    CardCashBalance: 0,
    CashBalance: 0,
    Height:0,
    isECashCard: true,
    isMemDist: true
  },
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          Height: res.windowHeight
        })
      }
    })
    this.setData({
      TotalWealth: options.TotalWealth,
      CardCashBalance: options.CardCashBalance,
      CashBalance: options.CashBalance,
      Currency: app.globalData.VendorInfo.Currency
    })
    var str = app.globalData.VendorInfo.VendorFeatureSet
    if (str.indexOf("ECashCard") > -1) {//储值
      this.setData({
        isECashCard: true
      })
    } else {
      this.setData({
        isECashCard: false
      })
    }
    if (str.indexOf("MemDist") > -1) {//会员分销
      this.setData({
        isMemDist: true
      })
    } else {
      this.setData({
        isMemDist: false
      })
    }
  },
})