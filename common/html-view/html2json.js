var HTMLParser = require('./htmlparser.js');


let empty = ["area", "base", "basefont", "br", "col", "frame", "hr", "img", "input", "link", "meta", "param", "embed", "command", "keygen", "source", "track", "wbr"];
let block = ["a", "address", "article", "applet", "aside", "audio", "blockquote", "button", "canvas", "center", "dd", "del", "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "iframe", "ins", "isindex", "li", "map", "menu", "noframes", "noscript", "object", "ol", "output", "p", "pre", "section", "script", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "video"];
let inline = ["abbr", "acronym", "applet", "b", "basefont", "bdo", "big", "br", "button", "cite", "code", "del", "dfn", "em", "font", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "object", "q", "s", "samp", "script", "select", "small", "span", "strike", "strong", "sub", "sup", "textarea", "tt", "u", "var"];
let closeSelf = ["colgroup", "dd", "dt", "li", "options", "p", "td", "tfoot", "th", "thead", "tr"];
let fillAttrs = ["checked", "compact", "declare", "defer", "disabled", "ismap", "multiple", "nohref", "noresize", "noshade", "nowrap", "readonly", "selected"];
let special = ["script", "style"];

//微信支持的受信任的HTML节点及属性，全局支持class和style属性，不支持id属性。
let wexinTag = ['a', 'abbr', 'b', 'blockquote', 'br', 'code', 'col', 'colgroup', 'dd', 'del', 'div', 'dl', 'dt', 'em', 'fieldset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'label', 'legend', 'li', 'ol', 'p', 'q', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];

function q(v) {
  return '"' + v + '"';
}

function removeDOCTYPE(html) {
  return html
    .replace(/<\?xml.*\?>\n/, '')
    .replace(/<!doctype.*\>\n/, '')
    .replace(/<!DOCTYPE.*\>\n/, '');
}

var html2json = function(html) {
  html = removeDOCTYPE(html);
  var bufArray = [];
  var results = {
    node: 'root',
    children: [],
  };
  HTMLParser(html, {
    start: function(tag, attrs, unary) {
      // node for this element
      var node = {
        node: 'element',
        name: wexinTag.indexOf(tag) > -1 ? tag : empty.indexOf(tag) > -1 ? 'span' : block.indexOf(tag) > -1 ? 'div' : inline.indexOf(tag) > -1 ? 'span' : tag
      };
      if (attrs.length !== 0) {
        //如果是图片加上图片处理样式
        if (node.name === 'img') {
          let newAttrs = [{
            name: 'class',
            value: 'html-view-img'
          }];
          attrs.map(item => (item.name.toLowerCase() != 'class' ? newAttrs.push(item) : ''));
          attrs = newAttrs;
        }
        node.attrs = attrs.reduce(function(pre, attr) {
          var name = attr.name;
          var value = attr.value;

          if (pre[name]) {
            if (Array.isArray(pre[name])) {
              // already array, push to last
              pre[name].push(value);
            } else {
              // single value, make it array
              pre[name] = [pre[name], value];
            }
          } else {
            // not exist, put it
            pre[name] = value;
          }

          return pre;
        }, {});
      }
      if (unary) {
        // if this tag dosen't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var parent = bufArray[0] || results;
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function(tag) {

      // merge into parent tag
      var node = bufArray.shift();
      tag = wexinTag.indexOf(tag) > -1 ? tag : empty.indexOf(tag) > -1 ? 'label' : block.indexOf(tag) > -1 ? 'div' : inline.indexOf(tag) > -1 ? 'span' : tag
      if (node.name !== tag) console.error('invalid state: mismatch end tag');

      if (bufArray.length === 0) {
        results.children.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    chars: function(text) {

      var node = {
        type: 'text',
        text: text,
      };
      if (bufArray.length === 0) {
        results.children.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.children === undefined) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    comment: function(text) {

      var node = {
        node: 'comment',
        text: text,
      };
      var parent = bufArray[0];
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(node);
    },
  });
  return results;
};

var json2html = function json2html(json) {
  // Empty Elements - HTML 4.01
  var empty = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param', 'embed'];

  var children = '';
  if (json.children) {
    children = json.children.map(function(c) {
      return json2html(c);
    }).join('');
  }

  var attr = '';
  if (json.attr) {
    attr = Object.keys(json.attr).map(function(key) {
      var value = json.attr[key];
      if (Array.isArray(value)) value = value.join(' ');
      return key + '=' + q(value);
    }).join(' ');
    if (attr !== '') attr = ' ' + attr;
  }

  if (json.node === 'element') {
    var tag = json.tag;
    if (empty.indexOf(tag) > -1) {
      // empty element
      return '<' + json.tag + attr + '/>';
    }

    // non empty element
    var open = '<' + json.tag + attr + '>';
    var close = '</' + json.tag + '>';
    return open + children + close;
  }

  if (json.node === 'text') {
    return json.text;
  }

  if (json.node === 'comment') {
    return '<!--' + json.text + '-->';
  }

  if (json.node === 'root') {
    return children;
  }
};
module.exports = html2json;