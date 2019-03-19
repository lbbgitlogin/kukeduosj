var cf = require('../config.js');
var conf = require('./kkd-tj-conf.js'); (function () {
  var isuser = true;
  var N = App;
  App = function (t) {
    heavyLoad(t, "onLaunch", va_Launch);
    heavyLoad(t, "onHide", va_Hide);
    heavyLoad(t, "onError", va_Error);
    N(t)
  };
  var J = Page;
  Page = function (t) {
    heavyLoad(t, "onShow", vp_Show);
    if (typeof t["onShareAppMessage"] != "undefined") {
      c(t, "onShareAppMessage", VP_SharePage)
    }
    J(t)
  };
  function heavyLoad(t, a, e) {
    if (t[a]) {
      var s = t[a];
      t[a] = function (t) {
        e.call(this, t, a);
        s.call(this, t)
      }
    } else {
      t[a] = function (t) {
        e.call(this, t, a)
      }
    }
  };
  function heavyShare(t, a, e) {
    if (t[a]) {
      var s = t[a];
      t[a] = function (t) {
        e.call(this, [t, n]);
        s.call(this, t)
      }
    } else {
      t[a] = function (t) {
        e.call(this, t, a)
      }
    }
  }
  function c(t, a, e) {
    if (t[a]) {
      var s = t[a];
      t[a] = function (t) {
        var n = s.call(this, t);
        e.call(this, [t, n], a);
        return n
      }
    } else {
      t[a] = function (t) {
        e.call(this, t, a)
      }
    }
  }
  function va_Launch(t) {
    var that = this;
    this["kkd_tj"] = new g(this);
    var d = wx.getSystemInfoSync();
    var miniAccess = [];
    try {
      miniAccess = {
        ProductCode: conf.config.productCode,
        CustomerGuid: cf.config.GUID,
        MiniAccessGuid: newGuid(),
        TimeStamp: Date.now(),
        SourceNumber: t.scene,
        AccessPagePath: t.path,
        Brand: d["brand"],
        Model: d["model"],
        PixelRatio: d["pixelRatio"],
        WXVersion: d["version"],
        WXSystem: d["system"],
        PlatForm: d["platform"],
        SDKVersion: typeof d["SDKVersion"] === "undefined" ? "1.0.0" : d["SDKVersion"],
        WXSystemInfo: JSON.stringify(d),
        MiniVersion: cf.config.versionNumber,
        TJ_Version: conf.tjVersion,
        ScreenWidth: d["screenWidth"],
        ScreenHeight: d["screenHeight"],
        Latitude: "",
        Longitude: "",
        Speed: ""
      }
    } catch (t) {
      miniAccess = {
        ProductCode: conf.config.productCode,
        CustomerGuid: cf.config.GUID,
        MiniAccessGuid: newGuid(),
        TimeStamp: Date.now(),
        SourceNumber: t.scene,
        AccessPagePath: t.path,
        WXSystemInfo: JSON.stringify(d),
        MiniVersion: cf.config.versionNumber,
        TJ_Version: conf.tjVersion,
        Latitude: "",
        Longitude: "",
        Speed: ""
      }
    }
    that.mini_access = miniAccess;
    that.mini_launchData = t;
    wx.getNetworkType({
      success: function (res) {
        miniAccess.NetworkType = res.networkType;
        that.mini_access = miniAccess;
        sendRequst(miniAccess, "MiniAccessLog")
      }
    })
  };
  function va_Hide(t) {
    var s = getApp();
    var data = {
      MiniAccessGuid: s.mini_access.MiniAccessGuid,
      TimeStamp: Date.now(),
      SerialNumber: s.mini_access.SerialNumber
    };
    sendRequst(data, "CloseMiniPageAccessLog")
  }
  function vp_Show(t, a) {
    var t = this.options;
    var r = this;
    var s = getApp();
    if (s.mini_access.SerialNumber === undefined) {
      s.mini_access.SerialNumber = 1
    } else {
      s.mini_access.SerialNumber++
    }
    var guid = "";
    if (t != undefined && typeof t["ShareGuid"] != undefined) {
      guid = t["ShareGuid"]
    }
    var data = {
      MiniAccessGuid: s.mini_access.MiniAccessGuid,
      ProductCode: conf.config.productCode,
      CustomerGuid: cf.config.GUID,
      MemberGuid: s.mini_access.MemberGuid,
      TimeStamp: Date.now(),
      SerialNumber: s.mini_access.SerialNumber,
      ShareGuid: guid,
      AccessPagePath: r.__route__,
      PageParameter: r.options != null && r.options != {} ? JSON.stringify(r.options) : '',
      Latitude: "",
      Longitude: "",
      Speed: ""
    };
    if (s.mini_access.Latitude != null && s.mini_access.Latitude != "" && s.mini_access.Latitude!=undefined){
      sendRequst(data, "MiniPageAccessLog");
      return;
    }
     
    wx.getSetting({
      success:function(res){
        if (res != null && res.errMsg == "getSetting:ok" && res.authSetting["scope.userLocation"])
        {
           wx.getLocation({
              type: "wgs84",
              success: function (t) {
                data.Latitude = t["latitude"];
                data.Longitude = t["longitude"];
                data.Speed = t["speed"];
                s.mini_access.Latitude = t["latitude"];
                s.mini_access.Longitude = t["longitude"];
                s.mini_access.Speed = t["speed"];
                sendRequst(data, "MiniPageAccessLog");
              },
              fail:function(){
                sendRequst(data, "MiniPageAccessLog");
              }
            });
        }
        else
          sendRequst(data, "MiniPageAccessLog");
      },
      fail:function(){
        sendRequst(data, "MiniPageAccessLog");
      }
    })
    
  };
  function VP_SharePage(t, a) {
    var s = this;
    if (typeof t == "undefined") {
      return
    }
    if (typeof t[1] == "undefined") {
      return
    }
    if (!t[1].path || t[1].path === "undefined") {
      t[1].path = s["__route__"]
    }
    var guid = newGuid();
    if (t[1].path.indexOf("?") != -1) {
      t[1].path += "&ShareGuid=" + guid
    } else {
      t[1].path += "?ShareGuid=" + guid
    }
    share_OK(s, guid);
    return t[1]
  };
  function share_OK(obj, guid) {
    var s = getApp();
    var hierarchy = 1;
    try {
      if (s.mini_launchData != undefined && s.mini_launchData.query != undefined && s.mini_launchData.query.ShareGuid != undefined && obj.__route__ == s.mini_launchData.path) {
        hierarchy = 2
      }
    } catch (t) {
      hierarchy = 1
    }
    var data = {
      MiniAccessGuid: s.mini_access.MiniAccessGuid,
      ProductCode: conf.config.productCode,
      CustomerGuid: cf.config.GUID,
      MemberGuid: s.mini_access.MemberGuid,
      ShareGuid: guid,
      AccessPagePath: obj.__route__,
      ShareMode: 1,
      ShareHierarchy: hierarchy,
      SerialNumber:s.mini_access.SerialNumber,
      ParentShareGuid: hierarchy == 2 ? s.mini_launchData.query.ShareGuid : ""
    };
    sendRequst(data, "AddSharePageAccess")
  }
  function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) guid += "-"
    }
    return guid
  };
  function sendRequst(d, method) {
    switch (arguments.length) {
      case 2:
        wx.request({
          url:
          conf.config.url + "MiniApp/AccessLog.asmx/" + method + "?V=" + conf.config.tjVersion,
          data: {
            data: JSON.stringify(d)
          },
          header: {
            'content-type': 'application/json'
          },
          method: "POST",
          success: function (res) { },
        });
        break;
      case 3:
        var callback = arguments[2];
        wx.request({
          url: conf.config.url + "MiniApp/AccessLog.asmx/" + method + "?V=" + conf.config.tjVersion,
          data: {
            data: JSON.stringify(d)
          },
          header: {
            'content-type': 'application/json'
          },
          method: "POST",
          success: function (res) {
            callback(JSON.parse(res.data.d))
          },
        });
        break;
      default:
    }
  }
  function SyscUser(memberGuid) {
    var s = getApp();
    s.mini_access.MemberGuid = memberGuid;
    if (isuser) {
      isuser = false;
      var data = {
        MiniAccessGuid: s.mini_access.MiniAccessGuid,
        ProductCode: conf.config.productCode,
        CustomerGuid: cf.config.GUID,
        MemberGuid: s.mini_access.MemberGuid,
      };
      sendRequst(data, "MiniMemberInfoUpdateMemberGUID",
        function (res) {
          if (res.Code != 0) {
            isuser = true
          }
        })
    }
  }
  function g(t) {
    this.app = t
  }
  g.prototype["SyscUser"] = function (t) {
    SyscUser(t)
  };
  function va_Error(t, a) {
    var s = getApp();
    var data = {
      MiniAccessGuid: s.mini_access.MiniAccessGuid,
      ProductCode: conf.config.productCode,
      CustomerGuid: cf.config.GUID,
      MemberGuid: s.mini_access.MemberGuid,
      ProductVersion: cf.config.versionNumber,
      WXVersion: s.mini_access.WXVersion,
      WXSystem: s.mini_access.WXSystem,
      PlatForm: s.mini_access.PlatForm,
      SDKVersion: s.mini_access.SDKVersion,
      ErrorLog: t,
    };
    sendRequst(data, "AddErrorLog")
  }
})();