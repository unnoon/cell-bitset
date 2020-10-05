/* eslint-disable */
// const Benchmark = require('benchmark');
import Benchmark from 'benchmark'

let result = '';
const suite = new Benchmark.Suite();

// add tests
suite
	.add('original', () => {
		msb(34534)
		msb(1)
		msb(532346456743634)
	})
	.add('deBruijn', () => {
		msb2(34534)
		msb2(1)
		msb2(532346456743634)
	})
	// add listeners
	.on('cycle', (event) => {
		const out = String(event.target);
		result += `${out}\n`;
		console.log(out);
	})
	.on('complete', function () {
		const out = `Fastest is ${this.filter('fastest').map('name')}`;
		// console.log(out);
		console.log(`${out}\n${result}`);
	})
	// run async
	.run({ async: true });


export function ones(num) {
	let w = num | 0; // convert to 32 bit int

	w -= (w >>> 1) & 0x55555555;
	w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

	w = ((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;

	return w | 0;
}


export function msb(num) {
	let w = num | 0;

	w |= w >> 1;
	w |= w >> 2;
	w |= w >> 4;
	w |= w >> 8;
	w |= w >> 16;

	return ones(w >> 1) | 0;
}

const multiplyDeBruijnBitPosition = [
	0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
	31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
];


function msb2(num) {
	let w = num | 0;

	w |= w >> 1;
	w |= w >> 2;
	w |= w >> 4;
	w |= w >> 8;
	w |= w >> 16;
	w = (w >> 1) + 1;

	return multiplyDeBruijnBitPosition[(w * 0x077CB531) >>> 27];
}