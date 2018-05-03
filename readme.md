# vbb-line-variant-score

**Identify the canonical variants of a VBB line.**

[![npm version](https://img.shields.io/npm/v/vbb-line-variant-score.svg)](https://www.npmjs.com/package/vbb-line-variant-score)
[![build status](https://api.travis-ci.org/derhuerst/vbb-line-variant-score.svg?branch=master)](https://travis-ci.org/derhuerst/vbb-line-variant-score)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-line-variant-score.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install vbb-line-variant-score
```


## Usage

```js
const readLines = require('vbb-lines')

readLines()
.on('data', (line) => {
	const computeLineVariantScore = create(line.variants)

	for (let variant of line.variants) {
		console.log(
			computeLineVariantScore(variant),
			variant
		)
	}
})
```

Most VBB lines have 1 "canonical" set of stations, hence 2 "canonical" variants. They will be the 2 variants with the highest score.


## Contributing

If you have a question or have difficulties using `vbb-line-variant-score`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-line-variant-score/issues).
