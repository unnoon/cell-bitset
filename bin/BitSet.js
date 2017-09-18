var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation. Beyond 32bit restrictions.
 */
import * as is from 'bottom_line/lang/is';
import aliases from 'bottom_line/decorators/aliases';
import readonly from 'bottom_line/decorators/readonly';
import nonconfigurable from 'bottom_line/decorators/nonconfigurable';
import nonenumerable from 'bottom_line/decorators/nonenumerable';
// int32 consts
const ZERO = 0 | 0;
const ONE = 1 | 0;
const WORD_SIZE = 32 | 0;
const WORD_LOG = 5 | 0;
/**
 * Fast JS BitSet implementation. Beyond 32bit restrictions.
 */
export default class BitSet {
    /**
     * BitSet constructor.
     *
     * @param indices_length - Length for the underlying bitvector or an Iterable<number> with indices.
     *
     * @returns a new BitSet.
     */
    constructor(indices_length = WORD_SIZE) {
        /**
         * Custom name for Object.prototype.toString.call(bitset) === [object BitSet]
         */
        this[Symbol.toStringTag] = 'BitSet';
        this.init(indices_length);
    }
    /**
     * Easy create method avoiding ugly 'new' keywords.
     * @aliases: [[spawn]]
     *
     * @param indices_length - Length for the underlying bitvector or an iterable object with indices.
     *
     * @returns a new BitSet.
     */
    static create(indices_length = WORD_SIZE) { return; }
    /** Alias of [[create]] */
    static spawn(indices_length = WORD_SIZE) {
        return new BitSet(indices_length);
    }
    /**
     * Calculate the hamming weight i.e. the number of ones in a bitstring/word.
     * @aliases: [[popCount]]
     *
     * @param w - Word to get the number of set bits from.
     *
     * @returns the number of set bits in the word.
     */
    static hammingWeight(w) { return; }
    /** Alias of [[hammingWeight]] */
    static popCount(w) {
        w = w | 0;
        w -= (w >>> 1) & 0x55555555;
        w = (w & 0x33333333) + ((w >>> 2) & 0x33333333);
        return (((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24) | 0;
    }
    /**
     * Returns the least significant bit in a word. Returns 32 in case the word is 0.
     *
     * @param w - The word to get the least significant bit from.
     *
     * @returns the least significant bit in w.
     */
    static lsb(w) {
        w = w | 0;
        return BitSet.hammingWeight((w & -w) - 1) | 0;
    }
    /**
     * Returns the most significant bit in a word.
     *
     * @param w - the word to get the most significant bit from.
     *
     * @returns the most significant bit in w.
     */
    static msb(w) {
        w = w | 0;
        w |= w >> 1;
        w |= w >> 2;
        w |= w >> 4;
        w |= w >> 8;
        w |= w >> 16;
        w = (w >> 1) + 1;
        return BitSet.hammingWeight(w - 1) | 0;
    }
    /**
     * Prototype Symbol.iterator to make BitSet iterable.
     * Returns a new Iterator object that contains the indices in the BitSet object.
     *
     * @returns iterable iterator containing the indices.
     */
    [Symbol.iterator]() {
        return this.values();
    }
    /**
     * Getter for the cardinality of the set. In case of a set it will return a warning.
     * @aliases: [[size]]
     *
     * @readonly
     * @type number
     */
    get cardinality() { return; }
    set cardinality(v) { }
    /** Alias of [[cardinality]] */
    get size() {
        const max = this.words.length;
        let i = ZERO;
        let output = ZERO;
        for (; i < max; i++) {
            output += BitSet.hammingWeight(this.words[i]);
        }
        return output | 0;
    }
    set size(v) {
        console.warn('Cardinality/size is read only');
    }
    /**
     * Adds numbers(indices) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param indices - Indices/numbers to add to the set.
     *
     * @returns this.
     */
    add(...indices) {
        for (let i = indices.length; i--;) {
            this.set(indices[i]);
        }
        return this;
    }
    /**
     * Clears the bitset. Length will be maintained.
     *
     * @returns this.
     */
    clear() {
        const max = this.words.length;
        for (let i = ZERO; i < max; i++) {
            this.words[i] = ZERO;
        }
        return this;
    }
    /**
     * Creates a clone of the bitset.
     *
     * @returns  clone.
     */
    clone() {
        const clone = Object.create(BitSet.prototype);
        clone._length = this._length | 0;
        clone.words = new Uint32Array(this.words);
        return clone;
    }
    /**
     * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     *
     * @returns this.
     */
    complement() {
        const max = this.words.length;
        for (let i = ZERO; i < max; i++) {
            this.words[i] = ~this.words[i];
        }
        this.trimTrailingBits();
        return this;
    }
    /**
     * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     * The result will be a new instance of a BitSet.
     *
     * @returns a new BitSet of the complement.
     */
    Complement() {
        return this.clone().complement();
    }
    /**
     * Calculates if the bitset contains a certain bitset.
     * In bitmask terms it will calculate if a bitmask fits a bitset.
     * @aliases: [[fits]]
     *
     * @param mask - Tests is a bitset mask fits. i.e. subset to test containment.
     *
     * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
     */
    contains(mask) { return; }
    /** Alias of [[contains]] */
    fits(mask) {
        const max = mask.words.length;
        let i = ZERO;
        let maskword;
        for (; i < max; i++) {
            maskword = mask.words[i];
            if (((this.words[i] || 0) & maskword) !== maskword) {
                return false;
            }
        }
        return true;
    }
    /**
     * Calculates the difference between 2 bitsets.
     * The result is stored in this.
     *
     * @param bitset - The bitset to subtract from the current one.
     *
     * @returns this.
     */
    difference(bitset) {
        const max = this.words.length;
        let i = ZERO;
        for (; i < max; i++) {
            this.words[i] &= ~bitset.words[i];
        }
        return this;
    }
    /**
     * Calculates the difference between 2 bitsets.
     * The result will be a new instance of BitSet.
     *
     * @param bitset - The bit set to subtract from the current one.
     *
     * @returns a new BitSet of the difference.
     */
    Difference(bitset) {
        return this.clone().difference(bitset);
    }
    /**
     * Iterates over the set bits and calls the callback function with: value=1, index, this.
     * Can be broken prematurely by returning false.
     * @aliases: [[forEach]]
     *
     * @param cb  - Callback function to be called on each bit.
     * @param ctx - Context to be called upon the callback function.
     *
     * @returns a boolean indicating if the loop finished completely=true or was broken=false.
     */
    each(cb, ctx) { return; }
    /** Alias of [[each]] */
    forEach(cb, ctx) {
        const max = this.words.length;
        let i = ZERO;
        let word;
        let tmp;
        for (; i < max; i++) {
            word = this.words[i];
            while (word !== 0) {
                tmp = (word & -word) | 0;
                if (cb.call(ctx, ONE, (i << WORD_LOG) + BitSet.hammingWeight(tmp - ONE), this) === false) {
                    return false;
                }
                word ^= tmp;
            }
        }
        return true;
    }
    /**
     * Iterates over all bits and calls the callback function with: value, index, this.
     * Can be broken prematurely by returning false.
     * @aliases: forEachAll
     *
     * @param cb  - Callback function o be called on each bit.
     * @param ctx - Context to be called upon the callback function.
     *
     * @returns a boolean indicating if the loop finished completely=true or was broken=false.
     */
    eachAll(cb, ctx) { return; }
    /** Alias of [[eachAll]] */
    forEachAll(cb, ctx) {
        const max = this._length;
        for (let i = ZERO; i < max; i++) {
            if (cb.call(ctx, this.get(i), i, this) === false) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object. This is kept similar to the Map object, so that each entry has the same value for its key and value here.
     *
     * @returns an iterable iterator yielding set indices [index, index].
     */
    entries() {
        const data = [];
        this.each((val, index) => data.push([index, index]));
        return (function* (d) { yield* d; })(data);
    }
    /**
     * Tests if 2 bitsets are equal.
     *
     * @param bitset - Bitset to compare to this.
     *
     * @returns a boolean indicating if the the 2 bitsets are equal.
     */
    equals(bitset) {
        const max = this.words.length;
        for (let i = ZERO; i < max; i++) {
            if (this.words[i] !== bitset.words[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Calculates the exclusion/symmetric difference between to bitsets.
     * The result is stored in this.
     * @aliases: [[symmetricDifference]], [[xor]]
     *
     * @param bitset - The bitset to calculate the symmetric difference with.
     *
     * @returns this.
     */
    exclusion(bitset) { return; }
    /** Alias of [[exclusion]] */
    symmetricDifference(bitset) { return; }
    /** Alias of [[exclusion]] */
    xor(bitset) {
        if (bitset.length > this._length) {
            this.resize(bitset.length);
        }
        const max = bitset.words.length;
        let i = ZERO;
        for (; i < max; i++) {
            this.words[i] ^= bitset.words[i];
        }
        return this;
    }
    /**
     * Calculates the exclusion/symmetric difference between to bitsets.
     * The result is a new instance of BitSet.
     * @aliases: [[SymmetricDifference]], [[XOR]]
     *
     * @param bitset - The bitset to calculate the symmetric difference with.
     *
     * @returns a new BitSet of the exclusion.
     */
    Exclusion(bitset) { return; }
    /** Alias of [[Exclusion]] */
    SymmetricDifference(bitset) { return; }
    /** Alias of [[Exclusion]] */
    XOR(bitset) {
        return this.clone().exclusion(bitset);
    }
    /**
     * Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged.
     *
     * @param index - Index of the bit to be flipped.
     *
     * @returns this.
     */
    flip(index) {
        index = index | 0;
        if (index >= this._length) {
            this.resize(index + ONE);
        }
        this.words[index >>> WORD_LOG] ^= (ONE << index);
        return this;
    }
    /**
     * Gets a specific bit from the bitset.
     *
     * @param index - Index of the bit to get.
     *
     * @returns the value of the bit at the given index.
     */
    get(index) {
        index = index | 0;
        return (index >= this._length ? ZERO : (this.words[index >>> WORD_LOG] >>> index) & ONE) | 0;
    }
    /**
     * Checks is the bitsets has a value/index.
     * @aliases: [[isMember]]
     *
     * @param index - The index/value to check membership for.
     *
     * @returns a boolean indicating if the bitset has the vale/index.
     */
    has(index) { return; }
    /** Alias of [[has]] */
    isMember(index) {
        index = index | 0;
        return !!this.get(index);
    }
    /**
     * Initializes the BitSet. Useful for reinitialization in case of pooling.
     *
     * @param indices_length - Length for the underlying bitvector or an iterable object with indices.
     *
     * @returns this.
     */
    init(indices_length = WORD_SIZE) {
        const arr = is.number(indices_length) ? [] : Array.from(indices_length);
        const len = is.number(indices_length) ? indices_length : arr.length;
        this._length = len;
        this.words = new Uint32Array(Math.ceil(len / WORD_SIZE));
        this.add(...arr);
        return this;
    }
    /**
     * Calculates the intersection between two bitsets.
     * The result is stored in this.
     * @aliases: [[and]]
     *
     * @param bitset - The bitset to calculate the intersection with.
     *
     * @returns this.
     */
    intersection(bitset) { return; }
    /** Alias of [[intersection]] */
    and(bitset) {
        const max = this.words.length;
        let i = ZERO;
        for (; i < max; i++) {
            this.words[i] &= bitset.words[i] || ZERO;
        }
        return this;
    }
    /**
     * Calculates the intersection between two bitsets.
     * The result is a new instance of BitSet.
     * @aliases: [[And]]
     *
     * @param bitset - The bitset to calculate the intersection with.
     *
     * @returns a new bitset intersection.
     */
    Intersection(bitset) { return; }
    /** Alias of [[Intersection]] */
    And(bitset) {
        return this.clone().intersection(bitset);
    }
    /**
     * Calculates if two bitsets intersect.
     *
     * @param bitset - The bitset to check intersection with.
     *
     * @returns a boolean indicating if the two bitsets intersects.
     */
    intersects(bitset) {
        const max = Math.min(this.words.length, bitset.words.length);
        let i = ZERO;
        for (; i < max; i++) {
            if (this.words[i] & bitset.words[i]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns if a set is empty i.e. all words are 0.
     *
     * @returns a boolean indicating that the set is empty.
     */
    isEmpty() {
        const max = this.words.length;
        let i = ZERO;
        for (; i < max; i++) {
            if (this.words[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if a bitset is contained in another.
     * @aliases: isContainedIn
     *
     * @param bitset - BitSet to check for containment.
     *
     * @returns a boolean indicating if this is contained in bitset.
     */
    isSubsetOf(bitset) { return; }
    /** Alias of [[isSubsetOf]] */
    isContainedIn(bitset) {
        return bitset.contains(this);
    }
    /**
     * Returns a new Iterator object that contains the indices of the BitSet.
     *
     * @returns iterable iterator containing set indices.
     */
    keys() {
        return this.values();
    }
    /**
     * Getter for the length of the underlying bitvector.
     * In case of a set it will return a warning.
     */
    get length() {
        return this._length | 0;
    }
    set length(v) {
        console.warn('Length is read only');
    }
    /**
     * Returns the max index in a set.
     * @aliases: [[msb]]
     *
     * @returns the max number/index in the set.
     */
    max() { return; }
    /** Alias of [[max]] */
    msb() {
        let word;
        for (let i = this.words.length; i--;) {
            if (!(word = this.words[i])) {
                continue;
            }
            return ((i << WORD_LOG) + BitSet.msb(word)) | 0;
        }
    }
    /**
     * Returns the minimum index in a set.
     * @aliases [[lsb]]
     *
     * @returns the minimum number/index in the set.
     */
    min() { return; }
    /** Alias of [[min]] */
    lsb() {
        let word;
        const max = this.words.length;
        for (let i = ZERO; i < max; i++) {
            if (!(word = this.words[i])) {
                continue;
            }
            return ((i << WORD_LOG) + BitSet.lsb(word)) | 0;
        }
    }
    /**
     * Removes indices/numbers from the bitset.
     * @alias  [[del]]
     *
     * @param indices - The indices/numbers to be removed.
     *
     * @returns this.
     */
    remove(...indices) { return; }
    /** Alias of [[remove]] */
    del(...indices) {
        for (let i = indices.length; i--;) {
            this.set(indices[i], 0);
        }
        return this;
    }
    /**
     * Resizes the underlying bitvector to a specific length.
     * Will trim any trailing bits in case length is smaller than the current length.
     *
     * @param length - The new length.
     *
     * @returns the resized bitset.
     */
    resize(length) {
        length = length | 0;
        if (this._length === length) {
            return this;
        }
        const diff = (length - this._length) | 0;
        const newLength = (length - 1 + WORD_SIZE >>> WORD_LOG) | 0;
        this._length = length;
        if (newLength !== this.words.length) {
            const max = Math.min(newLength, this.words.length) | 0;
            const newWords = new Uint32Array(newLength);
            let i = ZERO;
            for (; i < max; i++) {
                newWords[i] = this.words[i];
            }
            this.words = newWords;
        }
        // trim trailing bits
        if (diff < 0) {
            this.trimTrailingBits();
        }
        return this;
    }
    /**
     * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param index - Index/number to add to the set.
     * @param val   - Value (0|1) to set.
     *
     * @returns this.
     */
    set(index, val = ONE) {
        index = index | 0;
        val = val | 0;
        if (index >= this._length && val !== ZERO) {
            this.resize(index + ONE);
        } // don't resize in case of a remove
        if (val === ZERO) {
            this.words[index >>> WORD_LOG] &= ~(ONE << index);
        }
        else {
            this.words[index >>> WORD_LOG] |= (ONE << index);
        }
        return this;
    }
    /**
     * Outputs the set as an array.
     *
     * @param type - Type for the array Uint(8|16|32)Array.
     *
     * @returns an array representing the bitset.
     */
    toArray(type) {
        let arr;
        let i = ZERO;
        switch (type) {
            case 8:
                arr = new Uint8Array(this.cardinality);
                break;
            case 16:
                arr = new Uint16Array(this.cardinality);
                break;
            case 32:
                arr = new Uint32Array(this.cardinality);
                break;
            default: arr = [];
        }
        this.each((val, index) => arr[i++] = index);
        return arr;
    }
    /**
     * Outputs the underlying bitvector as an array, starting with the least significant bits.
     *
     * @param type - Type for the array Uint(8|16|32)Array.
     *
     * @returns an bit array representation of the bitset.
     */
    toBitArray(type) {
        let arr;
        switch (type) {
            case 8:
                arr = new Uint8Array(this._length);
                break;
            case 16:
                arr = new Uint16Array(this._length);
                break;
            case 32:
                arr = new Uint32Array(this._length);
                break;
            default: arr = [];
        }
        this.eachAll((val, index) => { arr[index] = val; });
        return arr;
    }
    /**
     * Outputs the underlying bitvector as a boolean array, starting with the least significant bits.
     *
     * @returns a boolean array representing the bitset.
     */
    toBooleanArray() {
        const arr = [];
        this.eachAll((val, index) => { arr[index] = !!val; });
        return arr;
    }
    /**
     * Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
     *
     * @param mode - Mode for stringification. -1 is used to display the full string including trailing bits.
     *
     * @returns the stringified bitvector.
     */
    toBitString(mode) {
        let output = '';
        for (let i = this.words.length | 0; i--;) {
            output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
        }
        return ~mode ? output.slice(-this._length) : output;
    }
    /**
     * Will output a string version of the bitset or bitstring.
     * @aliases: [[stringify]]
     *
     * @param mode - Mode of toString. undefined=bitset | 2=bitstring | -1=full bitstring.
     *
     * @returns stringified version of the bitset.
     */
    toString(mode) { return; }
    /** Alias of [[toString]] */
    stringify(mode) {
        let output = '';
        switch (mode) {
            case -1 /*binary full*/:
            case 2 /*binary*/:
                output = this.toBitString(mode);
                break;
            default:
                output += '{';
                this.each((val, index) => { output += (output !== '{' ? ', ' : '') + index; });
                output += '}';
        }
        return output;
    }
    /**
     * Trims the bitset to the most significant bit to save space.
     *
     * @returns this.
     */
    trim() {
        return this.resize(this.max() + ONE);
    }
    /**
     * Trims any trailing bits. That fall out of this.length but within this.words.length*WORD_SIZE.
     * Assumes this.length is somewhere in the last word.
     *
     * @returns this.
     */
    trimTrailingBits() {
        const wordsLength = this.words.length | 0;
        const diff = (wordsLength * WORD_SIZE - this._length) | 0;
        this.words[wordsLength - 1] = this.words[wordsLength - 1] << diff >>> diff;
        return this;
    }
    /**
     * Calculates the union between 2 bitsets.
     * The result is stored in this.
     * @aliases: [[or]]
     *
     * @param bitset - Bitset to calculate the union with.
     *
     * @returns the union of the two bitsets.
     */
    union(bitset) { return; }
    /** Alias of [[union]] */
    or(bitset) {
        if (bitset.length > this._length) {
            this.resize(bitset.length);
        }
        const max = bitset.words.length;
        let i = ZERO;
        for (; i < max; i++) {
            this.words[i] |= bitset.words[i];
        }
        return this;
    }
    /**
     * Calculates the union between 2 bitsets.
     * The result is a new BitSet.
     * @aliases: [[Or]]
     *
     * @param bitset - Bitset to calculate the union with.
     *
     * @returns a new BitSet of the union of the two bitsets.
     */
    Union(bitset) { return; }
    /** Alias of [[Union]] */
    Or(bitset) {
        return this.clone().union(bitset);
    }
    /**
     * Returns a new Iterator object that contains the indices of the BitSet.
     *
     * @returns iterable iterator containing yielding the indices.
     */
    values() {
        return (function* (data) { yield* data; })(this.toArray());
    }
}
/**
 * Info object to hold general module information.
 */
/* tslint:disable:quotemark object-literal-key-quotes */
BitSet.info = {
    "name": "cell-bitset",
    "description": "Fast JS BitSet implementation. Beyond 32bit restrictions.",
    "version": "0.3.2",
    "url": "https://github.com/unnoon/cell-bitset",
};
/* tslint:enable:quotemark object-literal-key-quotes */
/**
 * The species of the BitSet. Which is just the BitSet constructor.
 */
BitSet[Symbol.species] = BitSet;
__decorate([
    nonconfigurable, nonenumerable,
    __metadata("design:type", Number)
], BitSet.prototype, "_length", void 0);
__decorate([
    aliases('size'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], BitSet.prototype, "cardinality", null);
__decorate([
    aliases('fits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", Boolean)
], BitSet.prototype, "contains", null);
__decorate([
    aliases('forEach'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Boolean)
], BitSet.prototype, "each", null);
__decorate([
    aliases('forEach$', 'eachAll', 'forEachAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Boolean)
], BitSet.prototype, "eachAll", null);
__decorate([
    aliases('symmetricDifference', 'xor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "exclusion", null);
__decorate([
    aliases('SymmetricDifference', 'XOR'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "Exclusion", null);
__decorate([
    aliases('isMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Boolean)
], BitSet.prototype, "has", null);
__decorate([
    aliases('and'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "intersection", null);
__decorate([
    aliases('And'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "Intersection", null);
__decorate([
    aliases('isContainedIn'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", Boolean)
], BitSet.prototype, "isSubsetOf", null);
__decorate([
    aliases('msb'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], BitSet.prototype, "max", null);
__decorate([
    aliases('lsb'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], BitSet.prototype, "min", null);
__decorate([
    aliases('del'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "remove", null);
__decorate([
    aliases('stringify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", String)
], BitSet.prototype, "toString", null);
__decorate([
    aliases('or'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "union", null);
__decorate([
    aliases('Or'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BitSet]),
    __metadata("design:returntype", BitSet)
], BitSet.prototype, "Union", null);
__decorate([
    readonly, nonconfigurable,
    __metadata("design:type", Object)
], BitSet, "info", void 0);
__decorate([
    aliases('spawn'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", BitSet)
], BitSet, "create", null);
__decorate([
    aliases('popCount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Number)
], BitSet, "hammingWeight", null);
//# sourceMappingURL=BitSet.js.map