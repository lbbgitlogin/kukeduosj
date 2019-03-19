var app = getApp()
var $ = require('../../utils/util.js');
var pdapi = require('../../api/productAPI.js');
var fgapi = require('../../api/fightGroups.js');
Page({
	data: {
		viewtype: 1,
		pdlist: [], //商品列表
		fglist: [],//已拼团商品列表
		sort: 2, //排序方式
		flag: false, //是否可以进行下次分页
		ispage: false, //是否还有数据
		scposition: "", //滚动条位置
		istop: false,
		isdata: false, //是否存在数据
		isFG: false,//是否为拼团列表
		post: { //请求数据
			vendorId: 1, //排序条件
			orderByType: 2, //排序方式方式，默认降序
			isNew: false, //是否是上新商品
			productName: "", //商品名称
			shopProductCategoryId: 0, //分类ID
			pageNumber: 1 //当前页
		},
    isData:true,
    isnav: true,
    screenHeight: 0,
    isquicknav: false
	},
	onLoad:function(options) {
    
    var that = this;
    if ($.isNull(app.globalData.UserInfo)) {
      app.GetUserInfo(function () {
        that.setData({
          Currency: app.globalData.VendorInfo.Currency
        })
        that.load(options)
      }, options.uid);
    } else {
      that.setData({
        Currency: app.globalData.VendorInfo.Currency
      })
      that.load(options)
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
  load: function (options){
    var that = this;
    wx.setNavigationBarTitle({
      title: "预约列表"
    })
    this.setData({
      post: {
        vendorId: app.globalData.VendorInfo.Id,
        orderByType: 1, //排序条件
        isNew: false, //是否是上新商品
        sortDirection: 2, //排序方式方式，默认降序
        productName: options.pname || "", //商品名称
        shopProductCategoryId: options.cid || 0, //分类ID
        pageNumber: 1 //当前页

      }
    });
    this.GetPlist(function () {
      if (that.data.pdlist.length == 0) {
        that.setData({
          isdata: false
        });
      } else {
        that.setData({
          isdata: true
        });
      }
    });
  },
	viewType:function(event) {
		if (this.data.viewtype == 0) {
			this.setData({
				viewtype: 1
			})
		} else {
			this.setData({
				viewtype: 0
			})
		}
	},
	sealnum:function() { //根据销量排序
		this.setData({
			pdlist: [],
			post: {
				vendorId: app.globalData.VendorInfo.Id,
				orderByType: 1,
				sortDirection: 2,
				isNew: false, //是否是上新商品
				productName: this.data.post.pname,
				shopProductCategoryId: this.data.post.cid,
				pageNumber: 1,
			},
      isData: true
		});
		this.GetPlist(); //根据销量查询商品
	},
	newpd:function() { //根据上架时间排序
		this.setData({
			pdlist: [],
			post: {
				vendorId: app.globalData.VendorInfo.Id,
				orderByType: 2,
				sortDirection: 2,
				isNew: false, //是否是上新商品
				productName: this.data.post.pname,
				shopProductCategoryId: this.data.post.cid,
				pageNumber: 1
			},
      isData: true
		});
		this.GetPlist(); //根据上架时间查询商品
	},
	pdprice:function() { //根据价格排序
		if (this.data.sort == 1) {
			this.setData({
				sort: 2,
				pdlist: [],
				post: {
					vendorId: app.globalData.VendorInfo.Id,
					orderByType: 3,
					sortDirection: 2,
					isNew: false, //是否是上新商品
					productName: this.data.post.pname,
					shopProductCategoryId: this.data.post.cid,
					pageNumber: 1
				},
        isData: true
			});
		} else {
			this.setData({
				pdlist: [],
				sort: 1,
				post: {
					vendorId: app.globalData.VendorInfo.Id,
					orderByType: 3,
					sortDirection: 1,
					isNew: false, //是否是上新商品
					productName: this.data.post.pname,
					shopProductCategoryId: this.data.post.cid,
					pageNumber: 1
				},
        isData: true
			});
		}
		this.GetPlist(); //根据价格排序
	},
	scrollbottom:function(even) { //滚动到底部进行分页
		if (this.data.flag) { //判断是否可以进行下次分页
			var thisobj = this;
      thisobj.setData({
        flag: false
      });
			clearTimeout(time);
			var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
				thisobj.setData({
					post: {
						vendorId: app.globalData.VendorInfo.Id,
						orderByType: thisobj.data.post.orderByType,
						sortDirection: thisobj.data.post.sort,
						productName: thisobj.data.post.pname,
						isNew: false, //是否是上新商品
						shopProductCategoryId: thisobj.data.post.cid,
						pageNumber: parseInt(thisobj.data.post.pageNumber) + 1
					}
				});
				thisobj.GetPlist(); //根据价格排序
			}, 500);
		}
	},
	GetPlist:function(callblack) { //获取商品列表统一方法
		var thisObj = this;
		$.xsr($.makeUrl(pdapi.GetServiceProductList, this.data.post), function (res) {
			if (res.Info.length > 0) {
        thisObj.setData({
          isData: true
        })
        if (res.Info.length < 10) {
					thisObj.setData({
						pdlist: thisObj.data.pdlist.concat(res.Info),
						flag: false,
						ispage: false
					});
				} else {
					thisObj.setData({
						pdlist: thisObj.data.pdlist.concat(res.Info),
            flag: true,
            ispage: true,
					});
				}
			} else {
				thisObj.setData({
					flag: false,
					ispage: false,
				});
			}
      if ($.isNull(res.Info) && res.Code == 0 && thisObj.data.pageNumber == 1) {
        thisObj.setData({
          isData: false
        })
      }
			callblack && callblack();
		});
	},
	returnTop:function() { //返回顶部
		this.setData({
			scposition: 0
		});
	},
  scrolltoupper: function (e) {
    console.log(e)
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