exports.config = {
  GUID: '7b33dd14-b183-4d1e-8c96-04baf421498f',
  ASEkey: 'lnlqwynwmolymxnp',
  ASEIv: '8628800577744842',
  versionNumber: '1.9.0',
  //  configUrl: "http://localhost:33926/",
   configUrl: "https://wstest.soonku.net/", //正式
  //  configUrl: "https://ws.kukeduo.cn/",    //预发布
  // GUID: 'd39ebcfd-7d03-4ad2-9a64-3f6a23d1247d',
  // ASEkey: 'ewvuhvymrrerppsj',
  // ASEIv: '3778717345033638',
  // versionNumber: '1.9.0',
  //  configUrl: "https://wstest.soonku.net/", //测试
  tabBar: {
    "selectedColor": "#DB384C",
    "list": [{
        "pagePath": "pages/index/index",
        "iconPath": "img/tabBar1.png",
        "selectedIconPath": "img/tabBar_sel1.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/category/category",
        "iconPath": "img/tabBar2.png",
        "selectedIconPath": "img/tabBar_sel2.png",
        "text": "分类"
      },
      {
        "pagePath": "pages/cart/cart",
        "iconPath": "img/tabBar3.png",
        "selectedIconPath": "img/tabBar_sel3.png",
        "text": "购物车"
      },
      {
        "pagePath": "pages/UserCenter/UserCenter",
        "iconPath": "img/tabBar4.png",
        "selectedIconPath": "img/tabBar_sel4.png",
        "text": "我的"
      }
    ]
  }
}