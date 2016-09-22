'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * @author       Rogier Geertzema
 * @copyright    2016 Rogier Geertzema
 * @license      {@link https://github.com/unnoon/cell-bitset/blob/master/LICENSE|MIT License}
 * @overview     Fast JS BitSet implementation. No worrying about 32bits restrictions.
 */
!function (root, bitset) {
    /* istanbul ignore next */switch (true) {
        /*amd*/case typeof define === 'function' && root.define === define && !!define.amd:
            define(bitset);break;
        /*node*/case (typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && root === module.exports:
            module.exports = bitset();break;
        /*global*/case !root.BitSet:
            Reflect.defineProperty(root, 'BitSet', { value: bitset(), enumerable: !0 });break;default:
            console.error("'BitSet' is already defined on root object");}
}(undefined, function bitset() {
    "use strict";
    /*es6*/ /*<3*/
    // int32 consts

    var _info, _Symbol$species, _properties;

    var ZERO = 0 | 0;
    var ONE = 1 | 0;
    var WORD_SIZE = 32 | 0;
    var WORD_LOG = 5 | 0;

    var $attrs = Symbol.for('cell-type.attrs');

    var properties = (_properties = {
        /**
         * @name BitSet.info
         * @desc
         *       Info object to hold general module information
         */
        info: (_info = {}, _defineProperty(_info, $attrs, 'static !configurable !writable'), _defineProperty(_info, 'value', {
            "name": "cell-bitset",
            "description": "Fast JS BitSet implementation. No worrying about 32bits restrictions.",
            "version": "0.2.1",
            "url": "https://github.com/unnoon/cell-bitset"
        }), _info),
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
        create: function create() {
            "<$attrs alias=spawn>";

            var length_iterable = arguments.length <= 0 || arguments[0] === undefined ? WORD_SIZE : arguments[0];
            {
                return Object.create(BitSet.prototype).init(length_iterable);
            }
        },

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
        hammingWeight: function hammingWeight(w) {
            w = w | 0;
            "<$attrs static alias=popCount>";
            {
                w -= w >>> 1 & 0x55555555;
                w = (w & 0x33333333) + (w >>> 2 & 0x33333333);

                return (w + (w >>> 4) & 0xF0F0F0F) * 0x1010101 >>> 24 | 0;
            }
        },

        /**
         * @method BitSet.$lsb
         * @desc
         *         Returns the least significant bit in a word. Returns 32 in case the word is 0.
         *
         * @param {number} w - the word to get the least significant bit from.
         *
         * @returns {number} the least significant bit in w.
         */
        $lsb: function $lsb(w) {
            w = w | 0;
            "<$attrs static>";
            {
                return this.hammingWeight((w & -w) - 1) | 0;
            }
        },

        /**
         * @method BitSet.$msb
         * @desc
         *         Returns the most significant bit in a word.
         *
         * @param {number} w - the word to get the most significant bit from.
         *
         * @returns {number} the most significant bit in w.
         */
        $msb: function $msb(w) {
            w = w | 0;
            "<$attrs static>";
            {
                w |= w >> 1;
                w |= w >> 2;
                w |= w >> 4;
                w |= w >> 8;
                w |= w >> 16;
                w = (w >> 1) + 1;
                return this.hammingWeight(w - 1) | 0;
            }
        },

        /**
         * @method BitSet#add
         * @desc
         *         Adds numbers(indices) to the set. It will resize the set in case the index falls out of bounds.
         *
         * @param {...number} indices - indices/numbers to add to the set.
         *
         * @returns {BitSet} this
         */
        add: function add() {
            {
                for (var _len = arguments.length, indices = Array(_len), _key = 0; _key < _len; _key++) {
                    indices[_key] = arguments[_key];
                }

                for (var i = indices.length; i--;) {
                    this.set(indices[i]);
                }

                return this;
            }
        },

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
            "<$attrs alias=size>";

            {
                var max = this.words.length;
                var i = void 0,
                    output = ZERO;

                for (i = ZERO; i < max; i++) {
                    output += this.hammingWeight(this.words[i]);
                }

                return output | 0;
            }
        },
        set cardinality(v) {
            {
                console.warn('Cardinality is read only');
            }
        },
        /**
         * @method BitSet#clear
         * @desc
         *         Clears the bitset. Length will be maintained.
         *
         * @returns {BitSet} this
         */
        clear: function clear() {
            {
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    this.words[i] = ZERO;
                }

                return this;
            }
        },

        /**
         * @method BitSet#clone
         * @desc
         *         Creates a clone of the bitset.
         *
         * @returns {BitSet} clone
         */
        clone: function clone() {
            {
                var clone = Object.create(BitSet.prototype);

                clone._length = this._length | 0;
                clone.words = new Uint32Array(this.words);

                return clone;
            }
        },

        /**
         * @method BitSet#complement
         * @desc
         *         Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
         *
         * @returns {BitSet} this
         */
        complement: function complement() {
            {
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    this.words[i] = ~this.words[i];
                }

                this.trimTrailingBits();

                return this;
            }
        },

        /**
         * @method BitSet#Complement
         * @desc
         *         Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
         *         The result will be a new instance of a BitSet.
         *
         * @returns {BitSet} new BitSet of the complement.
         */
        Complement: function Complement() {
            {
                return this.clone().complement();
            }
        },

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
        contains: function contains(mask) {
            "<$attrs alias=fits>";

            {
                var max = mask.words.length;
                var i = void 0,
                    maskword = void 0;

                for (i = ZERO; i < max; i++) {
                    maskword = mask.words[i];

                    if (((this.words[i] || 0) & maskword) !== maskword) {
                        return false;
                    }
                }

                return true;
            }
        },

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
        difference: function difference(bitset) {
            {
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    this.words[i] &= ~bitset.words[i];
                }

                return this;
            }
        },

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
        Difference: function Difference(bitset) {
            {
                return this.clone().difference(bitset);
            }
        },

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
        each: function each(cb) {
            "<$attrs alias=forEach>";

            var ctx = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            {
                var max = this.words.length;
                var i = void 0,
                    word = void 0,
                    tmp = void 0;

                for (i = ZERO; i < max; i++) {
                    word = this.words[i];

                    while (word !== 0) {
                        tmp = word & -word | 0;
                        if (cb.call(ctx, ONE, (i << WORD_LOG) + this.hammingWeight(tmp - ONE), this) === false) {
                            return false;
                        }
                        word ^= tmp;
                    }
                }

                return true;
            }
        },

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
        each$: function each$(cb) {
            "<$attrs alias=forEach$|eachAll|forEachAll>";

            var ctx = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            {
                var max = this._length;
                for (var i = ZERO; i < max; i++) {
                    if (cb.call(ctx, this.get(i), i, this) === false) {
                        return false;
                    }
                }

                return true;
            }
        },

        /**
         * @method BitSet#entries
         * @desc
         *         Returns a new Iterator object that contains an array of [index, index] for each element in the BitSet object. This is kept similar to the Map object, so that each entry has the same value for its key and value here.
         *
         * @returns {Iterator.<Array.<int>>}
         */
        entries: function entries() {
            var data = [];

            this.each(function (val, index) {
                return data.push([index, index]);
            });

            return regeneratorRuntime.mark(function _callee(data) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.delegateYield(data, 't0', 1);

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })(data);
        },

        /**
         * @method BitSet#equals
         * @desc
         *         Tests if 2 bitsets are equal.
         *
         * @param {BitSet} bitset - bitset to compare to this.
         *
         * @returns {boolean} boolean indicating if the the 2 bitsets are equal.
         */
        equals: function equals(bitset) {
            {
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    if (this.words[i] !== bitset.words[i]) {
                        return false;
                    }
                }

                return true;
            }
        },

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
        exclusion: function exclusion(bitset) {
            "<$attrs alias=symmetricDifference|xor>";

            {
                if (bitset.length > this._length) {
                    this.resize(bitset.length);
                }

                var max = bitset.words.length;
                for (var i = ZERO; i < max; i++) {
                    this.words[i] ^= bitset.words[i];
                }

                return this;
            }
        },

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
        Exclusion: function Exclusion(bitset) {
            "<$attrs alias=SymmetricDifference|Xor>";

            {
                return this.clone().exclusion(bitset);
            }
        },

        /**
         * @method BitSet#flip
         * @desc
         *         Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged.
         *
         * @param {number} index - index of the bit to be flipped.
         *
         * @returns {BitSet} this
         */
        flip: function flip(index) {
            index = index | 0;
            {
                if (index >= this._length) {
                    this.resize(index + ONE);
                }

                this.words[index >>> WORD_LOG] ^= ONE << index;

                return this;
            }
        },

        /**
         * @method BitSet#get
         * @desc
         *         Gets a specific bit from the bitset.
         *
         * @param {number} index - index of the bit to get.
         *
         * @returns {number} the value of the bit at the given index.
         */
        get: function get(index) {
            index = index | 0;
            {
                return (index >= this._length ? ZERO : this.words[index >>> WORD_LOG] >>> index & ONE) | 0;
            }
        },

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
        has: function has(index) {
            index = index | 0;
            "<$attrs alias=isMember>";
            {
                return !!this.get(index);
            }
        },

        /**
         * @method BitSet#init
         * @desc
         *         Initializes the BitSet. Useful in case one wants to use 'Object.create' instead of 'new'.
         *
         * @param {number|Iterable.<any>=} length_iterable=32 - length for the underlying bitvector or an iterable object with indices.
         *
         * @returns {BitSet} this
         */
        init: function init() {
            var length_iterable = arguments.length <= 0 || arguments[0] === undefined ? WORD_SIZE : arguments[0];

            {
                var itr = Array.from(length_iterable);
                var len = (typeof length_iterable === 'number' ? length_iterable : itr.length) | 0;

                Reflect.defineProperty(this, '_length', { value: len, writable: true });
                this.words = new Uint32Array(Math.ceil(this._length / WORD_SIZE));

                this.add.apply(this, _toConsumableArray(itr));

                return this;
            }
        },

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
        intersection: function intersection(bitset) {
            "<$attrs alias=and>";

            {
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    this.words[i] &= bitset.words[i] || ZERO;
                }

                return this;
            }
        },

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
        Intersection: function Intersection(bitset) {
            "<$attrs alias=And>";

            {
                return this.clone().intersection(bitset);
            }
        },

        /**
         * @method BitSet#intersects
         * @desc
         *         Calculates if two bitsets intersect.
         *
         * @param {BitSet} bitset - the bitset to check intersection with.
         *
         * @returns {boolean} boolean indicating if the two bitsets intersects.
         */
        intersects: function intersects(bitset) {
            {
                var max = Math.min(this.words.length, bitset.words.length);
                for (var i = ZERO; i < max; i++) {
                    if (this.words[i] & bitset.words[i]) {
                        return true;
                    }
                }

                return false;
            }
        },

        /**
         * @method BitSet#isEmpty
         * @desc
         *         Returns if a set is empty i.e. all words are 0.
         *
         * @returns {boolean} boolean indicating that the set is empty.
         */
        isEmpty: function isEmpty() {
            {
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    if (this.words[i]) {
                        return false;
                    }
                }

                return true;
            }
        },

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
        isSubsetOf: function isSubsetOf(bitset) {
            "<$attrs alias=isContainedIn>";

            {
                return bitset.contains(this);
            }
        },

        /**
         * @method BitSet#keys
         * @desc
         *         Returns a new Iterator object that contains the indices of the BitSet.
         *
         * @returns {Iterator.<int>}
         */
        keys: function keys() {
            return this.values();
        },

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
                return this._length | 0;
            }
        },
        set length(v) {
            {
                console.warn('Length is read only');
            }
        },
        /**
         * @method BitSet#max
         * @desc   **aliases:** msb
         * #
         *         Returns the max index in a set.
         *
         * @returns {number} the max number/index in the set.
         */
        max: function max() {
            "<$attrs alias=msb>";

            {
                var word = void 0;

                for (var i = this.words.length; i--;) {
                    if (!(word = this.words[i])) {
                        continue;
                    }

                    return (i << WORD_LOG) + this.$msb(word) | 0;
                }
            }
        },

        /**
         * @method BitSet#min
         * @desc   **aliases:** lsb
         * #
         *         Returns the minimum index in a set.
         *
         * @returns {number} the minimum number/index in the set.
         */
        min: function min() {
            "<$attrs alias=lsb>";

            {
                var word = void 0;
                var max = this.words.length;
                for (var i = ZERO; i < max; i++) {
                    if (!(word = this.words[i])) {
                        continue;
                    }

                    return (i << WORD_LOG) + this.$lsb(word) | 0;
                }
            }
        },

        /**
         * @method BitSet#remove
         * @desc
         *         Removes indices/numbers from the bitset.
         *
         * @param {...number} indices - the indices/numbers to be removed.
         *
         * @returns {BitSet}
         */
        remove: function remove() {
            "<$attrs alias=delete>";

            {
                for (var _len2 = arguments.length, indices = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    indices[_key2] = arguments[_key2];
                }

                for (var i = indices.length; i--;) {
                    this.set(indices[i], 0);
                }

                return this;
            }
        },

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
        resize: function resize(len) {
            len = len | 0;
            {
                if (this._length === len) {
                    return this;
                }

                var diff = len - this._length | 0;
                var newLength = len - 1 + WORD_SIZE >>> WORD_LOG | 0;
                var i = void 0,
                    max = void 0,
                    newWords = void 0;

                this._length = len;

                if (newLength !== this.words.length) {
                    newWords = new Uint32Array(newLength);

                    for (i = ZERO, max = Math.min(newLength, this.words.length) | 0; i < max; i++) {
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
        },

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
        set: function set(index) {
            var val = arguments.length <= 1 || arguments[1] === undefined ? ONE : arguments[1];
            index = index | 0;val = val | 0;
            {
                if (index >= this._length && val !== ZERO) {
                    this.resize(index + ONE);
                } // don't resize in case of a remove

                if (val === ZERO) {
                    this.words[index >>> WORD_LOG] &= ~(ONE << index);
                } else {
                    this.words[index >>> WORD_LOG] |= ONE << index;
                }

                return this;
            }
        },

        /**
         * @method BitSet#toArray
         * @desc
         *         Outputs the set as an array.
         *
         * @param {number=} type - type for the array Uint(8|16|32)Array.
         *
         * @returns {Array<number>|Uint8Array<int>|Uint16Array<int>|Uint32Array<int>}
         */
        toArray: function toArray() {
            var _this = this;

            var type = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

            {
                var _ret = function () {
                    var arr = void 0;
                    var i = ZERO;

                    switch (type) {
                        case 8:
                            arr = new Uint8Array(_this.cardinality);break;
                        case 16:
                            arr = new Uint16Array(_this.cardinality);break;
                        case 32:
                            arr = new Uint32Array(_this.cardinality);break;
                        default:
                            arr = [];
                    }

                    _this.each(function (val, index) {
                        return arr[i++] = index;
                    });

                    return {
                        v: arr
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        },

        /**
         * @method BitSet#toBitArray
         * @desc
         *         Outputs the underlying bitvector as an array, starting with the least significant bits.
         *
         * @param {number=} type - type for the array Uint(8|16|32)Array.
         *
         * @returns {Array<number>|Uint8Array<int>|Uint16Array<int>|Uint32Array<int>}
         */
        toBitArray: function toBitArray() {
            var _this2 = this;

            var type = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

            {
                var _ret2 = function () {
                    var arr = void 0;

                    switch (type) {
                        case 8:
                            arr = new Uint8Array(_this2._length);break;
                        case 16:
                            arr = new Uint16Array(_this2._length);break;
                        case 32:
                            arr = new Uint32Array(_this2._length);break;
                        default:
                            arr = [];
                    }

                    _this2.each$(function (val, index) {
                        arr[index] = val;
                    });

                    return {
                        v: arr
                    };
                }();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            }
        },

        /**
         * @method BitSet#toBooleanArray
         * @desc
         *         Outputs the underlying bitvector as a boolean array, starting with the least significant bits.
         *
         * @returns {Array<boolean>}
         */
        toBooleanArray: function toBooleanArray() {
            var _this3 = this;

            {
                var _ret3 = function () {
                    var arr = [];

                    _this3.each$(function (val, index) {
                        arr[index] = !!val;
                    });

                    return {
                        v: arr
                    };
                }();

                if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
            }
        },

        /**
         * @method BitSet#toBitString
         * @desc
         *         Outputs the underlying bitvector as a bitstring, starting with the most significant bit.
         *
         * @param {number=} mode - mode for stringification. -1 is used to display the full string including trailing bits.
         *
         * @returns {string} the stringified bitvector.
         */
        toBitString: function toBitString() {
            var mode = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

            {
                var output = '';

                for (var i = this.words.length | 0; i--;) {
                    // typed arrays will discard any leading zero's when using toString
                    output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
                }

                return ~mode ? output.slice(-this._length) : output;
            }
        },

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
        toString: function toString() {
            "<$attrs alias=stringify>";

            var _this4 = this;

            var mode = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
            {
                var _ret4 = function () {
                    var output = '';

                    switch (mode) {
                        case -1 /*binary full*/:
                        case 2 /*binary*/:
                            output = _this4.toBitString(mode);break;
                        default:
                            /*set*/output += '{';_this4.each(function (val, index) {
                                output += (output !== '{' ? ', ' : '') + index;
                            });output += '}';
                    }

                    return {
                        v: output
                    };
                }();

                if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
            }
        },

        /**
         * @method BitSet#trim
         * @desc
         *         Trims the bitset to the most significant bit to save space.
         *
         * @returns {BitSet} this
         */
        trim: function trim() {
            {
                return this.resize(this.max() + ONE);
            }
        },

        /**
         * @method BitSet#trimTrailingBits
         * @desc
         *         Trims any trailing bits. That fall out of this.length but within this.words.length*WORD_SIZE.
         *         Assumes this.length is somewhere in the last word.
         *
         * @returns {BitSet}
         */
        trimTrailingBits: function trimTrailingBits() {
            {
                var wordsLength = this.words.length | 0;
                var diff = wordsLength * WORD_SIZE - this._length | 0;

                this.words[wordsLength - 1] = this.words[wordsLength - 1] << diff >>> diff;

                return this;
            }
        },

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
        union: function union(bitset) {
            "<$attrs alias=or>";

            {
                if (bitset.length > this._length) {
                    this.resize(bitset.length);
                }

                var max = bitset.words.length;
                for (var i = ZERO; i < max; i++) {
                    this.words[i] |= bitset.words[i];
                }

                return this;
            }
        },

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
        Union: function Union(bitset) {
            "<$attrs alias=Or>";

            {
                return this.clone().union(bitset);
            }
        },

        /**
         * @method BitSet#values
         * @desc
         *         Returns a new Iterator object that contains the indices of the BitSet.
         *
         * @returns {Iterator.<int>}
         */
        values: function values() {
            return regeneratorRuntime.mark(function _callee2(data) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.delegateYield(data, 't0', 1);

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            })(this.toArray());
        }
    }, _defineProperty(_properties, Symbol.iterator, function () {
        return this.values();
    }), _defineProperty(_properties, Symbol.species, (_Symbol$species = {}, _defineProperty(_Symbol$species, $attrs, 'static'), _defineProperty(_Symbol$species, 'value', BitSet), _Symbol$species)), _defineProperty(_properties, Symbol.toStringTag, 'BitSet'), _properties);

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
    function BitSet() {
        var length_array = arguments.length <= 0 || arguments[0] === undefined ? WORD_SIZE : arguments[0];

        {
            this.init(length_array);
        }
    }

    extend(BitSet.prototype, properties);

    /**
     * @func extend
     * @desc
     *       Very simple extend function including alias, static and basic attribute support.
     *
     * @param {Object} obj        - object to extend.
     * @param {Object} properties - object with the extend properties.
     *
     * @returns {Object} the object after extension.
     */
    function extend(obj, properties) {
        [].concat(_toConsumableArray(Object.getOwnPropertySymbols(properties)), _toConsumableArray(Object.keys(properties))).forEach(function (prop) {
            var dsc = processDescAttrs(Object.getOwnPropertyDescriptor(properties, prop));
            var names = dsc.alias || [];names.unshift(prop);

            names.forEach(function (name) {
                Object.defineProperty(obj, name, dsc);
                if (dsc.static && obj.hasOwnProperty('constructor')) {
                    Object.defineProperty(obj.constructor, name, dsc);
                }
            });
        });

        return obj;
    }
    /**
     * @func processDescAttrs
     * @desc
     *       processes any attributes passed to a function or on the $attrs symbol, in case of a property, and adds these to the descriptor.
    
     * @param {Object} dsc - Property descriptor to be processed.
     *
     * @returns {Object} The processed descriptor.
     */
    function processDescAttrs(dsc) {
        var tmp = ('' + (dsc.value || dsc.get || dsc.set)).match(/<\$attrs(.*?)>/);
        var tmp2 = ('' + (tmp ? tmp[1] : dsc.value && dsc.value[$attrs] || '')).replace(/[\s]*([=\|\s])[\s]*/g, '$1'); // prettify: remove redundant white spaces
        var attributes = tmp2.match(/[!\$\w]+(=[\$\w]+(\|[\$\w]+)*)?/g) || []; // filter attributes including values

        assignAttrsToDsc(attributes, dsc);

        // if value is a descriptor set the value to the descriptor value
        if (dsc.value && dsc.value[$attrs] !== undefined) {
            dsc.value = dsc.value.value;
        }

        return dsc;
    }
    /**
     * @func assignAttrsToDsc
     *
     * @param {Array<string>} attributes - Array containing the attributes.
     * @param {Object}        dsc        - The descriptor to be extended with the attributes.
     */
    function assignAttrsToDsc(attributes, dsc) {
        dsc.enumerable = false; // default set enumerable to false

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var attr = _step.value;
                var value = void 0;
                switch (true) {
                    case !attr.indexOf('!'):
                        value = false;attr = attr.slice(1);break;
                    case !!~attr.indexOf('='):
                        value = attr.match(/[\$\w]+/g);attr = value.shift();break;
                    default:
                        value = true;
                }

                dsc[attr] = value;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    return BitSet.prototype; // prefer prototypal inheritance
});
