var interpolate = require('interpolate'),
    capitalize = require('capitalize'),
    isWindow = require('isWindow'),
    isDocument = require('isDocument'),
    style = require('computedStyle'),
    from_px = require('from_px'),
    to_px = require('to_px'),
    css = require('css')


var dimensions = module.exports = function (el) {
  if(!(this instanceof dimensions)) return new dimensions(el);

  this.el = el

  this.innerWidth = this.inner('width', 'left', 'right').bind(this)
  this.innerHeight = this.inner('height', 'top', 'bottom').bind(this)
  this.height = this.wh('height', 'top', 'bottom').bind(this)
  this.width = this.wh('width', 'left', 'right').bind(this)
  this.outerWidth = this.outer('width', 'left', 'right').bind(this)
  this.outerHeight = this.outer('height', 'top', 'bottom').bind(this)
}

dimensions.prototype.from_window = function (name) {
  return this.el.document.documentElement[interpolate('client%s', name)]
}

// Get document width or height
// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
// whichever is greatest
dimensions.prototype.from_document = function (name) {
  name = capitalize(name)

  var scroll_name = interpolate('scroll%s', name)
  var offset_name = interpolate('offset%s', name)
  var client_name = interpolate('client%s', name)

  var body_scroll = this.el.body[scroll_name]
  var document_scroll = this.el.documentElement[scroll_name]

  var body_offset = this.el.body[offset_name]
  var document_offset = this.el.documentElement[offset_name]

  var body_client = this.el.body[client_name]
  var document_client = this.el.documentElement[client_name]

  return Math.max(body_scroll, document_scroll, body_offset, document_offset, body_client, document_client)
}

dimensions.prototype.inner = function (name, from, to) {
  return function () {
    if(isWindow(this.el))
      return this.from_window(name)

    if(isDocument(this.el))
      return this.from_document(name)

    var content = from_px(style(this.el, name))
    var boxSizing = style(this.el, 'box-sizing')
    var padding = 0
    var border = 0

    // if the width property already includes padding and not the border
    // then just get the width computedValue
    if(boxSizing === 'padding-box')
      return content

    // if the width includes the border value AND padding
    // calculate the border to then remove it from the width value
    if(boxSizing === 'border-box') {
      border += from_px(style(this.el, interpolate('border-%s-%s', from, name)))
      border += from_px(style(this.el, interpolate('border-%s-%s', to, name)))
    }

    // if the width value doesn't include the padding, calculate it
    padding += from_px(style(this.el, interpolate('padding-%', from)))
    padding += from_px(style(this.el, interpolate('padding-%', to)))

    return content + padding - border
  }
}

dimensions.prototype.wh = function (name, from, to) {
  return function (value) {
    if(isWindow(this.el))
      return this.from_window(name)

    if(isDocument(this.el))
      return this.from_document(name)

    return type(value) !== 'undefined' ? this.wh.set(name, value) : this.wh.get(name, from, to)
  }
}

dimensions.prototype.wh.set = function (name, value) {
  var to_set = Object.create(null)
  value = to_px(value)

  to_set[name] = value
  css(this.el, to_set)
}

dimensions.prototype.wh.get = function (name, from, to) {
  var content = from_px(style(this.el, name))
  var boxSizing = style(this.el, 'box-sizing')
  var padding = 0
  var border = 0

  if((boxSizing === 'content-box') || !boxSizing)
    return content

  // if the width property includes padding
  if(boxSizing === 'padding-box') {
    padding += from_px(style(this.el, interpolate('padding-%', from)))
    padding += from_px(style(this.el, interpolate('padding-%', to)))
  }

  // if the width property includes padding AND border
  if(boxSizing === 'border-box') {
    border += from_px(style(this.el, interpolate('border-%s-%s', from, name)))
    border += from_px(style(this.el, interpolate('border-%s-%s', to, name)))
    padding += from_px(style(this.el, interpolate('padding-%', from)))
    padding += from_px(style(this.el, interpolate('padding-%', to)))
  }

  return content - padding - border
}

dimensions.prototype.outer = function (name, from, to) {
  return function (marginplus) {
    if(isWindow(this.el))
      return this.from_window(name)

    if(isDocument(this.el))
      return this.from_document(name)

    var content = from_px(style(this.el, name))
    var boxSizing = style(this.el, 'box-sizing')
    var padding = 0
    var border = 0
    var margin = 0

    // width already includes border and padding
    if(boxSizing === 'border-box' && !marginplus)
      return content

    margin += from_px(style(this.el, interpolate('margin-%', from)))
    margin += from_px(style(this.el, interpolate('margin-%', to)))

    // width already includes border and padding
    if(boxSizing === 'border-box' && marginplus)
      return content + margin

    border += from_px(style(this.el, interpolate('border-%s-%s', from, name)))
    border += from_px(style(this.el, interpolate('border-%s-%s', to, name)))

    // width already includes padding (but NOT border)
    if(boxSizing === 'padding-box' & !marginplus)
      return content + border

    // width already includes padding (but NOT border)
    if(boxSizing === 'padding-box' & marginplus)
      return content + border + margin

    padding += from_px(style(this.el, interpolate('padding-%', from)))
    padding += from_px(style(this.el, interpolate('padding-%', to)))

    if(!marginplus)
      return content + border + margin

    return content + border + margin + padding
  }
}