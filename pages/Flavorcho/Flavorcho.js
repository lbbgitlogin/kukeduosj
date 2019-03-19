// pages/Flavorcho/Flavorcho.js
var app = getApp()
var $ = require('../../utils/util.js');
var notice = require('../../utils/notice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose:[
      { name: "去冰"}, { name: "少冰"}, { name: "不吃辣"}, { name: "少放辣"}, { name: "多放辣"}, { name: "不吃蒜"}, { name: "不吃香菜"},
    ],
    checked: false,
    remarkLength: 0,
    index:0,
    indexfirstname:"",
    optidata:"",
    remarkLength2:0,
    remarkLength1:0,
    checked7: false,
    isshow:false,
    remark0: "",
    remark: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({ //获取本地缓存商家名
      key: "IdEntity001",
      success: function (res) {
        if(res.data.nextname[0] != ''){
          that.setData({
            remark: res.data.nextname[0],
            remarkLength2: res.data.nextname[0].length
          })
        }
        console.log("res",res)
        that.setData({
        indexfirstname: res.data.sidname
      })
   
        var thatList = that.data.choose;
        var thatList2 = that.data.indexfirstname;
        for (var item of thatList ) {
          for (var item2 of thatList2) {
            if (item2 == item.name) {
              
            if (item.state) {
              item.state = ""
              that.setData({
                choose: that.data.choose
              })
            } else {

       
                item.state = "2"
                that.setData({
                  choose: that.data.choose
                })
          
              console.log("that.data.remark0", that.data.choose)

            }
          }
        }
        }
      },
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },
  goback: function () {
    var IdEntity = {
      sidname: [],
      nextname:[]
    }
    var thatList = this.data.choose;
    for (var item of thatList){
      if (item.state == '2'){
        IdEntity.sidname.push(item.name)
       
      }
    }
    IdEntity.nextname.push(this.data.remark)
    // var IdEntity = this.data.remark + this.data.choose 
    console.log("打印返回", IdEntity)
     $.backpage(1, function() {
      notice.postNotificationName("RefreshOrder5", IdEntity);
       wx.setStorage({
         key: "IdEntity001",
         data: IdEntity
       })
    });
  },
  condition: function (e) {

      console.log("wwww", e)
      var thatList = this.data.choose;
   
      for (var item of thatList) {
        if (item.name == e.currentTarget.dataset.name) {
        if (item.state) {
          item.state = ""
          this.setData({
            choose: this.data.choose
          })
        }else{

          if (item.name == e.currentTarget.dataset.name) {
            item.state = "2"
            this.setData({
              choose: this.data.choose
            })
          }
          console.log("that.data.remark0", this.data.choose)

        }
      }
      }
  },
  inputRemark: function (e) {//输入参数

    this.setData({
      remark: e.detail.value,
      remarkLength1: e.detail.value.length,
      isshow:true
    });
    this.setData({
      remarkLength2: this.data.remarkLength + this.data.remarkLength1
    })
  
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})