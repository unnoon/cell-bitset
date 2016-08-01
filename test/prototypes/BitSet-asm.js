/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSetASM implementation. No worrying about 32bits restrictions.
 */
/*? if(MODULE_TYPE === 'es6') {write('export default ')}*/(function(root, bitset) {
    /*module_type*//*? if(MODULE_TYPE !== 'es6') { *//* istanbul ignore next */ switch(true) {
    /*amd*/    case typeof(define) === 'function' && root.define === define && !!define.amd : define(bitset);                                                           break;
    /*node*/   case typeof(module) === 'object'   && root === module.exports                : module.exports = bitset();                                                break;
    /*global*/ case !root.BitSetASM                                                         : Object.defineProperty(root, 'BitSetASM', {value: bitset(), enumerable: !0}); break; default : console.error("'BitSetASM' is already defined on root object")}
    /*es6*/    /*? } else { write('\n    \/*es6*\/ return bitset(); ') } *//*<3*/
})(this, function bitset() { "use strict";
    const WORD_SIZE = 32|0;
    const WORD_LOG  =  5|0;

    function asmmod(stdlib, foreign, heap) {
        "use asm";
        var imul = stdlib.Math.imul;

        function $hammingWeight(w) {
            w = w|0;
            w = w - (w >>> 1)&0x55555555;
            w = ((w&0x33333333) + ((w >>> 2)&0x33333333))|0;

            return (imul(((w + (w >>> 4))&0x0F0F0F0F), 0x01010101) >>> 24)|0
        }

        /**
         * @method BitSetASM#$lsb
         * @desc
         *         Returns the least significant bit in a word. Returns 32 in case the word is 0.
         *
         * @param {number} w - the word to get the least significant bit from.
         *
         * @returns {number} the least significant bit in w.
         */
        function $lsb(w) {
            w = w|0;
            return ($hammingWeight(((w & -w) - 1)|0)|0);
        }

        /**
         * @method BitSetASM#$msb
         * @desc
         *         Returns the most significant bit in a word.
         *
         * @param {number} w - the word to get the most significant bit from.
         *
         * @returns {number} the most significant bit in w.
         */
        function $msb(w) {
            w = w|0;
            w = w|(w >> 1);
            w = w|(w >> 2);
            w = w|(w >> 4);
            w = w|(w >> 8);
            w = w|(w >> 16);
            w = ((w >> 1) + 1)|0;
            return ($hammingWeight((w - 1)|0)|0);
        }

        return {
            $hammingWeight2: $hammingWeight,
            $lsb: $lsb,
            $msb: $msb
        };
    }

    var asm = asmmod({Math});
    
    extend(BitSetASM.prototype, {
        /**
         * @name BitSetASM#$info
         * @desc
         *       Info object to hold general module information
         */
        $info: {
            "name"       : "cell-bitset",
            "description": "Fast JS BitSetASM implementation. No worrying about 32bits restrictions.",
            "version"    : "/*?= VERSION */",
            "url"        : "https://github.com/unnoon/cell-bitset"
        },
        /**
         * @method BitSetASM#$create
         * @desc   **aliases:** $spawn
         * #
         *         Easy create method for people who use prototypal inheritance.
         *
         * @param {number|Array=} length_array_=32 - length for the underlying bitvector or an array-like object with indices.
         *
         * @return {BitSetASM} new BitSetASM.
         */
        $create: function(length_array_) {
        "@aliases: $spawn";
        {
            return Object.create(BitSetASM.prototype).init(length_array_);
        }},
        /**
         * @method BitSetASM#$hammingWeight
         * @desc   **aliases:** $popCount
         * #
         *         Calculate the hamming weight i.e. the number of ones in a bitstring/word.
         *
         * @param {number} w - word to get the number of set bits from.
         *
         * @returns {number} the number of set bits in the word.
         */
        $hammingWeight: function(w) {
        "@aliases: $popCount";
        {
            w -= ((w >>> 1) & 0x55555555)|0;
            w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

            return (((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24)|0;
        }},
        /**
         * @method BitSetASM#$lsb
         * @desc
         *         Returns the least significant bit in a word. Returns 32 in case the word is 0.
         *
         * @param {number} w - the word to get the least significant bit from.
         *
         * @returns {number} the least significant bit in w.
         */
        $lsb: function(w) {
        {
            return this.$hammingWeight((w & -w) - 1);
        }},
        /**
         * @method BitSetASM#$msb
         * @desc
         *         Returns the most significant bit in a word.
         *
         * @param {number} w - the word to get the most significant bit from.
         *
         * @returns {number} the most significant bit in w.
         */
        $msb: function(w) {
        {
            w |= w >> 1;
            w |= w >> 2;
            w |= w >> 4;
            w |= w >> 8;
            w |= w >> 16;
            w = (w >> 1) + 1;
            return this.$hammingWeight(w - 1);
        }},
        /**
         * @method BitSetASM#add
         * @desc
         *         Adds numbers(indices) to the set. It will resize the set in case the index falls out of bounds.
         *
         * @param {...number} indices - indices/numbers to add to the set.
         *
         * @returns {BitSetASM} this
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
         * @readonly
         * @name BitSetASM#cardinality
         * @type number
         * @desc
         *       Getter for the cardinality of the set.
         *       In case of a set it will return a warning.
         */
        get cardinality() {
        {
            var output = 0|0;

            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                output += this.$hammingWeight(this.words[i]);
            }

            return output|0
        }},
        set cardinality(v) {
        {
            console.warn('Cardinality is read only')
        }},
        /**
         * @method BitSetASM#clear
         * @desc
         *         Clears the bitset. Length will be maintained.
         *
         * @returns {BitSetASM} this
         */
        clear: function() {
        {
            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] = 0;
            }

            return this
        }},
        /**
         * @method BitSetASM#clone
         * @desc
         *         Creates a clone of the bitset.
         *
         * @returns {BitSetASM} clone
         */
        clone: function() {
        {
            var clone = Object.create(BitSetASM.prototype);

            clone._length = this._length|0;
            clone.words   = new Uint32Array(this.words);

            return clone;
        }},
        /**
         * @method BitSetASM#complement
         * @desc
         *         Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
         *
         * @returns {BitSetASM} this
         */
        complement: function() {
        {
            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] = ~this.words[i];
            }

            this.trimTrailingBits();

            return this
        }},
        /**
         * @method BitSetASM#Complement
         * @desc
         *         Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
         *         The result will be a new instance of a BitSetASM.
         *
         * @returns {BitSetASM} new BitSetASM of the complement.
         */
        Complement: function() {
        {
            return this.clone().complement();
        }},
        /**
         * @method BitSetASM#contains
         * @desc   **aliases:** fits
         * #
         *         Calculates if the bitset contains a certain bitset.
         *         In bitmask terms it will calculate if a bitmask fits a bitset.
         *
         * @param {BitSetASM} mask - bitset mask to test fit. i.e. subset to test containment.
         *
         * @returns {boolean} boolean indicating if the mask fits the bitset or is a subset.
         */
        contains: function(mask) {
        "@aliases: fits";
        {
            var maskword;

            for(let i = 0|0, max = mask.words.length; i < max; i++)
            {
                maskword = mask.words[i];

                if(((this.words[i] || 0) & maskword) !== maskword) {return false}
            }

            return true
        }},
        /**
         * @method BitSetASM#difference
         * @desc
         *         Calculates the difference between 2 bitsets.
         *         The result is stored in this.
         *
         * @param {BitSetASM} bitset - the bit set to subtract from the current one.
         *
         * @returns {BitSetASM} this
         */
        difference: function(bitset) {
        {
            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= ~bitset.words[i];
            }

            return this
        }},
        /**
         * @method BitSetASM#Difference
         * @desc
         *         Calculates the difference between 2 bitsets.
         *         The result will be a new instance of BitSetASM.
         *
         * @param {BitSetASM} bitset - the bit set to subtract from the current one.
         *
         * @returns {BitSetASM} new BitSetASM of the difference.
         */
        Difference: function(bitset) {
        {
            return this.clone().difference(bitset)
        }},
        /**
         * @method BitSetASM#each
         * @desc
         *         Iterates over the set bits and calls the callback function with: value=1, index, this.
         *         Can be broken prematurely by returning false.
         *
         * @param {function(value, index, bitset)} cb   - callback function o be called on each bit.
         * @param {Object=}                        ctx_ - context to be called upon the callback function.
         *
         * @returns {boolean} boolean indicating if the loop finished completely=true or was broken=false
         */
        each: function(cb, ctx_)
        {
            var word;
            var tmp;

            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                word = this.words[i];

                while (word !== 0)
                {
                    tmp = (word & -word)|0;
                    if(cb.call(ctx_, 1, (i << WORD_LOG) + this.$hammingWeight(tmp - 1), this) === false) {return false}
                    word ^= tmp;
                }
            }

            return true
        },
        /**
         * @method BitSetASM#each$
         * @desc
         *         Iterates over all bits and calls the callback function with: value, index, this.
         *         Can be broken prematurely by returning false.
         *
         * @param {function(value, index, bitset)} cb   - callback function o be called on each bit.
         * @param {Object=}                        ctx_ - context to be called upon the callback function.
         *
         * @returns {boolean} boolean indicating if the loop finished completely=true or was broken=false.
         */
        each$: function(cb, ctx_)
        {
            for(let i = 0|0, max = this._length; i < max; i++)
            {
                if(cb.call(ctx_, this.get(i), i, this) === false) {return false}
            }

            return true
        },
        /**
         * @method BitSetASM#equals
         * @desc
         *         Tests if 2 bitsets are equal.
         *
         * @param {BitSetASM} bitset - bitset to compare to this.
         *
         * @returns {boolean} boolean indicating if the the 2 bitsets are equal.
         */
        equals: function(bitset) {
        {
            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                if(this.words[i] !== bitset.words[i]) {return false}
            }

            return true
        }},
        /**
         * @method BitSetASM#exclusion
         * @desc   **aliases:** symmetricDifference, xor
         * #
         *         Calculates the exclusion/symmetric difference between to bitsets.
         *         The result is stored in this.
         *
         * @param {BitSetASM} bitset - the bitset to calculate the symmetric difference with.
         *
         * @returns {BitSetASM} this
         */
        exclusion: function(bitset) {
        "@aliases: symmetricDifference, xor";
        {
            if(bitset.length > this._length) {this.resize(bitset.length)}

            for(let i = 0|0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] ^= bitset.words[i];
            }

            return this
        }},
        /**
         * @method BitSetASM#Exclusion
         * @desc   **aliases:** SymmetricDifference, Xor
         * #
         *         Calculates the exclusion/symmetric difference between to bitsets.
         *         The result is a new instance of BitSetASM.
         *
         * @param {BitSetASM} bitset - the bitset to calculate the symmetric difference with.
         *
         * @returns {BitSetASM} new BitSetASM of the exclusion.
         */
        Exclusion: function(bitset) {
        "@aliases: SymmetricDifference, Xor";
        {
            return this.clone().exclusion(bitset)
        }},
        /**
         * @method BitSetASM#flip
         * @desc
         *         Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged.
         *
         * @param {number} index - index of the bit to be flipped.
         *
         * @returns {BitSetASM} this
         */
        flip: function(index) {
        {
            if((index |= 0) >= this._length) {this.resize(index+1)}

            this.words[index >>> WORD_LOG] ^= (1 << index);

            return this
        }},
        /**
         * @method BitSetASM#get
         * @desc
         *         Gets a specific bit from the bitset.
         *
         * @param {number} index - index of the bit to get.
         *
         * @returns {number} the value of the bit at the given index.
         */
        get: function(index) {
        {   if((index |= 0) >= this._length) {return 0|0}

            return ((this.words[index >>> WORD_LOG] >>> index) & 1)|0;
        }},
        /**
         * @method BitSetASM#has
         * @desc   **aliases:** isMember
         * #
         *         Checks is the bitsets has a value/index.
         *
         * @param {number} index - the index/value to check membership for.
         *
         * @returns {boolean} boolean indicating if the bitset has the vale/index.
         */
        has: function(index) {
        "@aliases: isMember";
        {
            return !!this.get(index);
        }},
        /**
         * @method BitSetASM#init
         * @desc
         *         Initializes the BitSetASM. Useful in case one wants to use 'Object.create' instead of 'new'.
         *
         * @param {number|Array=} length_array_=32 - length for the underlying bitvector or an array-like object with indices.
         *
         * @returns {BitSetASM} this
         */
        init: function(length_array_) {
        {
            var arr = length_array_ && length_array_.length ? length_array_ : [];
            var len = ((arr.length ? arr[arr.length-1] : length_array_) || WORD_SIZE)|0;

            Object.defineProperty(this,'_length', {value: len, writable: true});
            this.words = new Uint32Array(Math.ceil(this._length / WORD_SIZE));

            this.add(...arr);

            return this
        }},
        /**
         * @method BitSetASM#intersection
         * @desc   **aliases:** and
         * #
         *         Calculates the intersection between two bitsets.
         *         The result is stored in this.
         *
         * @param {BitSetASM} bitset - the bitset to calculate the intersection with.
         *
         * @returns {BitSetASM} this
         */
        intersection: function(bitset) {
        "@aliases: and";
        {
            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= bitset.words[i] || 0;
            }

            return this
        }},
        /**
         * @method BitSetASM#Intersection
         * @desc   **aliases:** And
         * #
         *         Calculates the intersection between two bitsets.
         *         The result is a new instance of BitSetASM.
         *
         * @param {BitSetASM} bitset - the bitset to calculate the intersection with.
         *
         * @returns {BitSetASM} new bitset intersection.
         */
        Intersection: function(bitset) {
        "@aliases: And";
        {
            return this.clone().intersection(bitset)
        }},
        /**
         * @method BitSetASM#intersects
         * @desc
         *         Calculates if two bitsets intersect.
         *
         * @param {BitSetASM} bitset - the bitset to check intersection with.
         *
         * @returns {boolean} boolean indicating if the two bitsets intersects.
         */
        intersects: function(bitset) {
        {
            for(let i = 0|0, max = Math.min(this.words.length, bitset.words.length)|0; i < max; i++)
            {
                if(this.words[i] & bitset.words[i]) {return true}
            }

            return false
        }},
        /**
         * @method BitSetASM#isEmpty
         * @desc
         *         Returns if a set is empty i.e. all words are 0.
         *
         * @returns {boolean} boolean indicating that the set is empty.
         */
        isEmpty: function() {
        {
            for(let i = 0|0, max = this.words.length; i < max; i++)
            {
                if(this.words[i]) {return false}
            }

            return true
        }},
        /**
         * @method BitSetASM#isSubsetOf
         * @desc   **aliases:** isContainedIn
         * #
         *         Checks if a bitset is contained in another.
         *
         * @param {BitSetASM} bitset - to check for containment.
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
         * @name BitSetASM#length
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
         * @method BitSetASM#max
         * @desc   **aliases:** msb
         * #
         *         Returns the max index in a set.
         *
         * @returns {number} the max number/index in the set.
         */
        max: function() {
        "@aliases: msb";
        {
            var word;

            for(let i = this.words.length; i--;)
            {   if(!(word = this.words[i])) {continue}

                return ((i << WORD_LOG) + this.$msb(word))|0;
            }
        }},
        /**
         * @method BitSetASM#min
         * @desc   **aliases:** lsb
         * #
         *         Returns the minimum index in a set.
         *
         * @returns {number} the minimum number/index in the set.
         */
        min: function() {
        "@aliases: lsb";
        {
            var word;

            for(let i = 0|0, max = this.words.length; i < max; i++)
            {   if(!(word = this.words[i])) {continue}

                return ((i << WORD_LOG) + this.$lsb(word))|0;
            }
        }},
        /**
         * @method BitSetASM#remove
         * @desc
         *         Removes indices/numbers from the bitset.
         *
         * @param {...number} indices - the indices/numbers to be removed.
         *
         * @returns {BitSetASM}
         */
        remove: function(...indices) {
        {
            for(let i = indices.length; i--;)
            {
                this.set(indices[i], 0);
            }

            return this
        }},
        /**
         * @method BitSetASM#resize
         * @desc
         *         Resizes the underlying bitvector to a specific length.
         *         Will trim any trailing bits in case length is smaller than the current length.
         *
         * @param {number} len - the new length.
         *
         * @returns {BitSetASM} the resized bitset.
         */
        resize: function(len) {
        {   if(this._length === (len |= 0)) {return this}

            var diff      =  (len - this._length)|0;
            var newLength = ((len - 1 + WORD_SIZE) >>> WORD_LOG)|0;
            var newWords;

            this._length = len;

            if(newLength !== this.words.length)
            {
                newWords = new Uint32Array(newLength);

                for(let i = 0|0, max = Math.min(newLength, this.words.length)|0; i < max; i++)
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
         * @method BitSetASM#set
         * @desc
         *         Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
         *
         * @param {number}  index  - index/number to add to the set.
         * @param {number=} val_=1 - value (0|1) to set.
         *
         * @returns {BitSetASM} this
         */
        set: function(index, val_) {
        {
            if((index |= 0) >= this._length && val_ !== 0) {this.resize(index+1)} // don't resize in case of a remove

            if(val_ === 0)
            {
                this.words[index >>> WORD_LOG] &= ~(1 << index);
            }
            else
            {
                this.words[index >>> WORD_LOG] |=  (1 << index);
            }

            return this;
        }},
        /**
         * @method BitSetASM#toArray
         * @desc
         *         Outputs the set as an array.
         *
         * @param {number=} type_ - type for the array Uint(8|16|32)Array.
         *
         * @returns {Array<number>|Uint8Array<int>|Uint16Array<int>|Uint32Array<int>}
         */
        toArray: function(type_) {
        {
            var arr;
            let i = 0|0;

            switch(type_)
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
         * @method BitSetASM#toBitArray
         * @desc
         *         Outputs the underlying bitvector as an array, starting with the least significant bits.
         *
         * @param {number=} type_ - type for the array Uint(8|16|32)Array.
         *
         * @returns {Array<number>|Uint8Array<int>|Uint16Array<int>|Uint32Array<int>}
         */
        toBitArray: function(type_) {
        {
            var arr;

            switch(type_)
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
         * @method BitSetASM#toBooleanArray
         * @desc
         *         Outputs the underlying bitvector as a boolean array, starting with the least significant bits.
         *
         * @returns {Array<boolean>}
         */
        toBooleanArray: function() {
            {
                var arr = [];

                this.each$((val, index) => {arr[index] = !!val});

                return arr;
            }},
        /**
         * @method BitSetASM#toBitString
         * @desc
         *         Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
         *
         * @param {number=} mode_ - mode for stringification. -1 is used to display the full string including trailing bits.
         *
         * @returns {string} the stringified bitvector.
         */
        toBitString: function(mode_) {
        {
            var output = '';

            for(let i = this.words.length; i--;)
            {   // typed arrays will discard any leading zero's when using toString
                output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
            }

            return ~mode_ ? output.slice(-this._length) : output;
        }},
        /**
         * @method BitSetASM#toString
         * @desc   **aliases:** stringify
         * #
         *         Will output a string version of the bitset or bitstring.
         *
         * @param {number} mode - mode of toString. undefined=bitset | 2=bitstring | -1=full bitstring.
         *
         * @returns {string} stringified version of the bitset.
         */
        toString: function(mode) {
        "@aliases: stringify";
        {
            var output = '';

            switch(mode)
            {
                case -1 /*binary full*/ :
                case  2 /*binary*/      : output = this.toBitString(mode); break;
                default /*set*/         : output += '{'; this.each((val, index) => {output += (output !== '{' ? ', ' : '') + index}); output += '}'
            }

            return output
        }},
        /**
         * @method BitSetASM#trim
         * @desc
         *         Trims the bitset to the most significant bit to save space.
         *
         * @returns {BitSetASM} this
         */
        trim: function() {
        {
            return this.resize(this.max()+1)
        }},
        /**
         * @method BitSetASM#trimTrailingBits
         * @desc
         *         Trims any trailing bits. That fall out of this.length but within this.words.length*WORD_SIZE.
         *         Assumes this.length is somewhere in the last word.
         *
         * @returns {BitSetASM}
         */
        trimTrailingBits: function() {
        {
            var wordsLength = this.words.length;
            var diff        = wordsLength*WORD_SIZE - this._length;

            this.words[wordsLength-1] = this.words[wordsLength-1] << diff >>> diff;

            return this
        }},
        /**
         * @method BitSetASM#union
         * @desc   **aliases:** or
         * #
         *         Calculates the union between 2 bitsets.
         *         The result is stored in this.
         *
         * @param {BitSetASM} bitset - bitset to calculate the union with.
         *
         * @returns {BitSetASM} the union of the two bitsets.
         */
        union: function(bitset) {
        "@aliases: or";
        {
            if(bitset.length > this._length) {this.resize(bitset.length)}

            for(let i = 0|0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] |= bitset.words[i];
            }

            return this
        }},
        /**
         * @method BitSetASM#Union
         * @desc   **aliases:** Or
         * #
         *         Calculates the union between 2 bitsets.
         *         The result is a new BitSetASM.
         *
         * @param {BitSetASM} bitset - bitset to calculate the union with.
         *
         * @returns {BitSetASM} new BitSetASM of the union of the two bitsets.
         */
        Union: function(bitset) {
        "@aliases: Or";
        {
            return this.clone().union(bitset);
        }}
    });

    extend(BitSetASM.prototype, asm);

    /**
     * @class BitSetASM
     * @desc
     *        Fast JS BitSetASM implementation.
     *        No worrying about 32bits restrictions.
     *
     * @param {number|Array=} length_array_=32 - length for the underlying bitvector or an array-like object with indices.
     *
     * @return {BitSetASM} new BitSetASM
     */
    function BitSetASM(length_array_) {
    {
        this.init(length_array_);
    }}

    /**
     * @func extend
     * @desc
     *       Very simple extend function including alias support.
     *
     * @param {Object} obj        - object to extend.
     * @param {Object} properties - object with the extend properties.
     *
     * @returns {Object} the object after extension.
     */
    function extend(obj, properties)
    {
        for(var prop in properties)
        {   if(!properties.hasOwnProperty(prop)) {continue}

            var dsc     = Object.getOwnPropertyDescriptor(properties, prop);
            var aliases = dsc.value && (dsc.value + '').match(/@aliases:(.*?);/);
            var names   = aliases? aliases[1].match(/[\w\$]+/g) : []; names.unshift(prop);

            names.forEach(function(name) {Object.defineProperty(obj, name, dsc)});
        }

        return obj
    }

    return BitSetASM
});