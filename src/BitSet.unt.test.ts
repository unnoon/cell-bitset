/// <reference types="jest" />
import BitSet from './BitSet';

test('constructor', () => {
	const bs = new BitSet();

	expect(bs.value).toBe(0n);
});

test('constructor with values', () => {
	const bs = new BitSet().add(3, 4);

	expect(bs.value).toBe(24n);
});

test('add', () => {
	const bs = new BitSet();

	bs.add(3, 4);

	expect(bs.value).toBe(24n);
});

test('and', () => {
	const bs1  = new BitSet().add(6, 14, 62);
	const bs2  = new BitSet().add(6, 14);

	const bs3 = bs1.and(bs2);

	expect(bs3.value).toBe(16448n); // {6, 14}
});

test('clear', () => {
	const bs = new BitSet().add(6, 14, 62);

	bs.clear();

	expect(bs.value).toBe(0n);
});

test('clone', () => {
	const bs  = new BitSet().add(3, 4);
	const bs_ = bs.clone();

	expect(bs_.value).toBe(24n);
	expect(bs_).not.toBe(bs);
});

test('complement', () => {
	const bs  = new BitSet().add(2, 5, 7);

	expect(bs.toString()).toBe('{2, 5, 7}');

	bs.complement();

	expect(bs.value).toBe(-165n);
});

test('set', () => {
	const bs = new BitSet();

	bs.set(3);

	expect(bs.value).toBe(8n);
});

test('set specific value', () => {
	const bs = new BitSet();

	bs.set(3);
	bs.set(3, 0);

	expect(bs.value).toBe(0n);
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

test('flip', () => {
	const bs = new BitSet().add(3);

	bs.flip(123).flip(3);

	expect(bs.value).toBe(10633823966279326983230456482242756608n);
});

test('forEach', () => {
	const bs      = new BitSet().add(6, 14, 62);
	const indices:  number[] = [];
	const values:   number[] = [];

	const result = bs.forEach((val, i, bsi) => {
		indices.push(i);
		values.push(val);
		expect(bsi).toBe(bs);
	});

	expect(indices).toEqual([6, 14, 62]);
	expect(values).toEqual([6, 14, 62]);
	expect(result).toBe(true);
});

test('has', () => {
	const bs = new BitSet().add(3);

	expect(bs.has(3)).toBe(true);
	expect(bs.has(1)).toBe(false);
});

test('intersects', () => {
	const bs1 = new BitSet().add(3, 123);
	const bs2 = new BitSet().add(3, 6, 8);
	const bs3 = new BitSet().add(1, 2, 567);

	expect(bs1.intersects(bs2)).toBe(true);
	expect(bs1.intersects(bs3)).toBe(false);
});

test('size', () => {
	const bs = new BitSet().add(6, 14, 62);

	expect(bs.size).toBe(3);
});

test('toString/stringify', () => {
	const bs  = new BitSet().add(9, 14, 60);

	expect(bs.toString()).toBe('{9, 14, 60}');
	expect(bs.toString(2)).toBe('100000000000000000000000000000000000000000000010000100000000');
});

// // // TODO set 0
