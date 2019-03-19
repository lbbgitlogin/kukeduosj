// module/html-view.js
const html2json = require('html2json.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    innerText: String || ''
  },
  /**
   * 组件的初始数据
   */
  data: {
    node: {}
  },
  attached() {
    let html = `<div class='html-view-box'>${this.data.innerText}<div/>`
    this.setData({
      node: html2json(html)
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})