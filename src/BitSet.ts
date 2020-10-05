/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation.
 */

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

	#value = 0n

	static of(value: bigint): BitSet {
		const bitset = new BitSet();

		bitset.#value = value;

		return bitset;
	}

	constructor(indices: Iterable<number> = []) {
		this.add(...indices);
	}

	/**
	 * Adds numbers(indices) to the set.
	 *
	 * @param indices - Indices/numbers to add to the set.
	 *
	 * @returns this.
	 */
	public add(...indices: number[]): BitSet {
		let i = indices.length;

		while (i--) {
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
		this.#value &= bitset.#value;

		return this;
	}

	/**
	 * Clears the bitset. Length will be maintained.
	 *
	 * @returns this.
	 */
	public clear(): BitSet {
		this.#value = 0n;

		return this;
	}

	/**
	 * Creates a clone of the bitset.
	 *
	 * @returns  clone.
	 */
	public clone(): BitSet {
		return BitSet.of(this.#value);
	}

	/**
	 * Calculates the inverse of the set.
	 *
	 * @returns this.
	 */
	public complement(): BitSet {
		this.#value = ~this.#value;

		return this;
	}

	/**
	 * Removes indices/numbers from the bitset.
	 *
	 * @param indices - The indices/numbers to be removed.
	 *
	 * @returns this.
	 */
	public delete(...indices: number[]): BitSet {
		let i = indices.length;

		while (i--) {
			this.set(indices[i], 0);
		}

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
		this.#value &= ~bitset.#value;

		return this;
	}

	/**
	 * Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object.
	 * This is kept similar to the Map object, so that each entry has the same value for its key and value here.
	 *
	 * @yields an iterable iterator yielding set indices [index, index].
	 */
	public* entries(): IterableIterator<[number, number]> {
		for (const idx of this) {
			yield [idx, idx];
		}
	}

	/**
	 * Returns a value iterator
	 *
	 * @returns an iterable iterator yielding set indices [index, index].
	 */
	public values(): IterableIterator<number> {
		return this[Symbol.iterator].call(this);
	}

	public* [Symbol.iterator](): IterableIterator<number> {
		let remainder = this.#value;
		let wordIdx   = 0;
		let word;
		let subIdx = 0;
		let accIdx = 0;
		let idx;

		while (remainder) {
			word = Number(BigInt.asIntN(32, remainder));
			accIdx = wordIdx * 32;

			while (word) {
				subIdx = lsb(word);
				idx = accIdx + subIdx; // where 5 is the log of the word size 32

				yield idx;

				word ^= 1 << subIdx;
			}

			remainder = this.#value >> BigInt(++wordIdx) * 32n;
		}
	}

	/**
	 * Tests if 2 bitsets are equal.
	 *
	 * @param bitset - Bitset to compare to this.
	 *
	 * @returns a boolean indicating if the the 2 bitsets are equal.
	 */
	public equals(bitset: BitSet): boolean {
		return this.#value === bitset.#value;
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
		return (this.#value & mask.#value) === mask.#value;
	}

	/**
	 * Flips a bit in the bitset.
	 *
	 * @param index - Index of the bit to be flipped.
	 *
	 * @returns this.
	 */
	public flip(index: number): BitSet {
		this.#value ^= (1n << BigInt(index));

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
		return Number(this.#value >> BigInt(index)) & 1;
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
		return !!(this.#value & bitset.#value);
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
		this.#value = (val)
			? this.#value |  (1n << BigInt(index))
			: this.#value & ~(1n << BigInt(index));

		return this;
	}

	/**
	 * Getter for the length of the bit array.
	 *
	 * @returns The size of the set.
	 */
	public get size(): number {
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
	 * Iterates over the set bits and calls the callback function with: value index, this.
	 * Can be broken prematurely by returning false.
	 *
	 * @param cb  - Callback function to be called on each bit.
	 * @param ctx - Context to be called upon the callback function.
	 *
	 * @returns a boolean indicating if the loop finished completely=true or was broken=false.
	 */
	public forEach(cb: (value: number, index: number, bitset: BitSet) => any|boolean, ctx?: Record<string, any>): boolean {
		for (const idx of this) {
			if (cb.call(ctx, idx, idx, this) === false) {
				return false;
			}
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

		bitString ||= '0';

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

	public valueOf() {
		return this.#value;
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
		this.#value ^= bitset.#value;

		return this;
	}
}

const DeBruijnTable = Object.freeze([
	0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8, 31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9,
]);

/**
 * Calculate the number of set bits (hamming weight/pop count) in a 32 bit number/word.
 *
 * @param num - 32 bit-ish number to calculate the number of ones from.
 *
 * @returns The number of set bits in the word.
 */
export function ones(num: number): number {
	let w = num | 0; // convert to 32 bit int

	w -= (w >>> 1) & 0x55555555;
	w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

	w = ((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;

	return w | 0;
}

/**
 * Returns the least significant bit in a word. Returns 32 in case the word is 0.
 *
 * @param num - 32 bit-ish number to get the least significant bit from.
 *
 * @returns the least significant bit in the number.
 */
export function lsb(num: number): number {
	const w = num | 0;

	return DeBruijnTable[(((w & -w) * 0x077CB531)) >>> 27] | 0;
}

/**
 * Returns the most significant bit in a word.
 *
 * @param num - 32 bit-ish number to get the most significant bit from.
 *
 * @returns the most significant bit in number.
 */
export function msb(num: number): number {
	let w = num | 0;

	w |= w >> 1;
	w |= w >> 2;
	w |= w >> 4;
	w |= w >> 8;
	w |= w >> 16;
	w = (w >> 1) + 1;

	return DeBruijnTable[(w * 0x077CB531) >>> 27] | 0;
}
