import { clz, ctrz } from './Int32';

test('clz', () => {
	expect(clz(-(1 << 2))).toEqual(0); // TODO check!!!
	expect(clz(-(1 << 1))).toEqual(0); // TODO check!!!
	/* start valid range */
	expect(clz(0)).toEqual(32);
	expect(clz(1 << 0)).toEqual(31);
	expect(clz(1 << 1)).toEqual(30);
	expect(clz(1 << 2)).toEqual(29);
	expect(clz(1 << 10)).toEqual(21);
	expect(clz(1 << 20)).toEqual(11);
	expect(clz(1 << 30)).toEqual(1);
	expect(clz(1 << 31)).toEqual(0);
	/* end valid range */
	expect(clz(1 << 32)).toEqual(31);
	expect(clz(1 << 33)).toEqual(30);
});

test('ctrz', () => {
	expect(ctrz(-(1 << 2))).toEqual(2); // TODO check!!!
	expect(ctrz(-(1 << 1))).toEqual(1); // TODO check!!!
	/* start valid range */
	expect(ctrz(0)).toEqual(32);
	expect(ctrz(1 << 0)).toEqual(0);
	expect(ctrz(1 << 1)).toEqual(1);
	expect(ctrz(1 << 2)).toEqual(2);
	expect(ctrz(1 << 10)).toEqual(10);
	expect(ctrz(1 << 20)).toEqual(20);
	expect(ctrz(1 << 30)).toEqual(30);
	expect(ctrz(1 << 31)).toEqual(31);
	/* end valid range */
	expect(ctrz(1 << 32)).toEqual(0);
	expect(ctrz(1 << 33)).toEqual(1);
});
