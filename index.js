var debug = require('debug')('browser-mocha')
var Session = require('wd-exec')
var ejs = require('ejs')
var fs = require('fs')
var path = require('path')
var util = require('util')

module.exports = exports = run

exports.template = fs.readFileSync(path.resolve(__dirname, 'assets', 'fill.js'), 'utf8')

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
	script = 'window.__print = arguments[arguments.length - 1];' + script
	debug('async script', script)
	cb = cb || noop
	var session = Session()
	opt = opt || {}
	debug('options: %o', opt)
	opt.script = script
	session.init(opt, function(err, value) {
		if (err) {
			debug('init fail: %o', err)
			return cb(err)
		}
		if (opt.url) {
			session.open(opt.url, function(err) {
				if (err) return cb(err)
				exec(session, opt, cb)
			})
		} else {
			exec(session, opt, cb)
		}
	})
}

function exec(session, opt, cb) {
		session.exec('timeouts/async_script', {
			body: {
				ms: opt.timeout * 10 // 10 times of mocha async timeout
			}
		}, function(err, res) {
			if (err) return cb(err)
			session.exec('execute_async', {
				body: {
					script: opt.script,
					args: []
				}
			}, function(execErr, value) {
				session.exit(function(exitErr) {
					// always exit no matter error or not
					debug('exit')
					var err = execErr || exitErr
					if (err) {
						debug('exec fail', err)
						return cb(err)
					}
					if (value && 'object' == typeof value) {
						if (value.error) return cb(new Error('Page error: ' + value.error))
						value.session = session
						cb(null, value, session)
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
			process.stdout.write(util.format.apply(util, log))
		})
	}
}
