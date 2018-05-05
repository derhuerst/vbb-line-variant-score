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

const getBestVariants = (name, cb) => {
	const s = readLines()
	s.on('data', (line) => {
		if (line.name.toLowerCase() === name.toLowerCase()) {
			s.destroy()

			const computeLineVariantScore = create(line.variants)
			const rank = hifo(hifo.highest('score'), 2)
			for (let variant of line.variants) {
				rank.add({
					score: computeLineVariantScore(variant),
					stops: variant.stops
				})
			}
			cb(rank.data)
		}
	})
}

const ruhleben = '900000025202'
const pankow = '900000130002'
const uhlandstr = '900000023301'
const warschauerStr = '900000120004'

test('works with U2', (t) => {
	t.plan(6)
	getBestVariants('U2', (variants) => {
		const a = variants.find(v => stationOf[v.stops[0]] === ruhleben)
		t.ok(a)
		if (a) {
			t.ok(a.score > 0)
			t.equal(stationOf[a.stops[a.stops.length - 1]], pankow)
		}

		const b = variants.find(v => stationOf[v.stops[0]] === pankow)
		t.ok(b)
		if (b) {
			t.ok(b.score > 0)
			t.equal(stationOf[b.stops[b.stops.length - 1]], ruhleben)
		}

		t.end()
	})
})

test('works with U1', (t) => {
	t.plan(6)
	getBestVariants('U1', (variants) => {
		const a = variants.find(v => stationOf[v.stops[0]] === uhlandstr)
		t.ok(a)
		if (a) {
			t.ok(a.score > 0)
			t.equal(stationOf[a.stops[a.stops.length - 1]], warschauerStr)
		}

		const b = variants.find(v => stationOf[v.stops[0]] === warschauerStr)
		t.ok(b)
		if (b) {
			t.ok(b.score > 0)
			t.equal(stationOf[b.stops[b.stops.length - 1]], uhlandstr)
		}

		t.end()
	})
})
