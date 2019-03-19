var app = getApp()
var $ = require('../../utils/util.js');
var activityapi = require('../../api/activityAPI.js');
var userapi = require('../../api/userAPI.js');
var capi = require('../../api/community.js');
var notice = require('../../utils/notice.js');
var CommentVal = {}; //评论，回复参数
Page({
  data: {
    Info: [],
    dataComment:[],
    Id: 0,
    IsComment: '',//禁止评论
    flag: true,
    pageIndex: 1,
    focus: false,
    value: '',
    activitydetail: '', //解析过后的
    infoIndex:0,//对应列表第几条
    isBasics: true
  },
  onLoad: function(options) {
    console.log("options",options)
    var that = this
    this.setData({
      Id: options.id,
      infoIndex: options.i
    });
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function() {
        var str = app.globalData.VendorInfo.VendorFeatureSet
        if (str.indexOf("Share") > -1) {
          that.setData({
            isBasics: true
          })
        } else {
          that.setData({
            isBasics: false
          })
        }
        that.GetNewsletter()
        that.GetNewsCommentByPostsIdNotEncrypted()
      }, options.uid);
    } else {
      var str = app.globalData.VendorInfo.VendorFeatureSet
      if (str.indexOf("Share") > -1) {
        that.setData({
          isBasics: true
        })
      } else {
        that.setData({
          isBasics: false
        })
      }
      that.GetNewsletter()
      that.GetNewsCommentByPostsIdNotEncrypted()
    }
  },
  GetNewsletter: function() {
    var taht=this;
    var valdetail = {
      id: this.data.Id,
      vendorId: app.globalData.VendorInfo.Id,
    };
    var thisobj = this;
    $.xsr($.makeUrl(activityapi.GetNewsletter, valdetail), function(res) {
      console.log("获取id",res)
      if (!$.isNull(res.Info)) {
        notice.postNotificationName("Refresh", { num: res.Info.ViewCounts, id: valdetail.id, i: taht.data.infoIndex});
        thisobj.setData({
          Info: res.Info,
          IsComment: res.Info.IsComment
        });
      } else {
        thisobj.setData({
          flag: false
        })
      }
    });
  },
  texthidden: function() { //悬浮评论框点击  点击回复帖子

    var that = this;
    if (that.data.IsComment) { //没有被禁止评论
      CommentVal = {
        userId: app.globalData.UserInfo.Id,
        vendorId: app.globalData.VendorInfo.Id,
        commentContent: that.data.value,
        newsletterId: that.data.Id,
        postCommentId: 0,
        replyCommentId: 0,
        replyUserId: 0
      }
      that.setData({ 
        focus: true,
        huifuvalue: "写评论..."
      })
    } else {
      that.setData({
        focus: false,
        huifuvalue: "禁言"
      })
    }
    that.textblock();
  },
  scrollbottom: function (even) { //滚动到底部进行分页
  
    if (this.data.flag && this.data.ispage) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        flag: true
      });
      // clearTimeout(time);
      // var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
      //   that.setData({
      //     pageIndex: parseInt(that.data.pageIndex) + 1
      //   });
      //   console.log("传入：", that.data.pageIndex);
      //   that.GetPostsList();
      // }, 500);
      that.setData({
        pageIndex: parseInt(that.data.pageIndex) + 1
      });
      // console.log("传入：", that.data.pageIndex);
      that.GetNewsCommentByPostsIdNotEncrypted();
    }
  },
  textblock: function() { //遮罩层点击
    var that = this;
    if (that.data.ishidden == true) {
      that.setData({
        ishidden: false,
        value: "" //清空回复框内容
      })
    } else {
      that.setData({
        ishidden: true
      })
    }
  },
  onGotUserInfo6: function(e) {

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
      that.AddComment()
    } else {

    }
  },


  AddComment: function() { //评论帖子
    var that = this;
    if (that.data.IsComment) { //没有被禁止评论
      CommentVal.commentContent = that.data.value;
      //console.log("CommentVal", CommentVal);
      $.xsr($.makeUrl(capi.MemberNewsComment, CommentVal), function(res) {

        console.log("评论帖子", res);
        if (res.Code == 0) {
          that.textblock();
          that.setData({
            pageIndex: 1,
            dataComment: []
          });
          that.GetNewsCommentByPostsIdNotEncrypted();
        } else {
          $.alert(res.Msg);
        }
      });
    }
  },
  GetNewsCommentByPostsIdNotEncrypted: function() { //帖子详情分页获取帖子评论接口

    var that = this;
    var val = {
      newsletterId: that.data.Id,
      UserId: app.globalData.UserInfo.Id,
      pageIndex: that.data.pageIndex,
    }
    // //console.log("a", val)
    $.xsr($.makeUrl(capi.GetNewsCommentByPostsIdNotEncrypted, val), function(res) {
      console.log("帖子详情分页获取帖子评论接口", res);
      if (res.Code == 0) {
        if (res.Info.length > 0 && res.Info.length < 10) {
          that.setData({
            dataComment: that.data.dataComment.concat(res.Info),
            ispage: false,

          });
        } else {
          that.setData({
            dataComment: res.Info,
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
  textareavalue: function(e) { //获取评论框内容

    this.setData({
      value: e.detail.value
    })

  },
  onShareAppMessage: function() {
    return {
      title: this.data.Info.Title,
      path: '/news/newsletterdetail/newsletterdetail?id=' + this.data.Id + "&uid=" + app.globalData.UserInfo.Id
    }
  },
  shoucang: function(e) { //帖子收藏
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.id
    }
 
    $.xsr($.makeUrl(capi.MemberPostsCollection, val), function(res) {
    
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
   
      }
    });
  },
  cancelshoucang: function(e) { //帖子取消收藏
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.id
    }
    $.xsr($.makeUrl(capi.CancelMemberPostsCollection, val), function(res) {
   
      if (res.Code == "0") {
        that.GetMemberPostsInfo();
  
      }
    });
  },

  onGotUserInfo58: function(e) {
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
      that.zan(e)
    } else {

    }
  },
  zan: function(e) { //评论点赞
    // //console.log("ee", e);
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      postsCommentId: e.currentTarget.id
    }
    $.clearxsr($.makeUrl(capi.MemberCommentFabulous, val), function(res) {
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
  zan2: function(e) { //子评论点赞
    // //console.log("ee", e);
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      postsCommentId: e.currentTarget.id
    }
    $.clearxsr($.makeUrl(capi.MemberCommentFabulous, val), function(res) {
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
  cancelzan2: function(e) { //子评论取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      postsCommentId: e.currentTarget.id
    }

    $.clearxsr($.makeUrl(capi.CancelMemberCommentFabulous, val), function(res) {
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
  cancelzan: function(e) { //评论取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      postsCommentId: e.currentTarget.id
    }
    $.clearxsr($.makeUrl(capi.CancelMemberCommentFabulous, val), function(res) {
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
  aaa: function(e) {
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
        } else {
          commentList[i].commentList[j].IsShow = false;
        }
      }
      if (e.currentTarget.dataset.id == that.data.dataComment[i].Id) {
        if (that.data.dataComment[i].IsShow == true) {
          commentList[i].IsShow = false;
        } else {
          commentList[i].IsShow = true;
        }
      } else {
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

  hiddend: function() {
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

  ahuifu: function(e) { //点击回复评论

    // //console.log(e.target.dataset);
    var that = this;
    that.setData({
      hiddenddd: false
    })
    if (!that.data.IsComment) { //被禁止评论
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
        vendorId: app.globalData.VendorInfo.Id,
        commentContent: that.data.value,
        newsletterId: that.data.Id,
        postCommentId: e.target.dataset.fcomid,
        replyCommentId: e.target.dataset.comid,
        replyUserId: e.target.dataset.id
        // operateId: app.globalData.VendorInfo.Id,



      }
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
        } else {
          commentList[i].commentList[j].IsShow = false;
        }
      }
      if (e.currentTarget.dataset.id == that.data.dataComment[i].Id) {
        if (that.data.dataComment[i].IsShow == true) {
          commentList[i].IsShow = false;
        } else {
          commentList[i].IsShow = false;
        }
      } else {
        commentList[i].IsShow = false;
      }
    }
    that.setData({
      dataComment: commentList
    })
  },
})