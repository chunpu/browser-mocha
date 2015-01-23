var Session = require('wd-exec')
var ejs = require('ejs')
var fs = require('fs')
var path = require('path')
var debug = require('debug')('browser-mocha')

module.exports = exports = run

exports.template = fs.readFileSync(path.resolve(__dirname, 'assets', 'template.ejs'), 'utf8')

function noop() {}

function run(script, opt, cb) {
	if ('function' == typeof opt) {
		return run(script, {}, opt)
	}
	var timeout = opt.timeout || 10 * 1000
	script = ejs.render(exports.template, {
		  script: script
		, ui: opt.ui || 'bdd'
		, timeout: timeout
		, reporter: opt.reporter || 'spec'
		, shim: opt.shim || true
	})
	script = 'window.__print = arguments[arguments.length - 1]; document.write(unescape("' + escape(script) + '")); document.close()'
	debug('async script', script)
	cb = cb || noop
	var session = Session()
	opt = opt || {}
	session.init(opt, function(err, value) {
		if (err) {
			debug('init fail: %o', err)
			return cb(err)
		}
		session.exec('timeouts/async_script', {
			body: {
				ms: timeout * 10 // 10 times of mocha async timeout
			}
		}, function(err, res) {
			if (err) return cb(err)
			session.exec('execute_async', {
				body: {
					script: script,
					args: []
				}
			}, function(err, value) {
				if (err) {
					debug('exec fail', err)
					return cb(err)
				}
				if (value && 'object' == typeof value) {
					if (value.error) return cb(new Error('Page error: ' + value.error))
					cb(null, value, session)
					session.exit()
				} else {
					cb(new Error('Unknow error'))
				}
			})
		})
	})
}

exports.print = function(logs) {
	if (Array.isArray(logs)) {
		logs.forEach(function(log) {
			console.log.apply(console, log)
		})
	}
}
