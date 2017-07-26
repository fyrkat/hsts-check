var fs = require('fs')

var hstsData = null
var pinData = null

function read(version, cb) {
	fs.readFile(version + '/transport_security_state_static.pins', 'utf8', function(err, data) {
		if (err) {
			return cb(err)
		}
		pinData = {}
		data = data.split("\n")
		for (lineNumber = 0; lineNumber < data.length; lineNumber++) {
			var line = data[lineNumber].trim()
			if (line[0] === '#' || line.length === 0) continue
			var pin = line
			pinData[pin] = ''
			lineNumber++
			line = data[lineNumber].trim()
			while (line.length > 0) {
				pinData[pin] += line + "\n"
				lineNumber++
				line = data[lineNumber].trim()
			}
		}
		if (hstsData !== null) return cb(null, hstsData, pinData)
	})

	fs.readFile(version + '/transport_security_state_static.conv.json', 'utf8', function(err, data) {
		if (err) {
			return cb(err)
		}
		hstsData = JSON.parse(data)
		if (pinData !== null) return cb(null, hstsData, pinData)
	})
}

module.exports = read