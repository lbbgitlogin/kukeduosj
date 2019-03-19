var app = getApp();
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');

Page({
  data: {
    sqxx:[],
    pageIndex: 1,
    ispage: false,
    flag: false, //是否可以进行下次分页
    UserId: 0,
  },
  onLoad: function (options) {
    var that = this
    that.GetMemberPostsComment();
  },
  GetMemberPostsComment: function () {  //我的社区消息
    var that = this;
    var val = {
      userId: app.globalData.UserInfo.Id,
      pageIndex: that.data.pageIndex,
    }
    console.log(val)
    $.xsr($.makeUrl(capi.GetMemberPostsComment,val), function (res) {
      console.log("我的社区消息", res);
      if (res.Code == "0" || that.data.sqxx != '') {
        if (res.Info.length > 0) {
          if (that.data.pageIndex == 1 && res.Info.length < 10) {
            that.setData({
              sqxx: res.Info,
              ispage: false
            });
          } else {
            that.setData({
              sqxx: that.data.sqxx.concat(res.Info),
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
      }
    });
  },
  scrollbottom: function (even) { //滚动到底部进行分页
  console.log(1)
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
        that.GetMemberPostsComment();
      }, 500);
    }
  },

})