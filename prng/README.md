# @esm-alea/prng

A package for generating Psuedo Random numbers based off [aleaPRNG-1.1.js](https://github.com/macmcmeans/aleaPRNG/blob/master/aleaPRNG-1.1.js)

## Usage

```ts
import {seed, random, int32, reset, cycle} from "@esm-alea/prng"

seed(["lucky"])
const a = int32() // value 1
const x = random() * 10
const y = random() * 10

console.log({x, y}) // square 1

const x2 = random() * 10
const y2 = random() * 10

console.log({x:x2,y:y2}) // square 2

reset()

const b = int32() // value 2
// value 1 === value 2

// skip 2 random values
cycle(2)

const x3 = random() * 10
const y3 = random() * 10

console.log({x:x3,y:y3}) // square 3

// square 2 === square 3




```