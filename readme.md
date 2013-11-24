# dimensions

[jquery/jquery](https://github.com/jquery/jquery/blob/2.0.3/src/dimensions.js) based dimensions getters and setters (`innerHeight`, `innerWidth`, `height`, `width`, `outerHeight` and `outerWidth`)

## install

```bash
component install ramitos/dimensions
```

## example

```js
var dimensions = require('dimensions')
var css = require('css')

var el = document.querySelector('#my_el')

css(el, {
  width: '100px',
  height: '150px',
  padding: '10px',
  border: '1px solid black',
  margin: '5px'
})

dimensions(el).innerWidth() // => '120px'
dimensions(el).innerHeight() // => '170px'
dimensions(el).width() // => '100px'
dimensions(el).height() // => '150px'
dimensions(el).outerWidth() // => '122px'
dimensions(el).outerWidth(true) // => '132px'
dimensions(el).outerHeight() // => '172px'
dimensions(el).outerHeight(true) // => '182px'

dimensions(el).width(110)
dimensions(el).height(160)

dimensions(el).innerWidth() // => '130px'
dimensions(el).innerHeight() // => '180px'
dimensions(el).width() // => '110px'
dimensions(el).height() // => '160px'
dimensions(el).outerWidth() // => '132px'
dimensions(el).outerWidth(true) // => '142px'
dimensions(el).outerHeight() // => '182px'
dimensions(el).outerHeight(true) // => '192px'
```

## api

### .innerWidth() / .innerHeight()

![](https://i.cloudup.com/edk7buzalG.png)

Gets the `width`/`height` **without** `border` and `margin`

### .width([value]) / .height([value])

![](https://i.cloudup.com/s1aUUk9pPP.png)

Gets the `width`/`height` **without** `border`, `margin` and `padding`

Sets the `width`/`height` by applying css rules into the element.

Note that `.width([value])`/`.height([value])` will always return and set the `content-width`/`content-height` in conformity with the `box-sizing` value. This part of the implementation is not in parity with jQuery.

### .outerWidth([withMargin]) / .outerHeight([withMargin])

![](https://i.cloudup.com/1SwcggkWSA.png)

Gets the `width`/`height` **with** `border` and `padding`. Optionally, also with `margin`

## license

MIT