var assert = require('assert')
var dimensions = require('dimensions')
var css = require('css')
var domify = require('domify')
var type = require('type')

var remove = function (el) {
  if(arguments.length > 1 && type(arguments[1]) === 'element') return Array.prototype.map.call(arguments, remove)

  if(el.remove) el.remove()
  else if(el.parentNode) el.parentNode.removeChild(el)
}

document.body.appendChild(domify("<div id='mocha'></div><div id='nothiddendiv'><div id='nothiddendivchild'></div></div>"))
mocha.setup('tdd')
mocha.checkLeaks()


suite('width', function () {
  var div = document.querySelector('#nothiddendiv')
  var child = document.querySelector('#nothiddendivchild')

  test('set to 30 correctly', function () {
    dimensions(div).width(30)
    assert(dimensions(div).width() === 30)
  })

  test('hidden div', function () {
    css(div, {display: 'none'})
    assert(dimensions(div).width() === 30)

    css(div, {display: 'block'})
  })

  test('negative normalized to 0', function () {
    dimensions(div).width(-1)
    assert(dimensions(div).width() === 0)
  })

  test('padding specified with pixels', function () {
    css(div, {padding: '20px'})
    assert(dimensions(div).width() === 0)
  })

  test('border specified with pixels', function () {
    css(div, {border: '2px solid #fff'})
    assert(dimensions(div).width() === 0)

    css(div, {display: '', border: '', padding: ''})
  })

  test('child width with border and padding', function () {
    css(child, {width: '20px', padding: '3px', border: '2px solid #fff'})
    assert(dimensions(child).width() === 20)
  })

  test('window width is equal to width reported by window/document', function () {
    assert(dimensions(window).width() === document.documentElement.clientWidth)
  })

  suiteTeardown(function () {
    css(div, {border: '', padding: '', width: '', height: '', display: ''})
    css(child, {border: '', padding: '', width: '', height: '', display: ''})
  })
})


suite('height', function () {
  var div = div = document.querySelector('#nothiddendiv')
  var child = document.querySelector('#nothiddendivchild')

  test('set to 30 correctly', function () {
    dimensions(div).height(30)
    assert(dimensions(div).height() === 30)
  })

  test('hidden div', function () {
    css(div, {display: 'none'})
    assert(dimensions(div).height() === 30)

    css(div, {display: 'block'})
  })

  test('negative normalized to 0', function () {
    dimensions(div).height(-1)
    assert(dimensions(div).height() === 0)
  })

  test('padding specified with pixels', function () {
    css(div, {padding: '20px'})
    assert(dimensions(div).height() === 0)
  })

  test('border specified with pixels', function () {
    css(div, {border: '2px solid #fff'})
    assert(dimensions(div).height() === 0)

    css(div, {display: '', border: '', padding: '', height: '0px'})
  })

  test('child height with border and padding', function () {
    css(child, {height: '20px', padding: '3px', border: '2px solid #fff'})
    assert(dimensions(child).height() === 20)
  })

  test('window height is equal to height reported by window/document', function () {
    assert(dimensions(window).height() === document.documentElement.clientHeight)
  })

  suiteTeardown(function () {
    css(div, {border: '', padding: '', width: '', height: '', display: ''})
    css(child, {border: '', padding: '', width: '', height: '', display: ''})
  })
})


suite('innerWidth', function () {
  var div = div = document.querySelector('#nothiddendiv')
  var disconnected = domify('<div></div>')

  test('window', function () {
    assert(dimensions(window).innerWidth(), dimensions(window).width())
  })

  test('document', function () {
    assert(dimensions(document).innerWidth(), dimensions(document).width())
  })

  test('with margin and border', function () {
    css(div, {margin: '10px', border: '2px solid #fff', width: '30px'})
    assert(dimensions(div).innerWidth() === 30)
  })

  test('with margin, border and padding', function () {
    css(div, {padding: '20px'})
    assert(dimensions(div).innerWidth() === 70)
  })

  test('hidden div', function () {
    css(div, {display: 'none'})
    assert(dimensions(div).innerWidth() === 70)
  })

  test('disconnected nodes are handled', function () {
    assert(dimensions(disconnected).innerWidth() === 0)
  })

  suiteTeardown(function () {
    css(div, {border: '', padding: '', width: '', height: '', display: ''})
    remove(disconnected)
  })
})


suite('innerHeight', function () {
  var div = div = document.querySelector('#nothiddendiv')
  var disconnected = domify('<div></div>')

  test('window', function () {
    assert(dimensions(window).innerHeight(), dimensions(window).height())
  })

  test('document', function () {
    assert(dimensions(document).innerHeight(), dimensions(document).height())
  })

  test('with margin and border', function () {
    css(div, {margin: '10px', border: '2px solid #fff', height: '30px'})
    assert(dimensions(div).innerHeight() === 30)
  })

  test('with margin, border and padding', function () {
    css(div, {padding: '20px'})
    assert(dimensions(div).innerHeight() === 70)
  })

  test('hidden div', function () {
    css(div, {display: 'none'})
    assert(dimensions(div).innerHeight() === 70)

    // reset
    css(div, {display: '', border: '', padding: '', width: '', height: ''})
  })

  test('disconnected nodes are handled', function () {
    assert(dimensions(disconnected).innerHeight() === 0)
  })

  suiteTeardown(function () {
    css(div, {border: '', padding: '', width: '', height: '', display: ''})
    remove(disconnected)
  })
})


suite('outerWidth', function () {
  var div = div = document.querySelector('#nothiddendiv')

  test('window without margin option', function () {
    assert(dimensions(window).outerWidth(), dimensions(window).width())
  })

  test('window with margin option', function () {
    assert(dimensions(window).outerWidth(true), dimensions(window).width())
  })

  test('document without margin option', function () {
    assert(dimensions(document).outerWidth(), dimensions(document).width())
  })

  test('document with margin option', function () {
    assert(dimensions(document).outerWidth(true), dimensions(document).width())
  })

  test('with only width set', function () {
    css(div, {width: '30px'})
    assert(dimensions(div).outerWidth() === 30)
  })

  test('with padding', function () {
    css(div, {padding: '20px'})
    assert(dimensions(div).outerWidth() === 70)
  })

  test('with padding and border', function () {
    css(div, {border: '2px solid #fff'})
    assert(dimensions(div).outerWidth() === 74)
  })

  test('with padding, border and margin without margin option', function () {
    css(div, {margin: '10px'})
    assert(dimensions(div).outerWidth() === 74)
  })

  test('with padding, border and margin with margin option', function () {
    css(div, {position: 'absolute'})
    assert(dimensions(div).outerWidth(true) === 94)
  })

  test('hidden div with padding, border and margin with margin option', function () {
    css(div, {display: 'none'})
    assert(dimensions(div).outerWidth(true) === 94)
  })

  suiteTeardown(function () {
    css(div, {border: '', padding: '', width: '', height: '', display: ''})
  })
})


suite('child of a hidden elem (or unconnected node)', function () {
  var divNormal, divChild, divHiddenParent

  suiteSetup(function () {
    divNormal = domify('<div></div>')

    css(divNormal, {
      width: '100px',
      height: '100px',
      border: '10px solid white',
      padding: '2px',
      margin: '3px'
    })

    divChild = divNormal.cloneNode(true)
    var divUnconnected = divNormal.cloneNode(true)
    divHiddenParent = domify('<div></div>')

    css(divHiddenParent, {
      display: 'none'
    })

    divHiddenParent.appendChild(divChild)
    document.body.appendChild(divHiddenParent)
    document.body.appendChild(divNormal)
  })

  test('child of a hidden element width()', function () {
    assert(dimensions(divChild).width() === dimensions(divNormal).width())
  })

  test('child of a hidden element innerWidth()', function () {
    assert(dimensions(divChild).innerWidth() === dimensions(divNormal).innerWidth())
  })

  test('child of a hidden element outerWidth()', function () {
    assert(dimensions(divChild).outerWidth() === dimensions(divNormal).outerWidth())
  })

  test('child of a hidden element outerWidth(true)', function () {
    assert(dimensions(divChild).outerWidth(true) === dimensions(divNormal).outerWidth(true))
  })

  test('child of a hidden element height()', function () {
    assert(dimensions(divChild).height() === dimensions(divNormal).height())
  })

  test('child of a hidden element innerHeight()', function () {
    assert(dimensions(divChild).innerHeight() === dimensions(divNormal).innerHeight())
  })

  test('child of a hidden element outerHeight()', function () {
    assert(dimensions(divChild).outerHeight() === dimensions(divNormal).outerHeight())
  })

  test('child of a hidden element outerHeight(true)', function () {
    assert(dimensions(divChild).outerHeight(true) === dimensions(divNormal).outerHeight(true))
  })

  // https://bugs.webkit.org/show_bug.cgi?id=83867

  // test('unconnected element width()', function () {
  //   assert(dimensions(divUnconnected).width() === dimensions(divNormal).width())
  // })

  // test('unconnected element innerWidth()', function () {
  //   assert(dimensions(divUnconnected).innerWidth() === dimensions(divNormal).innerWidth())
  // })

  // test('unconnected element outerWidth()', function () {
  //   assert(dimensions(divUnconnected).outerWidth() === dimensions(divNormal).outerWidth())
  // })

  // test('unconnected element outerWidth(true)', function () {
  //   assert(dimensions(divUnconnected).outerWidth(true) === dimensions(divNormal).outerWidth(true))
  // })

  // test('unconnected element height()', function () {
  //   assert(dimensions(divUnconnected).height(true) === dimensions(divNormal).height(true))
  // })

  // test('unconnected element innerHeight()', function () {
  //   assert(dimensions(divUnconnected).innerHeight() === dimensions(divNormal).innerHeight())
  // })

  // test('unconnected element outerHeight()', function () {
  //   assert(dimensions(divUnconnected).outerHeight() === dimensions(divNormal).outerHeight())
  // })

  // test('unconnected element outerHeight(true)', function () {
  //   assert(dimensions(divUnconnected).outerHeight(true) === dimensions(divNormal).outerHeight(true))
  // })

  suiteTeardown(function () {
    remove(divHiddenParent, divNormal)
  })
})


suite('getting dimensions shouldn\'t modify runtimeStyle', function () {
  var runtimeStyleDiv = domify('<div></div>')

  suiteSetup(function () {
    document.body.appendChild(runtimeStyleDiv)
  })

  test('width', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '12em'
    runtimeStyleDiv.runtimeStyle.left = '11em'

    dimensions(runtimeStyleDiv).width()

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '12em')
    assert(runtimeStyleDiv.runtimeStyle.left === '11em')
  })

  test('height', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '13em'
    runtimeStyleDiv.runtimeStyle.left = '12em'

    dimensions(runtimeStyleDiv).height()

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '13em')
    assert(runtimeStyleDiv.runtimeStyle.left === '12em')
  })

  test('innerWidth', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '14em'
    runtimeStyleDiv.runtimeStyle.left = '13em'

    dimensions(runtimeStyleDiv).innerWidth()

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '14em')
    assert(runtimeStyleDiv.runtimeStyle.left === '13em')
  })

  test('innerHeight', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '15em'
    runtimeStyleDiv.runtimeStyle.left = '14em'

    dimensions(runtimeStyleDiv).innerHeight()

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '15em')
    assert(runtimeStyleDiv.runtimeStyle.left === '14em')
  })

  test('outerWidth', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '16em'
    runtimeStyleDiv.runtimeStyle.left = '15em'

    dimensions(runtimeStyleDiv).outerWidth()

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '16em')
    assert(runtimeStyleDiv.runtimeStyle.left === '15em')
  })

  test('outerWidth(true)', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '17em'
    runtimeStyleDiv.runtimeStyle.left = '16em'

    dimensions(runtimeStyleDiv).outerWidth(true)

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '17em')
    assert(runtimeStyleDiv.runtimeStyle.left === '16em')
  })

  test('outerHeight', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '18em'
    runtimeStyleDiv.runtimeStyle.left = '17em'

    dimensions(runtimeStyleDiv).outerHeight()

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '18em')
    assert(runtimeStyleDiv.runtimeStyle.left === '17em')
  })

  test('outerHeight(true)', function () {
    if(!runtimeStyleDiv.runtimeStyle)
      return assert(true, 'this browser doesn\'t support runtimeStyle')

    runtimeStyleDiv.runtimeStyle.marginLeft = '19em'
    runtimeStyleDiv.runtimeStyle.left = '18em'

    dimensions(runtimeStyleDiv).outerHeight(true)

    assert(runtimeStyleDiv.runtimeStyle.marginLeft === '19em')
    assert(runtimeStyleDiv.runtimeStyle.left === '18em')
  })

  suiteTeardown(function () {
    remove(runtimeStyleDiv)
  })
})

suite('table', function () {
  var table, td, col

  suiteSetup(function () {
    table = domify('<table><colgroup><col/><col/></colgroup><tbody><tr><td></td><td>a</td></tr><tr><td></td><td>a</td></tr></tbody></table>')
    td = table.querySelector('td')
    col = table.querySelector('col')

    document.body.appendChild(table)
    dimensions(col).width(300)
    css(td, {margin: 0, padding: 0})
  })

  test('width doesn\'t alter dimension values of empty cells', function () {
    assert(dimensions(td).width() === dimensions(td).width())
  })

  // test('"col elements have width()', function () {
  //   assert(dimensions(col).width() === 300)
  // })

  suiteTeardown(function () {
    remove(table)
  })
})

suite('box-sizing:border-box child of a hidden elem (or unconnected node)', function () {
  var divNormal, divChild, divHiddenParent

  suiteSetup(function () {
    divNormal = domify('<div></div>')

    css(divNormal, {
      width: '100px',
      height: '100px',
      border: '10px solid white',
      padding: '2px',
      margin: '3px',
      boxSizing: 'border-box'
    })

    divChild = divNormal.cloneNode(true)
    var divUnconnected = divNormal.cloneNode(true)
    divHiddenParent = domify('<div></div>')

    css(divHiddenParent, {
      display: 'none'
    })

    divHiddenParent.appendChild(divChild)
    document.body.appendChild(divHiddenParent)
    document.body.appendChild(divNormal)
  })

  test('child of a hidden element width()', function () {
    assert(dimensions(divChild).width() === dimensions(divNormal).width())
  })

  test('child of a hidden element innerWidth()', function () {
    assert(dimensions(divChild).innerWidth() === dimensions(divNormal).innerWidth())
  })

  test('child of a hidden element outerWidth()', function () {
    assert(dimensions(divChild).outerWidth() === dimensions(divNormal).outerWidth())
  })

  test('child of a hidden element outerWidth(true)', function () {
    assert(dimensions(divChild).outerWidth(true) === dimensions(divNormal).outerWidth(true))
  })

  test('child of a hidden element height()', function () {
    assert(dimensions(divChild).height() === dimensions(divNormal).height())
  })

  test('child of a hidden element innerHeight()', function () {
    assert(dimensions(divChild).innerHeight() === dimensions(divNormal).innerHeight())
  })

  test('child of a hidden element outerHeight()', function () {
    assert(dimensions(divChild).outerHeight() === dimensions(divNormal).outerHeight())
  })

  test('child of a hidden element outerHeight(true)', function () {
    assert(dimensions(divChild).outerHeight(true) === dimensions(divNormal).outerHeight(true))
  })

  // https://bugs.webkit.org/show_bug.cgi?id=83867

  // test('unconnected element width()', function () {
  //   assert(dimensions(divUnconnected).width() === dimensions(divNormal).width())
  // })

  // test('unconnected element innerWidth()', function () {
  //   assert(dimensions(divUnconnected).innerWidth() === dimensions(divNormal).innerWidth())
  // })

  // test('unconnected element outerWidth()', function () {
  //   assert(dimensions(divUnconnected).outerWidth() === dimensions(divNormal).outerWidth())
  // })

  // test('unconnected element outerWidth(true)', function () {
  //   assert(dimensions(divUnconnected).outerWidth(true) === dimensions(divNormal).outerWidth(true))
  // })

  // test('unconnected element height()', function () {
  //   assert(dimensions(divUnconnected).height(true) === dimensions(divNormal).height(true))
  // })

  // test('unconnected element innerHeight()', function () {
  //   assert(dimensions(divUnconnected).innerHeight() === dimensions(divNormal).innerHeight())
  // })

  // test('unconnected element outerHeight()', function () {
  //   assert(dimensions(divUnconnected).outerHeight() === dimensions(divNormal).outerHeight())
  // })

  // test('unconnected element outerHeight(true)', function () {
  //   assert(dimensions(divUnconnected).outerHeight(true) === dimensions(divNormal).outerHeight(true))
  // })

  suiteTeardown(function () {
    remove(divHiddenParent, divNormal)
  })
})

suite('outerHeight', function () {
  var div = document.querySelector('#nothiddendiv')
  var disconnected

  suiteSetup(function () {
    disconnected = domify('<div></div>')
    dimensions(div).height(30)
  })

  test('window without margin option', function () {
    assert(dimensions(window).outerHeight() === dimensions(window).height())
  })

  test('window with margin option', function () {
    assert(dimensions(window).outerHeight(true) === dimensions(window).height())
  })

  test('document without margin option', function () {
    assert(dimensions(document).outerHeight() === dimensions(document).height())
  })

  test('document with margin option', function () {
    assert(dimensions(document).outerHeight(true) === dimensions(document).height())
  })

  test('with only width set', function () {
    assert(dimensions(div).outerHeight() === 30)
  })

  test('with padding', function () {
    css(div, {padding: '20px'})
    assert(dimensions(div).outerHeight() === 70)
  })

  test('with padding and border', function () {
    css(div, {border: '2px solid #fff'})
    assert(dimensions(div).outerHeight() === 74)
  })

  test('with padding, border and margin without margin option', function () {
    css(div, {margin: '10px'})
    assert(dimensions(div).outerHeight() === 74)
  })

  test('with padding, border and margin with margin option', function () {
    css(div, {margin: '10px'})
    assert(dimensions(div).outerHeight(true) === 94)
  })

  test('disconnected nodes are handled', function () {
    assert(dimensions(disconnected).outerHeight() === 0)
  })

  suiteTeardown(function () {
    css(div, {display: '', border: '', padding: '', width: '', height: ''})
    remove(disconnected)
  })
})


suite('undefined as argument', function () {
  var div = document.querySelector('#nothiddendiv')

  suiteSetup(function () {
    dimensions(div).height(30)
    dimensions(div).width(30)
  })

  test('height', function () {
    dimensions(div).height(undefined)
    assert(dimensions(div).height() === 30)
  })

  test('width', function () {
    dimensions(div).width(undefined)
    assert(dimensions(div).width() === 30)
  })

  test('innerHeight', function () {
    dimensions(div).innerHeight(undefined)
    assert(dimensions(div).height() === 30)
  })

  test('innerWidth', function () {
    dimensions(div).innerWidth(undefined)
    assert(dimensions(div).width() === 30)
  })

  test('outerHeight', function () {
    dimensions(div).outerHeight(undefined)
    assert(dimensions(div).height() === 30)
  })

  suiteTeardown(function () {
    dimensions(div).height(0)
    dimensions(div).width(0)
  })
})


suite('getters on non elements', function () {
  var nonElem = domify('notAnElement')

  test('width', function () {
    assert(dimensions(nonElem).width() === null)
  })

  test('innerWidth', function () {
    assert(dimensions(nonElem).innerWidth() === null)
  })

  test('outerWidth', function () {
    assert(dimensions(nonElem).outerWidth() === null)
  })

  test('outerWidth(true)', function () {
    assert(dimensions(nonElem).outerWidth(true) === null)
  })

  test('height', function () {
    assert(dimensions(nonElem).height() === null)
  })

  test('innerHeight', function () {
    assert(dimensions(nonElem).innerHeight() === null)
  })

  test('outerHeight', function () {
    assert(dimensions(nonElem).outerHeight() === null)
  })

  test('outerHeight(true)', function () {
    assert(dimensions(nonElem).outerHeight(true) === null)
  })

  suiteTeardown(function () {
    remove(nonElem)
  })
})


suite('setters with and without box-sizing:border-box', function () {
  var expected = 100
  var el_bb, el

  suiteSetup(function () {
    el_bb = domify("<div style='width:114px;height:114px;margin:5px;padding:3px;border:4px solid white;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;'>test</div>")
    el = domify("<div style='width:100px;height:100px;margin:5px;padding:3px;border:4px solid white;'>test</div>")

    document.body.appendChild(el_bb)
    document.body.appendChild(el)
  })

  test('border-box width(int)', function () {
    dimensions(el_bb).width(101)
    assert(dimensions(el_bb).width() === 101)
  })

  test('border-box height(int)', function () {
    dimensions(el_bb).height(101)
    assert(dimensions(el_bb).height() === 101)
  })

  test('border-box width(int)', function () {
    dimensions(el_bb).width(101)
    assert(dimensions(el_bb).width() === 101)
  })

  test('width(int)', function () {
    dimensions(el).height(101)
    assert(dimensions(el).height() === 101)
  })

  test('height(int)', function () {
    dimensions(el).height(101)
    assert(dimensions(el).height() === 101)
  })

  suiteTeardown(function () {
    remove(el_bb, el)
  })
})


mocha.run()