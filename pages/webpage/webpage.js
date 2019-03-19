var $ = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(function(){
      wx.setNavigationBarTitle({
        title: options.tn
      });
    },400);
    
    wx.setNavigationBarColor({
      frontColor: options.tc == 'white' ? '#ffffff' : '#000000',
      backgroundColor: options.tb
    })
    this.setData({
      url: options.u
    });
  }
})