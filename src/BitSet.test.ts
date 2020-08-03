import test from 'ava';
import BitSet from './BitSet';

test('constructor', (t) => {
	const bs = new BitSet();

	t.is(bs.value, 0n);
});

test('constructor with values', (t) => {
	const bs = new BitSet().add(3, 4);

	t.is(bs.value, 24n);
});

test('add', (t) => {
	const bs = new BitSet();

	bs.add(3, 4);

	t.is(bs.value, 24n);
});

test('and', (t) => {
	const bs1  = new BitSet().add(6, 14, 62);
	const bs2  = new BitSet().add(6, 14);

	const bs3 = bs1.and(bs2);

	t.is(bs3.value, 16448n); // {6, 14}
});

test('clear', (t) => {
	const bs = new BitSet().add(6, 14, 62);

	bs.clear();

	t.is(bs.value, 0n);
});

test('clone', (t) => {
	const bs  = new BitSet().add(3, 4);
	const bs_ = bs.clone();

	t.is(bs_.value, 24n);
	t.not(bs_, bs);
});

test('complement', (t) => {
	const bs  = new BitSet().add(2, 5, 7);

	t.is(bs.toString(), '{2, 5, 7}');

	bs.complement();

	t.is(bs.value, -165n);
});

test('set', (t) => {
	const bs = new BitSet();

	bs.set(3);

	t.is(bs.value, 8n);
});

test('set specific value', (t) => {
	const bs = new BitSet();

	bs.set(3);
	bs.set(3, 0);

	t.is(bs.value, 0n);
});

test('get', (t) => {
	const bs = new BitSet();

	bs.set(3);

	t.is(bs.get(3), 1);
	t.is(bs.get(0), 0);
	t.is(bs.get(4), 0);
	t.is(bs.get(67853426), 0);
	t.is(bs.get(-6785342), 0);
});

test('flip', (t) => {
	const bs = new BitSet().add(3);

	bs.flip(123).flip(3);

	t.is(bs.value, 10633823966279326983230456482242756608n);
});

test('forEach', (t) => {
	const bs      = new BitSet().add(6, 14, 62);
	const indices:  number[] = [];
	const values:   number[] = [];

	const result = bs.forEach((val, i, bsi) => {
		indices.push(i);
		values.push(val);
		t.is(bsi, bs);
	});

	t.deepEqual(indices, [6, 14, 62]);
	t.deepEqual(values, [6, 14, 62]);
	t.true(result);
});

test('has', (t) => {
	const bs = new BitSet().add(3);

	t.true(bs.has(3));
	t.false(bs.has(1));
});

test('intersects', (t) => {
	const bs1 = new BitSet().add(3, 123);
	const bs2 = new BitSet().add(3, 6, 8);
	const bs3 = new BitSet().add(1, 2, 567);

	t.true(bs1.intersects(bs2));
	t.false(bs1.intersects(bs3));
});

test('size', (t) => {
	const bs = new BitSet().add(6, 14, 62);

	t.is(bs.size, 3);
});

test('toString/stringify', (t) => {
	const bs  = new BitSet().add(9, 14, 60);

	t.is(bs.toString(), '{9, 14, 60}');
	t.is(bs.toString(2), '100000000000000000000000000000000000000000000010000100000000');
});

// // TODO set 0
