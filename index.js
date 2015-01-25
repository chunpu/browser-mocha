var Session = require('wd-exec')
var ejs = require('ejs')
var fs = require('fs')
var path = require('path')
var debug = require('debug')('browser-mocha')

module.exports = exports = run

exports.template = fs.readFileSync(path.resolve(__dirname, 'assets', 'template.ejs'), 'utf8')

exports.getScript = function(script, opt) {
	opt = opt || {}
	script = ejs.render(exports.template, {
		  script: script
		, ui: opt.ui || 'bdd'
		, timeout: opt.timeout
		, reporter: opt.reporter || 'spec'
		, title: opt.title || 'untitled'
		, shim: opt.shim || true
	})
	return script
}

function noop() {}

function run(script, opt, cb) {

	if (script && script.script) {
		return run(script.script, script, opt)
	} else if ('function' == typeof opt) {
		return run(script, {}, opt)
	}
	opt = opt || {}
	opt.timeout = opt.timeout || 10 * 1000
	script = exports.getScript(script, opt)
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
				ms: opt.timeout * 10 // 10 times of mocha async timeout
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
					value.session = session
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
