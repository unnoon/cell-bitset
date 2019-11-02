/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import BitSet from '../../src/BitSet';
import { expect } from './test-utils.spec';

describe('basic usage', () =>
{
    it('should demonstrate the basic functions of cell-bitset', () =>
    {
        const bs1 = BitSet.create() // default length is 32
            .set(7)
            .set(54) // the length of the underlying bitvector is automatically resized to 55
            .set(23);

        const bs2 = BitSet.create(68) // create a bitvector with a specific size
            .add(7, 67, 23);

        const bs3 = new BitSet([7, 54, 23]); // use an iterable to initialize the bitset.

        bs1.union(bs2);

        expect(bs1.toString()).to.eql('{7, 23, 54, 67}');
        expect(bs1.toString(2)).to.eql('10000000000001000000000000000000000000000000100000000000000010000000'); // will output the bitstring
        expect(bs1.length).to.eql(68); // The length of the underlying bitvector. The length of bs1 is automatically resized
        expect(bs1.cardinality).to.eql(4); // i.e. the number of flipped bits

        const bs4 = bs3.Union(bs2); // use Pascal case Union to output a new bitset and leave bs3 unchanged

        expect(bs3.toString()).to.eql('{7, 23, 54}');
        expect(bs4.toString()).to.eql('{7, 23, 54, 67}');
    });

});

describe('hammingWeight/popCount', () =>
{

    it('should calculate the hamming weight of a word', () =>
    {
        const bs = BitSet.create(234).add(6).add(14).add(62);

        expect(BitSet.hammingWeight(bs.words[0])).to.eql(2);
        expect(BitSet.popCount(bs.words[0])).to.eql(2); // alias
    });
});

describe('create/spawn', () =>
{
    it('should create a new BitSet using the static BitSet.prototype.create using an array', () =>
    {
        const bs = BitSet.create([6,14,62]);

        expect(bs.has(6)).to.be.true;
        expect(bs.has(14)).to.be.true;
        expect(bs.has(62)).to.be.true;
        expect(bs.length).to.eql(63);
    });

    it('should create a new BitSet using the static BitSet.prototype.create', () =>
    {
        const bs = BitSet.create(234).add(6).add(14).add(62);

        expect(bs.has(14)).to.be.true;
        expect(bs.length).to.eql(234);
    });

    it('should create a new BitSet using the prototype static spawn alias', () =>
    {
        const bs = BitSet.spawn(234).add(6).add(14).add(62);

        expect(bs.has(14)).to.be.true;
        expect(bs.length).to.eql(234);
    });
});

describe('constructor', () =>
{
    it('should create a new BitSet using the constructor', () =>
    {
        const bs = new BitSet([6,14,62]);

        expect(bs.has(6)).to.be.true;
        expect(bs.has(14)).to.be.true;
        expect(bs.has(62)).to.be.true;
        expect(bs.length).to.eql(63);
    });
});

describe('add', () =>
{
    it('should be able to add a number/index', () =>
    {
        const bs = BitSet.create().add(6).add(14);

        const str = bs.toString(-1);

        expect(str).to.eql('00000000000000000100000001000000');
        expect(str.length).to.eql(32);
    });

    it('should be able to add multiple number/indices at the same time', () =>
    {
        const bs = BitSet.create().add(6, 14);

        const str = bs.toString(-1);

        expect(str).to.eql('00000000000000000100000001000000');
        expect(str.length).to.eql(32);
    });

    it('should resize the bitset in case with the index falls out of bounds', () =>
    {
        const bs = BitSet.create().add(6).add(14).add(63);

        const str = bs.toString(-1);

        expect(str).to.eql('1000000000000000000000000000000000000000000000000100000001000000');
        expect(str.length).to.eql(64);
    });
});

describe('cardinality/size/length', () =>
{
    it('should return the cardinality of a set', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(63);

        expect(bs.cardinality).to.eql(3);
        expect(bs.size).to.eql(3);
    });

    it('should return 0 if the bitset is empty', () =>
    {
        const bs  = BitSet.create();

        expect(bs.cardinality).to.eql(0);
    });

    it('should return a warning in case one tries to set the cardinality', () =>
    {
        const bs  = BitSet.create();

        bs.cardinality = 6;

        expect(console.warn['calledWith']('Cardinality/size is read only')).to.be.true;
    });
});

describe('clear', () =>
{
    it('should clear a bitset retaining length', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(63);

        bs.clear();

        expect(bs.isEmpty()).to.be.true;
        expect(bs.length).to.eql(64);
    });
});

describe('clone', () =>
{
    it('should be able to make a clone', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(63);
        const cln = bs.clone();

        expect(bs.equals(cln)).to.be.true;
        expect(bs === cln).to.be.false;
    });
});

describe('complement', () =>
{
    it('should be able to calculate the complement and trim any trailing bits', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(62);

        bs.complement();

        const str = bs.toString(2);

        expect(str).to.eql('011111111111111111111111111111111111111111111111011111110111111');
        expect(str.length).to.eql(63);

        const str_full = bs.toString(-1);

        expect(str_full).to.eql('0011111111111111111111111111111111111111111111111011111110111111');
        expect(str_full.length).to.eql(64);
    });
});

describe('Complement', () =>
{
    it('should be able to calculate the Complement and trim any trailing bits', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(62);

        const complement = bs.Complement();

        const str = complement.toString(2);

        expect(str).to.eql('011111111111111111111111111111111111111111111111011111110111111');
        expect(str.length).to.eql(63);

        const str_full = complement.toString(-1);

        expect(str_full).to.eql('0011111111111111111111111111111111111111111111111011111110111111');
        expect(str_full.length).to.eql(64);

        expect(complement).to.not.equal(bs);
    });
});

describe('contains/fits', () =>
{
    it('should be able to positively test if a mask contains', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62).add(123);
        const mask = BitSet.create().add(6).add(14).add(62);

        expect(bs.contains(mask)).to.be.true;
        expect(bs.fits(mask)).to.be.true;
    });

    it('should be able to positively test if a larger mask contains', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62).add(123);
        const mask = BitSet.create().add(6).add(14).add(62).set(367, 0);

        expect(bs.contains(mask)).to.be.true;
    });

    it('should be able to negatively test if a mask does not fit', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62);
        const mask = BitSet.create().add(6).add(14).add(78);

        expect(bs.contains(mask)).to.be.false;
    });

    it('should fix issue #1', () =>
    {
        const bitset1 = new BitSet();
        bitset1.set(95);

        const bitset2 = new BitSet();
        bitset2.set(95);

        expect(bitset1.contains(bitset2)).to.be.true;
    });
});

describe('difference', () =>
{
    it('should be able to calculate a simple difference', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(16);

        bs1.difference(bs2);

        const str = bs1.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000000100000000000000');
        expect(str.length).to.eql(63);

        const str_full = bs1.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000000100000000000000');
        expect(str_full.length).to.eql(64);
    });

    it('should be able to calculate the reverse case (first < second)', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create(20).add(6).add(16);

        bs2.difference(bs1);

        const str = bs2.toString(2);

        expect(str).to.eql('00010000000000000000');
        expect(str.length).to.eql(20);

        const str_full = bs2.toString(-1);

        expect(str_full).to.eql('00000000000000010000000000000000');
        expect(str_full.length).to.eql(32);
    });
});

describe('Difference', () =>
{
    it('should be able to calculate a simple Difference', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(16);

        const diff = bs1.Difference(bs2);

        const str = diff.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000000100000000000000');
        expect(str.length).to.eql(63);

        const str_full = diff.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000000100000000000000');
        expect(str_full.length).to.eql(64);

        expect(diff).to.not.equal(bs1);
    });
});

describe('each/forEach', () =>
{
    it('should be able to iterate over the bitset', () =>
    {
        const bs      = BitSet.create().add(6).add(14).add(62);
        const indices = [];

        const result = bs.each((val, i, bsi) =>
        {
            indices.push(i);
            expect(val).to.eql(1);
            expect(bsi).to.eql(bs);
        });

        expect(indices).to.have.members([6, 14, 62]);
        expect(result).to.be.true;
    });

    it('should be able to prematurely break iteration', () =>
    {
        const bs      = BitSet.create().add(6).add(14).add(62);
        const indices = [];

        const result = bs.each((val, i, bsi) =>
        {
            indices.push(i);
            expect(val).to.eql(1);
            expect(bsi).to.eql(bs);

            return i < 14;
        });

        expect(indices).to.have.members([6, 14]);
        expect(result).to.be.false;
    });

    it('should be able to use the alias forEach', () =>
    {
        const bs      = BitSet.create().add(6).add(14).add(62);
        const indices = [];

        const result = bs.forEach((val, i, bsi) =>
        {
            indices.push(i);
            expect(val).to.eql(1);
            expect(bsi).to.eql(bs);
        });

        expect(indices).to.have.members([6, 14, 62]);
        expect(result).to.be.true;
    });
});

describe('eachAll/forEachAll', () =>
{
    it('should be able to iterate the complete bitarray', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(62);
        let zeros = 0;
        let ones  = 0;

        const result = bs.eachAll((val, i, bsi) =>
        {
            zeros += Number(val === 0);
            ones  += Number(val === 1);
            expect(bsi).to.eql(bs);
        });

        expect(zeros).to.eql(60);
        expect(ones).to.eql(3);
        expect(result).to.be.true;
    });

    it('should be able to prematurely break iteration', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(62);
        let zeros = 0;
        let ones  = 0;

        const result = bs.eachAll((val, i, bsi) =>
        {
            zeros += Number(val === 0);
            ones  += Number(val === 1);
            expect(bsi).to.eql(bs);

            return i < 14;
        });

        expect(zeros).to.eql(13);
        expect(ones).to.eql(2);
        expect(result).to.be.false;
    });

    it('should be able to use the alias forEachAll', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(62);
        let zeros = 0;
        let ones  = 0;

        const result = bs.eachAll((val, i, bsi) =>
        {
            zeros += Number(val === 0);
            ones  += Number(val === 1);
            expect(bsi).to.eql(bs);
        });

        bs.forEachAll((val, i, bsi) =>
        {
            zeros += Number(val === 0);
            ones  += Number(val === 1);
            expect(bsi).to.eql(bs);
        });

        expect(zeros).to.eql(120);
        expect(ones).to.eql(6);
        expect(result).to.be.true;
    });
});

describe('entries', () =>
{
    it('should return all indices', () =>
    {
        const bs = BitSet.create([7, 67, 23]);

        const setIter = bs.entries();

        expect(setIter.next().value).to.eql([7, 7]);
        expect(setIter.next().value).to.eql([23, 23]);
        expect(setIter.next().value).to.eql([67, 67]);
    });
});

describe('equals', () =>
{
    it('should be able to positively compare two bitsets', () =>
    {
        const bs1 = BitSet.create().add(6).add(14).add(62);
        const bs2 = BitSet.create().add(6).add(14).add(62);

        expect(bs1.equals(bs2)).to.be.true;
    });

    it('should be able to positively compare two bitsets', () =>
    {
        const bs1 = BitSet.create().add(6).add(14).add(62);
        const bs2 = BitSet.create().add(6).add(14).add(78);

        expect(bs1.equals(bs2)).to.be.false;
    });
});

describe('exclusion/symmetricDifference', () =>
{
    it('should calculate the symmetric difference', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(16);

        bs1.exclusion(bs2);

        const str = bs1.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str.length).to.eql(63);

        const str_full = bs1.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
        expect(str_full.length).to.eql(64);
    });

    it('should calculate the symmetric difference in case the length of the bitsets is different)', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create(20).add(6).add(16);

        bs2.exclusion(bs1);

        const str = bs2.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str.length).to.eql(63);

        const str_full = bs2.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
        expect(str_full.length).to.eql(64);
    });

    it('should be able to use the alias symmetricDifference', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create(20).add(6).add(16);

        bs2.symmetricDifference(bs1);

        const str = bs2.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str.length).to.eql(63);

        const str_full = bs2.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
        expect(str_full.length).to.eql(64);
    });

    it('should be able to use the alias xor', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create(20).add(6).add(16);

        bs2.xor(bs1);

        const str = bs2.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str.length).to.eql(63);

        const str_full = bs2.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
        expect(str_full.length).to.eql(64);
    });
});

describe('Exclusion/SymmetricDifference', () =>
{

    it('should calculate the symmetric difference and output a new bitset', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(16);

        const exc = bs1.Exclusion(bs2);

        const str = exc.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str.length).to.eql(63);

        const str_full = exc.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
        expect(str_full.length).to.eql(64);

        expect(exc).to.not.equal(bs1);
    });

    it('should be possible to use the aliases SymmetricDifference/Xor', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(16);

        const exc = bs1.SymmetricDifference(bs2);
        const exc2 = bs1.XOR(bs2);

        const str = exc.toString(2);
        const str2 = exc2.toString(2);

        expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str2).to.eql('100000000000000000000000000000000000000000000010100000000000000');
        expect(str.length).to.eql(63);

        const str_full = exc.toString(-1);

        expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
        expect(str_full.length).to.eql(64);

        expect(exc).to.not.equal(bs1);
    });
});

describe('flip', () =>
{
    it('should be able to flip a bit in the bitset', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62).add(123);

        bs
            .flip(16)
            .flip(14);

        expect(bs.get(16)).to.eql(1);
        expect(bs.get(14)).to.eql(0);
    });

    it('should be able to enlarge the bitset in case the flipdex is out of bounds', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62);

        bs
            .flip(16)
            .flip(123);

        expect(bs.get(16)).to.eql(1);
        expect(bs.get(123)).to.eql(1);
    });
});

describe('get', () =>
{
    it('should get the value of bits in the bitset', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62).add(123);

        expect(bs.get(16)).to.eql(0);
        expect(bs.get(14)).to.eql(1);
    });

    it('should return 0 if the index is out of bounds', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62);

        expect(bs.get(123)).to.eql(0);
    });
});

describe('has/isMember', () =>
{
    it('should return the correct boolean values for membership', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62);

        expect(bs.has(14)).to.be.true;
        expect(bs.has(16)).to.be.false;
        expect(bs.isMember(123)).to.be.false;
    });
});

describe('init', () =>
{
    it('should be able to init a BitSet created by Object.create', () =>
    {
        const bs = Object.create(BitSet.prototype).init(234).add(6).add(14).add(62);

        expect(bs.has(14)).to.be.true;
        expect(bs.length).to.eql(234);
    });
});

describe('intersection', () =>
{
    it('should calculate the intersection between 2 sets', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(14);

        bs1.intersection(bs2);

        const str = bs1.toString();

        expect(str).to.eql('{6, 14}');
    });

    it('should be able to handle not intersecting sets', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(8).add(345);

        bs1.intersection(bs2);

        const str = bs1.toString();

        expect(str).to.eql('{}');
    });

    it('should calculate the intersection between 2 sets using alias and', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(14);

        bs1.and(bs2);

        const str = bs1.toString();

        expect(str).to.eql('{6, 14}');
    });
});

describe('Intersection', () =>
{
    it('should calculate the Intersection between 2 sets or its alias And', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(14);

        const ins  = bs1.Intersection(bs2);
        const ins2 = bs1.And(bs2);

        const str  = ins.toString();
        const str2 = ins2.toString();

        expect(str).to.eql('{6, 14}');
        expect(str2).to.eql('{6, 14}');

        expect(ins).to.not.equal(bs1);
    });
});

describe('intersects', () =>
{
    it('should calculate if two sets intersect', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(6).add(14);

        expect(bs1.intersects(bs2)).to.true;
    });

    it('should return in case two do not intersect', () =>
    {
        const bs1  = BitSet.create().add(6).add(14).add(62);
        const bs2  = BitSet.create().add(8).add(345);

        expect(bs1.intersects(bs2)).to.false;
    });
});

describe('isEmpty', () =>
{
    it('should return true is a set is empty', () =>
    {
        const bs  = BitSet.create(588);

        expect(bs.isEmpty()).to.true;
    });

    it('should return false in case a set is non empty', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(62);

        expect(bs.isEmpty()).to.false;
    });
});

describe('isSubsetOf/isContainedIn', () =>
{
    it('should be able to test if a bitset isSubsetOf of another or not', () =>
    {
        const bs   = BitSet.create().add(6).add(14).add(62).add(123);
        const bs2 = BitSet.create().add(6).add(14).add(62);

        expect(bs2.isSubsetOf(bs)).to.be.true;
        expect(bs.isSubsetOf(bs2)).to.be.false;
        expect(bs.isContainedIn(bs2)).to.be.false;
    });
});

describe('length', () =>
{
    it('should return the length of the underlying bitvector', () =>
    {
        const bs  = BitSet.create().add(6).add(14).add(63);

        expect(bs.length).to.eql(64);
    });

    it('should return 0 if the bitset is empty', () =>
    {
        const bs  = BitSet.create().resize(0);

        expect(bs.length).to.eql(0);
    });

    it('should give a waring if one tries to set the length', () =>
    {
        const bs  = BitSet.create();

        bs.length = 6;

        expect(console.warn['calledWith']('Length is read only')).to.be.true;
    });
});

describe('keys', () =>
{
    it('should return all indices', () =>
    {
        const bs = BitSet.create([7, 67, 23]);

        const setIter = bs.keys();

        expect(setIter.next().value).to.eql(7);
        expect(setIter.next().value).to.eql(23);
        expect(setIter.next().value).to.eql(67);
    });
});

describe('max/msb', () =>
{
    it('should return the max index of a bitset', () =>
    {
        const bs  = BitSet.create(588).add(9).add(14);

        expect(bs.max()).to.eql(14);
        expect(bs.msb()).to.eql(14);
    });

    it('should return undefined in case the set is empty', () =>
    {
        const bs  = BitSet.create(666);

        expect(bs.max()).to.be.undefined;
    });
});

describe('min/lsb', () =>
{
    it('should return the min index of a bitset', () =>
    {
        const bs  = BitSet.create(588).add(9).add(14);

        expect(bs.min()).to.eql(9);
        expect(bs.lsb()).to.eql(9);
    });

    it('should return the min index of a bitset', () =>
    {
        const bs  = BitSet.create(588).add(400).add(324);

        expect(bs.min()).to.eql(324);
    });

    it('should return undefined in case the set is empty', () =>
    {
        const bs  = BitSet.create(666);

        expect(bs.min()).to.be.undefined;
    });
});

describe('remove/delete', () =>
{
    it('should be able to remove an index', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(200);

        const str = bs.remove(14).del(45).toString();

        expect(str).to.eql('{9, 200}');
    });

    it('should be able to remove multiple indices at the same time', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(200);

        const str = bs.remove(14, 45).toString();

        expect(str).to.eql('{9, 200}');
    });

    it('should not increase the length in case the index falls out of bounds', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(200);

        const str = bs.remove(14).remove(45).remove(400).toString();

        expect(str).to.eql('{9, 200}');
        expect(bs.length).to.eql(201);
    });
});

describe('resize', () =>
{
    it('should be able to resize a bitset to a bigger size', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(200);

        const self = bs.resize(456);

        expect(bs.length).to.eql(456);
        expect(self).to.equal(bs);
    });

    it('should be able to decrease the length of the bitset, trimming any trailing bits', () =>
    {
        const bs  = BitSet.create().add(9).add(63);

        bs.resize(60);

        expect(bs.length).to.eql(60);
        expect(bs.toString(-1)).to.eql('0000000000000000000000000000000000000000000000000000001000000000');
    });

    it('should return the this (and in any other cases as well) in case the resize length is the same', () =>
    {
        const bs  = BitSet.create().add(9).add(63);

        const self = bs.resize(64);

        expect(self).to.equal(bs);
    });
});

describe('set', () =>
{
    it('should be able to add a number/index', () =>
    {
        const bs = BitSet.create().set(6).set(14);

        const str = bs.toString(-1);

        expect(str).to.eql('00000000000000000100000001000000');
        expect(str.length).to.eql(32);
    });

    it('should be able to set an index to 0', () =>
    {
        const bs = BitSet.create().set(6).set(6, 0);

        const str = bs.toString(-1);

        expect(str).to.eql('00000000000000000000000000000000');
        expect(str.length).to.eql(32);
    });
});

describe('toArray', () =>
{
    it('should return an array containing the indices', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(60);

        const arr = bs.toArray();
        expect(arr).to.have.members([9, 14, 60]);
        expect(arr).instanceof(Array);
    });

    it('should return a typed array containing the indices depending on type', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(60).add(789);

        const arr8 = bs.toArray(8);

        expect(arr8[0]).to.eql(9);
        expect(arr8[1]).to.eql(14);
        expect(arr8[2]).to.eql(60);
        expect(arr8[3]).to.eql(21);
        expect(arr8).instanceof(Uint8Array);

        const arr16 = bs.toArray(16);
        expect(arr16).instanceof(Uint16Array);

        const arr32 = bs.toArray(32);
        expect(arr32).instanceof(Uint32Array);
    });
});

describe('toBitArray', () =>
{
    it('should return an array containing all bits', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(33);

        const expected = [0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
        const arr      = bs.toBitArray();

        expect(expected.length).to.equal(arr.length);
        for(let i = 0; i < arr.length; i++)
        {
            expect(arr[i]).to.equal(expected[i]);
        }
        expect(arr).instanceof(Array);

        const arr8 = bs.toBitArray(8);
        expect(arr8).instanceof(Uint8Array);

        const arr16 = bs.toBitArray(16);
        expect(arr16).instanceof(Uint16Array);

        const arr32 = bs.toBitArray(32);
        expect(arr32).instanceof(Uint32Array);
    });
});

describe('toBooleanArray', () =>
{

    it('should return an array containing all bits converted to booleans', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(33);

        const expected = [false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true];
        const arr      = bs.toBooleanArray();

        expect(expected.length).to.equal(arr.length);

        for(let i = 0; i < arr.length; i++)
        {
            expect(arr[i]).to.equal(expected[i]);
        }
    });
});

describe('toBitString', () =>
{
    it('should return set, bitstring or full bitstring depending on mode', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(60);

        expect(bs.toBitString()).to.eql('1000000000000000000000000000000000000000000000100001000000000');
        expect(bs.toBitString(-1)).to.eql('0001000000000000000000000000000000000000000000000100001000000000');
    });
});

describe('toString/stringify', () =>
{
    it('should return set, bitstring or full bitstring depending on mode', () =>
    {
        const bs  = BitSet.create().add(9).add(14).add(60);

        expect(bs.toString()).to.eql('{9, 14, 60}');
        expect(bs.stringify()).to.eql('{9, 14, 60}');
        expect(bs.toString(2)).to.eql('1000000000000000000000000000000000000000000000100001000000000');
        expect(bs.toString(-1)).to.eql('0001000000000000000000000000000000000000000000000100001000000000');
    });
});

describe('trim', () =>
{
    it('should trim a bitset to the most significant bit', () =>
    {
        const bs  = BitSet.create(123).add(9).add(14).add(60);

        bs.trim();

        expect(bs.length).to.eql(61);
        expect(bs.words.length).to.eql(2);
    });
});

describe('trimTrailingBits', () =>
{
    it('should return set, bitstring or full bitstring depending on mode', () =>
    {
        const bs  = BitSet.create(55).add(9).add(14).add(50);

        bs.words[1] |= (1 << 60); // set a 1 at index 60 the unofficial way :-)

        const str = bs.toString(-1);

        expect(str).to.eql('0001000000000100000000000000000000000000000000000100001000000000');
        expect(str.length).to.eql(64);
        expect(bs.length).to.eql(55);

        bs.trimTrailingBits();

        expect(bs.toString(-1)).to.eql('0000000000000100000000000000000000000000000000000100001000000000');
    });
});

describe('union', () =>
{
    it('should calculate the union of 2 sets', () =>
    {
        const bs1 = BitSet.create() // default length is 32
            .add(7)
            .add(54) // the length of the underlying bitvector is automatically resized to 55
            .add(23);
        const bs2 = BitSet.create(68) // create a bitvector with a specific size
            .add(7)
            .add(67)
            .add(23);

        bs1.union(bs2);

        expect(bs1.toString()).to.eql('{7, 23, 54, 67}');
        expect(bs1.toString(2)).to.eql('10000000000001000000000000000000000000000000100000000000000010000000'); // will output the bitstring
        expect(bs1.length).to.eql(68); // The length of the underlying bitvector. The length of bs1 is automatically resized
        expect(bs1.cardinality).to.eql(4); // i.e. the number of flipped bits
    });

    it('should calculate the union of 2 sets using the alias or', () =>
    {
        const bs1  = BitSet.create(32)
            .add(7)
            .add(54)
            .add(23);
        const bs2  = BitSet.create(63)
            .add(7)
            .add(67)
            .add(23);

        bs1.or(bs2);

        const str = bs1.toString();

        expect(str).to.eql('{7, 23, 54, 67}');
        expect(bs1.length).to.eql(68);
    });
});

describe('Union', () =>
{
    it('should calculate the Union/Or of 2 sets', () =>
    {
        const bs1  = BitSet.create(32)
            .add(7)
            .add(54)
            .add(23);
        const bs2  = BitSet.create(63)
            .add(7)
            .add(67)
            .add(23);

        const un  = bs1.Union(bs2);
        const un2 = bs1.Or(bs2);

        const str  = un.toString();
        const str2 = un2.toString();

        expect(str).to.eql('{7, 23, 54, 67}');
        expect(str2).to.eql('{7, 23, 54, 67}');
        expect(un.length).to.eql(68);

        expect(un).to.not.equal(bs1);
    });
});

describe('values', () =>
{
    it('should return all indices', () =>
    {
        const bs = BitSet.create([7, 67, 23]);

        const setIter = bs.values();

        expect(setIter.next().value).to.eql(7);
        expect(setIter.next().value).to.eql(23);
        expect(setIter.next().value).to.eql(67);
    });
});

describe('[@@iterator]', () =>
{
    it('should return all indices', () =>
    {
        const bs = BitSet.create([7, 67, 23]);

        const values = [];

        for(const value of bs)
        {
            values.push(value);
        }

        expect(values).to.eql([7, 23, 67]);
    });
});

describe('[@@species]', () =>
{
    it('should return the BitSet constructor if the species is requested (static/non-static)', () =>
    {
        const bs = BitSet.create([7, 67, 23]);

        expect(BitSet[Symbol.species]).to.eql(BitSet);
        expect(bs.constructor[Symbol.species]).to.eql(BitSet);
    });
});

// disabled because this does not work in firefox yet
describe('[@@toStringTag]', () =>
{
    it('should return the custom type [object BitSet] in case Object.prototype.toString.call(bs) is used', () =>
    {
        const bs = BitSet.create([7, 67, 23]);

        expect(Object.prototype.toString.call(bs)).to.eql('[object BitSet]');
    });
});
