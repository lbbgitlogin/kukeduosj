var app = getApp()
var $ = require('../../utils/util.js');

Page({
    data: {
        img: ""
    },
    formSubmit: function (e) {
        $.confirm("开始请求：formId"+e.detail.formId+"，opendid："+app.globalData.UserInfo.WeiXinOpenId);
        $.xsr("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx1ad5fed768e3e096&secret=cc5f7087fd62a153bf1a721813cad5a0", function (res) {
            var val = {
                url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.access_token
            }
            // $.xsr("https://api.weixin.qq.com/sns/userinfo?access_token=" + res.data.access_token + "&openid=" + app.globalData.UserInfo.WeiXinOpenId + "&lang=zh_CN" + res.data.access_token, function (res) {
            //     console.log("模板：", res);
            // })
            $.confirm("发送消息：access_token:"+res.data.access_token+"，opendid："+app.globalData.UserInfo.WeiXinOpenId);
            wx.request({
                url: val.url,
                method: "POST",
                data: {
                    touser: app.globalData.UserInfo.WeiXinOpenId,
                    template_id: 'gjTzlV-LmaHAGUCXBjICiBnbd2mFJdZ6Lz4MdejsuoY',
                    form_id: e.detail.formId,
                    data: {
                        "keyword1": {
                            "value": "339208499",
                            "color": "#173177"
                        },
                        "keyword2": {
                            "value": "20",
                            "color": "#173177"
                        },
                        "keyword3": {
                            "value": "2016年8月8日",
                            "color": "#173177"
                        },
                        "keyword4": {
                            "value": "2104-12-09 16:00",
                            "color": "#173177"
                        }
                    }
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    $.confirm("发送消息成功："+JSON.stringify(res));
                },
                fail: function (res) {
                    console.error("错误信息:", res);
                    $.confirm("发送消息失败："+JSON.stringify(res));
                }
            })
        },function(data){
            $.confirm("access_token获取失败："+JSON.stringify(data));
        });
    },
    getCode: function () {
        var that = this;
        $.xsr("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx1ad5fed768e3e096&secret=cc5f7087fd62a153bf1a721813cad5a0", function (res) {
            wx.request({
                url: "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=" + res.data.access_token,
                method: "POST",
                data: {
                    path: "pages/productdetail/productdetail?pid=16605",
                    width: 430
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    that.setData({
                        img: res.data
                    });
                },
                fail: function (res) {
                    console.error("错误信息:", res);
                }
            });

        });
    },
    sao: function () {
        wx.scanCode({
            success: function (data) {
                console.log("成功：", data);
            },
            fail: function (data) {
                console.log("失败：", data);
            }
        });
    }
})