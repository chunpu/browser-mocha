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
