Try
---

try it by `node demo.js`, remember to open phantomjs web driver (`phantomjs -w`) before try

![demo](https://cloud.githubusercontent.com/assets/4565306/5872319/1529593c-a325-11e4-9841-223079da3135.png)


Usage
---

basic usage

```js
var browserMocha = require('./')

browserMocha('some mocha code', {ui: 'bdd'}, function(err, data) {
	browserMocha.print(data.logs)
})
```

data is mocha runner end value

- `logs` array of print logs, can use `browserMocha.print` print to stdout
- `total` count of test cases
- `failures` count of failure test cases


Advanced
---

Test page will default add [es5-shim](https://github.com/es-shims/es5-shim), use `{shim: false}` to close it

Get script by `browserMocha.getScript` for custom debug


Options
---

Use more options like below

```js
browserMocha('mocha code', {
	  ui: 'bdd'
	, reporter: 'spec'
	, timeout: '3000' // mocha timeout
	, host: 'localhost:8910' // webdriver host, default is this
	, title: 'my test' // page test
	, shim: true // add es5-shim, default true
	, browser: {
		  name: 'chrome'
		, version: '31'
		, platform: 'linux'
	}
}, callback)
```
