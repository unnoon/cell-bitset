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
	 * A String value that is used in the creation of the default string description of an object.
	 * Called by the built-in method Object.prototype.toString.
	 *
	 * @returns toStringTag value.
	 */
	get [Symbol.toStringTag](): string {
		return this.constructor.name;
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
			: this.valueOf();
	}

	/**
	 * Adds numbers(indices) to the set.
	 *
	 * @param bits - Indices/numbers to add to the set.
	 * @returns this.
	 */
	add(...bits: number[]): this {
		this.#value = add(this.#value, bits);

		return this;
	}

	/**
	 * Clears the bitset. Length will be maintained.
	 *
	 * @returns this.
	 */
	clear(): this {
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
	complement(): this {
		this.#value = complement(this.#value);

		return this;
	}

	/**
	 * Calculates if the bitset is a superset of another bitset.
	 * In bitmask terms it will calculate if a bitmask fits a bitset.
	 *
	 * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
	 * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
	 */
	isSuperSet(mask: this): boolean {
		return isSuperSet(this.#value, mask.#value);
	}

	/**
	 * Removes indices/numbers from the bitset.
	 *
	 * @param indices - The indices/numbers to be removed.
	 * @returns this.
	 */
	delete(...indices: number[]): this {
		this.#value = del(this.#value, indices);

		return this;
	}

	/**
	 * Calculates the difference between two bitsets.
	 *
	 * @param bitset - Bitset to calculate the difference with.
	 * @returns this.
	 */
	difference(bitset: this): this {
		this.#value = difference(this.#value, bitset.#value);

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
	 * Fast way to check if the bitset is empty.
	 *
	 * @returns boolean indicating that the bitset is empty.
	 */
	isEmpty(): boolean {
		return this.#value === 0n;
	}

	/**
	 * Tests if two bitsets are equal.
	 *
	 * @param bitset - Bitset to compare to this.
	 * @returns a boolean indicating if the the 2 bitsets are equal.
	 */
	isEqual(bitset: this): boolean {
		return this.#value === bitset.#value;
	}

	/**
	 * Flips a bit in the bitset.
	 *
	 * @param index - Index of the bit to be flipped.
	 * @returns this.
	 */
	flip(index: number): this {
		this.#value = flip(this.#value, index);

		return this;
	}

	/**
	 * Iterates over the set bits and calls the callback function with: value index, this.
	 * Can be broken prematurely by returning false.
	 *
	 * @param cb  - Callback function to be called on each bit.
	 * @param thisArg - Context to be called upon the callback function.
	 * @returns a boolean indicating if the loop finished completely=true or was broken=false.
	 */
	forEach(cb: (value: number, index: number, bitset: this) => unknown|boolean, thisArg?: unknown): boolean { // eslint-disable-line max-len, @typescript-eslint/explicit-module-boundary-types
		for (const idx of this) {
			if (cb.call(thisArg, idx, idx, this) === false) {
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
	 * Calculates the intersection between two bitsets.
	 *
	 * @param bitset - Bitset to calculate the intersection with.
	 * @returns this.
	 */
	intersection(bitset: this): this {
		this.#value = intersection(this.#value, bitset.#value);

		return this;
	}

	/**
	 * Calculates if two bitsets intersect.
	 *
	 * @param bitset - The bitset to check intersection with.
	 * @returns a boolean indicating if the two bitsets intersects.
	 */
	intersects(bitset: this): boolean {
		return intersects(this.#value, bitset.#value);
	}

	/**
	 * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
	 *
	 * @param index - Index/number to add to the set.
	 * @param val   - Value (0|1) to set.
	 * @returns this.
	 */
	set(index: number, val = 1 | 0): this {
		this.#value = set(this.#value, index, val);

		return this;
	}

	/**
	 * Calculates the symmetric difference (xor) between two bitsets.
	 *
	 * @param bitset - Bitset to calculate the symmetric difference with
	 * @returns this.
	 */
	symmetricDifference(bitset: this): this {
		this.#value = symmetricDifference(this.#value, bitset.#value);

		return this;
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

	/**
	 * Calculates the union between two bitsets.
	 *
	 * @param bitset - Bitset to calculate the union with.
	 * @returns this.
	 */
	union(bitset: this): this {
		this.#value = union(this.#value, bitset.#value);

		return this;
	}

	/**
	 * Returns the inner value e.g. bigint representation of the bitset.
	 *
	 * @returns the inner value e.g. bigint representation of the bitset.
	 */
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
 * @param bigintish  - The bigint/bit set to add numbers to.
 * @param bits - Indices/numbers to add to the set.
 * @returns Big int with added indices.
 */
export function add(bigintish: BigIntish, bits: number[]): bigint {
	let output = bigintish as bigint;
	const max = bits.length;

	for (let i = 0; i < max; i++) {
		output = set(output, bits[i]);
	}

	return output;
}

/**
 * Returns the (two's) complement of the given bigint
 *
 * @param bigintish - bigint to calculate the (two's) complement for.
 * @returns The (two's) complement of the provided bigint.
 */
export function complement(bigintish: BigIntish): bigint {
	return ~(bigintish as bigint);
}

/**
 * Removes indices/numbers from the bitset.
 *
 * @param bigintish - Bigint-ish to remove indices from
 * @param bits - The indices/numbers to be removed.
 * @returns this.
 */
export function del(bigintish: BigIntish, bits: number[]): bigint {
	let output = bigintish as bigint;
	const max = bits.length;

	for (let idx = 0; idx < max; idx++) {
		output = set(output, bits[idx], 0);
	}

	return output;
}

/**
 * Calculates the difference between two bigintish values.
 *
 * @param bigintish1 - First bigintish value.
 * @param bigintish2 - 2nd bigintish value.
 * @returns The difference between the given bigintish values.
 */
export function difference(bigintish1: BigIntish, bigintish2: BigIntish): bigint {
	return (bigintish1 as bigint) & ~(bigintish2 as bigint);
}

/**
 * Checks if a bigintish is empty.
 *
 * @param bigintish - To check for emptiness.
 * @returns Boolean that the bgiintish is empty.
 */
export function isEmpty(bigintish: BigIntish): boolean {
	return (bigintish as bigint) == 0n; // eslint-disable-line eqeqeq
}

/**
 * Calculates two bigintish values are equal.
 *
 * @param bigintish1 - First bigintish value.
 * @param bigintish2 - 2nd bigintish value.
 * @returns Boolean indicating if the values are equal
 */
export function isEqual(bigintish1: BigIntish, bigintish2: BigIntish): boolean {
	return (bigintish1 as bigint) == (bigintish2 as bigint); // eslint-disable-line eqeqeq
}

/**
 * Calculates if the bitset contains a certain bitset.
 * In bitmask terms it will calculate if a bitmask fits a bitset.
 *
 * @param bigintish - Bigintish to check containment/fit for.
 * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
 * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
 */
export function isSuperSet(bigintish: BigIntish, mask: BigIntish): boolean {
	return ((bigintish as bigint) & (mask as bigint)) == (mask as bigint); // eslint-disable-line eqeqeq
}

/**
 * Flips a bit in the bitset.
 *
 * @param bigintish - Provided bigintish to work from
 * @param index - Index of the bit to be flipped.
 * @returns this.
 */
export function flip(bigintish: BigIntish, index: number): bigint {
	return (bigintish as bigint) ^ (1n << BigInt(index));
}

/**
 * Gets a specific bit from the bitset.
 *
 * @param bigintish - Provided bigintish to work from.
 * @param index - Index of the bit to get.
 * @returns the value of the bit at the given index.
 */
export function get(bigintish: BigIntish, index: number): number {
	return Number((bigintish as bigint) >> BigInt(index)) & 1;
}

/**
 * Checks if the bitsets has a value/index.
 *
 * @param bigintish - Provided bigintish to work from.
 * @param index - The index/value to check membership for.
 * @returns a boolean indicating if the bitset has the vale/index.
 */
export function has(bigintish: BigIntish, index: number): boolean {
	return !!get(bigintish, index);
}

/**
 * Calculates the intersection between two bigintish values.
 *
 * @param bigintish1 - First bigintish value.
 * @param bigintish2 - 2nd bigintish value.
 * @returns The intersection between the given bigintish values.
 */
export function intersection(bigintish1: BigIntish, bigintish2: BigIntish): bigint {
	return (bigintish1 as bigint) & (bigintish2 as bigint);
}

/**
 * Calculates if two bigintish values are intersecting
 *
 * @param bigintish1 - First bigintish value.
 * @param bigintish2 - 2nd bigintish value.
 * @returns The intersection between the given bigintish values.
 */
export function intersects(bigintish1: BigIntish, bigintish2: BigIntish): boolean {
	return !!intersection(bigintish1, bigintish2);
}

/**
 * Returns an 'on' bit iterator for a bigint.
 *
 * @param bigintish - bigintish to create a 'on' bit iterator for.
 * @yields Set bits in the provided bigint.
 */
export function* iterator(bigintish: BigIntish): IterableIterator<number> {
	let remainder = bigintish as bigint;
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
 * @param bigintish - Bigintish to set a bit to.
 * @param index  - Index/number to add to the set.
 * @param val    - Value (0|1) to set.
 * @returns Big int with the appropriate set bit.
 */
export function set(bigintish: BigIntish, index: number, val = 1 | 0): bigint {
	const output = (val)
		? (bigintish as bigint) | (1n << BigInt(index))
		: (bigintish as bigint) & ~(1n << BigInt(index));

	return output;
}

/**
 * Calculates the symmetric difference (xor) between two bigintish values.
 *
 * @param bigintish1 - First bigintish value.
 * @param bigintish2 - 2nd bigintish value.
 * @returns The symmetricDifference between the given bigintish values.
 */
export function symmetricDifference(bigintish1: BigIntish, bigintish2: BigIntish): bigint {
	return (bigintish1 as bigint) ^ (bigintish2 as bigint);
}

/**
 * Calculates the union between two bigintish values.
 *
 * @param bigintish1 - First bigintish value.
 * @param bigintish2 - 2nd bigintish value.
 * @returns The union between the given bigintish values.
 */
export function union(bigintish1: BigIntish, bigintish2: BigIntish): bigint {
	return (bigintish1 as bigint) | (bigintish2 as bigint);
}
