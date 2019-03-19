var app = getApp();
var userapi = require('../../api/userAPI.js');
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');
var CommentVal = {};//评论，回复参数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isbenren: false,//是否看自己的帖子   
    isshowdzphoto: false,//是否显示点赞头像及数量
    ishidden: false, //评论框的显示隐藏
    value: "", //评论框的内容
    focus: false, //评论框的自动聚焦
    bar: false, //评论框上方的完成
    commentariehidden: false, //全部评论显示隐藏
    timea: false,  //回复举报功能显示隐藏
    PostId: 0,//帖子id
    datauser: {},//帖子内容
    dataContent: {},//帖子服务数据
    dataComment: [],//帖子评论
    huifuvalue: "写评论...",//回复的人
    timeaid: 0, //回复用户的id 
    IsShow: false, //回复举报是否显示
    commentList: [],
    userid: 0,
    ispage: true,
    flag: true, //是否可以进行下次分页
    scposition: "", //滚动条位置
    pageIndex: 1,
    hiddenddd: false,
    autoheight: true,
    cursorspacing: 50,
    isdata: true,
    uid: 0,
    PostsList: [],
    commentList2: [],
    value2:'',
    isnav: true,
    screenHeight: 0,
    isquicknav: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      PostId: options.id,
      uid: options.uid || 0,
    })
    if (app.globalData.UserInfo == null) {
      app.GetUserInfo(function () {
        that.GetMemberPostsInfo();
        that.GetPostsCommentByPostsId();
      }, that.data.uid, 0);
    }
    else {
      that.GetMemberPostsInfo();
      that.GetPostsCommentByPostsId();
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })

  },
  texthidden: function () {  //悬浮评论框点击  点击回复帖子
    var that = this;
    if (!that.data.datauser.IsComment) {//没有被禁止评论
      CommentVal = {
        userId: app.globalData.UserInfo.Id,
        memberPostsId: that.data.datauser.Id,
        commentContent: that.data.value,
        createNiceName: app.globalData.UserInfo.NickName,
        createPhotoPath: app.globalData.UserInfo.Photo,
        operateId: app.globalData.VendorInfo.Id,
        postCommentId: 0,
        replyCommentId: 0,
        replyUserId: that.data.datauser.UserId
      };
      that.setData({
        focus: true,
        huifuvalue: "写评论..."
      })
    }
    that.textblock();
  },

  textblock: function () {   //遮罩层点击
    var that = this;
    if (that.data.ishidden == true) {
      that.setData({
        ishidden: false,
        value: ""//清空回复框内容
      })
    } else {
      that.setData({
        ishidden: true
      })
    }
  },
  onGotUserInfo6: function (e) {
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
      that.AddComment()
    } else {

    }
  },


  AddComment: function () {   //评论帖子
    var that = this;
    if (!that.data.datauser.IsComment) {//没有被禁止评论
      CommentVal.commentContent = that.data.value;
      //  //console.log("CommentVal", CommentVal);
      $.xsr($.makeUrl(capi.MemberPostsComment, CommentVal), function (res) {
        // //console.log("评论帖子", res);
        if (res.Code == 0) {
          that.textblock();

          // wx.showToast({
          //   title: '评论成功',
          //   icon: 'success',
          //   duration: 3000
          // })
          // var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
          // }, 1000);
          that.setData({
            pageIndex: 1,
            dataComment: []
          });
          that.GetPostsCommentByPostsId();
        } else {
          $.alert(res.Msg);
        }
      });
    }
    else {
      $.alert("该帖禁止评论!");
    }
  },
  textareavalue: function (e) { //获取评论框内容
    this.setData({
      value: e.detail.value
    })
    if (this.data.value == '') {
      this.setData({
        cursorspacing: 50
      })
    } else {
      this.setData({
        cursorspacing: 0
      })
    }
    // //console.log(this.data.cursorspacing)
  },
  sousuobind: function (e) {
    var that = this;
    that.setData({
      value2: that.data.value
    });
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
      that.txt_book()
    } else {

    }
  },
  txt_book: function () {
    wx.navigateTo({
      url: '../../community/Publishedarticles/Publishedarticles'
    })
  },
  qwe: function () {

  },
  commentari: function (e) {
    var that = this
    that.setData({
      userid: e.currentTarget.dataset.id,
      commentariehidden: true
    })
  },
  commentariehidden: function (e) {
    var that = this
    that.setData({
      userid: -1,
      commentariehidden: false
    })
  },
  GetMemberPostsInfo: function () {  //获取帖子详情内容接口
    var that = this;
    var val = {
      UserId: app.globalData.UserInfo.Id,
      PostId: that.data.PostId
    }
    $.xsr($.makeUrl(capi.GetMemberPostsInfo, val), function (res) {
       console.log("获取帖子详情内容接口", res);
      if (res.Code == 0) {
        that.setData({
          datauser: res.Info,
          isdata: true
        })
        //判断是否看的自己的帖子
        if (app.globalData.UserInfo.Id == that.data.datauser.UserId) {
          that.setData({
            isbenren: true
          })
        } else {
          that.setData({
            isbenren: false
          })
        }
        that.GetMemberPostsServerData();
      } else {
        that.setData({
          isdata: false
        })
        clearTimeout(time);
        var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
          // $.alert("自动跳转中...")  

        }, 1500);
      }
    });
  },
  GetMemberPostsServerData: function () {  //获取帖子详情页面相关服务数据
    var that = this;
    var val = {
      memberPostsId: that.data.PostId,
      userId: app.globalData.UserInfo.Id,
      replyUserId: that.data.datauser.UserId,
      operateId: app.globalData.VendorInfo.Id
    }
    //  //console.log("val", val);
    $.xsr($.makeUrl(capi.GetMemberPostsServerData, val), function (res) {
      //console.log("获取帖子详情页面相关服务数据", res);
      if (res.Code == 0) {
        that.setData({
          dataContent: res.Info,
          PostsList: res.Info.PostsList,
        })
        if (that.data.dataContent.FabulousUserTotal > 0) {
          that.setData({
            isshowdzphoto: true
          })
        } else {
          that.setData({
            isshowdzphoto: false
          })
        }
      }
    });
  },
  GetPostsCommentByPostsId: function () {  //帖子详情分页获取帖子评论接口
    var that = this;
    var val = {
      MemberPostsId: that.data.PostId,
      UserId: app.globalData.UserInfo.Id,
      pageIndex: that.data.pageIndex,
    }
    // //console.log("a", val)
    $.xsr($.makeUrl(capi.GetPostsCommentByPostsId, val), function (res) {
      console.log("帖子详情分页获取帖子评论接口22222", res);
      if (res.Code == 0) {
        if (res.Info.length > 0 && res.Info.length < 10) {
          that.setData({
            dataComment: that.data.dataComment.concat(res.Info),
            ispage: false,

          });
        } else {
          that.setData({
            dataComment: that.data.dataComment.concat(res.Info),
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
      });
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
      //  //console.log(res);
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
        //$.alert("关注成功");
      }
    });
  },
  onGotUserInfo4: function (e) {
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
          // //console.log(res);
          if (res.Code == "0") {
            // $.alert("取消关注成功");
            that.GetMemberPostsInfo();
          }
        });
      }
    }, true);
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
      that.dianzan(e)
    } else {

    }
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
    //  //console.log(val);
    $.clearxsr($.makeUrl(capi.MemberPostsFabulous, val), function (res) {
      // //console.log(res);
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
      }
    });
  },
  onGotUserInfo5: function (e) {
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
    $.clearxsr($.makeUrl(capi.CancelMemberPostsFabulous, val), function (res) {
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
      }
    });
  },
  shoucang: function (e) {//帖子收藏
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.id
    }
    ////console.log(val);
    $.xsr($.makeUrl(capi.MemberPostsCollection, val), function (res) {
      //  //console.log(res);
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
        //  $.alert("收藏成功");
      }
    });
  },
  cancelshoucang: function (e) {//帖子取消收藏
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.id
    }
    $.xsr($.makeUrl(capi.CancelMemberPostsCollection, val), function (res) {
      // //console.log(res);
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
        //   $.alert("取消收藏成功");
      }
    });
  },

  onGotUserInfo58: function (e) {
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
      that.zan(e)
    } else {

    }
  },
  zan: function (e) {//评论点赞
    // //console.log("ee", e);
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      postsCommentId: e.currentTarget.id
    }
    $.clearxsr($.makeUrl(capi.MemberCommentFabulous, val), function (res) {
      //console.log(res);
      if (res.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.dataComment.length; i++) {
          if (that.data.dataComment[i].Id == e.currentTarget.id) {
            var thatObj = that.data.dataComment[i];
            if (that.data.dataComment[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousCount = thatObj.FabulousCount + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousCount = thatObj.FabulousCount - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.dataComment[i]);
          }
        }
        that.setData({
          dataComment: newArray
        });
        //  $.alert("点赞成功");
      }
    });
  },
  zan2: function (e) {//子评论点赞
    // //console.log("ee", e);
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      postsCommentId: e.currentTarget.id
    }
    $.clearxsr($.makeUrl(capi.MemberCommentFabulous, val), function (res) {
      if (res.Code == "0") {
        var index = e.currentTarget.dataset.index
        var commentList = that.data.dataComment[index].commentList
        var dataCommentvo = that.data.dataComment
        var newArray = [];
        for (var i = 0; i < commentList.length; i++) {
          if (commentList[i].Id == e.currentTarget.id) {
            var thatObj = commentList[i];
            if (commentList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousCount = thatObj.FabulousCount + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousCount = thatObj.FabulousCount - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(commentList[i]);
          }
        }
        dataCommentvo[index].commentList = newArray
        that.setData({
          dataComment: dataCommentvo
        });
      }
    });
  },
  cancelzan2: function (e) {//子评论取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      postsCommentId: e.currentTarget.id
    }

    $.clearxsr($.makeUrl(capi.CancelMemberCommentFabulous, val), function (res) {
      // //console.log(res);
      if (res.Code == "0") {
        var index = e.currentTarget.dataset.index
        var commentList = that.data.dataComment[index].commentList
        var dataCommentvo = that.data.dataComment
        var newArray = [];
        for (var i = 0; i < commentList.length; i++) {
          if (commentList[i].Id == e.currentTarget.id) {
            var thatObj = commentList[i];
            if (commentList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousCount = thatObj.FabulousCount + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousCount = thatObj.FabulousCount - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(commentList[i]);
          }
        }
        dataCommentvo[index].commentList = newArray
        that.setData({
          dataComment: dataCommentvo
        });
      }
    });
  },
  cancelzan: function (e) {//评论取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      postsCommentId: e.currentTarget.id
    }
    $.clearxsr($.makeUrl(capi.CancelMemberCommentFabulous, val), function (res) {
      // //console.log(res);
      if (res.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.dataComment.length; i++) {
          if (that.data.dataComment[i].Id == e.currentTarget.id) {
            var thatObj = that.data.dataComment[i];
            if (that.data.dataComment[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousCount = thatObj.FabulousCount + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousCount = thatObj.FabulousCount - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.dataComment[i]);
          }
        }
        that.setData({
          dataComment: newArray
        });
        //    $.alert("取消点赞成功");
      }
    });
  },
  aaa: function (e) {
    //  //console.log(e)
    var that = this;
    var commentList = that.data.dataComment;
    for (var i = 0; i < that.data.dataComment.length; i++) {
      for (var j = 0; j < that.data.dataComment[i].commentList.length; j++) {
        if (e.currentTarget.dataset.id == that.data.dataComment[i].commentList[j].Id) {
          if (that.data.dataComment[i].commentList[j].IsShow == true) {
            commentList[i].commentList[j].IsShow = false;
          } else {
            commentList[i].commentList[j].IsShow = true;
          }
        }
        else {
          commentList[i].commentList[j].IsShow = false;
        }
      }
      if (e.currentTarget.dataset.id == that.data.dataComment[i].Id) {
        if (that.data.dataComment[i].IsShow == true) {
          commentList[i].IsShow = false;
        } else {
          commentList[i].IsShow = true;
        }
      }
      else {
        commentList[i].IsShow = false;
      }
    }
    that.setData({
      dataComment: commentList
    })

    if (that.data.hiddenddd == true) {
      that.setData({
        hiddenddd: false
      })
    } else {
      that.setData({
        hiddenddd: true
      })
    }
  },

  hiddend: function () {
    var that = this;
    // //console.log(that.data.hiddenddd)

    if (that.data.hiddenddd == true) {
      that.setData({
        hiddenddd: false
      })
      //  //console.log(that.data.hiddenddd)

    }
    var commentList = that.data.dataComment;
    for (var i = 0; i < that.data.dataComment.length; i++) {
      for (var j = 0; j < that.data.dataComment[i].commentList.length; j++) {
        commentList[i].commentList[j].IsShow = false;
      }
      commentList[i].IsShow = false;
    }

    that.setData({
      dataComment: commentList
    })





  },


  ahuifu: function (e) {//点击回复评论

    // //console.log(e.target.dataset);
    var that = this;
    that.setData({
      hiddenddd: false
    })
    if (that.data.datauser.IsComment) {//被禁止评论
      that.setData({
        focus: false,
        huifuvalue: "禁言"
      })
    } else {
      this.setData({
        focus: true,
        huifuvalue: "回复@" + e.target.dataset.name + "：",
      })
      CommentVal = {
        userId: app.globalData.UserInfo.Id,
        memberPostsId: that.data.datauser.Id,
        commentContent: that.data.value,
        createNiceName: app.globalData.UserInfo.NickName,
        createPhotoPath: app.globalData.UserInfo.Photo,
        operateId: app.globalData.VendorInfo.Id,
        postCommentId: e.target.dataset.fcomid,
        replyCommentId: e.target.dataset.comid,
        replyUserId: e.target.dataset.id
      };
      // //console.log("CommentVal", CommentVal);
    }



    that.textblock();
    var commentList = that.data.dataComment;
    for (var i = 0; i < that.data.dataComment.length; i++) {
      for (var j = 0; j < that.data.dataComment[i].commentList.length; j++) {
        if (e.currentTarget.dataset.id == that.data.dataComment[i].commentList[j].Id) {
          if (that.data.dataComment[i].commentList[j].IsShow == true) {
            commentList[i].commentList[j].IsShow = false;
          } else {
            commentList[i].commentList[j].IsShow = false;
          }
        }
        else {
          commentList[i].commentList[j].IsShow = false;
        }
      }
      if (e.currentTarget.dataset.id == that.data.dataComment[i].Id) {
        if (that.data.dataComment[i].IsShow == true) {
          commentList[i].IsShow = false;
        } else {
          commentList[i].IsShow = false;
        }
      }
      else {
        commentList[i].IsShow = false;
      }
    }
    that.setData({
      dataComment: commentList
    })
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
        that.GetPostsCommentByPostsId();
      }, 500);
    }
  },
  gerenzhongxin: function () {
    wx.navigateTo({
      url: '../userspace/userspace?uid=' + this.data.datauser.UserId
    })
  },
  yulan: function (e) {
    console.log(e)
    console.log(this.data.datauser.ContentList)
    var str = [];

    for (var i = 0; i < this.data.datauser.ContentList.length; i++) {
      if (this.data.datauser.ContentList[i].ContentType == 2) {
        str.push(this.data.datauser.ContentList[i].ImgPath);
      }
    }

    console.log(str)

    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: str // 需要预览的图片http链接列表
      // this.data.datauser.ContentList
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.datauser.PostsTitle,
      path: '/community/tzparticulars/tzparticulars?id=' + this.data.datauser.Id + '&uid=' + app.globalData.UserInfo.Id
    }
  },
  remen: function (e) {  //热门帖子跳转
    //console.log()
    wx.navigateTo({
      url: '../tzparticulars/tzparticulars?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
})