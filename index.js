var checkHSTS = require('./hsts-check.js')
var dataReader = require('./data-reader.js')

function run(err, hstsData, pinData) {
	if (err) {
		return console.error(err)
	}
	hstsMatch = checkHSTS(process.argv[3] || process.argv[2], hstsData, pinData)
	console.log(hstsMatch)
}

dataReader(process.argv[2] || '7ce52e55c486ac3129cea139f771e43ee1024845', run)
