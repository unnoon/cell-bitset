/// <reference types="jest" />
import BitSet, {
	difference, intersection, isEmpty, isEqual, symmetricDifference, union,
} from './BitSet';

describe('BitSet', () => {
	describe('static', () => {
		test('from', () => {
			const bs = BitSet.from(6n);

			expect(`${bs}`).toBe('{1, 2}');
		});
	});

	describe('prototype', () => {
		test('constructor (empty)', () => {
			const bs = new BitSet();

			expect(`${bs}`).toBe('{}');
		});

		test('constructor with number iterator', () => {
			const bs = new BitSet([3, 4]);

			expect(`${bs}`).toBe('{3, 4}');
		});

		test('constructor with bitset', () => {
			const bs1 = new BitSet([3, 4]);
			const bs2 = new BitSet(bs1);

			expect(`${bs2}`).toBe('{3, 4}');
		});

		test('[Symbol.iterator]', () => {
			const bs1 = BitSet.from(6n);

			expect([...bs1]).toEqual([1, 2]);
		});

		test('[Symbol.toPrimitive]', () => {
			const bs = BitSet.from(6n);

			// @ts-expect-error awaiting support for this: https://github.com/microsoft/TypeScript/issues/2361
			expect(bs + 6n).toEqual(12n);
		});

		test('[Symbol.toStringTag]', () => {
			const bs = new BitSet();

			expect(Object.prototype.toString.call(bs)).toBe('[object BitSet]');
		});

		test('add', () => {
			const bs = new BitSet();

			bs.add(3, 4);

			expect(`${bs}`).toBe('{3, 4}');
		});

		test('clear', () => {
			const bs = new BitSet([3, 4]);

			expect(`${bs}`).toBe('{3, 4}');

			bs.clear();

			expect(`${bs}`).toBe('{}');
		});

		test('clone', () => {
			const bs = new BitSet([3, 4]);
			const bs_ = bs.clone();

			expect(`${bs_}`).toBe('{3, 4}');
			expect(bs_).not.toBe(bs);
		});

		test('complement', () => {
			const bs = new BitSet([2, 5, 7]);

			expect(`${bs}`).toBe('{2, 5, 7}');

			bs.complement();

			expect(bs.valueOf()).toBe(-165n);
		});

		test('isSuperSet', () => {
			const bs1 = new BitSet([2, 5, 7]);
			const bs2 = new BitSet([2, 5]);

			expect(bs1.isSuperSet(bs2)).toBe(true);
			expect(bs2.isSuperSet(bs1)).toBe(false);
		});

		test('delete', () => {
			const bs = new BitSet([6, 14, 62]);

			bs.delete(14, 62);

			expect(`${bs}`).toBe('{6}');
		});

		test('difference', () => {
			const bs1 = new BitSet([6, 14, 62]);
			const bs2 = new BitSet([6, 16]);

			bs1.difference(bs2);

			expect(`${bs1}`).toBe('{14, 62}');
		});

		test('entries', () => {
			const bs = new BitSet([7, 67, 23]);

			expect([...bs.entries()]).toEqual([[7, 7], [23, 23], [67, 67]]);
		});

		test('intersection', () => {
			const bs1 = new BitSet([6, 14, 62]);
			const bs2 = new BitSet([6, 16]);

			bs1.intersection(bs2);

			expect(`${bs1}`).toBe('{6}');
		});

		test('isEmpty', () => {
			const bs1 = new BitSet([6, 14, 62]);
			const bs2 = new BitSet();

			expect(bs1.isEmpty()).toBe(false);
			expect(bs2.isEmpty()).toBe(true);
		});

		test('isEqual', () => {
			const bs1 = new BitSet([6, 14, 62]);
			const bs2 = new BitSet([6, 14, 62]);
			const bs3 = new BitSet([6]);

			expect(bs1.isEqual(bs2)).toBe(true);
			expect(bs2.isEqual(bs3)).toBe(false);
		});

		test('flip', () => {
			const bs = new BitSet([3, 4]);

			bs.flip(3).flip(5);

			expect(`${bs}`).toBe('{4, 5}');
		});

		test('forEach', () => {
			const bs = new BitSet([6, 14, 62]);
			const indices: number[] = [];
			const values: number[] = [];

			const result = bs.forEach((val, i, bsi) => {
				indices.push(i);
				values.push(val);
				expect(bsi).toBe(bs);
			});

			expect(indices).toEqual([6, 14, 62]);
			expect(values).toEqual([6, 14, 62]);
			expect(result).toBe(true);
		});

		test('forEach with break', () => {
			const bs = new BitSet([6, 14, 62]);
			const indices: number[] = [];
			const values: number[] = [];

			const result = bs.forEach((val, i, bsi) => {
				indices.push(i);
				values.push(val);
				expect(bsi).toBe(bs);
				return i < 2;
			});

			expect(indices).toEqual([6]);
			expect(values).toEqual([6]);
			expect(result).toBe(false);
		});

		test('get', () => {
			const bs = new BitSet();

			bs.set(3);

			expect(bs.get(3)).toBe(1);
			expect(bs.get(0)).toBe(0);
			expect(bs.get(4)).toBe(0);
			expect(bs.get(67853426)).toBe(0);
			expect(bs.get(-6785342)).toBe(0);
		});

		test('has', () => {
			const bs = new BitSet([3]);

			expect(bs.has(3)).toBe(true);
			expect(bs.has(1)).toBe(false);
		});

		test('intersects', () => {
			const bs1 = new BitSet([3, 123]);
			const bs2 = new BitSet([3, 6, 8]);
			const bs3 = new BitSet([1, 2, 567]);

			expect(bs1.intersects(bs2)).toBe(true);
			expect(bs1.intersects(bs3)).toBe(false);
		});

		test('set', () => {
			const bs = new BitSet();

			bs.set(3);

			expect(bs.valueOf()).toBe(8n);
		});

		test('set specific value', () => {
			const bs = new BitSet();

			bs.set(3);
			bs.set(3, 0);

			expect(bs.valueOf()).toBe(0n);
		});

		test('size', () => {
			const bs = new BitSet([6, 14, 62]);

			expect(bs.size).toBe(3);

			const bs1 = new BitSet([]);

			expect(bs1.size).toBe(0);
		});

		test('symmetricDifference', () => {
			const bs1 = new BitSet([6, 14, 62]);
			const bs2 = new BitSet([6, 16]);

			bs1.symmetricDifference(bs2);

			expect(`${bs1}`).toBe('{14, 16, 62}');
		});

		test('toBitString', () => {
			const bs1 = new BitSet([9, 14, 60, 1]);

			expect(bs1.toString(2)).toBe('100000000000000000000000000000000000000000000010000100000001');

			const bs2 = new BitSet();

			expect(bs2.toBitString()).toBe('0');

			const bs3 = new BitSet([1]);

			expect(bs3.toBitString()).toBe('1');

			const bs4 = new BitSet([2]);

			expect(bs4.toBitString()).toBe('10');
		});

		test('toString', () => {
			const bs = new BitSet([9, 14, 60, 1]);

			expect(`${bs}`).toBe('{1, 9, 14, 60}');
			expect(bs.toString(2)).toBe('100000000000000000000000000000000000000000000010000100000001');
		});

		test('union', () => {
			const bs1 = new BitSet([6, 14, 62]);
			const bs2 = new BitSet([6, 16]);

			bs1.union(bs2);

			expect(`${bs1}`).toBe('{6, 14, 16, 62}');
		});

		test('valueOf', () => {
			const bs = BitSet.from(45n);

			expect(bs.valueOf()).toEqual(45n);
		});

		test('values', () => {
			const bs = new BitSet([6, 14, 62, 256]);

			const values = bs.values();

			expect([...values]).toEqual([6, 14, 62, 256]);
		});
	});
});

describe('BigIntish functions', () => {
	test('difference', () => {
		const bs1 = new BitSet([6, 14, 62]);
		const bs2 = new BitSet([6, 16]);

		const dbs = BitSet.from(difference(bs1, bs2));

		expect(`${dbs}`).toBe('{14, 62}');
	});

	test('intersection', () => {
		const bs1 = new BitSet([6, 14, 62]);
		const bs2 = new BitSet([6, 14]);

		expect(intersection(bs1, bs2)).toBe(16448n); // {6, 14}
	});

	test('union', () => {
		const bs1 = new BitSet([6, 14, 62]);
		const bs2 = new BitSet([6, 16]);

		const ubs = BitSet.from(union(bs1, bs2));

		expect(`${ubs}`).toBe('{6, 14, 16, 62}');
	});

	test('symmetricDifference', () => {
		const bs1 = new BitSet([6, 14, 62]);
		const bs2 = new BitSet([6, 16]);

		const sdbs = BitSet.from(symmetricDifference(bs1, bs2));

		expect(`${sdbs}`).toBe('{14, 16, 62}');
	});

	test('isEmpty', () => {
		const bs1 = new BitSet([6, 14, 62]);
		const bs2 = new BitSet();

		expect(isEmpty(bs1.valueOf())).toBe(false);
		expect(isEmpty(bs2)).toBe(true);
	});

	test('isEqual', () => {
		const bs1 = new BitSet([6, 14, 62]);
		const bs2 = new BitSet([6, 14, 62]);
		const bs3 = new BitSet([6]);

		expect(isEqual(bs1.valueOf(), bs2)).toBe(true);
		expect(isEqual(bs1, bs3)).toBe(false);
	});
});
