var app = getApp();
Component({
  properties: {
    MessageType: Number || 3,//1.普通消息，立即发送；2.支付消息，立即发送并且记录次数；3.普通消息记录；
    TplKey: String || "",//固定消息类型，记录类型不需要
    TplData: Array || "",//传输数据,数组，对应发送的模版字段，记录类型不需要
    PageUrl:String || ""//需要跳转的路径
  },
  data: {},
  methods: {
    formSubmit: function (e) {
      var val={
        FormId: e.detail.formId,
        MessageType: this.data.MessageType,
        TplKey: this.data.TplKey,
        PageUrl: this.data.PageUrl,
        TplData: this.data.TplData
      }
      app.SendMessage(val);
    }
  }
})
