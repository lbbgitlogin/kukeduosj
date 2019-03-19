var app = getApp();
var $ = require('../../utils/util.js');
var userapi = require('../../api/userAPI.js');
Page({
    data: {
        remark: "",
        remarkLength: 0,
        wechat_id: '',
        Email: '',
        platform: ''
    },
      
    onLoad: function () {
        this.setData({
            Email: $.isNull(app.globalData.UserInfo.Email) ? '' : app.globalData.UserInfo.Email
        });
        try {
            var res = wx.getSystemInfoSync();
            this.setData({
                platform: res.platform
            });
        } catch (e) {
            console.log(e);
        }
    },
    inputwechat: function (e) {
        this.setData({
            wechat_id: e.detail.value
        });
    },
    inputemail: function (e) {
        this.setData({
            Email: e.detail.value
        });
    },
    inputRemark: function (e) {//输入参数
        this.setData({
            remark: e.detail.value,
            remarkLength: e.detail.value.length
        });
    },

    submitdata: function () { //提交数据
        if ($.isNull(this.data.remark)) {
            $.alert("请输入您宝贵的意见");
            return;
        }

        var val = {
            MiniAppVersion: "",
            Wechat: this.data.wechat_id,
            Suggestion: this.data.remark,
            Platform: this.data.platform,
            Email: this.data.Email,
            UserName: app.globalData.UserInfo.UserName
        }
        $.xsr($.makeUrl(userapi.AddMiniUserSuggestion, val), function (data) {
            if (data.Code == 0) {
                $.alert("提交成功！");
                setTimeout(function () {
                    $.backpage(1, function () {
							
						});
                }, 1000);
            } else {
                $.alert(data.Msg);
            }
        });
    }

})