var bm = require('../')
var assert = require('assert')
var fs = require('fs')
var spawn = require('child_process').spawn

var str = fs.readFileSync('assets/test.js')

describe('basic test', function() {
	before(function(done) {
		var phantom = spawn('phantomjs', ['-w'])
		phantom.stdout.on('data', function(buf) {
			buf = buf + ''
			if (/8910/.test(buf)) {
				done()
			}
		})
		phantom.stderr.on('data', function(buf) {
			console.error(buf + '')
		})
	})
	it('should return fails, total, logs, session', function(done) {
		bm(str, function(err, data) {
			assert(!err)
			assert(data.session && 'object' == typeof data.session.browser)
			assert(Array.isArray(data.logs), 'logs is array')
			assert(1 == data.failures, 'has one failure')
			assert(2 == data.total, 'has 2 cases')
			done()
		})
	})
	it('should get script for debug', function() {
		var script = bm.getScript(str)
		assert(/mocha/.test(script), 'has mocha')
		assert(/runner/.test(script), 'has runner')
	})
	after(function() {
		spawn('pkill', ['-9', 'phantomjs'])
	})
})
