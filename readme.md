browser-mocha@1.0.0
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

run browser mocha test by web driver

Installation
---

```sh
npm install browser-mocha
```

Usage
---

try it by `node demo.js`, remember to open phantomjs web driver (`phantomjs -w`) before try

basic usage

```js
var browserMocha = require('./')

browserMocha('some mocha code', {
	ui: 'bdd',
	reporter: 'spec',
	timeout: '3000',
	host: 'localhost:8910'
}, function(err, data) {
	browserMocha.print(data.logs)
})
```

data is mocha runner end value

- `logs` array of print logs, can use `browserMocha.print` print to stdout
- `total` count of test cases
- `failures` count of failure test cases

License
---

ISC

[npm-image]: https://img.shields.io/npm/v/browser-mocha.svg?style=flat-square
[npm-url]: https://npmjs.org/package/browser-mocha
[downloads-image]: http://img.shields.io/npm/dm/browser-mocha.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/browser-mocha
