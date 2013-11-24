var interpolate = require('interpolate'),
    capitalize = require('capitalize'),
    isWindow = require('isWindow'),
    isDocument = require('isDocument'),
    isElement = require('isElement'),
    style = require('computedStyle'),
    from_px = require('from_px'),
    to_px = require('to_px'),
    type = require('type'),
    css = require('css')


var from_window = function (el, name) {
  return el.document.documentElement[interpolate('client%s', capitalize(name))]
}

// Get document width or height
// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
// whichever is greatest
var from_document = function (el, name) {
  name = capitalize(name)

  var scroll_name = interpolate('scroll%s', name)
  var offset_name = interpolate('offset%s', name)
  var client_name = interpolate('client%s', name)

  var body_scroll = el.body[scroll_name]
  var document_scroll = el.documentElement[scroll_name]

  var body_offset = el.body[offset_name]
  var document_offset = el.documentElement[offset_name]

  var body_client = el.body[client_name]
  var document_client = el.documentElement[client_name]

  return Math.max(body_scroll, document_scroll, body_offset, document_offset, body_client, document_client)
}


// flag to include padding or not
// by default it should include padding
var inner = function (el, name, from, to) {
  if(isWindow(el))
    return from_window(el, name)

  if(isDocument(el))
    return from_document(el, name)

  if(!isElement(el))
    return null

  var content = from_px(style(el, name))
  var boxSizing = style(el, 'box-sizing')
  var padding = 0
  var border = 0

  // if the width property already includes padding and not the border
  // then just get the width computedValue
  if(boxSizing === 'padding-box')
    return content

  // if the width value doesn't include the padding, calculate it
  padding += from_px(style(el, interpolate('padding-%s', from)))
  padding += from_px(style(el, interpolate('padding-%s', to)))

  // if the width includes the border value AND padding
  // calculate the border to then remove it from the width value
  if(boxSizing === 'border-box') {
    border += from_px(style(el, interpolate('border-%s-width', from)))
    border += from_px(style(el, interpolate('border-%s-width', to)))
  }

  return content + padding - border
}

var outer = function (el, withMargin, name, from, to) {
  if(isWindow(el))
    return from_window(el, name)

  if(isDocument(el))
    return from_document(el, name)

  if(!isElement(el))
    return null

  var content = from_px(style(el, name))
  var boxSizing = style(el, 'box-sizing')
  var padding = 0
  var border = 0
  var margin = 0

  // width already includes border and padding
  if(boxSizing === 'border-box' && !withMargin)
    return content

  margin += from_px(style(el, interpolate('margin-%s', from)))
  margin += from_px(style(el, interpolate('margin-%s', to)))

  // width already includes border and padding
  if(boxSizing === 'border-box' && withMargin)
    return content + margin

  border += from_px(style(el, interpolate('border-%s-width', from)))
  border += from_px(style(el, interpolate('border-%s-width', to)))

  // width already includes padding (but NOT border)
  if(boxSizing === 'padding-box' & !withMargin)
    return content + border

  // width already includes padding (but NOT border)
  if(boxSizing === 'padding-box' & withMargin)
    return content + border + margin

  padding += from_px(style(el, interpolate('padding-%s', from)))
  padding += from_px(style(el, interpolate('padding-%s', to)))

  if(!withMargin)
    return content + border + padding

  return content + border + margin + padding
}

var wh = function (el, value, name, from, to) {
  if(isWindow(el))
    return from_window(el, name)

  if(isDocument(el))
    return from_document(el, name)

  if(!isElement(el))
    return null

  if(type(value) !== 'undefined')
    return wh.set(el, value, name)

  return wh.get(el, name, from, to)
}

wh.set = function (el, value, name) {
  var to_set = Object.create(null)
  value = to_px(value, true)

  to_set[name] = value
  css(el, to_set)
}

wh.get = function (el, name, from, to) {
  if(isWindow(el))
    return from_window(el, name)

  if(isDocument(el))
    return from_document(el, name)

  if(!isElement(el))
    return null

  var content = from_px(style(el, name))
  var boxSizing = style(el, 'box-sizing')
  var padding = 0
  var border = 0

  if(!boxSizing || boxSizing === 'content-box')
    return content

  padding += from_px(style(el, interpolate('padding-%s', from)))
  padding += from_px(style(el, interpolate('padding-%s', to)))

  if(boxSizing === 'padding-box')
    return content - padding

  border += from_px(style(el, interpolate('border-%s-width', from)))
  border += from_px(style(el, interpolate('border-%s-width', to)))

  return content - padding - border
}

var dimensions = module.exports = function (el) {
  if(!(this instanceof dimensions)) return new dimensions(el);

  this.el = el
}

dimensions.prototype.innerWidth = function () {
  return inner(this.el, 'width', 'left', 'right')
}

dimensions.prototype.innerHeight = function () {
  return inner(this.el, 'height', 'top', 'bottom')
}

dimensions.prototype.height = function (value) {
  return wh(this.el, value, 'height', 'top', 'bottom')
}

dimensions.prototype.width = function (value) {
  return wh(this.el, value, 'width', 'left', 'right')
}

dimensions.prototype.outerWidth = function (withMargin) {
  return outer(this.el, withMargin, 'width', 'left', 'right')
}

dimensions.prototype.outerHeight = function (withMargin) {
  return outer(this.el, withMargin, 'height', 'top', 'bottom')
}