/**
 * Created by Rogier on 13/04/2017.
 */
/* tslint:disable: max-classes-per-file no-console */

import 'reflect-metadata';
// import BitSet  from '../../src/BitSet';
import aliases from 'bottom_line/decorators/aliases';
// import KeyPropertyDescriptor from '../../src/classes/KeyPropertyDescriptor';

class BitSet {}

class TestDefineProperty
{
    @aliases('SymmetricDifference', 'XOR') /* istanbul ignore next */
    public Exclusion(bitset: BitSet): BitSet {return}
    /** Alias of [[Exclusion]] */ /* istanbul ignore next */
    public SymmetricDifference(bitset: BitSet): BitSet {return}
    /** Alias of [[Exclusion]] */
    public XOR(bitset: BitSet): BitSet
    {
        console.log('normal..');

        return bitset
    }
}

const td = new TestDefineProperty();

td.Exclusion(new BitSet());

// console.assert(tdp['_id'].hasOwnProperty(), '_id should be defined on instance');