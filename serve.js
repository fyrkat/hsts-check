var checkHSTS = require('./hsts-check.js')
var dataReader = require('./data-reader.js')
var http = require('http')

function run(err, hstsData, pinData) {
	if (err) {
		return console.error(err)
	}

	http.createServer(function (req, res) {
		var domain = req.url.substr(1)
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end(JSON.stringify(checkHSTS(domain, hstsData, pinData)) + "\n")
	}).listen(process.env.PORT || 8080)
}

dataReader(process.argv[2] || '7ce52e55c486ac3129cea139f771e43ee1024845', run)
