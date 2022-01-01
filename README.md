# @i-xi-dev/bytes

A JavaScript byte array library for the browser, Deno and Node.js

![Conversion](assets/conversion.svg)


## `ByteSequence` class

### Requirement
`ByteSequence` requires [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) and [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

- Chrome
- Edge
- Firefox
- Safari
- Deno
- Node.js 16.5.0+


### Installation

#### npm

```console
$ npm i @i-xi-dev/bytes
```

```javascript
import { ByteSequence } from "@i-xi-dev/bytes";
```

#### CDN

```javascript
import { ByteSequence } from "https://cdn.skypack.dev/@i-xi-dev/bytes";
```

```javascript
import { ByteSequence } from "https://unpkg.com/@i-xi-dev/bytes/dist/index.js";
```

```javascript
import { ByteSequence } from "https://cdn.jsdelivr.net/npm/@i-xi-dev/bytes/dist/index.js";
```


### Usage

#### Creating an instance of `ByteSequence` class

##### Creating an instance as a wrapper object for [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
```javascript
// wraps a ArrayBuffer
const bytes = ByteSequence(arrayBuffer);
// → arrayBuffer === bytes.buffer → true
```

```javascript
// wraps a ArrayBufferView.buffer, ignores byteOffset and byteLength of ArrayBufferView
const bytes = ByteSequence(uint8Array);
// → uint8Array.buffer === bytes.buffer → true
```

##### Creating an instance with a specific size
```javascript
const zeroFilledBytes = ByteSequence.allocate(size);
```

##### Creating an instance filled with random bytes
```javascript
const randomBytes = ByteSequence.generateRandom(size);
```

##### Creating an instance with a new underlying buffer
```javascript
// from a Array<number>
const bytes = ByteSequence.from([1,2,3,4,5,6,7,8]);
const copiedBytes = ByteSequence.from(bytes);
// → bytes.buffer !== copiedBytes.buffer

const bytes2 = ByteSequence.of(...[1,2,3,4,5,6,7,8]);
const copiedBytes2 = ByteSequence.from(bytes2);
// → bytes2.buffer !== copiedBytes2.buffer
```

```javascript
// from a ArrayBufferView
const bytes = ByteSequence.from(uint8Array);
const copiedBytes = ByteSequence.from(bytes);
// → bytes.buffer !== copiedBytes.buffer && uint8Array.buffer !== bytes.buffer
```

##### Creating an instance by [isomorphic encoding](https://infra.spec.whatwg.org/#isomorphic-encode) the [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)
```javascript
const isomorphicEncoded = ByteSequence.fromBinaryString("hello");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

##### Creating an instance by parsing the hexadecimal formatted
```javascript
const parsed = ByteSequence.parse("68656c6c6f");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

##### Creating an instance by decoding the Base64 encoded
```javascript
const decoded = ByteSequence.fromBase64Encoded("aGVsbG8=");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

##### Creating an instance by decoding the percent encoded
```javascript
const decoded = ByteSequence.fromPercentEncoded("%68%65%6C%6C%6F");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

##### Creating an instance by reading the [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of Uint8Array
```javascript
// stream: ReadableStream<Uint8Array>
const loadedBytes = await ByteSequence.fromStream(stream);
```

If you want to read [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer), you can use [`stream.Readable.toWeb`](https://nodejs.org/dist/latest-v17.x/docs/api/stream.html#streamreadabletowebstreamreadable) method
```javascript
import { Readable } from "node:stream";

const loadedBytes = await ByteSequence.fromStream(Readable.toWeb(nodeJsStream));
```

TODO createStreamReadingProgress

##### Creating an instance by encoding the text in UTF-8
```javascript
const encoded = ByteSequence.utf8EncodeFrom("hello");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]

const encoded = ByteSequence.utf8EncodeFrom("新幹線");
// → Uint8Array[ 0xE6, 0x96, 0xB0, 0xE5, 0xB9, 0xB9, 0xE7, 0xB7, 0x9A ]
```

##### Creating an instance by reading the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
```javascript
const loadedBytes = await ByteSequence.fromBlob(blob);
```

##### Creating an instance by reading the [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
```javascript
const loadedBytes = await ByteSequence.fromDataURL("data:text/plain;charset=US-ASCII,hello");
```


#### Converting the instance to a number array
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);
const binaryString = bytes.toArray();
// → [ 3, 2, 1, 0, 255, 254, 253, 252 ]
```


#### Converting the instance to an Uint8Array
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);
const binaryString = bytes.toUint8Array();
// → Uint8Array[ 3, 2, 1, 0, 255, 254, 253, 252 ]
```


#### Converting the instance to a [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);
const binaryString = bytes.toBinaryString();
// → "\u{3}\u{2}\u{1}\u{0}\u{FF}\u{FE}\u{FD}\u{FC}"
```


#### Converting the instance to a string based on the specified format
```javascript
const bytes = ByteSequence.parse("68656c6c6f");
const formatted = bytes.toString();
// → "68656C6C6F"
```

##### Format options

| parameter | type | default | notes |
| :--- | :--- | :--- | :--- |
| `radix` | number | `16` | only 16, 10, 8, 2 are available |
| `upperCase` | boolean | `true` | parsing is case-insensitive |
| `paddedLength` | number | see below | |
| `prefix` | string | `""` | |
| `suffix` | string | `""` | |
| `separator` | string | `""` | |

```javascript
const bytes = ByteSequence.parse("68656c6c6f", { radix: 16 });

const formatted2 = bytes.format({ radix: 10 });
// → "104101108108111"

const formatted3 = bytes.format({ radix: 8 });
// → "150145154154157"

const formatted4 = bytes.format({ radix: 2 });
// → "0110100001100101011011000110110001101111"

const formatted5 = bytes.format({ upperCase: false });
// → "68656c6c6f"

const formatted6 = bytes.format({ paddedLength: 4 });
// → "00680065006C006C006F"

// Minimum paddedLength
// - radix 16 → 2
// - radix 10 → 3
// - radix 8 → 3
// - radix 2 → 8
// If the specified paddedLength is less than the minimum, the specified paddedLength will be ignored.

const formatted7 = bytes.format({ prefix: " " });
// → " 68 65 6C 6C 6F"

const formatted8 = bytes.format({ suffix: "  " });
// → "68  65  6C  6C  6F  "

const formatted8 = bytes.format({ separator: "   " });
// → "68   65   6C   6C   6F"
```


#### Converting the instance to a Base64 encoded string
```javascript
const bytes = ByteSequence.fromBinaryString("hello");

// Base64 encode
const base64Encoded = bytes.toBase64Encoded();
// → "aGVsbG8="
```

##### Base64 options
```javascript
const decoded = ByteSequence.fromBase64Encoded("aGVsbG8=", options);
const base64Encoded = bytes.toBase64Encoded(options);
```
The `options` object is same interface as [@i-xi-dev/base64 encoding options](https://www.npmjs.com/package/@i-xi-dev/base64#encoding-options).


TODO toPercentEncoded


#### Converting the instance to a text
```javascript
// UTF-8 encode
const bytes = ByteSequence.utf8EncodeFrom("あいうえお");
// → Uint8Array[ 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

// UTF-8 decode
const str = bytes.utf8DecodeTo();
// → "あいうえお"
```

TODO getter, ...
TODO edit bytes
















#### Text encoding options


BOM handling
```javascript
// If the string does not start with a U+FEFF, prepend a BOM
const bytes1 = ByteSequence.fromText("あいうえお", "UTF-8", { addBom: true });
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]
const bytes2 = ByteSequence.fromText("\uFEFFあいうえお", "UTF-8", { addBom: true });
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

// If the byte sequence starts with a BOM, remove the BOM
const str1 = bytes1.asText("UTF-8", { removeBom: true });
// → "あいうえお"
```

#### Other text encodings
You can register the text encoding.

Example in Node.js
```javascript
import iconv from "iconv-lite";
import { TextEncoding } from "@i-xi-dev/bytes";
TextEncoding.register("EUC-JP", {
  // name :string
  name: "EUC-JP",

  // decode: (encoded: Uint8Array) => string
  decode(encoded) {
    return iconv.decode(Buffer.from(encoded), "EUC-JP");
  },

  // encode: (toEncode: string) => Uint8Array
  encode(toEncode) {
    return iconv.encode(toEncode, "EUC-JP");
  },
});

const bytes = ByteSequence.fromText("あいうえお", "EUC-JP");
// → Uint8Array[ 0xA4, 0xA2, 0xA4, 0xA4, 0xA4, 0xA6, 0xA4, 0xA8, 0xA4, 0xAA ]

const str = bytes.asText("EUC-JP");
// → "あいうえお"
```


### Converting the instance to a percent encoded string
```javascript
const utf8Bytes = ByteSequence.fromText("hello");

// Percent encode (every bytes)
const utf8PercentEncoded = utf8Bytes.toPercent(); // equivalents to utf8Bytes.toPercent({ encodeSet:"all" });
// → "%68%65%6C%6C%6F"
```

#### Percent encode for URL component
```javascript
const encoded = ByteSequence.fromText("hello world").toPercent({ encodeSet: "uri-component" });
// → "hello%20world"
//   This result is match to the result of (globalThis.encodeURIComponent("hello world"))

const encoded2 = ByteSequence.fromText("§1").toPercent({ encodeSet: "uri-component" });
// → "%C2%A71"
```

#### Percent encode for the value of application/x-www-form-urlencoded
```javascript
const encoded = ByteSequence.fromText("hello world").toPercent({ encodeSet: "form-urlencoded", spaceAsPlus: true });
// → "hello+world"
//   This result is match to the result of (globalThis.encodeURIComponent("hello world").replaceAll(/[!'()~]/g, (c) => `%${ c.charCodeAt(0).toString(16).toUpperCase() }`))
//   And also, this result is match to the result of (const url = new URL("http://example.com/"); url.searchParams.set("p1", "hello world"); url.search.replace("?p1=", ""));
```


### Converting the instance to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
```javascript
const resource = new Resource("application/octet-stream", ByteSequence.from(uint8Array));
const blob = resource.toBlob();
```

#### Converting the instance to a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
```javascript
const resource = await Resource.fromDataURL("data:text/plain;charset=US-ASCII,hello");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]

const dataUrl = resource.toDataURL().toString();
// → "data:text/plain;charset=US-ASCII;base64,aGVsbG8="

const resource2 = await Resource.fromDataURL(dataUrl);
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```


### Generating a digest of the instance
```javascript
const bytes = ByteSequence.create(0);
// SHA-256 digest
const digestBytes = await bytes.toDigest("SHA-256");
// It uses Web Crypto API.
// This result is exactly match to the result of crypto.subtle.digest("SHA-256", bytes.toUint8Array())
const digestStr = digestBytes.toString();
// → "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

// also supports SHA-384 and SHA-512
const digestBytes2 = await bytes.toDigest("SHA-384");
const digestBytes3 = await bytes.toDigest("SHA-512");
```

#### Other digest algorithm
You can register the digest algorithm.

Example in Node.js
```javascript
import { createHash } from "node:crypto";
import { DigestAlgorithm } from "@i-xi-dev/bytes";
DigestAlgorithm.register({
  "MD5",
  {
    // compute: (input: Uint8Array) => Promise<Uint8Array>
    async compute(input) {
      const md5 = createHash("md5");
      md5.update(input);
      return md5.digest();
    }
  }
});

const bytes = ByteSequence.create(0);
// → Uint8Array[]

const str = (await bytes.toDigest("MD5")).toString();
// → "d41d8cd98f00b204e9800998ecf8427e"
```


### Generating a [subresource integrity](https://www.w3.org/TR/SRI/) value of the instance
```javascript
const resource = await Resource.fromDataURL("data:text/plain;charset=US-ASCII,hello");
const integrity = await resource.integrity("SHA-256");
// → "sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ="

// also supports SHA-384 and SHA-512
const integrity2 = await resource.integrity("SHA-384");
const integrity3 = await resource.integrity("SHA-512");
```






...

