/* eslint-disable */
// const Benchmark = require('benchmark');
import Benchmark from 'benchmark'

let result = '';
const suite = new Benchmark.Suite();

var arr = [], range = 100;

for(var i = 0; i < range; i++){
    arr[i]=Math.floor((Math.random() * 500) + 1);
}

console.log(arr);

// add tests
suite
	.add('for', () => {
		const max = arr.length

		for(let i = 0; i < max; i++ ) {
			arr[i]
		}
	})
	.add('for of', () => {
		for(const elm of arr) {
			elm
		}
	})
	.add('while', () => {
		let i = arr.length

		while(i--) {
			arr[i]
		}
	})
	.add('forEach', () => {
		arr.forEach((elm) => elm)
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
