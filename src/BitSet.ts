/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation. Beyond 32bit restrictions.
 */
import aliases         from 'bottom_line/decorators/aliases';
import nonconfigurable from 'bottom_line/decorators/nonconfigurable';
import nonenumerable   from 'bottom_line/decorators/nonenumerable';
import readonly        from 'bottom_line/decorators/readonly';
import is              from 'bottom_line/lang/is';

// int32 consts
const ZERO      =  0|0;
const ONE       =  1|0;
const WORD_SIZE = 32|0;
const WORD_LOG  =  5|0;

/**
 * Fast JS BitSet implementation. Beyond 32bit restrictions.
 */
export default class BitSet
{
    /**
     * Info object to hold general module information.
     */
    /* tslint:disable:quotemark object-literal-key-quotes */
    @readonly @nonconfigurable
    public static info =
    {
      "name"       : "cell-bitset",
      "description": "Fast JS BitSet implementation. Beyond 32bit restrictions.",
      "version"    : "/*?= VERSION */",
      "url"        : "https://github.com/unnoon/cell-bitset",
    };
    /* tslint:enable:quotemark object-literal-key-quotes */

    /**
     * The species of the BitSet. Which is just the BitSet constructor.
     */
    public static [Symbol.species] = BitSet;

    /**
     * Easy create method avoiding ugly 'new' keywords.
     * @aliases: [[spawn]]
     *
     * @param indices_length - Length for the underlying bitvector or an iterable object with indices.
     *
     * @returns a new BitSet.
     */
    @aliases('spawn')
    public static create(indices_length: Iterable<number>|number = WORD_SIZE): BitSet {return}
    /** Alias of [[create]] */
    public static spawn(indices_length: Iterable<number>|number = WORD_SIZE)
    {
        return new BitSet(indices_length)
    }

    /**
     * Calculate the hamming weight i.e. the number of ones in a bitstring/word.
     * @aliases: [[popCount]]
     *
     * @param w - Word to get the number of set bits from.
     *
     * @returns the number of set bits in the word.
     */
    @aliases('popCount')
    public static hammingWeight(w: number): number {return}
    /** Alias of [[hammingWeight]] */
    public static popCount(w: number): number
    {
        w = w|0;

        w -= (w >>> 1) & 0x55555555;
        w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

        return (((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24)|0
    }

    /**
     * Returns the least significant bit in a word. Returns 32 in case the word is 0.
     *
     * @param w - The word to get the least significant bit from.
     *
     * @returns the least significant bit in w.
     */
    public static lsb(w: number): number
    {
        w = w|0;

        return BitSet.hammingWeight((w & -w) - 1)|0
    }

    /**
     * Returns the most significant bit in a word.
     *
     * @param w - the word to get the most significant bit from.
     *
     * @returns the most significant bit in w.
     */
    public static msb(w: number): number
    {
        w = w|0;

        w |= w >> 1;
        w |= w >> 2;
        w |= w >> 4;
        w |= w >> 8;
        w |= w >> 16;
        w = (w >> 1) + 1;

        return BitSet.hammingWeight(w - 1)|0
    }

    /**
     * Custom name for Object.prototype.toString.call(bitset) === [object BitSet]
     */
    public [Symbol.toStringTag] = 'BitSet';

    /**
     * Array of 32bit words.
     */
    public words: Int32Array;

    @nonconfigurable @nonenumerable
    private _length: number;

    /**
     * BitSet constructor.
     *
     * @param indices_length - Length for the underlying bitvector or an Iterable<number> with indices.
     *
     * @returns a new BitSet.
     */
    constructor(indices_length: Iterable<number>|number = WORD_SIZE)
    {
        this.init(indices_length);
    }

    /**
     * Prototype Symbol.iterator to make BitSet iterable.
     * Returns a new Iterator object that contains the indices in the BitSet object.
     *
     * @returns iterable iterator containing the indices.
     */
    public [Symbol.iterator](): IterableIterator<number>
    {
        return this.values()
    }

    /**
     * Getter for the cardinality of the set. In case of a set it will return a warning.
     * @aliases: [[size]]
     *
     * @readonly
     * @type number
     */
    @aliases('size')
    public get cardinality(): number {return} public set cardinality(v: number) {/**/}
    /** Alias of [[cardinality]] */
    public get size(): number
    {
        const max       = this.words.length;
        let   i         = ZERO;
        let   output    = ZERO;

        for(; i < max; i++)
        {
            output += BitSet.hammingWeight(this.words[i]);
        }

        return output|0
    }
    public set size(v: number)
    {   /* tslint:disable-next-line:no-console */
        console.warn('Cardinality/size is read only');
    }

    /**
     * Adds numbers(indices) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param indices - Indices/numbers to add to the set.
     *
     * @returns this.
     */
    public add(...indices: number[]): BitSet
    {
        for(let i = indices.length; i--;)
        {
            this.set(indices[i]);
        }

        return this
    }

    /**
     * Clears the bitset. Length will be maintained.
     *
     * @returns this.
     */
    public clear(): BitSet
    {
        const max = this.words.length;
        for(let i = ZERO; i < max; i++)
        {
            this.words[i] = ZERO;
        }

        return this
    }

    /**
     * Creates a clone of the bitset.
     *
     * @returns  clone.
     */
    public clone(): BitSet
    {
        const clone = Object.create(BitSet.prototype);

        clone._length = this._length|0;
        clone.words   = new Int32Array(this.words);

        return clone
    }

    /**
     * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     *
     * @returns this.
     */
    public complement(): BitSet
    {
        const max = this.words.length;
        let   i   = ZERO

        for(; i < max; i++)
        {
            this.words[i] = ~this.words[i];
        }

        this.trimTrailingBits();

        return this
    }

    /**
     * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     * The result will be a new instance of a BitSet.
     *
     * @returns a new BitSet of the complement.
     */
    public Complement(): BitSet
    {
        return this.clone().complement()
    }

    /**
     * Calculates if the bitset contains a certain bitset.
     * In bitmask terms it will calculate if a bitmask fits a bitset.
     * @aliases: [[fits]]
     *
     * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
     *
     * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
     */
    @aliases('fits')
    public contains(mask: BitSet): boolean {return}
    /** Alias of [[contains]] */
    public fits(mask: BitSet): boolean
    {
        const max = mask.words.length;
        let   i   = ZERO;
        let   maskword;

        for(; i < max; i++)
        {
            maskword = mask.words[i];

            if(((this.words[i] || ZERO) & maskword) !== maskword) {return false}
        }

        return true
    }

    /**
     * Calculates the difference between 2 bitsets.
     * The result is stored in this.
     *
     * @param bitset - The bitset to subtract from the current one.
     *
     * @returns this.
     */
    public difference(bitset: BitSet): BitSet
    {
        const max = this.words.length;
        let   i   = ZERO;

        for(; i < max; i++)
        {
            this.words[i] &= ~bitset.words[i];
        }

        return this
    }

    /**
     * Calculates the difference between 2 bitsets.
     * The result will be a new instance of BitSet.
     *
     * @param bitset - The bit set to subtract from the current one.
     *
     * @returns a new BitSet of the difference.
     */
    public Difference(bitset: BitSet): BitSet
    {
        return this.clone().difference(bitset)
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
    @aliases('forEach')
    public each(cb: (value: number, index: number, bitset: BitSet) => any|boolean, ctx?: object): boolean {return}
    /** Alias of [[each]] */
    public forEach(cb: (value: number, index: number, bitset: BitSet) => any|boolean, ctx?: object): boolean
    {
        const max = this.words.length;
        let   i   = ZERO;
        let   word;
        let   tmp;

        for(; i < max; i++)
        {
            word = this.words[i];

            while (word !== ZERO)
            {
                tmp = (word & -word)|0;
                if(cb.call(ctx, ONE, (i << WORD_LOG) + BitSet.hammingWeight(tmp - ONE), this) === false) {return false}
                word ^= tmp;
            }
        }

        return true
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
    @aliases('eachAll', 'forEachAll')
    public eachAll(cb: (value: number, index: number, bitset: BitSet) => any|boolean, ctx?: object): boolean {return}
    /** Alias of [[eachAll]] */
    public forEachAll(cb: (value: number, index: number, bitset: BitSet) => any|boolean, ctx?: object): boolean
    {
        const max = this._length;
        let   i   = ZERO;

        for(; i < max; i++)
        {
            if(cb.call(ctx, this.get(i), i, this) === false) {return false}
        }

        return true
    }

    /**
     * Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object. This is kept similar to the Map object, so that each entry has the same value for its key and value here.
     *
     * @returns an iterable iterator yielding set indices [index, index].
     */
    public entries(): IterableIterator<[number, number]>
    {
        const data = [];

        this.each((val, index) => data.push([index, index]));

        return (function*(d) {yield* d;})(data)
    }

    /**
     * Tests if 2 bitsets are equal.
     *
     * @param bitset - Bitset to compare to this.
     *
     * @returns a boolean indicating if the the 2 bitsets are equal.
     */
    public equals(bitset: BitSet): boolean
    {
        const max = this.words.length;
        let  i    = ZERO;

        for(; i < max; i++)
        {
            if(this.words[i] !== bitset.words[i]) {return false}
        }

        return true
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
    @aliases('symmetricDifference', 'xor')
    public exclusion(bitset: BitSet): BitSet {return}
    /** Alias of [[exclusion]] */
    public symmetricDifference(bitset: BitSet): BitSet {return}
    /** Alias of [[exclusion]] */
    public xor(bitset: BitSet): BitSet
    {
        if(bitset.length > this._length) {this.resize(bitset.length)}

        const max = bitset.words.length;
        let   i   = ZERO;

        for(; i < max; i++)
        {
            this.words[i] ^= bitset.words[i];
        }

        return this
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
    @aliases('SymmetricDifference', 'XOR')
    public Exclusion(bitset: BitSet): BitSet {return}
    /** Alias of [[Exclusion]] */
    public SymmetricDifference(bitset: BitSet): BitSet {return}
    /** Alias of [[Exclusion]] */
    public XOR(bitset: BitSet): BitSet
    {
        return this.clone().exclusion(bitset)
    }

    /**
     * Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged.
     *
     * @param index - Index of the bit to be flipped.
     *
     * @returns this.
     */
    public flip(index: number): BitSet
    {
        index = index|0;

        if(index >= this._length) {this.resize(index+ONE)}

        this.words[index >>> WORD_LOG] ^= (ONE << index);

        return this
    }

    /**
     * Gets a specific bit from the bitset.
     *
     * @param index - Index of the bit to get.
     *
     * @returns the value of the bit at the given index.
     */
    public get(index: number): number
    {
        index = index|0;

        return (index >= this._length ? ZERO : (this.words[index >>> WORD_LOG] >>> index) & ONE)|0
    }

    /**
     * Checks is the bitsets has a value/index.
     * @aliases: [[isMember]]
     *
     * @param index - The index/value to check membership for.
     *
     * @returns a boolean indicating if the bitset has the vale/index.
     */
    @aliases('isMember')
    public has(index: number): boolean {return}
    /** Alias of [[has]] */
    public isMember(index: number): boolean
    {
        index = index|0;

        return !!this.get(index)
    }

    /**
     * Initializes the BitSet. Useful for reinitialization in case of pooling.
     *
     * @param indices_length - Length for the underlying bitvector or an iterable object with indices.
     *
     * @returns this.
     */
    public init(indices_length: Iterable<number>|number = WORD_SIZE): BitSet
    {
        const arr = is.number(indices_length) ? []             : Array.from(indices_length);
        const len = is.number(indices_length) ? indices_length : arr.length;

        this._length = len;
        this.words   = new Int32Array(Math.ceil(len / WORD_SIZE));

        this.add(...arr);

        return this
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
    @aliases('and')
    public intersection(bitset: BitSet): BitSet {return}
    /** Alias of [[intersection]] */
    public and(bitset: BitSet): BitSet
    {
        const max = this.words.length;
        let   i   = ZERO;

        for(; i < max; i++)
        {
            this.words[i] &= bitset.words[i] || ZERO;
        }

        return this
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
    @aliases('And')
    public Intersection(bitset: BitSet): BitSet {return}
    /** Alias of [[Intersection]] */
    public And(bitset: BitSet): BitSet
    {
        return this.clone().intersection(bitset);
    }

    /**
     * Calculates if two bitsets intersect.
     *
     * @param bitset - The bitset to check intersection with.
     *
     * @returns a boolean indicating if the two bitsets intersects.
     */
    public intersects(bitset: BitSet): boolean
    {
        const max = Math.min(this.words.length, bitset.words.length);
        let i     = ZERO;

        for(; i < max; i++)
        {
            if(this.words[i] & bitset.words[i]) {return true;}
        }

        return false;
    }

    /**
     * Returns if a set is empty i.e. all words are 0.
     *
     * @returns a boolean indicating that the set is empty.
     */
    public isEmpty(): boolean
    {
        const max = this.words.length;
        let   i   = ZERO;

        for(; i < max; i++)
        {
            if(this.words[i]) {return false}
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
    @aliases('isContainedIn')
    public isSubsetOf(bitset: BitSet): boolean {return}
    /** Alias of [[isSubsetOf]] */
    public isContainedIn(bitset: BitSet): boolean
    {
        return bitset.contains(this)
    }

    /**
     * Returns a new Iterator object that contains the indices of the BitSet.
     *
     * @returns iterable iterator containing set indices.
     */
    public keys(): IterableIterator<number>
    {
        return this.values()
    }

    /**
     * Getter for the length of the underlying bitvector.
     * In case of a set it will return a warning.
     */
    get length(): number
    {
        return this._length|0
    }
    set length(v: number)
    {   /* tslint:disable-next-line:no-console */
        console.warn('Length is read only');
    }

    /**
     * Returns the max index in a set.
     * @aliases: [[msb]]
     *
     * @returns the max number/index in the set.
     */
    @aliases('msb')
    public max(): number {return}
    /** Alias of [[max]] */
    public msb(): number
    {
        let word;
        let i = this.words.length;

        for(; i--;)
        {
            if(!(word = this.words[i])) {continue;}

            return ((i << WORD_LOG) + BitSet.msb(word))|0
        }
    }

    /**
     * Returns the minimum index in a set.
     * @aliases [[lsb]]
     *
     * @returns the minimum number/index in the set.
     */
    @aliases('lsb')
    public min(): number {return}
    /** Alias of [[min]] */
    public lsb(): number
    {
        let   word;
        const max = this.words.length;

        for(let i = ZERO; i < max; i++)
        {
            if(!(word = this.words[i])) {continue;}

            return ((i << WORD_LOG) + BitSet.lsb(word))|0
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
    @aliases('del')
    public remove(...indices: number[]): BitSet {return}
    /** Alias of [[remove]] */
    public del(...indices: number[]): BitSet
    {
        let i = indices.length;

        for(; i--;)
        {
            this.set(indices[i], ZERO);
        }

        return this
    }

    /**
     * Resizes the underlying bitvector to a specific length.
     * Will trim any trailing bits in case length is smaller than the current length.
     *
     * @param length - The new length.
     *
     * @returns the resized bitset.
     */
    public resize(length: number): BitSet
    {
        length = length|0;

        if(this._length === length) {return this}

        const diff      = (length - this._length)|0;
        const newLength = (length - 1 + WORD_SIZE >>> WORD_LOG)|0;

        this._length = length;

        if(newLength !== this.words.length)
        {
            const max      = Math.min(newLength, this.words.length)|0;
            const newWords = new Int32Array(newLength);
            let i          = ZERO;

            for(; i < max; i++)
            {
                newWords[i] = this.words[i];
            }

            this.words  = newWords;
        }

        // trim trailing bits
        if(diff < ZERO) {this.trimTrailingBits();}

        return this
    }

    /**
     * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param index - Index/number to add to the set.
     * @param val   - Value (0|1) to set.
     *
     * @returns this.
     */
    public set(index: number, val: number = ONE): BitSet
    {
        index = index|0; val = val|0;

        if(index >= this._length && val !== ZERO) { // don't resize in case of a remove
            this.resize(index+ONE);
        }

        if(val === ZERO)
        {
            this.words[index >>> WORD_LOG] &= ~(ONE << index);
        }
        else
        {
            this.words[index >>> WORD_LOG] |=  (ONE << index);
        }

        return this
    }

    /**
     * Outputs the set as an array.
     *
     * @param type - Type for the array Uint(8|16|32)Array.
     *
     * @returns an array representing the bitset.
     */
    public toArray(type?: number): number[]|Uint8Array|Uint16Array|Uint32Array
    {
        let arr;
        let i = ZERO;

        switch(type)
        {
            case  8 : arr = new Uint8Array(this.cardinality);  break;
            case 16 : arr = new Uint16Array(this.cardinality); break;
            case 32 : arr = new Uint32Array(this.cardinality); break;
            default : arr = [];
        }

        this.each((val, index) => arr[i++] = index);

        return arr
    }

    /**
     * Outputs the underlying bitvector as an array, starting with the least significant bits.
     *
     * @param type - Type for the array Uint(8|16|32)Array.
     *
     * @returns an bit array representation of the bitset.
     */
    public toBitArray(type?: number): number[]|Uint8Array|Uint16Array|Uint32Array
    {
        let arr;

        switch(type)
        {
            case  8 : arr = new Uint8Array(this._length); break;
            case 16 : arr = new Uint16Array(this._length); break;
            case 32 : arr = new Uint32Array(this._length); break;
            default : arr = [];
        }

        this.eachAll((val, index) => {arr[index] = val;});

        return arr
    }

    /**
     * Outputs the underlying bitvector as a boolean array, starting with the least significant bits.
     *
     * @returns a boolean array representing the bitset.
     */
    public toBooleanArray(): boolean[]
    {
        const arr = [];

        this.eachAll((val, index) => {arr[index] = !!val;});

        return arr
    }

    /**
     * Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
     *
     * @param mode - Mode for stringification. -1 is used to display the full string including trailing bits.
     *
     * @returns the stringified bitvector.
     */
    public toBitString(mode?: number): string
    {
        let output = '';
        let i      = (~mode)
            ? this._length
            : this.words.length * WORD_SIZE;


        while(i--)
        {
            output += this.get(i)
        }

        return output
    }

    /**
     * Will output a string version of the bitset or bitstring.
     * @aliases: [[stringify]]
     *
     * @param mode - Mode of toString. undefined=bitset | 2=bitstring | -1=full bitstring.
     *
     * @returns stringified version of the bitset.
     */
    @aliases('stringify')
    public toString(mode?: number): string {return}
    /** Alias of [[toString]] */
    public stringify(mode?: number): string
    {
        let output = '';

        switch(mode)
        {
            case -1 /*binary full*/ :
            case  2 /*binary*/      : output  = this.toBitString(mode); break;
            default /*set*/         : output += '{'; this.each((val, index) => {output += (output !== '{' ? ', ' : '') + index;}); output += '}';
        }

        return output
    }

    /**
     * Trims the bitset to the most significant bit to save space.
     *
     * @returns this.
     */
    public trim(): BitSet
    {
        return this.resize(this.max()+ONE)
    }

    /**
     * Trims (sets to zero) any trailing bits that fall out of this._length but within this.words.length*WORD_SIZE.
     * Assumes this.length is somewhere in the last word.
     *
     * @returns this.
     */
    private trimTrailingBits(): BitSet
    {
        const wordsLength = this.words.length|0;
        const diff        = (wordsLength*WORD_SIZE - this._length)|0;

        this.words[wordsLength-1] = this.words[wordsLength-1] << diff >>> diff;

        return this
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
    @aliases('or')
    public union(bitset: BitSet): BitSet {return}
    /** Alias of [[union]] */
    public or(bitset: BitSet): BitSet
    {
        if(bitset.length > this._length) {this.resize(bitset.length)}

        const max = bitset.words.length;
        let   i   = ZERO;

        for(; i < max; i++)
        {
            this.words[i] |= bitset.words[i];
        }

        return this
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
    @aliases('Or')
    public Union(bitset: BitSet): BitSet {return}
    /** Alias of [[Union]] */
    public Or(bitset: BitSet): BitSet
    {
        return this.clone().union(bitset)
    }

    /**
     * Returns a new Iterator object that contains the indices of the BitSet.
     *
     * @returns iterable iterator containing yielding the indices.
     */
    public values(): IterableIterator<number>
    {
        return (function*(data) {yield* data;})(this.toArray())
    }
}
