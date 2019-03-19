var app = getApp();
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');

Page({
  data: {
    isbenren: false,//是否看自己的粉丝
    UserList: [],
    ispage: false,
    flag: false, //是否可以进行下次分页
    UserId: 0,
    pageIndex: 1
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      UserId:options.id
    });
    console.log(options.id);
    that.GetUserFansList();
  },
  GetUserFansList: function () {  //分页获取用户粉丝列表接口
    var that = this;
    var val = {
      UserId:that.data.UserId,
      pageIndex: that.data.pageIndex
    }
    $.xsr($.makeUrl(capi.GetUserFansList, val), function (res) {
      console.log("分页获取用户粉丝列表接口", res);
      if (res.Code == "0" || that.data.UserList) {
        if (res.Info.length > 0) {
          if (that.data.pageIndex == 1 && res.Info.length < 10) {
            that.setData({
              UserList: that.data.UserList.concat(res.Info),
              ispage: false
            });
          } else {
            that.setData({
              UserList: that.data.UserList.concat(res.Info),
              ispage: true
            });
          }
        } else {
          that.setData({
            ispage: false
          });
        }

        that.setData({
          flag: true
        })

        //判断是否看的自己的帖子
        if (app.globalData.UserInfo.Id == that.data.UserId) {
          that.setData({
            isbenren: true
          })
        } else {
          that.setData({
            isbenren: false
          })
        }

        console.log(that.data.isbenren);
      }
    });
  },
  scrollbottom: function (even) { //滚动到底部进行分页
    if (this.data.flag && this.data.ispage) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        flag: false
      });
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1
        });
        console.log("传入：", that.data.pageIndex);
        that.GetUserFansList();
      }, 500);
    }
  },
  onGotUserInfo2: function (e) {
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
      that.AddFollow(e)
    } else {

    }
  },
  AddFollow: function (e) {//关注
    var that = this;
    var val = {
      CreateUserId: app.globalData.UserInfo.Id,
      OperateId: app.globalData.VendorInfo.Id,
      ReplyUserId: e.currentTarget.id
    }
    $.xsr($.makeUrl(capi.AddUserFollow, val), function (res) {
      console.log(res);
      if (res.Code == "0") {
        //$.alert("关注成功");
        that.setData({
          pageIndex:1,
          UserList: []
        });
        that.GetUserFansList();
      }
    });
  },
  onGotUserInfo3: function (e) {
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
      that.cancelFollow(e)
    } else {

    }
  },
  cancelFollow: function (e) {//取消关注
    var that = this;
    $.confirm("是否取消关注?", function (res) {
      if (res.confirm) {
        var val = {
          CreateUserId: app.globalData.UserInfo.Id,
          OperateId: app.globalData.VendorInfo.Id,
          ReplyUserId: e.currentTarget.id
        }
        $.xsr($.makeUrl(capi.AddUserFollow, val), function (res) {
          console.log(res);
          if (res.Code == "0") {
            //$.alert("取消关注成功");
            that.setData({
              pageIndex: 1,
              UserList: []
            });
            that.GetUserFansList();
          }
        });
      }
    }, true);
  }
})