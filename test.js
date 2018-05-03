'use strict'

const test = require('tape')
const mapping = require('merged-vbb-stations')
const stations = require('vbb-stations/full.json')
const readLines = require('vbb-lines')
const hifo = require('hifo')

const create = require('.')

const stationOf = Object.create(null)
for (let oldId in stations) {
	const newId = mapping[oldId]
	stationOf[oldId] = newId
	for (let stop of stations[oldId].stops) stationOf[stop.id] = newId
}

const getU2 = (cb) => {
	const s = readLines()
	s.on('data', (line) => {
		if (line.name.toLowerCase() === 'u2') {
			s.destroy()
			cb(line)
		}
	})
}

const ruhleben = '900000025202'
const pankow = '900000130002'

test('works with U2', (t) => {
	t.plan(6)

	getU2((line) => {
		const computeLineVariantScore = create(line.variants)
		const rank = hifo(hifo.highest('score'), 2)

		for (let variant of line.variants) {
			rank.add({
				score: computeLineVariantScore(variant),
				stations: variant.stations
			})
		}

		const a = rank.data.find(v => stationOf[v.stations[0]] === ruhleben)
		t.ok(a)
		if (a) {
			t.ok(a.score > 0)
			t.equal(stationOf[a.stations[a.stations.length - 1]], pankow)
		}

		const b = rank.data.find(v => stationOf[v.stations[0]] === pankow)
		t.ok(b)
		if (b) {
			t.ok(b.score > 0)
			t.equal(stationOf[b.stations[b.stations.length - 1]], ruhleben)
		}

		t.end()
	})
})
