/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	var BitSet = (function () {
	    function BitSet(size, buffer) {
	        this._numOn = 0;
	        this._size = 0;
	        if (buffer) {
	            this.setFromBuffer(buffer, size);
	        }
	        else {
	            this.setSize(size);
	        }
	    }
	    BitSet.prototype.check = function (idx) {
	        return (this._buffer[elemIdx(idx)] & (1 << bitPlace(idx))) !== 0; // tslint:disable-line
	    };
	    BitSet.prototype.set = function (idx, val) {
	        var existing = this.check(idx);
	        if (val === existing)
	            return;
	        if (val) {
	            this._buffer[elemIdx(idx)] |= 1 << bitPlace(idx); // tslint:disable-line
	        }
	        else {
	            this._buffer[elemIdx(idx)] &= ~(1 << bitPlace(idx)); // tslint:disable-line
	        }
	        this._numOn += val ? 1 : -1;
	    };
	    BitSet.prototype.setAll = function (val) {
	        if (val) {
	            // don't overfill the last element in case we grow (we'd be wrong)
	            var numOverhang = this._size % PER_ELEM_BITS;
	            if (numOverhang === 0) {
	                fill(this._buffer, FULL_ELEM);
	            }
	            else {
	                fill(this._buffer, FULL_ELEM, this._buffer.length - 1);
	                this._buffer[this._buffer.length - 1] = (1 << numOverhang) - 1; // tslint:disable-line
	            }
	            this._numOn = this._size;
	        }
	        else {
	            fill(this._buffer, 0);
	            this._numOn = 0;
	        }
	    };
	    BitSet.prototype.numOn = function () { return this._numOn; };
	    BitSet.prototype.numOff = function () { return this.size() - this.numOn(); };
	    BitSet.prototype.size = function () { return this._size; };
	    BitSet.prototype.any = function () { return this.numOn() > 0; };
	    BitSet.prototype.all = function () { return this.numOn() === this.size(); };
	    BitSet.prototype.none = function () { return !this.any(); };
	    BitSet.prototype.setSize = function (newSize) {
	        if (newSize === this._size)
	            return;
	        this._size = newSize;
	        var oldBuf = this._buffer;
	        var newBuf = this._buffer = new Uint32Array(numElemsNeeded(newSize));
	        if (oldBuf) {
	            if (newBuf.length < oldBuf.length) {
	                newBuf.set(oldBuf.subarray(0, newBuf.length));
	                // clear any bits above the overhang
	                var numOverhang = newSize % PER_ELEM_BITS;
	                if (numOverhang > 0) {
	                    newBuf[newBuf.length - 1] &= (1 << numOverhang) - 1; // tslint:disable-line
	                }
	                this._numOn = numOn(newBuf, newSize);
	            }
	            else {
	                // we grew, no need to recompute num true, just copy
	                newBuf.set(oldBuf);
	            }
	        }
	        else {
	            this._numOn = 0; // fresh array
	        }
	    };
	    Object.defineProperty(BitSet.prototype, "buffer", {
	        get: function () { return this._buffer.buffer; },
	        enumerable: true,
	        configurable: true
	    });
	    BitSet.prototype.setFromBuffer = function (buffer, size) {
	        this._buffer = new Uint32Array(buffer);
	        this._size = size;
	        this._numOn = numOn(this._buffer, size);
	    };
	    return BitSet;
	}());
	exports.BitSet = BitSet;
	var PER_ELEM_BITS = 8 * Uint32Array.BYTES_PER_ELEMENT;
	var FULL_ELEM = 0xFFFFFFFF;
	function elemIdx(bitIdx) {
	    return Math.floor(bitIdx / PER_ELEM_BITS);
	}
	function bitPlace(bitIdx) {
	    return bitIdx % PER_ELEM_BITS;
	}
	function numElemsNeeded(size) {
	    return Math.ceil(size / PER_ELEM_BITS);
	}
	function numOn(buf, size) {
	    var sum = 0;
	    var numElems = numElemsNeeded(size);
	    var numOverhang = size % PER_ELEM_BITS;
	    for (var i = 0; i < numElems; i++) {
	        if (i === numElems - 1 && numOverhang > 0) {
	            sum += popcount(buf[i], numOverhang);
	        }
	        else {
	            sum += popcount(buf[i]);
	        }
	    }
	    return sum;
	}
	function popcount(anInt, topBitPlaceToStart) {
	    if (topBitPlaceToStart !== undefined) {
	        anInt &= (1 << topBitPlaceToStart) - 1; // tslint:disable-line
	    }
	    anInt -= anInt >> 1 & 0x55555555; // tslint:disable-line
	    anInt = (anInt & 0x33333333) + (anInt >> 2 & 0x33333333); // tslint:disable-line
	    anInt = anInt + (anInt >> 4) & 0x0f0f0f0f; // tslint:disable-line
	    anInt += anInt >> 8; // tslint:disable-line
	    anInt += anInt >> 16; // tslint:disable-line
	    return anInt & 0x7f; // tslint:disable-line
	}
	// world's jankiest polyfill
	function fill(arr, val, len) {
	    if (len === void 0) { len = arr.length; }
	    if (arr.fill) {
	        arr.fill(val, 0, len);
	        return;
	    }
	    for (var i = 0; i < len; i++) {
	        arr[i] = val;
	    }
	}


/***/ }
/******/ ]);