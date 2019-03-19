// common/zip-img/zip-img.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source_img: String || '',
    source_style:String || ''
  },
  /**
   * 组件的初始数据
   */
  data: {
    source_src:'',
    source_style:''
  },
  onLoad:function(){
    console.log(0);
  },
  /**
   * 组件的方法列表
   */
  ready: function (){
    var img_src = this.data.source_img;
    var img_style = this.data.source_style;
    this.setData({
      source_src: img_src.replace(/sourcefile/g,'zipfile'),
      source_style: img_style
    });
  }
})
