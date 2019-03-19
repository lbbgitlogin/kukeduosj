// common/home-countdown/home-countdown.js
Component({
  externalClasses: ['cttitle', "time-box"],
  properties: {
    startTime: String || "",
    endTime: String || "",
    showType: Number || 0
  },
  data: {
    flag:true,//活动是否有效
    timeText: "", //展示的文字
    days: 0, //所剩天数
    hours: 0, //所剩小时
    minutes: 0, //所剩分钟
    seconds: 0 //所剩秒
  },
  ready: function() {
    var that = this;
    var clearIntervalTime=setInterval(function() {
        var resultData = that.timeFormat();
        // if (!resultData.flag) {
        //   clearInterval(clearIntervalTime);
        // }
        that.setData({
          flag: resultData.flag
        });
        that.setData({
          timeText: resultData.timeText,
          days: resultData.days, //所剩天数
          hours: resultData.hours, //所剩小时
          minutes: resultData.minutes, //所剩分钟
          seconds: resultData.seconds //所剩秒
        });
      }, 1000)
    
  },
  methods: {
    timeFormat: function() { //返回格式化时间
      var stime = Date.parse(new Date(this.data.startTime.replace(/-/g, "/"))), //开始时间时间戳
        etime = Date.parse(new Date(this.data.endTime.replace(/-/g, "/"))), //结束时间时间戳
        nowtime = Date.parse(new Date()), //当前时间时间戳
        difftime = etime - stime, //开始时间和结束时间的时间差
        resultData = {
          flag: true, //活动是否有效
          timeText: "已结束",
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        } //返回数据

      if (nowtime < stime) { //如果现在时间小于开始时间，表示【距离开始】
        resultData.timeText = "距开始";
        difftime = stime - nowtime; //开始时间减去，当前时间
      } else { //表示活动已经开始
        if (nowtime > etime) { //表示活动已结束
          resultData.timeText = "已结束";
          resultData.days ="00";
          resultData.hours = "00";
          resultData.minutes = "00";
          resultData.seconds = "00";
          resultData.flag = false;
        } else { //表示活动进行中
          resultData.timeText = "距结束";
          difftime = etime - nowtime;
        }
      }

      if (resultData.flag) { //活动没有结束的时候进行计算
        var days = Math.floor(difftime / (24 * 3600 * 1000));

        //计算出小时数
        var leave1 = difftime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));

        if (this.data.showType) {
          hours = days * 24 + hours;
        }

        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));

        //相差秒
        var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);

        resultData.days = days >= 10 ? days : `0${days}`;
        resultData.hours = hours >= 10 ? hours : `0${hours}`;
        resultData.minutes = minutes >= 10 ? minutes : `0${minutes}`;
        resultData.seconds = seconds >= 10 ? seconds : `0${seconds}`;
      }

      return resultData;
    }
  }
})