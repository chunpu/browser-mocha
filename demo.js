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
			version: '6',
			//platform: 'Windows XP'
		}
	}
}

browserMocha(code, opt, function(err, val) {
	if (err) return console.error(err, val)
	browserMocha.print(val.logs)
})
