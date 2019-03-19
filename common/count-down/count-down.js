var $ = require('../../utils/util.js'); 
Component({
  properties: {
    millisecond: Number || 1,
    Type: Number || 0
  },
  data: {
    time: ""
  },
  ready: function () {
    var thatSecond = this.data.millisecond;
    var that = this;

    setInterval(function () {
      thatSecond = thatSecond - 1000;
      if (thatSecond <= 0) {
        clearInterval()
        var d = "00",
          h = "00",
          m = "00",
          s = "00";
        if (that.data.Type == 2) {
          if (d == '00') {
            that.setData({
              time: h + ":" + m + ":" + s
            });
          } else {
            that.setData({
              time: d + "天" + h + ":" + m + ":" + s
            });
          }
        } else {
          if (d == '00') {
            that.setData({
              time: (that.data.Type == 0 ? "距开始" : "仅剩") + " " + h + ":" + m + ":" + s
            });
          } else {
            that.setData({
              time: (that.data.Type == 0 ? "距开始" : "仅剩") + " " + d + "天" + h + ":" + m + ":" + s
            });
          }
        }

      } else {
        var d = $.doubleNum(Math.floor(thatSecond / 1000 / 60 / 60 / 24)),
          h = $.doubleNum(Math.floor(thatSecond / 1000 / 60 / 60 % 24)),
          m = $.doubleNum(Math.floor(thatSecond / 1000 / 60 % 60)),
          s = $.doubleNum(Math.floor(thatSecond / 1000 % 60));
        if (that.data.Type == 2) {

          if (d == '00') {
            that.setData({
              time: h + ":" + m + ":" + s
            });
          } else {
            that.setData({
              time: d + "天" + h + ":" + m + ":" + s
            });
          }
        } else {

          if (d == '00') {
            that.setData({
              time: (that.data.Type == 0 ? "距开始" : "仅剩")+" " + h + ":" + m + ":" + s
            });
          } else {
            that.setData({
              time: (that.data.Type == 0 ? "距开始" : "仅剩")+" " + d + "天" + h + ":" + m + ":" + s
            });
          }
        }
      }
    }, 1000);


  }
})