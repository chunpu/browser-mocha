var fs = require('fs')
var browserMocha = require('./')

var code = fs.readFileSync('./assets/test.js', 'utf8')

var isSauce = process.argv[2] == 'sauce'

console.log(isSauce)

var opt = {}

if (isSauce) {
	opt = {
		sauceLabs: true,
		browser: {
			name: 'internet explorer',
			version: '8',
			platform: 'Windows XP'
		}
	}
}

browserMocha(code, opt, function(err, val) {
	if (err) return console.error(err)
	browserMocha.print(val.logs)
})
