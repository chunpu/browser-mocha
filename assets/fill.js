!function() {

var head = document.getElementsByTagName('head')[0]
function getSyncScript(url, cb) {
	var script = document.createElement('script')
	script.onload = script.onerror = script.onreadystatechange = function(ev) {
		var state = script.readyState
		if (ev && 'error' == ev.type) { // old browser has no onerror
			cb('error')
		} else if (!state || /loaded|complete/.test(state)) { // new browser has no state
			cb(null)
		}
	}
	script.src = url
	head.appendChild(script)
}

function async(arr, fn, cb) {
	var len = arr.length
	var count = 0
	for (var i = 0; i < len; i++) {
		fn(arr[i], function() {
			count++
			if (count == len) {
				cb()
			}
		})
	}
}

var __logs = []
function __push(arr) {
	__logs.push(arr)
}
window.console = window.console || {}
if (!window.__print) {
	__print = function(x) {
		console.debug(x)
	}
}
console.log = function() {
	__push(arguments)
}

var arr = ['http://rawgit.com/es-shims/es5-shim/master/es5-shim.min.js', 'http://rawgit.com/visionmedia/mocha/master/mocha.js']

async(arr, getSyncScript, function() {
	Mocha.process.stdout.write = function() {
		__push(arguments)
	}
	mocha.setup({
		ui: '<%= ui%>',
		timeout: 3000,
		reporter: '<%= reporter%>'
	})

	// template
	<%- script %>

	try {
		var runner = mocha.run()
		runner.on('end', function() {
			var obj = {
				total: runner.total,
				failures: runner.failures,
				logs: __logs
			}
			__print(obj)
		})
	} catch (e) {
		__print({
			error: e.message
		})
	}
})

}()
