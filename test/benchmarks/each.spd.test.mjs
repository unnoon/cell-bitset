/* eslint-disable */
// const Benchmark = require('benchmark');
import Benchmark from 'benchmark'

let result = '';
const suite = new Benchmark.Suite();
let r1
let r2


// add tests
suite
	.add('each1', () => {
		each1(34534n)
		each1(1n)
		each1(532346456743634n)
	})
	.add('each2', () => {
		each2(34534n)
		each2(1n)
		each2(532346456743634n)
	})
	// add listeners
	.on('cycle', (event) => {
		const out = String(event.target);
		result += `${out}\n`;
		console.log(out);
	})
	.on('complete', function () {
		const out = `Fastest is ${this.filter('fastest').map('name')}`;
		console.log(out);
		// console.log([...r1], [...r2])
	})
	// run async
	.run({ async: true });


	const DeBruijnTable = Object.freeze([
		0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
		31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9,
	]);

	/**
	 * Calculate the number of set bits (hamming weight/pop count).
	 *
	 * @param num - 32 bit-ish number to calculate the number of ones from.
	 *
	 * @returns The number of set bits in the word.
	 */
	export function ones(num) {
		let w = num | 0; // convert to 32 bit int

		w -= (w >>> 1) & 0x55555555;
		w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

		w = ((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;

		return w | 0;
	}

	/**
	 * Returns the least significant bit in a word. Returns 32 in case the word is 0.
	 *
	 * @param num - The word to get the least significant bit from.
	 *
	 * @returns the least significant bit in w.
	 */
	export function lsb(num) {
		const w = num | 0;

		return DeBruijnTable[(((w & -w) * 0x077CB531)) >>> 27] | 0;
	}


function* each1(val) {
	let remainder = val;
	let wordIdx   = 0;
	let word;
	let tmp;
	let idx;
	let result = []

	while (remainder) {
		word = Number(BigInt.asIntN(32, remainder));
		wordLog = (wordIdx << 5)

		while (word) {
			tmp = (word & -word);
			idx = wordLog + ones(tmp - 1); // where 5 is the log of the word size 32

			result.push(idx)

			word ^= tmp;
		}

		remainder = val >> BigInt(++wordIdx) * 32n;
	}

	return result
}

function* each2(val) {
	let remainder = val;
	let wordIdx   = 0;
	let word;
	let subIdx = 0;
	let idxSum = 0;
	let idx;

	while (remainder) {
		word = Number(BigInt.asIntN(32, remainder));
		idxSum = wordIdx * 32;

		while (word) {
			subIdx = lsb(word);
			idx = idxSum + subIdx; // where 5 is the log of the word size 32

			result.push(idx)

			word ^= 1 << subIdx;
		}

		remainder = val >> BigInt(++wordIdx) * 32n;
	}

	return result
}