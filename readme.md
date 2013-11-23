# dimensions

[jquery/jquery](https://github.com/jquery/jquery/blob/master/src/dimensions.js#L7-L47) based dimensions getters and setters (`innerHeight`, `innerWidth`, `height`, `width`, `outerHeight` and `outerWidth`)

## install

```bash
component install ramitos/dimensions
```

## api

```js
var dimensions = require('dimensions')
var el = document.querySelector('#myID')

dimensions(el).innerHeight()
dimensions(el).height('10px')
```

## todo
 * write docs
 * write tests

## license

MIT