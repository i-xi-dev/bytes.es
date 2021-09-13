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


#### Converting the instance to a [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)
```javascript
const bytes = ByteSequence.of(3, 2, 1, 0, 255, 254, 253, 252);
const binaryString = bytes.toBinaryString();
// → "\u{3}\u{2}\u{1}\u{0}\u{FF}\u{FE}\u{FD}\u{FC}"
```


### Converting the instance to a string based on the specified format
```javascript
const bytes = ByteSequence.parse("68656c6c6f"); // equivalents to ByteSequence.parse("68656c6c6f", 16, { paddedLength: 2, upperCase: false, prefix: "", suffix: "", caseInsensitive: false, });
const formatted = bytes.toString(); // equivalents to bytes.format(16, { paddedLength: 2, upperCase: false, prefix: "", suffix: "", });
// → "68656c6c6f"
```

#### Format options
Radix (16, 10, 8, 2)
```javascript
const bytes = ByteSequence.parse("68656c6c6f", 16);

// 10
const formatted2 = bytes.format(10);
// → "104101108108111"

// 8
const formatted3 = bytes.format(8);
// → "150145154154157"

// 2
const formatted4 = bytes.format(2);
// → "0110100001100101011011000110110001101111"
```

Using upper case
```javascript
const bytes = ByteSequence.parse("68656c6c6f", 16);
const formatted = bytes.format(16, { upperCase: true });
// → "68656C6C6F"
```

Zero padding
```javascript
const bytes = ByteSequence.parse("68656c6c6f", 16);
const formatted = bytes.format(16, { paddedLength: 4 });
// → "00680065006c006c006f"

// Minimum paddedLength
// - radix 16 → 2
// - radix 10 → 3
// - radix 8 → 3
// - radix 2 → 8
// If the specified paddedLength is less than the minimum, the specified paddedLength will be ignored.
```

Prefix & Suffix
```javascript
const bytes = ByteSequence.parse("68656c6c6f", 16);
const formatted = bytes.format(16, { prefix: " " });
// → " 68 65 6c 6c 6f"
const formatted2 = bytes.format(16, { suffix: "  " });
// → "68  65  6c  6c  6f  "
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


### Converting the instance to a text
```javascript
// UTF-8 encode
const bytes = ByteSequence.fromText("あいうえお");
// → Uint8Array[ 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

// UTF-8 decode
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
// If the string does not start with a U+FEFF, prepend a BOM
const bytes1 = ByteSequence.fromText("あいうえお", "UTF-8", { addBom: true });
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]
const bytes2 = ByteSequence.fromText("\uFEFFあいうえお", "UTF-8", { addBom: true });
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A ]

// If the byte sequence starts with a BOM, remove the BOM
const str1 = bytes1.asText("UTF-8", { removeBom: true });
// → "あいうえお"
```

MS932 decode / encode
```javascript
// MS932 encode
const bytes = ByteSequence.fromText("あいうえお", "Shift_JIS");
// → Uint8Array[ 0x82, 0xA0, 0x82, 0xA2, 0x82, 0xA4, 0x82, 0xA6, 0x82, 0xA8 ]
//   It is an implementation of https://encoding.spec.whatwg.org/#shift_jis-encoder
//   In this context "Shift_JIS" means **MS932**.

// MS932 decode
const str = bytes.asText("Shift_JIS");
// → "あいうえお"
//   It uses TextDecoder object.
//   This result is exactly match to the result of (new TextDecoder("Shift_JIS")).decode(bytes.toUint8Array())
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


### Converting the instance to a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
```javascript
const resource = new Resource("application/octet-stream", ByteSequence.from(uint8Array));
const blob = resource.toBlob();
```

#### Converting the instance to a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
```javascript
const resource = await Resource.fromDataUrl("data:text/plain;charset=US-ASCII,hello");
// → Uint8Array[ 0x68, 0x65, 0x6C, 0x6C, 0x6F ]

const dataUrl = resource.toDataUrl().toString();
// → "data:text/plain;charset=US-ASCII;base64,aGVsbG8="

const resource2 = await Resource.fromDataUrl(dataUrl);
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
const resource = await Resource.fromDataUrl("data:text/plain;charset=US-ASCII,hello");
const integrity = await resource.integrity("SHA-256");
// → "sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ="

// also supports SHA-384 and SHA-512
const integrity2 = await resource.integrity("SHA-384");
const integrity3 = await resource.integrity("SHA-512");
```












...

