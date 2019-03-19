var app = getApp();
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');
Page({
  data: {
    jubaoInfo: [],
    t_id: 0,//-1  其他  选择举报内容id
    istap: false,
    isinput: true,
    buttonClicked:true,
    inputtapnum: -1,
    Cvalue: "",//选择的举报内容
    value: "",//填写的举报内容
    pid: 0,//举报帖子或评论id
    puserid: 0,//被举报用户id
    pcontent: "",//被举报内容
    ptype: 0,//举报类型  1帖子 2评论   3新闻资讯举报
    tzid:0,//帖子id
    focus:false
  },
  onLoad: function (options) {
    console.log("options",options)
    var that = this;
    that.GetReporContentByAllList();
    that.setData({
      id: options.plId,
      pid: options.id,
      plId: options.plId,
      puserid: options.userid,
      pcontent: options.content,
      ptype: options.type,
      tzid: options.tzid
    })
  },
  textareavalue: function (e) { //获取其他输入内容
    this.setData({
      value: e.detail.value
    })
  },
  GetReporContentByAllList: function () {  //获取举报内容类型
    var that = this;
    $.xsr($.makeUrl(capi.GetReporContentByAllList), function (res) {
      console.log("获取举报内容类型", res);
      if (res.Code == 0) {
        that.setData({
          jubaoInfo: res.Info
        })
      }
    });
  },
  ckitem: function (e) {//选择举报内容
    var that = this;
    var type = e.currentTarget.dataset.id;
    that.setData({
      t_id: e.currentTarget.dataset.id,
      Cvalue: e.currentTarget.dataset.content,
      focus: true
    })
  },
  submitdata: function () {//提交举报
    var that = this;
    if (that.data.t_id == -1) {
      that.setData({
        Cvalue: that.data.value
      })
    }
    console.log($.isNull(that.data.Cvalue));
    if ($.isNull(that.data.Cvalue)) {
      wx.showModal({
        title: '提示',
        content: "请先选择举报内容！",
        showCancel: false,
      });
      return;
    }
    var val = {};
    if (that.data.ptype == 3){//举报新闻资讯评论
  
      val = {
        newsletterId: that.data.tzid, //帖子id 
        newsletterCommentId: that.data.plId, //评论id
        reportContent: that.data.Cvalue, //举报内容
        reportUserId: app.globalData.UserInfo.Id, //举报用户id  
        vendorId: app.globalData.VendorInfo.Id, //商家id
      }
      console.log(val);
      $.xsr($.makeUrl(capi.ReportNewLetter, val), function (res) {
        
        console.log("举报返回",res)
        if (res.Code == 0) {
          that.setData({
            buttonClicked:false
          })
          $.alert("举报已提交");
          console.log(that.data.pid)
          var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        } else {
          $.alert("举报失败!");
        }
      });



    }
    if (that.data.ptype == 1 || that.data.ptype == 2){
    if (that.data.ptype == 1) {//举报帖子
      val = {
        memberPostsId: that.data.pid,
        operateId: app.globalData.VendorInfo.Id,
        postsCommentId: 0,
        replyContent: that.data.pcontent,
        replyUserId: that.data.puserid,
        reporContent: that.data.Cvalue,
        reportType: that.data.ptype,
        reportUserId: app.globalData.UserInfo.Id
      }
    } else if (that.data.ptype == 2) {
      val = {
        memberPostsId: 0,
        operateId: app.globalData.VendorInfo.Id,
        postsCommentId: that.data.pid,
        replyContent: that.data.pcontent,
        replyUserId: that.data.puserid,
        reporContent: that.data.Cvalue,
        reportType: that.data.ptype,
        reportUserId: app.globalData.UserInfo.Id
      }
    }
    console.log(val);
    $.xsr($.makeUrl(capi.MemberRepor, val), function (res) {
      if (res.Code == 0) {
        $.alert("举报已提交");
        console.log(that.data.pid)
        var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      }else{
       $.alert("举报失败!");
      }
    });
  }
  }
})