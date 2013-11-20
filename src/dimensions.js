var isWindow = require('isWindow')
var style = require('computedStyle')
var css = require('css')

var names = {
  Height: 'height',
  Width: 'width'
}

var dimensions = function (el) {
  if(!(this instanceof dimensions)) return new dimensions(el);

  this.el = el
}

Object.keys(names).forEach(function (name) {
  var type = names[name]
  var defaultExtras = {
    padding: 'inner' + name,
    content: type,
    '': 'outer' + name
  }

  Object.keys(defaultExtras).forEach(function (defaultExtra) {
    dimensions.prototype[defaultExtras[defaultExtra]] = function (value) {
      var css_to_set = {}
      css_to_set[type] = value

      // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
      // isn't a whole lot we can do. See pull request at this URL for discussion:
      // https://github.com/jquery/jquery/pull/764
      if (isWindow(this.el))
        return elem.document.documentElement['client' + name]

      // Get width or height on the element, requesting but not forcing parseFloat
      // or
      // Set width or height on the element
      if(this.el.nodeType !== 9)
        return value === undefined ? style(this.el, type) : css(this.el, css_to_set)

      // Get document width or height
      // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
      // whichever is greatest
      return Math.max(
        this.el.body['scroll' + name], this.el.documentElement['scroll' + name],
        this.el.body['offset' + name], this.el.documentElement['offset' + name],
        this.el.documentElement['client' + name]
      )
    }
  })
})