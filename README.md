# @i-xi-dev/bytes

A JavaScript byte array library for the browser, Deno and Node.js


## Description

### Conversion
![Conversion](assets/conversion.svg)


## Requirement

### Browser
...

### Node.js
16.5.0+


## Installation

### npm

```console
$ npm i @i-xi-dev/bytes
```

```javascript
import { ByteSequence, Resource } from "@i-xi-dev/bytes";
```

### CDN

```javascript
import { ByteSequence, Resource } from "https://unpkg.com/@i-xi-dev/bytes";
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
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

#### Creating an instance by parsing the hexadecimal formatted
```javascript
const parsed = ByteSequence.parse("68656c6c6f");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

#### Creating an instance by decoding the Base64 encoded
```javascript
const decoded = ByteSequence.fromBase64("aGVsbG8=");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]
```

#### Creating an instance by reading the [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of Uint8Array
```javascript
const loadedBytes = await ByteSequence.fromByteStream(byteStream);
```

[Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) is also available.
```javascript
const loadedBytes = await ByteSequence.fromByteStream(byteStream);
```

#### Creating an instance by encoding the text in UTF-8
```javascript
const encoded = ByteSequence.fromText("hello");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]

const encoded = ByteSequence.fromText("新幹線");
// → Uint8Array[ 0xE6, 0x96, 0xB0, 0xE5, 0xB9, 0xB9, 0xE7, 0xB7, 0x9A ]
```

#### Creating an instance by reading the [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
```javascript
const resource = await Resource.fromBlob(blob);
const loadedBytes = resource.bytes;
```

#### Creating an instance by reading the [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
```javascript
const resource = await Resource.fromDataUrl("data:text/plain;charset=US-ASCII,hello");
const loadedBytes = resource.bytes;
```


### Converting the instance to a Base64 encoded string
```javascript
// Base64 decode
const bytes = ByteSequence.fromBinaryString("hello");

// Base64 encode
const base64Encoded = bytes.toBase64();
// → "aGVsbG8="
```

#### Base64 options
Default
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);

// Base64 encode
const base64Encoded = bytes.toBase64(); // equivalents to bytes.toBase64({ table: "rfc4648", usePadding: true });
// → "AwIBAP/+/fw="

// Base64 decode
const bytes2 = ByteSequence.fromBase64(base64Encoded); // equivalents to ByteSequence.fromBase64({ table: "rfc4648", usePadding: true });
// → Uint8Array[ 3, 2, 1, 0, 255, 254, 253, 252 ]
```

Using RFC 4648 Base64url Table
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);

// Base64 encode
const base64Encoded = bytes.toBase64({ table: "rfc4648-url" });
// → "AwIBAP_-_fw="

// Base64 decode
const bytes2 = ByteSequence.fromBase64(base64Encoded, { table: "rfc4648-url" });
// → Uint8Array[ 3, 2, 1, 0, 255, 254, 253, 252 ]
```

No padding
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);
const base64Encoded = bytes.toBase64({ usePadding: false });
// → "AwIBAP/+/fw"

// Base64 decode
const bytes2 = ByteSequence.fromBase64(base64Encoded, { usePadding: false });
// → Uint8Array[ 3, 2, 1, 0, 255, 254, 253, 252 ]
```

[Forgiving base64](https://infra.spec.whatwg.org/#forgiving-base64) decoding
```javascript
// Forgiving base64 decode
const bytes1 = ByteSequence.fromBase64("AwIBAP/+/fw=", { forgiving: true });
// → Uint8Array[ 3, 2, 1, 0, 255, 254, 253, 252 ]

// Forgiving base64 decode
const bytes2 = ByteSequence.fromBase64("AwIBA P/+/fw", { forgiving: true });
// → Uint8Array[ 3, 2, 1, 0, 255, 254, 253, 252 ]
```


### Converting the instance to a string
```javascript
// text encode
const bytes = ByteSequence.fromText("あいうえお");
// → Uint8Array[ 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

// text decode
const str = bytes.asText();
// → "あいうえお"
```

#### Text encoding options
Default
```javascript
// text encode
const bytes = ByteSequence.fromText("あいうえお"); // equivalents to ByteSequence.fromText("あいうえお", "UTF-8", { addBom: false });

// text decode
const str = bytes.asText(); // equivalents to bytes.asText("UTF-8", { removeBom: false });
```

BOM handling
```javascript
// text encode
const bytes1 = ByteSequence.fromText("あいうえお", "UTF-8", { addBom: true });
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

const bytes2 = ByteSequence.fromText("\uFEFFあいうえお", "UTF-8", { addBom: true });
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

// text decode 
const str1 = bytes1.asText("UTF-8", { removeBom: true });
// → "あいうえお"
```

MS932 decode / encode
```javascript
// text encode
const bytes = ByteSequence.fromText("あいうえお", "Shift_JIS");
// → Uint8Array[ 0x82, 0xA0, 0x82, 0xA2, 0x82, 0xA4, 0x82, 0xA6, 0x82, 0xA8 ]
```
It is implementation of [https://encoding.spec.whatwg.org/#shift_jis-encoder](https://encoding.spec.whatwg.org/#shift_jis-encoder).
In this context "Shift_JIS" means **MS932**.

```javascript
// text decode
const str = bytes.asText("Shift_JIS");
// → "あいうえお"
//   This is exactly match to the result of (new TextDecoder("Shift_JIS")).decode(bytes.toUint8Array());
```

#### Other text encodings
Any other encoding is not implemented.
However, you can register the text encoding.

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
const str = bytes.asText();
// → "あいうえお"
```



...

