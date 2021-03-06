<img src="https://github.com/unnoon/cell-bitset/raw/master/rsc/img/cell-bitset.png">

[![Build Status](https://travis-ci.org/unnoon/cell-bitset.svg?branch=dev)](https://travis-ci.org/unnoon/cell-bitset?branch=dev)
[![Coverage Status](https://coveralls.io/repos/github/unnoon/cell-bitset/badge.svg?branch=dev)](https://coveralls.io/github/unnoon/cell-bitset?branch=dev)
[![Inline docs](http://inch-ci.org/github/unnoon/cell-bitset.svg?branch=dev)](http://inch-ci.org/github/unnoon/cell-bitset?branch=dev)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Fast(est) & consistent JavaScript BitSet (AKA bitvector, bitarray, bitstring) implementation. Implemented as part of my upcoming(...loading...) cell game engine, but perfectly usable as a standalone lib.

## Features

- Fast! 
- Fully tested
- Fully documented
- Both bitset & bitvector like methods
- Pascal methods respect immutability
- Chaining
- Lots of aliases
- Lots of output options
- ES6 binaries
- Made with bits of love!

## Installation

[npm](https://www.npmjs.com)

`npm install cell-bitset`

## Usage

```js
const bs1 = BitSet.create() // default length is 32
    .set(7)
    .set(54) // the length of the underlying bitvector is automatically resized to 55
    .set(23);

const bs2 = BitSet.create(68) // create a bitvector with a specific size
    .add(7, 67, 23);

const bs3 = new BitSet([7, 54, 23]); // use an iterable to initialize the bitset.

bs1.union(bs2);

expect(bs1.toString()).to.eql('{7, 23, 54, 67}');
expect(bs1.toString(2)).to.eql('10000000000001000000000000000000000000000000100000000000000010000000'); // will output the bitstring
expect(bs1.length).to.eql(68); // The length of the underlying bitvector. The length of bs1 is automatically resized
expect(bs1.cardinality).to.eql(4); // i.e. the number of flipped bits

const bs4 = bs3.Union(bs2); // use Pascal case Union to output a new bitset and leave bs3 unchanged

expect(bs3.toString()).to.eql('{7, 23, 54}');
expect(bs4.toString()).to.eql('{7, 23, 54, 67}');
```

For more usage example see the [unit tests](test/unit/BitSet.spec.ts).

