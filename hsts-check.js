function parentDomain(subdomain) {
	var segments = subdomain.split('.')
	segments.shift()
	return segments.join('.')
}

function matchHSTS(domain, entry, recursive) {
	if (domain.length === 0) return {}
	var name = entry.name
	if ((entry.include_subdomains || recursive) && domain === name) {
		return entry
	}
	if (domain.endsWith('.' + name)) {
		return matchHSTS(parentDomain(domain), entry, false)
	}
	return {}
}

function checkHSTS(domain, hstsData, pinData) {
	var hstsMatch = {}

	for (var entry in hstsData.entries) {
		var match = matchHSTS(domain, hstsData.entries[entry], true)
		if ('name' in match) {
			if (!('name' in hstsMatch) || match.name.length < hstsMatch.name.length) {
				hstsMatch = match
			}
		}
	}
	
	if ('pins' in hstsMatch) for (var pinset in hstsData.pinsets) {
		if (hstsMatch.pins === hstsData.pinsets[pinset].name) {
			hstsMatch.pins = hstsData.pinsets[pinset]
			var static_spki_hashes = {}
			for(var p in pinData) {
				if (hstsMatch.pins.static_spki_hashes.indexOf(p) !== -1) {
					static_spki_hashes[p] = pinData[p]
				}
			}
			hstsMatch.pins.static_spki_hashes = static_spki_hashes
			break
		}
	}

	return hstsMatch
}

module.exports = checkHSTS
