/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation.
 */

type numeric = number|bigint

/**
 * Fast JS BitSet implementation.
 */
export default class BitSet {
	/**
	 * The species of the BitSet. Which is just the BitSet constructor.
	 */
	public static [Symbol.species] = BitSet;

	/**
	 * Custom name for Object.prototype.toString.call(bitset) === [object BitSet]
	 */
	public [Symbol.toStringTag] = 'BitSet';

	public value = 0n

	// TOOD iterable
	constructor(value = 0n) {
		this.value = value;
	}

	/**
	 * Adds numbers(indices) to the set.
	 *
	 * @param indices - Indices/numbers to add to the set.
	 *
	 * @returns this.
	 */
	// TODO any iterable
	public add(...indices: number[]): BitSet {
		for (let i = indices.length; i--;) {
			this.set(indices[i]);
		}

		return this;
	}

	/**
	 * Calculates the intersection between two bitsets.
	 * The result is stored in this.
	 *
	 * @param bitset - The bitset to calculate the intersection with.
	 *
	 * @returns this.
	 */
	public and(bitset: BitSet): BitSet {
		this.value &= bitset.value;

		return this;
	}

	/**
	 * Clears the bitset. Length will be maintained.
	 *
	 * @returns this.
	 */
	public clear(): BitSet {
		this.value = 0n;

		return this;
	}

	/**
	 * Creates a clone of the bitset.
	 *
	 * @returns  clone.
	 */
	public clone(): BitSet {
		return new BitSet(this.value);
	}

	/**
	 * Calculates the inverse of the set.
	 *
	 * @returns this.
	 */
	public complement(): BitSet {
		this.value = ~this.value;

		return this;
	}

	/**
	 * Calculates the difference between 2 bitsets.
	 * The result is stored in this.
	 *
	 * @param bitset - The bitset to subtract from the current one.
	 *
	 * @returns this.
	 */
	public difference(bitset: BitSet): BitSet {
		this.value &= ~bitset.value;

		return this;
	}

	/**
	 * Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object.
	 * This is kept similar to the Map object, so that each entry has the same value for its key and value here.
	 *
	 * @returns an iterable iterator yielding set indices [index, index].
	 */
	public entries(): IterableIterator<[number, number]> {
		const bits: Array<[number, number]> = [];
		const bitsIteratorFn = function* (bits_) {
			yield* bits_;
		};

		this.forEach((val, index) => bits.push([index, index]));

		return bitsIteratorFn(bits);
	}

	/**
	 * Tests if 2 bitsets are equal.
	 *
	 * @param bitset - Bitset to compare to this.
	 *
	 * @returns a boolean indicating if the the 2 bitsets are equal.
	 */
	public equals(bitset: BitSet): boolean {
		return this.value === bitset.value;
	}

	/**
	 * Calculates if the bitset contains a certain bitset.
	 * In bitmask terms it will calculate if a bitmask fits a bitset.
	 *
	 * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
	 *
	 * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
	 */
	public fits(mask: BitSet): boolean {
		return (this.value & mask.value) === mask.value;
	}

	/**
	 * Flips a bit in the bitset.
	 *
	 * @param index - Index of the bit to be flipped.
	 *
	 * @returns this.
	 */
	public flip(index: number): BitSet {
		this.value ^= (1n << BigInt(index));

		return this;
	}

	/**
	 * Gets a specific bit from the bitset.
	 *
	 * @param index - Index of the bit to get.
	 *
	 * @returns the value of the bit at the given index.
	 */
	public get(index: number): number {
		return Number((this.value >> BigInt(index)) & 1n);
	}

	/**
	 * Checks is the bitsets has a value/index.
	 *
	 * @param index - The index/value to check membership for.
	 *
	 * @returns a boolean indicating if the bitset has the vale/index.
	 */
	public has(index: number): boolean {
		return !!this.get(index);
	}

	/**
	 * Calculates if two bitsets intersect.
	 *
	 * @param bitset - The bitset to check intersection with.
	 *
	 * @returns a boolean indicating if the two bitsets intersects.
	 */
	public intersects(bitset: BitSet): boolean {
		return !!(this.value & bitset.value);
	}

	/**
	 * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
	 *
	 * @param index - Index/number to add to the set.
	 * @param val   - Value (0|1) to set.
	 *
	 * @returns this.
	 */
	public set(index: number, val = 1): BitSet {
		this.value = (val)
			? this.value |  (1n << BigInt(index))
			: this.value & ~(1n << BigInt(index));

		return this;
	}

	/**
	 * Getter for the length of the bit array.
	 *
	 * @returns The size of the set.
	 */
	// TODO a better algorithm for this i.e. hammingWeight
	public get size(): number {
		let count = 0;

		this.forEach(() => count++);

		return count;
	}

	/**
	 * Iterates over the set bits and calls the callback function with: value index, this.
	 * Can be broken prematurely by returning false.
	 *
	 * @param cb  - Callback function to be called on each bit.
	 * @param ctx - Context to be called upon the callback function.
	 *
	 * @returns a boolean indicating if the loop finished completely=true or was broken=false.
	 */
	// TODO better algorithm
	public forEach(cb: (value: number, index: number, bitset: BitSet) => any|boolean, ctx?: Record<string, unknown>): boolean {
		let remainder = this.value;
		let idx       = 0;

		while (remainder) {
			if (remainder & 1n) {
				if (cb.call(ctx, idx, idx, this) === false) {
					return false;
				}
			}
			idx++;
			remainder >>= 1n;
		}

		return true;
	}

	/**
	 * Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
	 *
	 * @returns the stringified bitvector.
	 */
	public toBitString(): string {
		let prevIdx   = 0;
		let bitString = '';

		this.forEach((idx) => {
			const diff = idx - prevIdx;

			prevIdx = idx;

			bitString = `1${'0'.repeat(diff - 1)}${bitString}`;
		});

		return bitString;
	}

	/**
	 * Will output a string version of the bitset or bitstring.
	 *
	 * @param mode - Mode of toString. undefined=bitset | 2=bitstring
	 *
	 * @returns stringified version of the bitset.
	 */
	public toString(mode?: number): string {
		let output = '';

		switch (mode) {
		case  2: output = this.toBitString(); break;
		default: output = '{'; this.forEach((val) => { output += ((output !== '{') ? ', ' : '') + val; }); output += '}'; break; } // eslint-disable-line brace-style

		return output;
	}

	/**
	 * Calculates the exclusion/symmetric difference between to bitsets.
	 * The result is stored in this.
	 *
	 * @param bitset - The bitset to calculate the symmetric difference with.
	 *
	 * @returns this.
	 */
	public xor(bitset: BitSet): BitSet {
		this.value ^= bitset.value;

		return this;
	}
}
