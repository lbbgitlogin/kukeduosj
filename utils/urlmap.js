function urlmap(that) {
  console.log(that);
  var maps = [{
    oldurl: "activitylist/activitylist",//活动列表
    newurl: "../../news/activitylist/activitylist"
  }, {
    oldurl: "HappyNewYear/HappyNewYear",//送祝福
    newurl: "../../game/HappyNewYear/HappyNewYear"
  }, {
    oldurl: "setCards/setCards",//集卡
    newurl: "../../game/setCards/setCards"
  }, {
    oldurl: "newsletterdetail/newsletterdetail",//新闻详情
    newurl: "../../news/newsletterdetail/newsletterdetail?" + that.split("?")[1]
  }, {
      oldurl: "plate/plate",//新闻详情
      newurl: "../../community/plate/plate?" + that.split("?")[1]
  },{
      oldurl: "activity/activity",//活动详情
      newurl: "../../news/activity/activity?" + that.split("?")[1]
  },
  {
    oldurl: "activitysignin/activitysignin",//活动详情
    newurl: "../../news/activitysignin/activitysignin?" + that.split("?")[1]
  }];
  var flag = false;//是否需要调整到分包页面
  maps.map(function (info, index) {
    if (that.indexOf(info.oldurl) > -1) {
      wx.navigateTo({
        url: info.newurl
      })
      flag = true;
      return;
    }
  });
  if (!flag) {
    wx.navigateTo({
      url: that
    });
  }
}
module.exports = {
  urlmap: urlmap
}