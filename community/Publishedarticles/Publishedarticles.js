var app = getApp()
var $ = require('../../utils/util.js');
var capi = require('../../api/community.js');
var notice = require('../../utils/notice.js');
var picPath = [];
var Interval
Page({
  data: {
    postTitle: "",
    postContent: "",
    postContentVal: "",
    plateId: 0,
    PostsPlateList: [],
    ImgList: [],
    sortList: [],
    shopback: [],
    caogaolist: [],
    proLista: [],
    objlist: [],
    tiaozhuan: true,
    shuaxin: true,
    count: 0,
    uploadFile: true,
    bdpicPath: [],
    postTitle2: '',
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        if (res.data) {
          that.getStorage(res)
        } else {
          picPath = [];
          //获取可以发布帖子的版块
          // that.GetDraftDetail()
          
        }
      }
    })
    notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);
    that.GetPostsPlateList();
  },
  getStorage: function (res) {
    var that = this;
    console.log(res.data)
    var res = JSON.parse(res.data)
    console.log(res)
    var obj = []
    for (var i = 0; i < res.PostImgList.length; i++) {
      obj.push({
        Url: res.PostImgList[i],
        order: i
      });
    }
    picPath = obj;
    that.setData({
      postTitle: res.PostTitle,
      ImgList: obj,
      shopback: that.data.shopback.concat(res.proList),
      plateId: res.PlateId,
      postContent: res.PostContent

    });

    picPath = [];
    //获取可以发布帖子的版块
    // that.GetDraftDetail()
    that.GetPostsPlateList();
    // notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);

  },
  onHide: function () {
    clearInterval(Interval)
  },
  onShow: function () {
    var that = this;
    var count = 0

    Interval = setInterval(function () {
      that.zdSaveDraft()
    }, 30000);
  },

  onUnload: function () {
    clearInterval(Interval)
  },
  RefreshCoupon: function (info) {//刷新优惠券
    console.log('info',info)
    if (this.data.shopback.length == 0) {
      this.setData({
        shopback: info.couponItemId
      });
    } else {
      var aa = [];
      aa = this.data.shopback;
      //移除相同的
      for (var i = 0; i < aa.length; i++) {
        for (var j = 0; j < info.couponItemId.length; j++) {
          //console.log(aa[i]);
          if (aa[i].ProductId == info.couponItemId[j].ProductId) {
            aa.splice(i, 1);
          }
        }
      }
      //添加新选择的
      for (var j = 0; j < info.couponItemId.length; j++) {
        aa.push(info.couponItemId[j]);
      }
      this.setData({
        shopback: aa
      });
      console.log(this.data.shopback)
    }
  },
  GetPostsPlateList: function () {  //获取可以发布帖子的版块：
    var that = this;
    var val = {
      OperateId: app.globalData.VendorInfo.Id
    }
    $.xsr($.makeUrl(capi.GetPostsPlateList, val), function (res) {
      // console.log(res)
      if (res.Code == 0) {
        that.setData({
          PostsPlateList: res.Info
        });
      }
    });
  },
  inputpostTitle: function (e) {//输入标题
    this.setData({
      postTitle: e.detail.value
    });
  },
  bindinputpostTitle: function (e) {//输入标题
    this.setData({
      postTitle2: this.data.postTitle
    });
  },
  inputpostContent: function (e) {//输入内容
    this.setData({
      postContentVal: e.detail.value
    });
  },
  bindTextAreaBlur: function () {
    var that = this;
    this.setData({
      postContent: that.data.postContentVal
    });
  },
  ChoosePlate: function (e) {//选择版块
    this.setData({
      plateId: e.target.id
    });
  },
  UploadImg: function () {  //发布帖子上传图片接口
    var that = this;
    //console.log(picPath);
    //console.log(that.data.ImgList);
    //console.log(that.data.sortList);
    var count = 9;//还可以上传图片数量
    if (!$.isNull(that.data.ImgList)) {
      count = 9 - that.data.ImgList.length;
    }
    if (count == 0) {
      $.alert("最多上传9张图片！");
      return;
    }
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var coun = that.data.ImgList.length
        var tempFilePaths = res.tempFilePaths;//这里是选好的图片的地址，是一个数组
        var arr = [];
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: capi.UploadImgNew.url, //仅为示例，非真实的接口地址
            method: "POST",
            filePath: tempFilePaths[i],
            name: 'filesBytes',
            formData: {
              'user': i + coun,
              'vendorId': app.globalData.VendorInfo.Id, 
            },
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (res) {
              console.log(res)
              console.log(res.data)
              var aa = JSON.parse(res.data)
              console.log(aa);


              var data = $.parseJSON(res.data);
              picPath.push(data.Info);
              var length = picPath.length;
              for (var i = length - 1; i > 0; i--) { //用于缩小范围
                for (var j = 0; j < i; j++) { //在范围内进行冒泡，在此范围内最大的一个将冒到最后面
                  if (picPath[j].order > picPath[j + 1].order) {
                    var temp = picPath[j];
                    picPath[j] = picPath[j + 1];
                    picPath[j + 1] = temp;
                  }
                }
              }
              that.setData({
                ImgList: picPath,
              });

            },
            fail: function (res) {
            },
            complete: function (res) {
            }
          })

        }
        //console.log(that.data.ImgList);
      }, fail: function (res) {
      },
      complete: function (res) {
      }
    })
  },
  delImg: function (e) {//删除图片
    var that = this;
    $.confirm("是否放弃上传本张图片?", function (res) {
      if (res.confirm) {
        var pPic = that.data.ImgList;

        //console.log(e);
        //console.log(pPic);
        var newArray = [];
        picPath = [];
        for (var j in pPic) {
          if (j != e.target.dataset.index) {
            newArray.push(pPic[j]);
            picPath.push(pPic[j]);
          }
        }


        //console.log("删除", newArray);
        that.setData({
          ImgList: newArray,
        });
      }
    }, true);
  },
  AddMemberPosts: function () {  //发布帖子接口
    var that = this;

    if (19 < that.data.postTitle.length || that.data.postTitle.length < 3) {
      $.alert("标题在3~18字内");
      return
    }

    if (that.data.postContent.length < 5) {
      $.alert("内容在5~3000字内");
      return
    }

    if (that.data.plateId == 0) {
      wx.showToast({
        title: '请选择板块',
        icon: 'success',
        duration: 2000
      })
      return
    }



    var sort = [];
    if (!$.isNull(that.data.postContent)) {
      sort.push(0);
    }
    var photoarr = [];
    if (!$.isNull(that.data.ImgList)) {
      for (var i = 0; i < that.data.ImgList.length; i++) {
        sort.push(i + 1);
        photoarr.push(that.data.ImgList[i].Url);
      }
    }
    that.setData({
      sortList: sort
    });
    //console.log(that.data.sortList)

    var obj = []
    //console.log(this.data.shopback)

    for (var i = 0; i < this.data.shopback.length; i++) {
      obj.push(this.data.shopback[i].ProductId)
    }
    that.setData({
      objlist: obj
    })
    if (that.data.tiaozhuan == true) {
      that.setData({
        tiaozhuan: false,
      })

      //console.log("参数", val);
      var val = {
        UserId: app.globalData.UserInfo.Id,
        OperateId: app.globalData.VendorInfo.Id,
        PlateId: that.data.plateId,
        PostTitle: that.data.postTitle,
        PostContent: that.data.postContent,
        //PostImgList: that.data.ImgList || [],
        PostImgList: photoarr || [],
        SortList: that.data.sortList,
        proList: that.data.objlist || []
      }

      $.clearxsr($.makeUrl(capi.AddMemberPosts, val), function (res) {
        // console.log("发布帖子接口", res);

        if (res.Code == "0") {

          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 3000
          })
          clearTimeout(time);
          var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
            that.setData({
              postTitle: "",
              postContent: "",
              plateId: 0,
              PostsPlateList: [],
              ImgList: [],
              sortList: [],
              shopback: [],
              caogaolist: [],
              proLista: [],
              objlist: [],
              postTitle2:''
            })
            picPath = [];
            // wx.redirectTo({
            //   url: '',
            // })
            wx.switchTab({
              url: '../../pages/DIYcontent/DIYcontent',
            })
          }, 1500);
          wx.removeStorage({
            key: 'key',
            success: function (res) {
              console.log(res.data)
            }
          })
        }
        else {
          $.alert(res.Msg);
          that.setData({
            tiaozhuan: true,
          })
        }

      });
    }

  },
  SaveDraft: function () {   //保存草稿
    var that = this;
    var sort = [];
    if (!$.isNull(that.data.postContent)) {
      sort.push(0);
    }
    var photoarr = [];
    if (!$.isNull(that.data.ImgList)) {
      for (var i = 0; i < that.data.ImgList.length; i++) {
        sort.push(i + 1);
        photoarr.push(that.data.ImgList[i].Url);
      }
    }
    that.setData({
      sortList: sort
    });
    var obj = []
    //console.log(this.data.shopback)

    for (var i = 0; i < this.data.shopback.length; i++) {
      obj.push(this.data.shopback[i])
    }
    that.setData({
      objlist: obj
    })

    var val = {
      UserId: app.globalData.UserInfo.Id,
      OperateId: app.globalData.VendorInfo.Id,
      PlateId: that.data.plateId || 0,
      PostTitle: that.data.postTitle,
      PostContent: that.data.postContent,
      //PostImgList: that.data.ImgList || [],
      PostImgList: photoarr || [],
      SortList: that.data.sortList,
      proList: that.data.objlist || []
    }
    var st = JSON.stringify(val);

    wx.setStorage({
      key: "key",
      data: st
    })
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    })
    // $.xsr($.makeUrl(capi.SaveDraft, val), function (res) {
    //   console.log("保存草稿接口", res);
    //   if (res.Code == "0") {
    //     // picPath = [];
    //     wx.showToast({
    //       title: '保存成功',
    //       icon: 'success',
    //       duration: 1500
    //     })

    //   }
    //   else {
    //     $.alert(res.Msg);
    //   }
    // });
  },
  zdSaveDraft: function () {   //自动保存草稿
    var that = this;
    var sort = [];
    if (!$.isNull(that.data.postContent)) {
      sort.push(0);
    }
    var photoarr = [];
    if (!$.isNull(that.data.ImgList)) {
      for (var i = 0; i < that.data.ImgList.length; i++) {
        sort.push(i + 1);
        photoarr.push(that.data.ImgList[i].Url);
      }
    }
    that.setData({
      sortList: sort
    });
    var obj = []
    //console.log(this.data.shopback)

    for (var i = 0; i < this.data.shopback.length; i++) {
      obj.push(this.data.shopback[i])
    }
    that.setData({
      objlist: obj
    })

    var val = {
      UserId: app.globalData.UserInfo.Id,
      OperateId: app.globalData.VendorInfo.Id,
      PlateId: that.data.plateId,
      PostTitle: that.data.postTitle,
      PostContent: that.data.postContent,
      //PostImgList: that.data.ImgList || [],
      PostImgList: photoarr || [],
      SortList: that.data.sortList,
      proList: that.data.objlist || []
    }
    var st = JSON.stringify(val);
    wx.setStorage({
      key: "key",
      data: st
    })

    // $.clearxsr($.makeUrl(capi.SaveDraft, val), function (res) {
    //   //console.log("发布帖子接口", res);
    //   if (res.Code == "0") {
    //     // picPath = [];
    //     that.setData({
    //       shuaxin: true
    //     })
    //   }
    //   else {
    //   }
    // });
  },
  shopsearch: function () {   //提到的商品
    wx.navigateTo({
      url: '../searchsq/searchsq?num=' + (4 - this.data.shopback.length),
    })
  },
  // GetDraftDetail: function () {   //获取草稿
  //   var that = this;
  //   var val = {
  //     UserId: app.globalData.UserInfo.Id,
  //     OperateId: app.globalData.VendorInfo.Id,
  //   }
  //   //console.log("参数", val);
  //   $.xsr($.makeUrl(capi.GetDraftDetail, val), function (res) {
  //     // console.log(res)
  //     if (res.Code == "0") {
  //       var obj = []
  //       for (var i = 0; i < res.Info.pathList.length; i++) {
  //         obj.push({
  //           Url: res.Info.pathList[i].ImgPath,
  //           order: i
  //         });
  //       }
  //       picPath = obj;
  //       // console.log(that.data.ImgList)
  //       that.setData({
  //         postTitle: res.Info.PostsTitle,
  //         ImgList: obj,
  //         shopback: that.data.shopback.concat(res.Info.productList),
  //         plateId: res.Info.PostsPlateId
  //       });

  //       if (!$.isNull(res.Info.contentList)) {
  //         that.setData({
  //           postContent: res.Info.contentList[0].PostsContent,
  //         });
  //       } else {
  //         that.setData({
  //           postContent: '',
  //         });
  //       }
  //     }
  //   });
  // },
  delshopImg: function (e) {
    var that = this;
    $.confirm("是否放弃选择该商品?", function (res) {
      if (res.confirm) {
        var dataset = e.target.dataset;
        var Index = dataset.index; //拿到是第几个数组

        that.data.shopback.splice(Index, 1);

        that.setData({
          shopback: that.data.shopback
        });
      }
    }, true);
  }

})