var fs = require('fs')
var browserMocha = require('./')

var basic = fs.readFileSync('./assets/test.js', 'utf8')

browserMocha(basic, function(err, val) {
	if (err) return console.error(err)
	browserMocha.print(val.logs)
})
