import { clz, ctrz, clon, ctron, imul, zeros, ones } from './Int32';

test('clz', () => {
	expect(clz(0)).toEqual(32);
	expect(clz(1 << 0)).toEqual(31);
	expect(clz(1 << 1)).toEqual(30);
	expect(clz(1 << 2)).toEqual(29);
	expect(clz(1 << 10)).toEqual(21);
	expect(clz(1 << 20)).toEqual(11);
	expect(clz(1 << 30)).toEqual(1);
	expect(clz(1 << 31)).toEqual(0);
});

test('ctrz', () => {
	expect(ctrz(0)).toEqual(32);
	expect(ctrz(1 << 0)).toEqual(0);
	expect(ctrz(1 << 1)).toEqual(1);
	expect(ctrz(1 << 2)).toEqual(2);
	expect(ctrz(1 << 10)).toEqual(10);
	expect(ctrz(1 << 20)).toEqual(20);
	expect(ctrz(1 << 30)).toEqual(30);
	expect(ctrz(1 << 31)).toEqual(31);
});

test('clon', () => {
	expect(clon(~(0))).toEqual(32);
	expect(clon(~(1 << 0))).toEqual(31);
	expect(clon(~(1 << 1))).toEqual(30);
	expect(clon(~(1 << 2))).toEqual(29);
	expect(clon(~(1 << 10))).toEqual(21);
	expect(clon(~(1 << 20))).toEqual(11);
	expect(clon(~(1 << 30))).toEqual(1);
	expect(clon(~(1 << 31))).toEqual(0);
});

test('ctron', () => {
	expect(ctron(~(0))).toEqual(32);
	expect(ctron(~(1 << 0))).toEqual(0);
	expect(ctron(~(1 << 1))).toEqual(1);
	expect(ctron(~(1 << 2))).toEqual(2);
	expect(ctron(~(1 << 10))).toEqual(10);
	expect(ctron(~(1 << 20))).toEqual(20);
	expect(ctron(~(1 << 30))).toEqual(30);
	expect(ctron(~(1 << 31))).toEqual(31);
});

test('zeros', () => {
	expect(zeros(0)).toEqual(32);
	expect(zeros((1 << 3) | (1 << 5) | (1 << 27))).toEqual(29);
	expect(zeros(~0)).toEqual(0);
});

test('ones', () => {
	expect(ones(0)).toEqual(0);
	expect(ones((1 << 3) | (1 << 5) | (1 << 27))).toEqual(3);
	expect(ones(~0)).toEqual(32);
});

test('imul', () => {
	expect(imul(3, 4)).toEqual(12);
	expect(imul(-5, 12)).toEqual(-60);
	expect(imul(0xffffffff, 5)).toEqual(-5);
	expect(imul(0xfffffffe, 5)).toEqual(-10);
});
