const DeBruijnTable = new Int32Array([
	0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
	31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9,
]);

/**
 * Count Leading Zeros.
 *
 * @param x - Number to count the leading zeros for.
 * @returns Returns the number of leading zero bits in the 32-bit binary representation of a number.
 */
export const clz = Math.clz32;

/**
 * Returns the result of 32-bit multiplication of two numbers.
 *
 * @param x — First number.
 * @param y — Second number.
 * @returns 32-bit multiplication of two numbers.
 */
// eslint-disable-next-line prefer-destructuring
export const imul = Math.imul;

/**
 * Count Leading Ones and beyond.
 *
 * @param x - Number to count the leading ones for.
 * @returns Returns the number of leading one bits in the 32-bit binary representation of a number.
 */
export function clon(x: number): number {
	return clz(~x);
}

/**
 * Count Trailing Zeros.
 *
 * @param x - Number to count the trailing zeros for.
 * @returns Returns the number of trailing zero bits in the 32-bit binary representation of a number.
 */
export function ctrz(x: number): number {
	return ((!x) as unknown as number * 32 | 0)
		+ ((!!x) as unknown as number * DeBruijnTable[(((x & -x) * 0x077CB531)) >>> 27]);
}

/**
 * Count Trailing Ones.
 *
 * @param x - Number to count the trailing ones for.
 * @returns Returns the number of trailing one bits in the 32-bit binary representation of a number.
 */
export function ctron(x: number): number {
	return ctrz(~x);
}

/**
 * Calculate the number of set bits (hamming weight/pop count) in a 32 binary representation of a number.
 *
 * @param x - Number to calculate the number of ones for.
 * @returns The number of set bits in the 32-bit binary representation of a number.
 */
export function ones(x: number): number {
	let internal = x | 0;

	internal -= (internal >>> 1) & 0x55555555;
	internal = (internal & 0x33333333) + ((internal >>> 2) & 0x33333333);

	return ((internal + (internal >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
}

/**
 * Calculate the number of off bits in a 32 binary representation of a number.
 *
 * @param x - Number to calculate the number of ones from.
 * @returns The number of off bits in the 32 binary representation of a number.
 */
export function zeros(x: number): number {
	return ones(~x);
}
