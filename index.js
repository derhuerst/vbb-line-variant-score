'use strict'

const mapping = require('merged-vbb-stations')
const stations = require('vbb-stations/full.json')

const stationOf = Object.create(null)

for (let origId in stations) {
	const newId = mapping[origId]

	stationOf[origId] = newId
	for (let stop of stations[origId].stops) stationOf[stop.id] = newId
}

const create = (allVariants) => {
	const stationCounts = Object.create(null)
	for (let v of allVariants) {
		for (let stop of v.stops) {
			const station = stationOf[stop]
			if (!stationCounts[station]) stationCounts[station] = 1
			else stationCounts[station]++
		}
	}

	const computeLineVariantScore = (variant) => {
		let score = 0
		for (let stop of variant.stops) {
			const station = stationOf[stop]
			score += stationCounts[station]
		}
		return score * variant.trips
	}
	return computeLineVariantScore
}

module.exports = create
