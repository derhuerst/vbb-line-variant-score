'use strict'

const mapping = require('merged-vbb-stations')
const stations = require('vbb-stations/full.json')
const readLines = require('vbb-lines')
const hifo = require('hifo')

const nameOf = Object.create(null)
for (let oldId in stations) {
	const newId = mapping[oldId]
	const name = stations[newId].name
	for (let stop of stations[oldId].stops) nameOf[stop.id] = name
}

const create = require('.')

const getU2 = (cb) => {
	const s = readLines()
	s.on('data', (line) => {
		if (line.name.toLowerCase() === 'u2') {
			s.destroy()
			cb(line)
		}
	})
}

getU2((line) => {
	const computeLineVariantScore = create(line.variants)
	const rank = hifo(hifo.highest(0), 4)

	for (let v of line.variants) {
		rank.add([
			computeLineVariantScore(v), v
		])
	}

	for (let [score, v] of rank.data) {
		console.log(v.stations.map(s => nameOf[s]))
		console.log(score)
		console.log('')
	}
})
