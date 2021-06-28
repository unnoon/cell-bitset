/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation.
 */

import type { Primitive } from 'type-fest';
import { ctrz, ones } from './Int32';

type BigIntish = bigint|BigInt|BitSet // eslint-disable-line no-use-before-define

/**
 * Fast JS BitSet implementation.
 */
export default class BitSet {
	/**
	 * Creates a bitset from a bigint.
	 *
	 * @param value Bigint to create a BitSet from.
	 * @returns the created BitSet.
	 */
	static from(value: bigint): BitSet {
		const bitset = new BitSet();

		bitset.#value = value;

		return bitset;
	}

	/**
	 * The internal bigint representation of the bit set.
	 */
	#value = 0n;

	/**
	 * BitSet constructor
	 *
	 * @param bits Number iterator to initialize the bitset with.
	 */
	constructor(bits: Iterable<number> = []) {
		this.add(...bits);
	}

	/**
	 * A method that returns the default iterator for an object.
	 * Called by the semantics of the for-of statement.
	 *
	 * @returns The iterator for the bitset.
	 */
	[Symbol.iterator](): IterableIterator<number> {
		return iterator(this.#value);
	}

	/**
	 * A method that converts an object to a corresponding primitive value.
	 * Called by the ToPrimitive abstract operation.
	 *
	 * @param hint Typeof value hit to be used in this to primitive conversion.
	 * @returns The internal bigint representation.
	 */
	[Symbol.toPrimitive](hint: Primitive): string|bigint {
		return (hint === 'string')
			? this.toString()
			: this.#value;
	}

	/**
	 * A String value that is used in the creation of the default string description of an object.
	 * Called by the built-in method Object.prototype.toString.
	 *
	 * @returns toStringTag value.
	 */
	get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Adds numbers(indices) to the set.
	 *
	 * @param bits - Indices/numbers to add to the set.
	 * @returns this.
	 */
	add(...bits: number[]): BitSet {
		this.#value = add(this.#value, bits);

		return this;
	}

	/**
	 * Clears the bitset. Length will be maintained.
	 *
	 * @returns this.
	 */
	clear(): BitSet {
		this.#value = 0n;

		return this;
	}

	/**
	 * Creates a clone of the bitset.
	 *
	 * @returns  clone.
	 */
	clone(): BitSet {
		const clone = BitSet.from(this.#value);

		return clone;
	}

	/**
	 * Calculates the (two's) complement of the set.
	 *
	 * @returns this.
	 */
	complement(): BitSet {
		this.#value = complement(this.#value);

		return this;
	}

	/**
	 * Calculates if the bitset contains a certain bitset.
	 * In bitmask terms it will calculate if a bitmask fits a bitset.
	 *
	 * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
	 * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
	 */
	contains(mask: BigIntish): boolean {
		return contains(this.#value, mask);
	}

	/**
	 * Removes indices/numbers from the bitset.
	 *
	 * @param indices - The indices/numbers to be removed.
	 * @returns this.
	 */
	delete(...indices: number[]): BitSet {
		this.#value = del(this.#value, indices);

		return this;
	}

	/**
	 * Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object.
	 * This is kept similar to the Map object, so that each entry has the same value for its key and value here.
	 *
	 * @yields an iterable iterator yielding set indices [index, index].
	 */
	* entries(): IterableIterator<[number, number]> {
		for (const idx of this) {
			yield [idx, idx];
		}
	}

	/**
	 * Tests if 2 bitsets are equal.
	 *
	 * @param bitset - Bitset to compare to this.
	 * @returns a boolean indicating if the the 2 bitsets are equal.
	 */
	equals(bitset: BitSet): boolean {
		return this.#value === bitset.#value;
	}

	/**
	 * Flips a bit in the bitset.
	 *
	 * @param index - Index of the bit to be flipped.
	 * @returns this.
	 */
	flip(index: number): BitSet {
		this.#value ^= (1n << BigInt(index));

		return this;
	}

	/**
	 * Iterates over the set bits and calls the callback function with: value index, this.
	 * Can be broken prematurely by returning false.
	 *
	 * @param cb  - Callback function to be called on each bit.
	 * @param ctx - Context to be called upon the callback function.
	 * @returns a boolean indicating if the loop finished completely=true or was broken=false.
	 */
	forEach(cb: (value: number, index: number, bitset: BitSet) => unknown|boolean, ctx?: Record<string, unknown>): boolean { // eslint-disable-line max-len
		for (const idx of this) {
			if (cb.call(ctx, idx, idx, this) === false) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Gets a specific bit from the bitset.
	 *
	 * @param index - Index of the bit to get.
	 * @returns the value of the bit at the given index.
	 */
	get(index: number): number {
		return get(this.#value, index);
	}

	/**
	 * Checks is the bitsets has a value/index.
	 *
	 * @param index - The index/value to check membership for.
	 * @returns a boolean indicating if the bitset has the vale/index.
	 */
	has(index: number): boolean {
		return has(this.#value, index);
	}

	/**
	 * Calculates if two bitsets intersect.
	 *
	 * @param bitset - The bitset to check intersection with.
	 * @returns a boolean indicating if the two bitsets intersects.
	 */
	intersects(bitset: BitSet): boolean {
		return !!(this.#value & bitset.#value);
	}

	/**
	 * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
	 *
	 * @param index - Index/number to add to the set.
	 * @param val   - Value (0|1) to set.
	 * @returns this.
	 */
	set(index: number, val = 1 | 0): BitSet {
		this.#value = set(this.#value, index, val);

		return this;
	}

	/**
	 * Getter for the length of the bit array.
	 *
	 * @returns The size of the set.
	 */
	get size(): number {
		let remainder = this.#value;
		let word;
		let size = 0;

		while (remainder) {
			word = Number(BigInt.asIntN(32, remainder));

			size += ones(word);

			remainder >>= 32n;
		}

		return size;
	}

	/**
	 * Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
	 *
	 * @returns the stringified bitvector.
	 */
	toBitString(): string {
		let prevIdx = 0;
		let bitString = '';

		this.forEach((idx) => {
			const diff = idx - prevIdx;

			prevIdx = idx;

			bitString = `1${'0'.repeat(diff - 1)}${bitString}`;
		});

		bitString ||= '0';

		return bitString;
	}

	/**
	 * Will output a string version of the bitset or bitstring.
	 *
	 * @param mode - Mode of toString. undefined=bitset | 2=bitstring
	 * @returns stringified version of the bitset.
	 */
	toString(mode?: number): string {
		let output = '';

		switch (mode) {
		case 2: output = this.toBitString(); break;
		default: output = '{'; this.forEach((val) => { output += ((output !== '{') ? ', ' : '') + val; }); output += '}'; break; } // eslint-disable-line brace-style, max-len

		return output;
	}

	valueOf(): bigint {
		return this.#value;
	}

	/**
	 * Returns a value iterator
	 *
	 * @returns an iterable iterator yielding set indices [index, index].
	 */
	values(): IterableIterator<number> {
		return this[Symbol.iterator]();
	}
}

/**
 * Adds numbers(indices) to the set.
 *
 * @param bigint  - The bigint/bit set to add numbers to.
 * @param bits - Indices/numbers to add to the set.
 * @returns Big int with added indices.
 */
export function add(bigint: BigIntish, bits: number[]): bigint {
	let output = bigint as bigint;
	const max = bits.length;

	for (let i = 0; i < max; i++) {
		output = set(output, bits[i]);
	}

	return output;
}

/**
 * Returns the (two's) complement of the given bigint
 *
 * @param bigint - bigint to calculate the (two's) complement for.
 * @returns The (two's) complement of the provided bigint.
 */
export function complement(bigint: BigIntish): bigint {
	return ~(bigint as bigint);
}

/**
 * Calculates if the bitset contains a certain bitset.
 * In bitmask terms it will calculate if a bitmask fits a bitset.
 *
 * @param bigint - Bitset to check containment/fit for.
 * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
 * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
 */
export function contains(bigint: BigIntish, mask: BigIntish): boolean {
	return ((bigint as bigint) & (mask as bigint)) == (mask as bigint); // eslint-disable-line eqeqeq
}

/**
 * Removes indices/numbers from the bitset.
 *
 * @param bigint - Bigint-ish to remove indices from
 * @param bits - The indices/numbers to be removed.
 * @returns this.
 */
export function del(bigint: BigIntish, bits: number[]): bigint {
	let output = bigint as bigint;
	const max = bits.length;

	for (let idx = 0; idx < max; idx++) {
		output = set(output, bits[idx], 0);
	}

	return output;
}

/**
 * Calculates the difference between 2 bitsets.
 * The result is stored in this.
 *
 * @param bigints - Bigint-ish to calculate the difference from
 * @returns this.
 */
export function difference(...bigints: BigIntish[]): bigint {
	const max = bigints.length;

	let output = bigints[0] as bigint;

	for (let idx = 1; idx < max && output; idx++) {
		output &= ~(bigints[idx] as bigint);
	}

	return output;
}

/**
 * Flips a bit in the bitset.
 *
 * @param bigint - Provided bigint to work from.
 * @param index - Index of the bit to be flipped.
 * @returns this.
 */
export function flip(bigint: BigIntish, index: number): bigint {
	return (bigint as bigint) ^ (1n << BigInt(index));
}

/**
 * Gets a specific bit from the bitset.
 *
 * @param bigint - Provided bigint to work from.
 * @param index - Index of the bit to get.
 * @returns the value of the bit at the given index.
 */
export function get(bigint: BigIntish, index: number): number {
	return Number((bigint as bigint) >> BigInt(index)) & 1;
}

/**
 * Checks is the bitsets has a value/index.
 *
 * @param bigint - Provided bigint to work from.
 * @param index - The index/value to check membership for.
 * @returns a boolean indicating if the bitset has the vale/index.
 */
export function has(bigint: BigIntish, index: number): boolean {
	return !!get(bigint, index);
}

/**
 * Calculates the intersection bigints/bit sets
 *
 * @param bigints - Big ints to calculate the intersection off.
 * @returns The intersection of all the bigints provided.
 */
export function intersection(...bigints: BigIntish[]): bigint {
	const max = bigints.length;

	let output = bigints[0] as bigint;

	for (let idx = 1; idx < max && output; idx++) {
		output &= bigints[idx] as bigint;
	}

	return output;
}

/**
 * Returns a set bit iterator for a bigint.
 *
 * @param bigint - bigint to create a set bit iterator for.
 * @yields Set bits in the provided bigint.
 */
export function* iterator(bigint: BigIntish): IterableIterator<number> {
	let remainder = bigint as bigint;
	let word;
	let subIdx = 0;
	let accIdx = 0;
	let idx;

	while (remainder) {
		word = Number(BigInt.asIntN(32, remainder));

		while (word) {
			subIdx = ctrz(word);
			idx = accIdx + subIdx;

			yield idx;

			word ^= 1 << subIdx;
		}

		accIdx += 32;
		remainder >>= 32n;
	}
}

/**
 * Adds a number(index) to the bigint/bit set.
 *
 * @param bigint - Big int to set a bit to.
 * @param index  - Index/number to add to the set.
 * @param val    - Value (0|1) to set.
 * @returns Big int with the appropriate set bit.
 */
export function set(bigint: BigIntish, index: number, val = 1 | 0): bigint {
	const output = (val)
		? (bigint as bigint) | (1n << BigInt(index))
		: (bigint as bigint) & ~(1n << BigInt(index));

	return output;
}

/**
 * Calculates the symmetric difference bigints/bit sets
 *
 * @param bigints - Bigints to calculate the intersection of.
 * @returns The intersection of all the bigints provided.
 */
export function xor(...bigints: BigIntish[]): bigint {
	const max = bigints.length;

	let output = bigints[0] as bigint;

	for (let idx = 1; idx < max; idx++) {
		output ^= bigints[idx] as bigint;
	}

	return output;
}

/**
 * Calculates the union of the provided bigints/bit sets
 *
 * @param {...any} bigints - bigint to get the union of
 * @returns The intersection of all the bigints provided.
 */
export function union(...bigints : BigIntish[]): bigint {
	const max = bigints.length;

	let output = bigints[0] as bigint;

	for (let idx = 1; idx < max; idx++) {
		output |= bigints[idx] as bigint;
	}

	return output;
}
