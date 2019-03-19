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
    postsTitle:'',
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      plateId: options.id,
      postsTitle: options.sousuovalue
    })
    that.GetPostsList();
  },
  // GetPostsPlateDetail: function () {  //获取版块基本信息接口
  //   var that = this;
  //   var val = {
  //     PlateId: that.data.plateId
  //   }
  //   $.xsr($.makeUrl(capi.GetPostsPlateDetail, val), function (res) {
  //     //console.log("获取版块基本信息接口", res);
  //     if (res.Code == 0) {
  //       that.setData({
  //         isshow: false,
  //         PlateInfo: res.Info
  //       })
  //     } else {
  //       that.setData({
  //         isshow: true
  //       })
  //     }
  //     wx.setNavigationBarTitle({
  //       title: res.Info.PlateName
  //     })

  //   });
  // },
  GetPostsList: function () {  //分页获取版块页面帖子列表接口
    var that = this;
    var val = {
      operateId: app.globalData.VendorInfo.Id,
      pageIndex: that.data.pageIndex,
      postsTitle: that.data.postsTitle,
      plateId: that.data.plateId
    }
     console.log("传入：",val);
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
  returnTop: function () { //返回顶部
    this.setData({
      scposition: 0
    });
  },
  scrollView: function (e) { //滚动到顶部
    if (e.detail.deltaY < -305) {

    }
  },
  onPullDownRefresh: function () {

  }
})