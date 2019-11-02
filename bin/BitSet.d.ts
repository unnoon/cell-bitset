/**
 * Fast JS BitSet implementation. Beyond 32bit restrictions.
 */
export default class BitSet {
    /**
     * Info object to hold general module information.
     */
    static info: {
        "name": string;
        "description": string;
        "version": string;
        "url": string;
    };
    /**
     * The species of the BitSet. Which is just the BitSet constructor.
     */
    static [Symbol.species]: typeof BitSet;
    /**
     * Easy create method avoiding ugly 'new' keywords.
     * @aliases: [[spawn]]
     *
     * @param indices_length - Length for the underlying bitvector or an iterable object with indices.
     *
     * @returns a new BitSet.
     */
    static create(indices_length?: Iterable<number> | number): BitSet;
    /** Alias of [[create]] */
    static spawn(indices_length?: Iterable<number> | number): BitSet;
    /**
     * Calculate the hamming weight i.e. the number of ones in a bitstring/word.
     * @aliases: [[popCount]]
     *
     * @param w - Word to get the number of set bits from.
     *
     * @returns the number of set bits in the word.
     */
    static hammingWeight(w: number): number;
    /** Alias of [[hammingWeight]] */
    static popCount(w: number): number;
    /**
     * Returns the least significant bit in a word. Returns 32 in case the word is 0.
     *
     * @param w - The word to get the least significant bit from.
     *
     * @returns the least significant bit in w.
     */
    static lsb(w: number): number;
    /**
     * Returns the most significant bit in a word.
     *
     * @param w - the word to get the most significant bit from.
     *
     * @returns the most significant bit in w.
     */
    static msb(w: number): number;
    /**
     * Custom name for Object.prototype.toString.call(bitset) === [object BitSet]
     */
    [Symbol.toStringTag]: string;
    /**
     * Array of 32bit words.
     */
    words: Int32Array;
    private _length;
    /**
     * BitSet constructor.
     *
     * @param indices_length - Length for the underlying bitvector or an Iterable<number> with indices.
     *
     * @returns a new BitSet.
     */
    constructor(indices_length?: Iterable<number> | number);
    /**
     * Prototype Symbol.iterator to make BitSet iterable.
     * Returns a new Iterator object that contains the indices in the BitSet object.
     *
     * @returns iterable iterator containing the indices.
     */
    [Symbol.iterator](): IterableIterator<number>;
    /**
     * Getter for the cardinality of the set. In case of a set it will return a warning.
     * @aliases: [[size]]
     *
     * @readonly
     * @type number
     */
    cardinality: number;
    /** Alias of [[cardinality]] */
    size: number;
    /**
     * Adds numbers(indices) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param indices - Indices/numbers to add to the set.
     *
     * @returns this.
     */
    add(...indices: number[]): BitSet;
    /**
     * Clears the bitset. Length will be maintained.
     *
     * @returns this.
     */
    clear(): BitSet;
    /**
     * Creates a clone of the bitset.
     *
     * @returns  clone.
     */
    clone(): BitSet;
    /**
     * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     *
     * @returns this.
     */
    complement(): BitSet;
    /**
     * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     * The result will be a new instance of a BitSet.
     *
     * @returns a new BitSet of the complement.
     */
    Complement(): BitSet;
    /**
     * Calculates if the bitset contains a certain bitset.
     * In bitmask terms it will calculate if a bitmask fits a bitset.
     * @aliases: [[fits]]
     *
     * @param mask - Tests if a bitset mask fits. i.e. subset to test containment.
     *
     * @returns a boolean indicating if the mask fits the bitset (i.e. is a subset).
     */
    contains(mask: BitSet): boolean;
    /** Alias of [[contains]] */
    fits(mask: BitSet): boolean;
    /**
     * Calculates the difference between 2 bitsets.
     * The result is stored in this.
     *
     * @param bitset - The bitset to subtract from the current one.
     *
     * @returns this.
     */
    difference(bitset: BitSet): BitSet;
    /**
     * Calculates the difference between 2 bitsets.
     * The result will be a new instance of BitSet.
     *
     * @param bitset - The bit set to subtract from the current one.
     *
     * @returns a new BitSet of the difference.
     */
    Difference(bitset: BitSet): BitSet;
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
    each(cb: (value: number, index: number, bitset: BitSet) => any | boolean, ctx?: object): boolean;
    /** Alias of [[each]] */
    forEach(cb: (value: number, index: number, bitset: BitSet) => any | boolean, ctx?: object): boolean;
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
    eachAll(cb: (value: number, index: number, bitset: BitSet) => any | boolean, ctx?: object): boolean;
    /** Alias of [[eachAll]] */
    forEachAll(cb: (value: number, index: number, bitset: BitSet) => any | boolean, ctx?: object): boolean;
    /**
     * Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object. This is kept similar to the Map object, so that each entry has the same value for its key and value here.
     *
     * @returns an iterable iterator yielding set indices [index, index].
     */
    entries(): IterableIterator<[number, number]>;
    /**
     * Tests if 2 bitsets are equal.
     *
     * @param bitset - Bitset to compare to this.
     *
     * @returns a boolean indicating if the the 2 bitsets are equal.
     */
    equals(bitset: BitSet): boolean;
    /**
     * Calculates the exclusion/symmetric difference between to bitsets.
     * The result is stored in this.
     * @aliases: [[symmetricDifference]], [[xor]]
     *
     * @param bitset - The bitset to calculate the symmetric difference with.
     *
     * @returns this.
     */
    exclusion(bitset: BitSet): BitSet;
    /** Alias of [[exclusion]] */
    symmetricDifference(bitset: BitSet): BitSet;
    /** Alias of [[exclusion]] */
    xor(bitset: BitSet): BitSet;
    /**
     * Calculates the exclusion/symmetric difference between to bitsets.
     * The result is a new instance of BitSet.
     * @aliases: [[SymmetricDifference]], [[XOR]]
     *
     * @param bitset - The bitset to calculate the symmetric difference with.
     *
     * @returns a new BitSet of the exclusion.
     */
    Exclusion(bitset: BitSet): BitSet;
    /** Alias of [[Exclusion]] */
    SymmetricDifference(bitset: BitSet): BitSet;
    /** Alias of [[Exclusion]] */
    XOR(bitset: BitSet): BitSet;
    /**
     * Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged.
     *
     * @param index - Index of the bit to be flipped.
     *
     * @returns this.
     */
    flip(index: number): BitSet;
    /**
     * Gets a specific bit from the bitset.
     *
     * @param index - Index of the bit to get.
     *
     * @returns the value of the bit at the given index.
     */
    get(index: number): number;
    /**
     * Checks is the bitsets has a value/index.
     * @aliases: [[isMember]]
     *
     * @param index - The index/value to check membership for.
     *
     * @returns a boolean indicating if the bitset has the vale/index.
     */
    has(index: number): boolean;
    /** Alias of [[has]] */
    isMember(index: number): boolean;
    /**
     * Initializes the BitSet. Useful for reinitialization in case of pooling.
     *
     * @param indices_length - Length for the underlying bitvector or an iterable object with indices.
     *
     * @returns this.
     */
    init(indices_length?: Iterable<number> | number): BitSet;
    /**
     * Calculates the intersection between two bitsets.
     * The result is stored in this.
     * @aliases: [[and]]
     *
     * @param bitset - The bitset to calculate the intersection with.
     *
     * @returns this.
     */
    intersection(bitset: BitSet): BitSet;
    /** Alias of [[intersection]] */
    and(bitset: BitSet): BitSet;
    /**
     * Calculates the intersection between two bitsets.
     * The result is a new instance of BitSet.
     * @aliases: [[And]]
     *
     * @param bitset - The bitset to calculate the intersection with.
     *
     * @returns a new bitset intersection.
     */
    Intersection(bitset: BitSet): BitSet;
    /** Alias of [[Intersection]] */
    And(bitset: BitSet): BitSet;
    /**
     * Calculates if two bitsets intersect.
     *
     * @param bitset - The bitset to check intersection with.
     *
     * @returns a boolean indicating if the two bitsets intersects.
     */
    intersects(bitset: BitSet): boolean;
    /**
     * Returns if a set is empty i.e. all words are 0.
     *
     * @returns a boolean indicating that the set is empty.
     */
    isEmpty(): boolean;
    /**
     * Checks if a bitset is contained in another.
     * @aliases: isContainedIn
     *
     * @param bitset - BitSet to check for containment.
     *
     * @returns a boolean indicating if this is contained in bitset.
     */
    isSubsetOf(bitset: BitSet): boolean;
    /** Alias of [[isSubsetOf]] */
    isContainedIn(bitset: BitSet): boolean;
    /**
     * Returns a new Iterator object that contains the indices of the BitSet.
     *
     * @returns iterable iterator containing set indices.
     */
    keys(): IterableIterator<number>;
    /**
     * Getter for the length of the underlying bitvector.
     * In case of a set it will return a warning.
     */
    length: number;
    /**
     * Returns the max index in a set.
     * @aliases: [[msb]]
     *
     * @returns the max number/index in the set.
     */
    max(): number;
    /** Alias of [[max]] */
    msb(): number;
    /**
     * Returns the minimum index in a set.
     * @aliases [[lsb]]
     *
     * @returns the minimum number/index in the set.
     */
    min(): number;
    /** Alias of [[min]] */
    lsb(): number;
    /**
     * Removes indices/numbers from the bitset.
     * @alias  [[del]]
     *
     * @param indices - The indices/numbers to be removed.
     *
     * @returns this.
     */
    remove(...indices: number[]): BitSet;
    /** Alias of [[remove]] */
    del(...indices: number[]): BitSet;
    /**
     * Resizes the underlying bitvector to a specific length.
     * Will trim any trailing bits in case length is smaller than the current length.
     *
     * @param length - The new length.
     *
     * @returns the resized bitset.
     */
    resize(length: number): BitSet;
    /**
     * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param index - Index/number to add to the set.
     * @param val   - Value (0|1) to set.
     *
     * @returns this.
     */
    set(index: number, val?: number): BitSet;
    /**
     * Outputs the set as an array.
     *
     * @param type - Type for the array Uint(8|16|32)Array.
     *
     * @returns an array representing the bitset.
     */
    toArray(type?: number): number[] | Uint8Array | Uint16Array | Uint32Array;
    /**
     * Outputs the underlying bitvector as an array, starting with the least significant bits.
     *
     * @param type - Type for the array Uint(8|16|32)Array.
     *
     * @returns an bit array representation of the bitset.
     */
    toBitArray(type?: number): number[] | Uint8Array | Uint16Array | Uint32Array;
    /**
     * Outputs the underlying bitvector as a boolean array, starting with the least significant bits.
     *
     * @returns a boolean array representing the bitset.
     */
    toBooleanArray(): boolean[];
    /**
     * Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
     *
     * @param mode - Mode for stringification. -1 is used to display the full string including trailing bits.
     *
     * @returns the stringified bitvector.
     */
    toBitString(mode?: number): string;
    /**
     * Will output a string version of the bitset or bitstring.
     * @aliases: [[stringify]]
     *
     * @param mode - Mode of toString. undefined=bitset | 2=bitstring | -1=full bitstring.
     *
     * @returns stringified version of the bitset.
     */
    toString(mode?: number): string;
    /** Alias of [[toString]] */
    stringify(mode?: number): string;
    /**
     * Trims the bitset to the most significant bit to save space.
     *
     * @returns this.
     */
    trim(): BitSet;
    /**
     * Trims (sets to zero) any trailing bits that fall out of this._length but within this.words.length*WORD_SIZE.
     * Assumes this.length is somewhere in the last word.
     *
     * @returns this.
     */
    trimTrailingBits(): BitSet;
    /**
     * Calculates the union between 2 bitsets.
     * The result is stored in this.
     * @aliases: [[or]]
     *
     * @param bitset - Bitset to calculate the union with.
     *
     * @returns the union of the two bitsets.
     */
    union(bitset: BitSet): BitSet;
    /** Alias of [[union]] */
    or(bitset: BitSet): BitSet;
    /**
     * Calculates the union between 2 bitsets.
     * The result is a new BitSet.
     * @aliases: [[Or]]
     *
     * @param bitset - Bitset to calculate the union with.
     *
     * @returns a new BitSet of the union of the two bitsets.
     */
    Union(bitset: BitSet): BitSet;
    /** Alias of [[Union]] */
    Or(bitset: BitSet): BitSet;
    /**
     * Returns a new Iterator object that contains the indices of the BitSet.
     *
     * @returns iterable iterator containing yielding the indices.
     */
    values(): IterableIterator<number>;
}
