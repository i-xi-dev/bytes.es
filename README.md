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

#### Creating an instance by [isomorphic encoding](https://infra.spec.whatwg.org/#isomorphic-encode) the [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)
```javascript
const isomorphicEncoded = ByteSequence.fromBinaryString("hello");
// [ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

#### Creating an instance by parsing the hexadecimal formatted
```javascript
const parsed = ByteSequence.parse("68656c6c6f");
// [ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

#### Creating an instance by decoding the Base64 encoded
```javascript
const decoded = ByteSequence.fromBase64("aGVsbG8=");
// [ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

#### Creating an instance by reading the [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of Uint8Array
```javascript
const loadedBytes = await ByteSequence.fromByteStream(byteStream);
```

[Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) is also available.
```javascript
const loadedBytes = await ByteSequence.fromByteStream(byteStream);
```


...

