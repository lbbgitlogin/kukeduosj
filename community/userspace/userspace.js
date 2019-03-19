var app = getApp();
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');
var userapi = require('../../api/userAPI.js');
Page({
  data: {
    tapindex: 1,
    UserInfo: [],//用户
    pageIndex: 1,
    ispage: true,
    flag: true, //是否可以进行下次分页
    PostsList: [],
    scposition: "", //滚动条位置
    pageIndex: 1,
    IsLoginUser: false,
    uid: 0,
    value: "",
    xgqy: true,
    focus: false,
    Signature: '',
    isnav: true,
    screenHeight: 0,
    isquicknav: false
  },


  onLoad: function (options) {
    // //console.log(options.uid);
    var that = this
    that.setData({
      uid: options.uid || app.globalData.UserInfo.Id
    })
    if (options.uid == app.globalData.UserInfo.Id) {
      that.setData({
        IsLoginUser: true
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
    that.GetUserSpace();
    that.GetMemberPostsByUserId();
  },

  EditSignature: function () {  //修改用户个性签名接口
    var that = this
    var val = {
      UserId: app.globalData.UserInfo.Id,
      OperateId: app.globalData.VendorInfo.Id,
      Signature: this.data.UserInfo.Signature,
    }
    //console.log(val);
    $.xsr($.makeUrl(capi.EditSignature, val), function (data) {
      //console.log("修改用户个性签名接口", data);
      that.setData({
        xgqy: true
      });
      that.GetUserSpace()
    });
  },
  onGotUserInfo: function (e) {
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
      that.dianzan(e)
    } else {

    }
  },
  DeleteMemberPosts: function (e) {  //删除帖子接口
    var that = this;
    // //console.log(e);
    if (that.data.tapindex == 1) {
      var val = {
        MemberPostsId: e.currentTarget.dataset.id,
      }
      $.confirm("是否删除帖子?", function (data) {
        if (data.confirm) {
          $.xsr($.makeUrl(capi.DeleteMemberPosts, val), function (data) {
            if (data.Code == 0) {
              that.setData({
                PostsList: []
              })
              that.GetUserSpace();
              that.GetMemberPostsByUserId();
            }
          });
        }
      }, true);
    }
    else {
      var val = {
        userId: app.globalData.UserInfo.Id,
        memberPostsId: e.currentTarget.dataset.id,
        operateId: app.globalData.VendorInfo.Id
      }
      $.confirm("是否取消收藏帖子?", function (data) {
        if (data.confirm) {
          $.xsr($.makeUrl(capi.CancelMemberPostsCollection, val), function (data) {
            if (data.Code == 0) {
              that.setData({
                PostsList: []
              })
              that.GetUserSpace();
              that.loaddata();
            }
          });
        }
      }, true);
    }
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
      that.txt_book()
    } else {

    }
  },
  txt_book: function () {
    wx.navigateTo({
      url: '../../community/Publishedarticles/Publishedarticles'
    })
  },
  GetUserSpace: function () {  //获取用户空间页面接口
    var that = this
    var val = {
      UserId: app.globalData.UserInfo.Id,
      replyUserId: that.data.uid,
      operateId: app.globalData.VendorInfo.Id
    }

    $.xsr($.makeUrl(capi.GetUserSpace, val), function (data) {
      console.log("获取用户空间页面接口", data);

      if (data.Info.Signature == '编辑签名') {
        that.setData({
          UserInfo: data.Info,
          Signature: ''
        })
      } else {
        that.setData({
          UserInfo: data.Info,
          Signature: data.Info.Signature
        })
      }
    });
  },

  GetMemberPostsByUserId: function () {  //分页获取用户发布帖子列表接口
    var that = this;
    var val = {
      UserId: that.data.uid,
      pageIndex: that.data.pageIndex,
    }
    if (that.data.pageIndex == 1) {
      that.setData({
        PostsList: []
      })
    }
    $.xsr($.makeUrl(capi.GetMemberPostsByUserId, val), function (data) {
      console.log("分页获取用户发布帖子列表接口", data);
      if (data.Info != "") {
        that.setData({
          isdata: true
        })
        if (data.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            PostsList: that.data.PostsList.concat(data.Info),
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            PostsList: that.data.PostsList.concat(data.Info),
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


  GetCommentPostsByUserId: function () {  //分页获取用户评论帖子列表接口
    var that = this;
    var val = {
      UserId: that.data.uid,
      pageIndex: that.data.pageIndex,
    }
    if (that.data.pageIndex == 1) {
      that.setData({
        PostsList: []
      })
    }
    $.xsr($.makeUrl(capi.GetCommentPostsByUserId, val), function (data) {
      // console.log("分页获取用户评论帖子列表接口", data);
      if (data.Info != "") {
        that.setData({
          isdata: true
        })
        if (data.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            PostsList: that.data.PostsList.concat(data.Info),
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            PostsList: that.data.PostsList.concat(data.Info),
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
  xiugaiqianming: function () {
    var that = this;
    if (that.data.xgqy == false) {
      that.setData({
        xgqy: true,
        focus: false
      });
    } else {
      that.setData({
        xgqy: false,
        focus: true

      });
    }

  },


  GetCollectionPostsByUserId: function () {  //分页获取用户收藏帖子列表接口
    var that = this;
    var val = {
      UserId: that.data.uid,
      pageIndex: that.data.pageIndex,
    }
    if (that.data.pageIndex == 1) {
      that.setData({
        PostsList: []
      })
    }
    $.xsr($.makeUrl(capi.GetCollectionPostsByUserId, val), function (data) {
      //  //console.log("分页获取用户收藏帖子列表接口", data);
      if (data.Info != "") {
        that.setData({
          isdata: true
        })
        if (data.Info.length < 10) {
          that.setData({
            flag: false,
            ispage: false,
            PostsList: that.data.PostsList.concat(data.Info),
          });
        } else {
          that.setData({
            flag: true,
            ispage: true,
            PostsList: that.data.PostsList.concat(data.Info),
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
  tiezi: function () {

    if (this.data.tapindex != 1) {
      this.setData({
        tapindex: 1,
        pageIndex: 1
      });
      this.GetMemberPostsByUserId();
    } else {

    }
  },
  pinglun: function () {
    if (this.data.tapindex != 2) {
      this.setData({
        tapindex: 2,
        pageIndex: 1
      });
      this.GetCommentPostsByUserId();
    } else {

    }
  },
  shoucang: function () {
    if (this.data.tapindex != 3) {
      this.setData({
        tapindex: 3,
        pageIndex: 1
      });
      this.GetCollectionPostsByUserId();
    } else {

    }
  },
  scrollbottom: function (even) {  //滚动到底部进行分页
    var that = this
    if (this.data.flag) { //判断是否可以进行下次分页
      this.setData({
        flag: false
      })
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        that.setData({
          pageIndex: parseInt(that.data.pageIndex) + 1,
        });
        that.loaddata()
      }, 500);
    }
  },
  loaddata: function () {
    var that = this;
    if (that.data.tapindex == 1) {
      this.GetMemberPostsByUserId();
    }
    else if (that.data.tapindex == 2) {
      this.GetCommentPostsByUserId();
    }
    else {
      this.GetCollectionPostsByUserId();
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
      ReplyUserId: that.data.uid
    }
    $.xsr($.makeUrl(capi.AddUserFollow, val), function (data) {
      // //console.log(data);
      if (data.Code == "0") {
        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 2000
        })
        clearTimeout(time);
        var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
          that.GetUserSpace();
        }, 1500);

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
    // $.confirm("是否取消关注?", function (data) {
    //   if (data.confirm) {
    var val = {
      CreateUserId: app.globalData.UserInfo.Id,
      OperateId: app.globalData.VendorInfo.Id,
      ReplyUserId: that.data.uid
    }
    $.xsr($.makeUrl(capi.AddUserFollow, val), function (data) {
      //  //console.log(data);
      if (data.Code == "0") {

        wx.showToast({
          title: '取消关注成功',
          icon: 'success',
          duration: 2000
        })
        clearTimeout(time);
        var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
          that.GetUserSpace();
        }, 1500);


      }
    });
    //   }
    // }, true);
  },
  input: function (e) {
    var user = this.data.UserInfo;
    user.Signature = e.detail.value;
    this.setData({
      UserInfo: user
    });
  },
  guanzhu: function () {
    wx.navigateTo({
      url: '../attention/attention?id=' + this.data.UserInfo.UserId
    })
  },
  fensi: function () {
    wx.navigateTo({
      url: '../fans/fans?id=' + this.data.UserInfo.UserId
    })
  },
  dianzan: function (e) {//帖子点赞
    //console.log(e)
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.dataset.id,
      niceName: app.globalData.UserInfo.NickName,
      userPhotoPath: app.globalData.UserInfo.Photo
    }
    //console.log(val);
    $.clearxsr($.makeUrl(capi.MemberPostsFabulous, val), function (data) {
      //console.log(data);
      if (data.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.PostsList.length; i++) {
          if (that.data.PostsList[i].Id == e.currentTarget.dataset.id) {
            //console.log(that.data.PostsList[i].IsFabulous)
            var thatObj = that.data.PostsList[i];
            if (that.data.PostsList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.PostsList[i]);
          }
        }
        that.setData({
          PostsList: newArray
        });
      }
    });
  },
  onGotUserInfo1: function (e) {
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
      that.canceldianzan(e)
    } else {

    }
  },
  canceldianzan: function (e) {//帖子取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      memberPostsId: e.currentTarget.dataset.id
    }
    $.clearxsr($.makeUrl(capi.CancelMemberPostsFabulous, val), function (data) {
      //console.log(data);
      if (data.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.PostsList.length; i++) {
          if (that.data.PostsList[i].Id == e.currentTarget.dataset.id) {
            //console.log(that.data.PostsList[i].IsFabulous)
            var thatObj = that.data.PostsList[i];
            if (that.data.PostsList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.PostsList[i]);
          }
        }
        that.setData({
          PostsList: newArray
        });
      }
    });
  },
  scrolltoupper: function (e) {
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
  returnTop: function () { //返回顶部
    this.setData({
      scposition: 0
    });
  },
  nav: function () {
    this.setData({
      isnav: false,
      animation: false
    })
  },
  outnav: function () {
    var that = this;
    this.setData({
      animation: true
    })
    setTimeout(function () {
      that.setData({
        isnav: true
      })
    }, 400)
  }
}, true);
