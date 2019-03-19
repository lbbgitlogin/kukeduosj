var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');

var dataInfo = {};
Page({
    data: {
        CommentInfo: {},
        CommentImgList: [],
        isDisable: true,
        show:false,
        Info:""
    },
    onLoad: function (options) {
        var that = this;
        // 生命周期函数--监听页面加载
        var val = {
            OrderNum: options.od,
            VendorId: app.globalData.VendorInfo.Id,
            UserId: app.globalData.UserInfo.Id
        }
        $.xsr($.makeUrl(orderapi.getProductComment, val), function (res) {
          console.log("pl",res)
            if (res.Code == 0) {
                dataInfo = res.Info;
                dataInfo.OrderNum = options.od;
                dataInfo.UserId = val.UserId;
                dataInfo.VendorId = val.VendorId;
                for (var i in dataInfo.ProductCommentList) {
                    dataInfo.ProductCommentList[i].Title = app.globalData.UserInfo.Photo;
                    dataInfo.ProductCommentList[i].Account_User = app.globalData.UserInfo.NickName;
                    if (dataInfo.ProductCommentList[i].ProductCommentId > 0) {
                        that.setData({
                            isDisable: false
                        });
                    }
                }
                that.setData({
                    CommentInfo: dataInfo
                });
            }
        });
    },
    ServiceStart: function (e) {//服务评分
        if (e.target.dataset.type == 1) {
            dataInfo.VendorScore = e.target.dataset.index;
        } else if (e.target.dataset.type == 2) {
            dataInfo.Logisticsservice = e.target.dataset.index;
        } else {
            for (var i in dataInfo.ProductCommentList) {
              if (dataInfo.ProductCommentList[i].SkuId == e.target.dataset.id) {
                    dataInfo.ProductCommentList[i].Grade = e.target.dataset.index;
                }
            }
        }
        this.setData({
            CommentInfo: dataInfo
        });
    },
    inputOpinion: function (e) {
        for (var i in dataInfo.ProductCommentList) {
          if (dataInfo.ProductCommentList[i].SkuId == e.target.dataset.id) {
                dataInfo.ProductCommentList[i].CommentInfo = e.detail.value;
            }
        }
        this.setData({
            CommentInfo: dataInfo
        });
    },
    upImgs: function (e) {//上传图片
        var that = this;

        for (var i in dataInfo.ProductCommentList) {
          if (dataInfo.ProductCommentList[i].SkuId == e.target.dataset.id) {
                if (dataInfo.ProductCommentList[i].CommentPicList.length == 9) {
                    $.alert("最多上传9张图片！");
                    return;
                }
            }
        }
        $.loading();
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            success: function (res) {
                $.loading();
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: orderapi.upProductCommentImg.url, //仅为示例，非真实的接口地址
                    method: "POST",
                    filePath: tempFilePaths[0],
                    name: 'filesBytes',
                    formData: {
                      'vendorId': app.globalData.VendorInfo.Id,
                    },
                    header: {
                        'content-type': 'multipart/form-data'
                    },
                    success: function (res) {
                        $.hideloading();
                        var data = $.parseJSON(res.data);
                        for (var i in dataInfo.ProductCommentList) {
                          if (dataInfo.ProductCommentList[i].SkuId == e.target.dataset.id) {
                                var obj = {
                                    Path: data.Info
                                }
                                dataInfo.ProductCommentList[i].CommentPicList.push(obj);
                            }
                        }
                        that.setData({
                            CommentInfo: dataInfo
                        });
                    },
                    fail: function (res) {
                        $.hideloading();
                    },
                    complete: function (res) {
                        $.hideloading();
                    }
                })
            },
            fail: function (res) {
                $.hideloading();
            },
            complete: function (res) {
                $.hideloading();
            }
        })
    },
    delImg: function (e) {//删除评论图片
        var that = this;
        $.confirm("是否放弃上传本张图片?", function (res) {
            if (res.confirm) {
                for (var i in dataInfo.ProductCommentList) {
                  if (dataInfo.ProductCommentList[i].SkuId == e.target.dataset.id) {
                        var newArray = [];
                        for (var j in dataInfo.ProductCommentList[i].CommentPicList) {
                            if (j != e.target.dataset.index) {
                                var obj = {
                                    Path: dataInfo.ProductCommentList[i].CommentPicList[j].Path
                                }
                                newArray.push(obj);
                            }
                        }
                        dataInfo.ProductCommentList[i].CommentPicList = newArray;
                    }
                }
                that.setData({
                    CommentInfo: dataInfo
                });
            }
        }, true);
    },
    submitComment: function (e) {//提交评论
        var thisobj=this
        for (var i in dataInfo.ProductCommentList) {
            if ($.isNull(dataInfo.ProductCommentList[i].Grade)) {
                $.alert("请对您购买的商品进行评分!");
                return;
            }
        }
        if ($.isNull(dataInfo.VendorScore)) {
            $.alert("亲~请针对我们的服务给一个评分!");
            return;
        }
        if ($.isNull(dataInfo.Logisticsservice)) {
            $.alert("亲~请针对我们的物流给一个评分!");
            return;
        }
        $.confirm("是否发表评价?", function (res) {
            if (res.confirm) {
                var val = {
                    Logisticsservice: dataInfo.Logisticsservice,
                    OrderNum: dataInfo.OrderNum,
                    UserId: dataInfo.UserId,
                    VendorId: dataInfo.VendorId,
                    VendorScore: dataInfo.VendorScore,
                    ProductCommentList: dataInfo.ProductCommentList
                }
                $.xsr($.makeUrl(orderapi.sendProductComment, val), function (res) {
                    if (res.Code == 0) {
                        $.alert("发表成功！", function () {
                          thisobj.setData({
                            show: true,
                            Info: res.Info
                          })
                          setTimeout(function () {
                              thisobj.setData({
                                show: false
                              })
                            }, 2000);
                            setTimeout(function () {
                                $.backpage(1);
                            }, 2000);
                        });
                    }
                });
            }
        }, true)
    },
    ImgTap: function (e) {
      var that = this;
      var imageUrls = [];
      for (var i in this.data.CommentInfo.ProductCommentList) {
        if (this.data.CommentInfo.ProductCommentList[i].SkuId == e.target.dataset.id){
          for (var j in this.data.CommentInfo.ProductCommentList[i].CommentPicList){
            imageUrls.push(this.data.CommentInfo.ProductCommentList[i].CommentPicList[j].Path);
          }
        }
      }

      var nowImgUrl = e.target.dataset.src;
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: imageUrls // 需要预览的图片http链接列表
      })
    }
})