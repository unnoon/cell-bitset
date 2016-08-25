/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation. No worrying about 32bits restrictions.
 */
export {BitSet as CBitSet};
export default BitSet.prototype

/*<3*/
// int32 consts
const zero      =  0|0;
const one       =  1|0;
const WORD_SIZE = 32|0;
const WORD_LOG  =  5|0;

const properties = {
    /**
     * @name BitSet.info
     * @desc
     *       Info object to hold general module information
     */
    'static info': {
        "name"       : "cell-bitset",
        "description": "Fast JS BitSet implementation. No worrying about 32bits restrictions.",
        "version"    : "0.1.0",
        "url"        : "https://github.com/unnoon/cell-bitset"
    },
    /**
     * @method BitSet.create
     * @desc   **aliases:** spawn
     * #
     *         Easy create method for people who use prototypal inheritance.
     *
     * @param {number|Iterable.<any>=} length_iterable=32 - length for the underlying bitvector or an iterable object with indices.
     *
     * @return {BitSet} new BitSet.
     */
    'static create': function(length_iterable=WORD_SIZE) {
    "@aliases: spawn";
    {
        return Object.create(BitSet.prototype).init(length_iterable);
    }},
    /**
     * @method BitSet.hammingWeight
     * @desc   **aliases:** popCount
     * #
     *         Calculate the hamming weight i.e. the number of ones in a bitstring/word.
     *
     * @param {number} w - word to get the number of set bits from.
     *
     * @returns {number} the number of set bits in the word.
     */
    'static hammingWeight': function(w) { w = w|0;
    "@aliases: popCount";
    {
        w -= (w >>> 1) & 0x55555555;
        w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

        return (((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24)|0;
    }},
    /**
     * @method BitSet.$lsb
     * @desc
     *         Returns the least significant bit in a word. Returns 32 in case the word is 0.
     *
     * @param {number} w - the word to get the least significant bit from.
     *
     * @returns {number} the least significant bit in w.
     */
    'static $lsb': function(w) { w = w|0;
    {
        return this.hammingWeight((w & -w) - 1)|0;
    }},
    /**
     * @method BitSet.$msb
     * @desc
     *         Returns the most significant bit in a word.
     *
     * @param {number} w - the word to get the most significant bit from.
     *
     * @returns {number} the most significant bit in w.
     */
    'static $msb': function(w) { w = w|0;
    {
        w |= w >> 1;
        w |= w >> 2;
        w |= w >> 4;
        w |= w >> 8;
        w |= w >> 16;
        w = (w >> 1) + 1;
        return this.hammingWeight(w - 1)|0;
    }},
    /**
     * @method BitSet#add
     * @desc
     *         Adds numbers(indices) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param {...number} indices - indices/numbers to add to the set.
     *
     * @returns {BitSet} this
     */
    add: function(...indices) {
    {
        for(let i = indices.length; i--;)
        {
            this.set(indices[i]);
        }

        return this
    }},
    /**
     * @name BitSet#cardinality
     * @desc **aliases:** size
     * #
     *       Getter for the cardinality of the set.
     *       In case of a set it will return a warning.
     *
     * @readonly
     * @type number
     */
    get cardinality() {
    "@aliases: size";
    {
        const max       = this.words.length;
        let   i, output = zero;

        for(i = zero; i < max; i++)
        {
            output += this.hammingWeight(this.words[i]);
        }

        return output|0
    }},
    set cardinality(v) {
    {
        console.warn('Cardinality is read only')
    }},
    /**
     * @method BitSet#clear
     * @desc
     *         Clears the bitset. Length will be maintained.
     *
     * @returns {BitSet} this
     */
    clear: function() {
    {
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {
            this.words[i] = zero;
        }

        return this
    }},
    /**
     * @method BitSet#clone
     * @desc
     *         Creates a clone of the bitset.
     *
     * @returns {BitSet} clone
     */
    clone: function() {
    {
        const clone = Object.create(BitSet.prototype);

        clone._length = this._length|0;
        clone.words   = new Uint32Array(this.words);

        return clone;
    }},
    /**
     * @method BitSet#complement
     * @desc
     *         Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     *
     * @returns {BitSet} this
     */
    complement: function() {
    {
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {
            this.words[i] = ~this.words[i];
        }

        this.trimTrailingBits();

        return this
    }},
    /**
     * @method BitSet#Complement
     * @desc
     *         Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
     *         The result will be a new instance of a BitSet.
     *
     * @returns {BitSet} new BitSet of the complement.
     */
    Complement: function() {
    {
        return this.clone().complement();
    }},
    /**
     * @method BitSet#contains
     * @desc   **aliases:** fits
     * #
     *         Calculates if the bitset contains a certain bitset.
     *         In bitmask terms it will calculate if a bitmask fits a bitset.
     *
     * @param {BitSet} mask - bitset mask to test fit. i.e. subset to test containment.
     *
     * @returns {boolean} boolean indicating if the mask fits the bitset or is a subset.
     */
    contains: function(mask) {
    "@aliases: fits";
    {
        const max = mask.words.length;
        let   i, maskword;

        for(i = zero; i < max; i++)
        {
            maskword = mask.words[i];

            if(((this.words[i] || 0) & maskword) !== maskword) {return false}
        }

        return true
    }},
    /**
     * @method BitSet#difference
     * @desc
     *         Calculates the difference between 2 bitsets.
     *         The result is stored in this.
     *
     * @param {BitSet} bitset - the bit set to subtract from the current one.
     *
     * @returns {BitSet} this
     */
    difference: function(bitset) {
    {
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {
            this.words[i] &= ~bitset.words[i];
        }

        return this
    }},
    /**
     * @method BitSet#Difference
     * @desc
     *         Calculates the difference between 2 bitsets.
     *         The result will be a new instance of BitSet.
     *
     * @param {BitSet} bitset - the bit set to subtract from the current one.
     *
     * @returns {BitSet} new BitSet of the difference.
     */
    Difference: function(bitset) {
    {
        return this.clone().difference(bitset)
    }},
    /**
     * @method BitSet#each
     * @desc   **aliases:** forEach
     * #
     *         Iterates over the set bits and calls the callback function with: value=1, index, this.
     *         Can be broken prematurely by returning false.
     *
     * @param {function(value, index, bitset)} cb   - callback function to be called on each bit.
     * @param {Object=}                        ctx - context to be called upon the callback function.
     *
     * @returns {boolean} boolean indicating if the loop finished completely=true or was broken=false
     */
    each: function(cb, ctx=null) {
    "@aliases: forEach";
    {
        const max = this.words.length;
        let   i, word, tmp;

        for(i = zero; i < max; i++)
        {
            word = this.words[i];

            while (word !== 0)
            {
                tmp = (word & -word)|0;
                if(cb.call(ctx, one, (i << WORD_LOG) + this.hammingWeight(tmp - one), this) === false) {return false}
                word ^= tmp;
            }
        }

        return true
    }},
    /**
     * @method BitSet#each$
     * @desc   **aliases:** forEach$, eachAll, forEachAll
     * #
     *         Iterates over all bits and calls the callback function with: value, index, this.
     *         Can be broken prematurely by returning false.
     *
     * @param {function(value, index, bitset)} cb   - callback function o be called on each bit.
     * @param {Object=}                        ctx - context to be called upon the callback function.
     *
     * @returns {boolean} boolean indicating if the loop finished completely=true or was broken=false.
     */
    each$: function(cb, ctx=null) {
    "@aliases: forEach$, eachAll, forEachAll";
    {
        const max = this._length;
        for(let i = zero; i < max; i++)
        {
            if(cb.call(ctx, this.get(i), i, this) === false) {return false}
        }

        return true
    }},
    /**
     * @method BitSet#equals
     * @desc
     *         Tests if 2 bitsets are equal.
     *
     * @param {BitSet} bitset - bitset to compare to this.
     *
     * @returns {boolean} boolean indicating if the the 2 bitsets are equal.
     */
    equals: function(bitset) {
    {
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {
            if(this.words[i] !== bitset.words[i]) {return false}
        }

        return true
    }},
    /**
     * @method BitSet#exclusion
     * @desc   **aliases:** symmetricDifference, xor
     * #
     *         Calculates the exclusion/symmetric difference between to bitsets.
     *         The result is stored in this.
     *
     * @param {BitSet} bitset - the bitset to calculate the symmetric difference with.
     *
     * @returns {BitSet} this
     */
    exclusion: function(bitset) {
    "@aliases: symmetricDifference, xor";
    {
        if(bitset.length > this._length) {this.resize(bitset.length)}

        const max = bitset.words.length;
        for(let i = zero; i < max; i++)
        {
            this.words[i] ^= bitset.words[i];
        }

        return this
    }},
    /**
     * @method BitSet#Exclusion
     * @desc   **aliases:** SymmetricDifference, Xor
     * #
     *         Calculates the exclusion/symmetric difference between to bitsets.
     *         The result is a new instance of BitSet.
     *
     * @param {BitSet} bitset - the bitset to calculate the symmetric difference with.
     *
     * @returns {BitSet} new BitSet of the exclusion.
     */
    Exclusion: function(bitset) {
    "@aliases: SymmetricDifference, Xor";
    {
        return this.clone().exclusion(bitset)
    }},
    /**
     * @method BitSet#flip
     * @desc
     *         Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged.
     *
     * @param {number} index - index of the bit to be flipped.
     *
     * @returns {BitSet} this
     */
    flip: function(index) { index = index|0;
    {
        if(index >= this._length) {this.resize(index+one)}

        this.words[index >>> WORD_LOG] ^= (one << index);

        return this
    }},
    /**
     * @method BitSet#get
     * @desc
     *         Gets a specific bit from the bitset.
     *
     * @param {number} index - index of the bit to get.
     *
     * @returns {number} the value of the bit at the given index.
     */
    get: function(index) { index = index|0;
    {
        return (index >= this._length ? zero : (this.words[index >>> WORD_LOG] >>> index) & one)|0;
    }},
    /**
     * @method BitSet#has
     * @desc   **aliases:** isMember
     * #
     *         Checks is the bitsets has a value/index.
     *
     * @param {number} index - the index/value to check membership for.
     *
     * @returns {boolean} boolean indicating if the bitset has the vale/index.
     */
    has: function(index) { index = index|0;
    "@aliases: isMember";
    {
        return !!this.get(index);
    }},
    /**
     * @method BitSet#init
     * @desc
     *         Initializes the BitSet. Useful in case one wants to use 'Object.create' instead of 'new'.
     *
     * @param {number|Iterable.<any>=} length_iterable=32 - length for the underlying bitvector or an iterable object with indices.
     *
     * @returns {BitSet} this
     */
    init: function(length_iterable=WORD_SIZE) {
    {
        const itr = Array.from(length_iterable);
        const len = (typeof(length_iterable) === 'number' ? length_iterable : itr.length)|0;

        Reflect.defineProperty(this,'_length', {value: len, writable: true});
        this.words = new Uint32Array(Math.ceil(this._length / WORD_SIZE));

        this.add(...itr);

        return this
    }},
    /**
     * @method BitSet#intersection
     * @desc   **aliases:** and
     * #
     *         Calculates the intersection between two bitsets.
     *         The result is stored in this.
     *
     * @param {BitSet} bitset - the bitset to calculate the intersection with.
     *
     * @returns {BitSet} this
     */
    intersection: function(bitset) {
    "@aliases: and";
    {
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {
            this.words[i] &= bitset.words[i] || zero;
        }

        return this
    }},
    /**
     * @method BitSet#Intersection
     * @desc   **aliases:** And
     * #
     *         Calculates the intersection between two bitsets.
     *         The result is a new instance of BitSet.
     *
     * @param {BitSet} bitset - the bitset to calculate the intersection with.
     *
     * @returns {BitSet} new bitset intersection.
     */
    Intersection: function(bitset) {
    "@aliases: And";
    {
        return this.clone().intersection(bitset)
    }},
    /**
     * @method BitSet#intersects
     * @desc
     *         Calculates if two bitsets intersect.
     *
     * @param {BitSet} bitset - the bitset to check intersection with.
     *
     * @returns {boolean} boolean indicating if the two bitsets intersects.
     */
    intersects: function(bitset) {
    {
        const max = Math.min(this.words.length, bitset.words.length);
        for(let i = zero; i < max; i++)
        {
            if(this.words[i] & bitset.words[i]) {return true}
        }

        return false
    }},
    /**
     * @method BitSet#isEmpty
     * @desc
     *         Returns if a set is empty i.e. all words are 0.
     *
     * @returns {boolean} boolean indicating that the set is empty.
     */
    isEmpty: function() {
    {
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {
            if(this.words[i]) {return false}
        }

        return true
    }},
    /**
     * @method BitSet#isSubsetOf
     * @desc   **aliases:** isContainedIn
     * #
     *         Checks if a bitset is contained in another.
     *
     * @param {BitSet} bitset - to check for containment.
     *
     * @returns {boolean} boolean indicating if this is contained in bitset.
     */
    isSubsetOf: function(bitset) {
    "@aliases: isContainedIn";
    {
        return bitset.contains(this);
    }},
    /**
     * @readonly
     * @name BitSet#length
     * @type number
     * @desc
     *       Getter for the length of the underlying bitvector.
     *       In case of a set it will return a warning.
     */
    get length() {
    {
        return this._length|0;
    }},
    set length(v) {
    {
        console.warn('Length is read only')
    }},
    /**
     * @method BitSet#max
     * @desc   **aliases:** msb
     * #
     *         Returns the max index in a set.
     *
     * @returns {number} the max number/index in the set.
     */
    max: function() {
    "@aliases: msb";
    {
        let word;

        for(let i = this.words.length; i--;)
        {   if(!(word = this.words[i])) {continue}

            return ((i << WORD_LOG) + this.$msb(word))|0;
        }
    }},
    /**
     * @method BitSet#min
     * @desc   **aliases:** lsb
     * #
     *         Returns the minimum index in a set.
     *
     * @returns {number} the minimum number/index in the set.
     */
    min: function() {
    "@aliases: lsb";
    {
        let   word;
        const max = this.words.length;
        for(let i = zero; i < max; i++)
        {   if(!(word = this.words[i])) {continue}

            return ((i << WORD_LOG) + this.$lsb(word))|0;
        }
    }},
    /**
     * @method BitSet#remove
     * @desc
     *         Removes indices/numbers from the bitset.
     *
     * @param {...number} indices - the indices/numbers to be removed.
     *
     * @returns {BitSet}
     */
    remove: function(...indices) {
    "@aliases: delete";
    {
        for(let i = indices.length; i--;)
        {
            this.set(indices[i], 0);
        }

        return this
    }},
    /**
     * @method BitSet#resize
     * @desc
     *         Resizes the underlying bitvector to a specific length.
     *         Will trim any trailing bits in case length is smaller than the current length.
     *
     * @param {number} len - the new length.
     *
     * @returns {BitSet} the resized bitset.
     */
    resize: function(len) { len = len|0;
    {   if(this._length === len) {return this}

        const diff      = (len - this._length)|0;
        const newLength = (len - 1 + WORD_SIZE >>> WORD_LOG)|0;
        let   i, max, newWords;

        this._length = len;

        if(newLength !== this.words.length)
        {
            newWords = new Uint32Array(newLength);

            for(i = zero, max = Math.min(newLength, this.words.length)|0; i < max; i++)
            {
                newWords[i] = this.words[i];
            }

            this.words  = newWords;
        }

        // trim trailing bits
        if(diff < 0) {this.trimTrailingBits()}

        return this
    }},
    /**
     * @method BitSet#set
     * @desc
     *         Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
     *
     * @param {number}  index - index/number to add to the set.
     * @param {number=} val=1 - value (0|1) to set.
     *
     * @returns {BitSet} this
     */
    set: function(index, val=one) { index = index|0; val = val|0;
    {
        if(index >= this._length && val !== zero) {this.resize(index+one)} // don't resize in case of a remove

        if(val === zero)
        {
            this.words[index >>> WORD_LOG] &= ~(one << index);
        }
        else
        {
            this.words[index >>> WORD_LOG] |=  (one << index);
        }

        return this;
    }},
    /**
     * @method BitSet#toArray
     * @desc
     *         Outputs the set as an array.
     *
     * @param {number=} type - type for the array Uint(8|16|32)Array.
     *
     * @returns {Array<number>|Uint8Array<int>|Uint16Array<int>|Uint32Array<int>}
     */
    toArray: function(type=void 0) {
    "@aliases: entries";
    {
        let arr;
        let i = zero;

        switch(type)
        {
            case  8 : arr = new Uint8Array(this.cardinality); break;
            case 16 : arr = new Uint16Array(this.cardinality); break;
            case 32 : arr = new Uint32Array(this.cardinality); break;
            default : arr = [];
        }

        this.each((val, index) => {arr[i++] = index});

        return arr;
    }},
    /**
     * @method BitSet#toBitArray
     * @desc
     *         Outputs the underlying bitvector as an array, starting with the least significant bits.
     *
     * @param {number=} type - type for the array Uint(8|16|32)Array.
     *
     * @returns {Array<number>|Uint8Array<int>|Uint16Array<int>|Uint32Array<int>}
     */
    toBitArray: function(type=void 0) {
    {
        let arr;

        switch(type)
        {
            case  8 : arr = new Uint8Array(this._length); break;
            case 16 : arr = new Uint16Array(this._length); break;
            case 32 : arr = new Uint32Array(this._length); break;
            default : arr = [];
        }

        this.each$((val, index) => {arr[index] = val});

        return arr;
    }},
    /**
     * @method BitSet#toBooleanArray
     * @desc
     *         Outputs the underlying bitvector as a boolean array, starting with the least significant bits.
     *
     * @returns {Array<boolean>}
     */
    toBooleanArray: function() {
    {
        const arr = [];

        this.each$((val, index) => {arr[index] = !!val});

        return arr;
    }},
    /**
     * @method BitSet#toBitString
     * @desc
     *         Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
     *
     * @param {number=} mode - mode for stringification. -1 is used to display the full string including trailing bits.
     *
     * @returns {string} the stringified bitvector.
     */
    toBitString: function(mode=void 0) {
    {
        let output = '';

        for(let i = this.words.length|0; i--;)
        {   // typed arrays will discard any leading zero's when using toString
            output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
        }

        return ~mode ? output.slice(-this._length) : output;
    }},
    /**
     * @method BitSet#toString
     * @desc   **aliases:** stringify
     * #
     *         Will output a string version of the bitset or bitstring.
     *
     * @param {number=} mode - mode of toString. undefined=bitset | 2=bitstring | -1=full bitstring.
     *
     * @returns {string} stringified version of the bitset.
     */
    toString: function(mode=void 0) {
    "@aliases: stringify";
    {
        let output = '';

        switch(mode)
        {
            case -1 /*binary full*/ :
            case  2 /*binary*/      : output = this.toBitString(mode); break;
            default /*set*/         : output += '{'; this.each((val, index) => {output += (output !== '{' ? ', ' : '') + index}); output += '}'
        }

        return output
    }},
    /**
     * @method BitSet#trim
     * @desc
     *         Trims the bitset to the most significant bit to save space.
     *
     * @returns {BitSet} this
     */
    trim: function() {
    {
        return this.resize(this.max()+one)
    }},
    /**
     * @method BitSet#trimTrailingBits
     * @desc
     *         Trims any trailing bits. That fall out of this.length but within this.words.length*WORD_SIZE.
     *         Assumes this.length is somewhere in the last word.
     *
     * @returns {BitSet}
     */
    trimTrailingBits: function() {
    {
        const wordsLength = this.words.length|0;
        const diff        = (wordsLength*WORD_SIZE - this._length)|0;

        this.words[wordsLength-1] = this.words[wordsLength-1] << diff >>> diff;

        return this
    }},
    /**
     * @method BitSet#union
     * @desc   **aliases:** or
     * #
     *         Calculates the union between 2 bitsets.
     *         The result is stored in this.
     *
     * @param {BitSet} bitset - bitset to calculate the union with.
     *
     * @returns {BitSet} the union of the two bitsets.
     */
    union: function(bitset) {
    "@aliases: or";
    {
        if(bitset.length > this._length) {this.resize(bitset.length)}

        const max = bitset.words.length;
        for(let i = zero; i < max; i++)
        {
            this.words[i] |= bitset.words[i];
        }

        return this
    }},
    /**
     * @method BitSet#Union
     * @desc   **aliases:** Or
     * #
     *         Calculates the union between 2 bitsets.
     *         The result is a new BitSet.
     *
     * @param {BitSet} bitset - bitset to calculate the union with.
     *
     * @returns {BitSet} new BitSet of the union of the two bitsets.
     */
    Union: function(bitset) {
    "@aliases: Or";
    {
        return this.clone().union(bitset);
    }}
};

/**
 * @class BitSet
 * @desc
 *        Fast JS BitSet implementation.
 *        No worrying about 32bits restrictions.
 *
 * @param {number|Array=} length_array=32 - length for the underlying bitvector or an array-like object with indices.
 *
 * @return {BitSet} new BitSet
 */
function BitSet(length_array=WORD_SIZE) {
{
    this.init(length_array);
}}

extend(BitSet, properties);

/**
 * @func extend
 * @desc
 *       Very simple extend function including alias, static support.
 *
 * @param {Object} obj        - object to extend.
 * @param {Object} properties - object with the extend properties.
 *
 * @returns {Object} the object after extension.
 */
function extend(obj, properties)
{
    Object.keys(properties).forEach(prop => {
        let dsc      = Object.getOwnPropertyDescriptor(properties, prop);
        let attrs    = prop.match(/[\w\$\@]+/g); prop = attrs.pop();
        let aliases  = `${dsc.value || dsc.get || dsc.set}`.match(/@aliases:(.*?);/);
        let names    = aliases? aliases[1].match(/[\w\$]+/g) : []; names.unshift(prop);
        let symbol   = prop.match(/@@(.+)/); symbol = symbol ? symbol[1] : '';
        let addProp  = function(obj, name) {if(symbol) {obj[Symbol[symbol]] = dsc.value} else {Reflect.defineProperty(obj, name, dsc)}};

        names.forEach(name => {
            if(~attrs.indexOf('static')) {addProp(obj, name)}
            addProp(obj.prototype, name);
        });
    });

    return obj
}
