<img src="https://github.com/unnoon/cell-bitset/raw/master/rsc/img/cell-bitset.png">

[![Build Status](https://travis-ci.org/unnoon/cell-bitset.svg?branch=dev)](http://inch-ci.org/github/unnoon/cell-bitset)
[![Coverage Status](https://coveralls.io/repos/github/unnoon/cell-bitset/badge.svg?branch=dev)](https://coveralls.io/github/unnoon/cell-bitset?branch=dev)
[![Inline docs](http://inch-ci.org/github/unnoon/cell-bitset.svg?branch=dev)](http://inch-ci.org/github/unnoon/cell-bitset)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Fast(est) & consistent JavaScript BitSet (AKA bitvector, bitarray, bitstring) implementation. Implemented as part of my upcoming(...loading...) cell game engine, but perfectly usable as a standalone lib.

## Features

- Fast! 
- Fully tested
- Fully documented
- Both bitset & bitvector like operands
- Pascal case operands can be used to output new bitsets
- Chaining
- Lots of aliases
- Prototypal & Classical inheritance ready
- Supports amd, node, globals (es6 modules coming up in the near future)
- Made with bits of love!

## Installation

[bower](http://bower.io)

`bower install cell-bitset`

[npm](https://www.npmjs.com)

`npm install cell-bitset`

## Usage

```js
var bs1  = new BitSet(32)
    .add(7)
    .add(54)
    .add(23);
var bs2  = new BitSet(63)
    .add(7)
    .add(67)
    .add(23);

bs1.union(bs2);

expect(bs1.stringify()).to.eql('{7, 23, 54, 67}'); // alias for toString
expect(bs1.toString(2)).to.eql('10000000000001000000000000000000000000000000100000000000000010000000'); // will output the bitstring
expect(bs1.length).to.eql(68); // The length of the underlying bitvector. The length of bs1 is automatically resized
expect(bs1.cardinality).to.eql(4); // i.e. the number of flipped bits
```

For more usage example see the unit tests @ /test/unit/BitSet-spec.js

## Documentation

Documentation can be generated by running the command below and is outputted @ /doc.

`npm run docs`

Make sure you'll run a npm install first.

