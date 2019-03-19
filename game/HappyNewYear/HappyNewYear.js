var app = getApp()
var $ = require('../../utils/util.js');
var napi = require('../../api/NewAPI.js');

Page({
  data: {
    imgUrls: [
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//827f1524-628d-4df7-9437-8ed2dbfd0e30.jpg',
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//827f1524-628d-4df7-9437-8ed2dbfd0e30.jpg',
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//827f1524-628d-4df7-9437-8ed2dbfd0e30.jpg',
    ],
    butUrls: [
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//7d711099-9ce3-4bab-9f1a-f0bed64762aa.png', //去拜年
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//69459aed-b03e-4bb4-981d-a04fd744e4a1.png', //比人气
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//6fe6303e-7051-4b3b-9d28-41f65d133dd8.png', //朋友圈
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//6fe6303e-7051-4b3b-9d28-41f65d133dd8.png', //朋友圈
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//5d959b96-54a0-416d-851b-10a5882e2567.png', //请扫码
      'http://bbcfile.kukeduo.cn//ad001/201802/0318//5bef75fc-59aa-45fd-ac31-dc1b216caefb.png', //喝芝香
      'http://bbcfile.kukeduo.cn//ad001/201802/0518//74bb3a22-7284-47c7-9c29-2310effe85fd.png', //换贺词
      'http://bbcfile.kukeduo.cn//ad001/201802/0517//bfa7b267-3f3f-4c8c-a517-fcb3f09e8adb.png', //预览
      'http://bbcfile.kukeduo.cn//ad001/201802/0517//0ace19f6-0a08-4a6d-8365-55b9de448877.png', //写福卡
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 200,
    nameValue: '',   //姓氏
    callValue: '',  //名字
    signatureValue: '',   //祝福人
    Congratulations: [],   //贺词
    Poster: [],   //海报
    CongratulationsList: [],   //贺词集合
    PosterList: [],   //海报集合
    i: 1,   //当前选中贺词的下标
    sid: 0,   //保存贺卡获取的id
    isdata: true
  },

  Initialize: function () {   //页面初始化
    var that = this
    that.setData({
      photo: app.globalData.UserInfo.Photo,
      signatureValue: app.globalData.UserInfo.NickName
    })
    that.GetBlessedGameInfo()
  },
  onLoad: function (options) {
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          IsChannel: app.globalData.VendorInfo.IsChannel,//是否展示技术支持
        })
        that.Initialize()
      });
    }
    else {
      that.setData({
        IsChannel: app.globalData.VendorInfo.IsChannel,//是否展示技术支持
      })
      that.Initialize()
    }
  },
  GetBlessedGameInfo: function (e) {  //获取活动详情
    var that = this;
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
    }
    console.log(val)
    $.xsr($.makeUrl(napi.GetBlessedGameInfo, val), function (data) {
      console.log(data)
      if (data.Code == 0) {
        that.setData({
          CongratulationsList: data.Info.Congratulations,
          PosterList: data.Info.Poster,
          Congratulations: data.Info.Congratulations[0],
          Poster: data.Info.Poster[0],
          bid: data.Info.Id,
        })
      } else {
        that.setData({
          isdata: false,
        })
      }
    });
  },
  updataCongratulations: function () {   //点击更换贺词
    var that = this;
    if (that.data.i < that.data.CongratulationsList.length) {
      that.setData({
        Congratulations: that.data.CongratulationsList[that.data.i],
        i: that.data.i + 1
      })
    } else {
      that.setData({
        Congratulations: that.data.CongratulationsList[0],
        i: 1
      })
    }
  },
  nameInput: function (e) {   //输入祝福人的姓氏
    this.setData({
      nameValue: e.detail.value
    })
  },
  callInput: function (e) {   //输入祝福人的名字
    this.setData({
      callValue: e.detail.value
    })
  },
  signatureInput: function (e) {   //输入送福人的名字
    this.setData({
      signatureValue: e.detail.value
    })
  },
  AddUserSendBlessedInfo: function () {  //保存贺岁信息接口
    var that = this;
    if ($.isNull(that.data.nameValue)) {
      $.alert("请输入姓名")
      return false
    }
    if ($.isNull(that.data.signatureValue)) {
      $.alert("请输入署名")
      return false
    }
    if ($.isNull(that.data.Congratulations)) {
      $.alert("请输入祝福词")
      return false
    }
    var val = {
      userId: app.globalData.UserInfo.Id,
      userCall: that.data.nameValue,
      // position: that.data.callValue,
      congratulations: that.data.Congratulations,
      // poster: that.data.Poster,
      userPhotoPath: that.data.photo,
      userName: that.data.signatureValue
    }
    console.log(val)
    $.xsr($.makeUrl(napi.AddUserSendBlessedInfo, val), function (data) {
      console.log(data)
      if (data.Code == 0) {
        that.setData({
          sid: data.Msg
        })
        that.gotoUrl(data.Msg)
      }
    });
  },
  gotoUrl: function (sid) {
    console.log(sid)
    wx.navigateTo({
      url: '../previewcard/previewcard?sid=' + sid + '&bid=' + this.data.bid,
    })
  },
  bindchange: function (e) {
    var that = this;
    that.setData({
      poster: that.data.PosterList[e.detail.current],
    })
    console.log(that.data.poster)
  },
  CongratulationsInput:function(e){
    var that = this;
    that.setData({
      Congratulations: e.detail.value
    })
  }
})