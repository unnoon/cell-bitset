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
	static [Symbol.species] = BitSet;

	/**
	 * Custom name for Object.prototype.toString.call(bitset) === [object BitSet]
	 */
	[Symbol.toStringTag] = 'BitSet';

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
	add(...indices: number[]): BitSet {
		this.#value = add(this.#value, indices);

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
		const clone = BitSet.of(this.#value);

		return clone;
	}

	/**
	 * Calculates the inverse of the set.
	 *
	 * @returns this.
	 */
	invert(): BitSet {
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
	 * Returns a value iterator
	 *
	 * @returns an iterable iterator yielding set indices [index, index].
	 */
	values(): IterableIterator<number> {
		return this[Symbol.iterator]();
	}

	* [Symbol.iterator](): IterableIterator<number> {
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
				idx = accIdx + subIdx;

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
	equals(bitset: BitSet): boolean {
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
	contains(mask: BitSet): boolean {
		return (this.#value & mask.#value) === mask.#value;
	}

	/**
	 * Flips a bit in the bitset.
	 *
	 * @param index - Index of the bit to be flipped.
	 *
	 * @returns this.
	 */
	flip(index: number): BitSet {
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
	get(index: number): number {
		return Number(this.#value >> BigInt(index)) & 1;
	}

	/**
	 * Checks is the bitsets has a value/index.
	 *
	 * @param index - The index/value to check membership for.
	 *
	 * @returns a boolean indicating if the bitset has the vale/index.
	 */
	has(index: number): boolean {
		return !!this.get(index);
	}

	/**
	 * Calculates if two bitsets intersect.
	 *
	 * @param bitset - The bitset to check intersection with.
	 *
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
	 *
	 * @returns this.
	 */
	set(index: number, val = 1): BitSet {
		this.#value = set(this.#value, index, val);

		return this;
	}

	/**
	 * Getter for the length of the bit array.
	 *
	 * @returns The size of the set.
	 */
	// TODO improve by (ceil(log2(this < 0 ? -this : this+1))).
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
	 * Iterates over the set bits and calls the callback function with: value index, this.
	 * Can be broken prematurely by returning false.
	 *
	 * @param cb  - Callback function to be called on each bit.
	 * @param ctx - Context to be called upon the callback function.
	 *
	 * @returns a boolean indicating if the loop finished completely=true or was broken=false.
	 */
	forEach(cb: (value: number, index: number, bitset: BitSet) => unknown|boolean, ctx?: Record<string, unknown>): boolean {
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
	toBitString(): string {
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
	toString(mode?: number): string {
		let output = '';

		switch (mode) {
		case  2: output = this.toBitString(); break;
		default: output = '{'; this.forEach((val) => { output += ((output !== '{') ? ', ' : '') + val; }); output += '}'; break; } // eslint-disable-line brace-style

		return output;
	}

	valueOf() {
		return this.#value;
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
 * @returns The least significant bit in the number.
 */
export function lsb(num: number): number {
	const w = (num & -num);
	let output = 0;

	output = DeBruijnTable[((w * 0x077CB531)) >>> 27];

	return output | 0;
}

/**
 * Returns the most significant bit in a word.
 *
 * @param num - 32 bit-ish number to get the most significant bit from.
 *
 * @returns The most significant bit in number.
 */
export function msb(num: number): number {
	let w      = num | 0;
	let output = 0;

	w |= w >> 1;
	w |= w >> 2;
	w |= w >> 4;
	w |= w >> 8;
	w |= w >> 16;
	w = (w >> 1) + 1;

	output = DeBruijnTable[(w * 0x077CB531) >>> 27];

	return output | 0;
}

/**
 * Adds numbers(indices) to the set.
 *
 * @param bigint  - The bigint/bit set to add numbers to.
 * @param indices - Indices/numbers to add to the set.
 *
 * @returns Big int with added indices.
 */
export function add(bigint: bigint, indices: number[]): bigint {
	let output = bigint;
	let i = indices.length;

	while (i--) {
		output = set(output, indices[i]);
	}

	return output;
}

/**
 * Removes indices/numbers from the bitset.
 *
 * @param bigint - Bigint-ish to remove indices from
 * @param indices - The indices/numbers to be removed.
 *
 * @returns this.
 */
export function del(bigint: bigint, indices: number[]): bigint {
	let output = bigint;
	let i = indices.length;

	while (i--) {
		output = set(output, indices[i], 0);
	}

	return output;
}

/**
 * Calculates the difference between 2 bitsets.
 * The result is stored in this.
 *
 * @param bigints - Bigint-ish to calculate the difference from
 *
 * @returns this.
 */
export function difference(...bigints: bigint[]): bigint {
	let   output = bigints.shift() ?? 0n;
	const max    = bigints.length;

	for (let i = 0; i < max && output; i++) {
		output &= ~bigints[i];
	}

	return output;
}

/**
 * Calculates the intersection bigints/bit sets
 *
 * @param bigints - Big ints to calculate the intersection off.
 *
 * @returns The intersection of all the bigints provided.
 */
export function intersection(...bigints: bigint[]): bigint {
	let output = bigints.pop() ?? 0n;
	let i      = bigints.length;

	while (i-- && output) {
		output &= bigints[i];
	}

	return output;
}

/**
 * Creates of a bigint.
 *
 * @param value - Bigint internal value for the bit set.
 *
 * @returns BitSet with internal value equal to the value provided.
 */
export function of(value: bigint): BitSet {
	const bitset = BitSet.of(value);

	return bitset;
}

/**
 * Adds a number(index) to the bigint/bit set.
 *
 * @param bigint - Big int to set a bit to.
 * @param index  - Index/number to add to the set.
 * @param val    - Value (0|1) to set.
 *
 * @returns Big int with the appropriate set bit.
 */
export function set(bigint: bigint, index: number, val = 1): bigint {
	const output = (val)
		? bigint |  (1n << BigInt(index))
		: bigint & ~(1n << BigInt(index));

	return output;
}

/**
 * Calculates the symmetric difference bigints/bit sets
 *
 * @param bigints - Bigints to calculate the intersection off.
 *
 * @returns The intersection of all the bigints provided.
 */
export function symmetricDifference(...bigints: bigint[]): bigint {
	let output = bigints.pop() ?? 0n;
	let i      = bigints.length;

	while (i--) {
		output ^= bigints[i];
	}

	return output;
}

/**
 * Calculates the union of the provided bigints/bit sets
 *
 * @param bigints - Bigints to calculate the intersection off.
 *
 * @returns The intersection of all the bigints provided.
 */
export function union(...bigints: bigint[]): bigint {
	let output = bigints.pop() ?? 0n;
	let i      = bigints.length;

	while (i--) {
		output |= bigints[i];
	}

	return output;
}
