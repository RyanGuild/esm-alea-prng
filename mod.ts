/*////////////////////////////////////////////////////////////////
aleaPRNG 1.1
//////////////////////////////////////////////////////////////////
https://github.com/macmcmeans/aleaPRNG/blob/master/aleaPRNG-1.1.js
//////////////////////////////////////////////////////////////////
Original work copyright © 2010 Johannes Baagøe, under MIT license
This is a derivative work copyright (c) 2017-2020, W. Mac" McMeans, under BSD license.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////////////////////////////////////////////////////////////////*/

/**
 * @module @esm-alea/prng
 * @description A module that exports a pseudo-random number generator
 */
type Stringable = { toString: () => string };

/**
 * A HOC that creates a mash function
 * the mash function is used to hash the seed values
 */
function Mash() {
    let n = 4022871197; // 0xefc8249d

    return function mash<D extends Stringable>(data: D): number {
        const d = data.toString();

        // cache the length
        for (var i = 0, l = d.length; i < l; i++) {
            n += d.charCodeAt(i);

            var h = 0.02519603282416938 * n;

            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 4294967296; // 0x100000000      2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
}

let s0: number;
let s1: number;
let s2: number;
let c: number;
let uinta = new Uint32Array(3);
let initialArgs: Uint32Array | Array<Stringable>;
/**
 * initializes generator with specified seed
 */
function initState<S extends Array<Stringable> | Uint32Array>(
    _internalSeed: S
) {
    const mash = Mash();
    // internal state of generator
    s0 = mash(" ");
    s1 = mash(" ");
    s2 = mash(" ");

    c = 1;

    for (var i = 0; i < _internalSeed.length; i++) {
        s0 -= mash(_internalSeed[i]);
        if (s0 < 0) {
            s0 += 1;
        }

        s1 -= mash(_internalSeed[i]);
        if (s1 < 0) {
            s1 += 1;
        }

        s2 -= mash(_internalSeed[i]);
        if (s2 < 0) {
            s2 += 1;
        }
    }
}

/**
 * check if number is integer
 */
function isInteger(_int: any) {
    return parseInt(_int, 10) === _int;
}

/**
 * return a 32-bit fraction in the range [0, 1]
 * This is the main function returned when aleaPRNG is instantiated
 */
export function random(): number {
    var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

    s0 = s1;
    s1 = s2;

    return (s2 = t - (c = t | 0));
}

/**
 * returns a 53-bit fraction in the range [0, 1]
 */
export function fract53(): number {
    return random() + ((random() * 0x200000) | 0) * 1.1102230246251565e-16; // 2^-53
}

/**
 * return an unsigned integer in the range [0, 2^32]
 */
export function int32(): number {
    return random() * 0x100000000; // 2^32
}

/**
 * advance the generator the specified amount of cycles
 */
export function cycle(runs?: number): void {
    runs = typeof runs === "undefined" ? 1 : +runs;
    if (runs < 1) {
        runs = 1;
    }
    for (var i = 0; i < runs; i++) {
        random();
    }
}

/**
 * initialize generator with the seed values used upon instantiation
 */
export function restart() {
    initState(initialArgs);
}

/**
 * seeding function
 */
export function seed(newSeed: Array<Stringable>): void {
    initialArgs = newSeed;
    initState(newSeed || globalThis.crypto.getRandomValues(uinta));
}

// store the seed used when the RNG was instantiated, if any
initialArgs = globalThis.crypto.getRandomValues(uinta);

// initialize the RNG
initState(initialArgs);

/**
 * An Object containing the exported functions
 */
export default {
    random,
    fract53,
    int32,
    cycle,
    restart,
    seed,
};
