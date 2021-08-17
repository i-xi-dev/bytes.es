# @i-xi-dev/bytes

A JavaScript byte array library for the browser and Node.js


## Description

### Conversion
![Conversion](assets/conversion.svg)


## Requirement

...


## Installation

### npm

```console
$ npm i @i-xi-dev/bytes
```

```javascript
import { ByteSequence } from "@i-xi-dev/bytes";
```

### CDN

```javascript
import { ByteSequence } from "https://unpkg.com/@i-xi-dev/bytes";
```


## Example

### Creating an instance of `ByteSequence` class

#### Creating an instance that views the specified [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
```javascript
const arrayBufferView = new ByteSequence(arrayBuffer);
```

#### Creating an instance with a specific size
```javascript
const zeroFilledBytes = ByteSequence.create(size);
```

#### Creating an instance filled with random bytes
```javascript
const randomBytes = ByteSequence.generateRandom(size);
```

#### Creating an instance with a new underlying buffer
```javascript
const copiedBytes = ByteSequence.from(uint8Array);
const copiedBytes2 = ByteSequence.from(copiedBytes);
```


...

