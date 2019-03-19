var app = getApp();
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');

Page({
  data: {
    plateId: 0,//版块id
    PlateInfo: {},//版块信息
    PlatePostList: [],//版块帖子列表
    isdata: true,//是否存在数据
    ispage: true,//是否还有分页数据
    flag: true, //是否可以进行下次分页
    scposition: "", //滚动条位置
    pageIndex: 1,
    isshow: false,//是否下线或删除版块
    sousuovalue: '',
    opacity: 0,
    background: 'fff',
    isnav: true,
    screenHeight: 0,
    isquicknav: false
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      plateId: options.id
    });
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
    if (app.globalData.UserInfo == null) {
      app.GetUserInfo(function () {
        that.GetPostsPlateDetail();
        that.GetPostsList();
        that.setData({
          photo: app.globalData.UserInfo.Photo
        })
      }, 0, 0);
    }
    else {
      that.setData({
        photo: app.globalData.UserInfo.Photo
      })
      that.GetPostsPlateDetail();
      that.GetPostsList();
    }
  },
  GetPostsPlateDetail: function () {  //获取版块基本信息接口
    var that = this;
    var val = {
      PlateId: that.data.plateId
    }
    $.xsr($.makeUrl(capi.GetPostsPlateDetail, val), function (res) {
      //console.log("获取版块基本信息接口", res);
      if (res.Code == 0) {
        that.setData({
          isshow: false,
          PlateInfo: res.Info
        })
      } else {
        that.setData({
          isshow: true
        })
      }
      wx.setNavigationBarTitle({
        title: res.Info.PlateName
      })

    });
  },
  GetPostsList: function () {  //分页获取版块页面帖子列表接口
    var that = this;
    var val = {
      plateId: that.data.plateId,
      operateId: app.globalData.VendorInfo.Id,
      pageIndex: that.data.pageIndex,
      userId: app.globalData.UserInfo.Id,
    }
    //  console.log("传入：",val);
    $.xsr($.makeUrl(capi.GetPostsList, val), function (res) {
      console.log("分页获取版块页面帖子列表接口", res);


      if (res.Info.length > 0) {
        if (that.data.pageIndex == 1 && res.Info.length < 10) {
          that.setData({
            PlatePostList: that.data.PlatePostList.concat(res.Info),
            ispage: false
          });
        } else {
          that.setData({
            PlatePostList: that.data.PlatePostList.concat(res.Info),
            ispage: true
          });
        }
      } else {
        if (that.data.pageIndex == 1) {
          that.setData({
            isdata: false
          });
        }
        that.setData({
          ispage: false
        });
      }
      that.setData({
        flag: true
      });
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
        that.GetPostsList();
      }, 500);
    }
  },
  scrollView: function (e) { //滚动到顶部
    if (e.detail.deltaY < -305) {

    }
  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {
    return {
      title: this.data.PlateInfo.PlateName,
      path: '/community/plate/plate?id=' + this.data.plateId
    }
  },
  searchinput: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../Postalist/Postalist?sousuovalue=' + this.data.sousuovalue + '&id=' + parseInt(that.data.plateId),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    that.setData({
      sousuovalue: ''
    });
  },
  sousuovalue: function (e) {
    var that = this;
    that.setData({
      sousuovalue: e.detail.value
    });
  },
  sousuobind: function (e) {
    var that = this;
    that.setData({
      sousuovalue2: that.data.sousuovalue
    });
  },
  bindscroll: function (e) {
    console.log(e)
    var that = this;
    if (e.detail.scrollTop > 100) {
      that.setData({
        opacity: 1,
        background: "f8f8f8"
      });
    } else {
      that.setData({
        opacity: 0,
        background: 'fff'
      });
    }
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
  dianzan: function (e) {//帖子点赞
    console.log(e)
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      operateId: app.globalData.VendorInfo.Id,
      memberPostsId: e.currentTarget.dataset.id,
      niceName: app.globalData.UserInfo.NickName,
      userPhotoPath: app.globalData.UserInfo.Photo
    }
    console.log(val);
    $.clearxsr($.makeUrl(capi.MemberPostsFabulous, val), function (res) {
      console.log(res);
      if (res.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.PlatePostList.length; i++) {
          if (that.data.PlatePostList[i].Id == e.currentTarget.dataset.id) {
            console.log(that.data.PlatePostList[i].IsFabulous)
            var thatObj = that.data.PlatePostList[i];
            if (that.data.PlatePostList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.PlatePostList[i]);
          }
        }
        that.setData({
          PlatePostList: newArray
        });
      }
    });
  },
  canceldianzan: function (e) {//帖子取消点赞
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      memberPostsId: e.currentTarget.dataset.id
    }
    $.clearxsr($.makeUrl(capi.CancelMemberPostsFabulous, val), function (res) {
      console.log(res);
      if (res.Code == "0") {
        var newArray = [];
        for (var i = 0; i < that.data.PlatePostList.length; i++) {
          if (that.data.PlatePostList[i].Id == e.currentTarget.dataset.id) {
            console.log(that.data.PlatePostList[i].IsFabulous)
            var thatObj = that.data.PlatePostList[i];
            if (that.data.PlatePostList[i].IsFabulous == 0) {
              thatObj.IsFabulous = 1;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal + 1
            } else {
              thatObj.IsFabulous = 0;
              thatObj.FabulousUserTotal = thatObj.FabulousUserTotal - 1
            }
            newArray.push(thatObj);
          } else {
            newArray.push(that.data.PlatePostList[i]);
          }
        }
        that.setData({
          PlatePostList: newArray
        });
      }
    });
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
