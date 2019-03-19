const kkd = wx;
const tabBarUrl = require('../config.js').config.tabBar;

//检查页面是否为底部导航
const checkForTabBar = (urlList, navigateUrl) => urlList.find(item => navigateUrl.indexOf(item.pagePath.replace('pages/','')) > -1);

//保留当前页，跳转到应用内某个页面
let navigateTo = (url) => {
  checkForTabBar(tabBarUrl, url) ? switchTab(url) : kkd.navigateTo({
    url: url
  });
}

// 跳转到指定导航页面
let switchTab = (url) => {
  kkd.switchTab({
    url: url
  });
}

// 关闭当前页面，跳转到应用内的某个页面。
let redirectTo = (url) => {
  checkForTabBar(tabBarUrl.list, url) ? switchTab(url) : kkd.redirectTo({
    url: url
  });
}

//关闭当前所有页面，跳转到应用内的某个指定页面。
let reLaunch = (url) => {
  checkForTabBar(tabBarUrl, url) ? switchTab(url) : kkd.reLaunch({
    url: url
  });
}

// 关闭当前页面，返回上一级或多级页面
let navigateBack = (num) => {
  kkd.navigateBack({
    delta: num || 1
  })
}

module.exports = {
  navigateTo: navigateTo,
  redirectTo: redirectTo,
  switchTab: switchTab,
  reLaunch: reLaunch
}