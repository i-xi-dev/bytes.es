# @i-xi-dev/bytes

A JavaScript byte array library for the browser, Deno and Node.js


## Documentation

[https://i-xi-dev.github.io/bytes.es/](https://i-xi-dev.github.io/bytes.es/)


## Requirement
`ByteSequence` requires [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) and [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

- Chrome
- Edge
- Firefox
- Safari
- Deno
- Node.js 16.5.0+


## Installation

### npm

```console
$ npm i @i-xi-dev/bytes
```

```javascript
import { ByteSequence } from "@i-xi-dev/bytes";
```

### CDN

Example for Skypack
```javascript
import { ByteSequence } from "https://cdn.skypack.dev/@i-xi-dev/bytes";
```


## Usage

### `ByteSequence` class

![Conversion](assets/conversion.svg)

#### Creating an instance
Creates an instance filled with zeros
```javascript
const zeroFilledBytes = ByteSequence.allocate(1024);
// zeroFilledBytes.byteLength → 1024
```

Creates an instance filled with random bytes
```javascript
const randomBytes = ByteSequence.generateRandom(size);
```

Creates an instance with a new underlying buffer
```javascript
const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
const buffer = uint8Array.buffer;

// The following represents the same sequence.
const bytes1 = ByteSequence.fromArrayBufferView(uint8Array);
const bytes2 = ByteSequence.fromArrayBuffer(buffer);
const bytes3 = ByteSequence.fromBufferSource(uint8Array);
const bytes4 = ByteSequence.fromBufferSource(buffer);
```

Creates an instance with the specified underlying buffer
```javascript
const bytes5 = ByteSequence.wrapArrayBuffer(buffer);
```

#### Converting the instance to a number array
```javascript
const numberArray = bytes1.toArray();
// → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const numberArray2 = bytes1.toJSON();
// → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const bytesFromNumberArray = ByteSequence.fromArray(numberArray);
bytesFromNumberArray.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

#### Converting the instance to an `ArrayBuffer`
```javascript
const arrayBuffer = bytes1.toArrayBuffer();
// new Uint8Array(arrayBuffer) → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const bytesFromArrayBuffer = ByteSequence.fromArrayBuffer(arrayBuffer);
bytesFromArrayBuffer.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

#### Converting the instance to an `Uint8Array`
```javascript
const uint8Array = bytes1.toUint8Array();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const bytesFromUint8Array = ByteSequence.fromArrayBufferView(uint8Array);
bytesFromUint8Array.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

#### Converting the instance to an [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
```javascript
const uint8Array2 = bytes1.toArrayBufferView(Uint8Array);
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const int8Array = bytes1.toArrayBufferView(Int8Array);
const uint8ClampedArray = bytes1.toArrayBufferView(Uint8ClampedArray);
const int16Array = bytes1.toArrayBufferView(Int16Array);
const uint16Array = bytes1.toArrayBufferView(Uint16Array);
const int32Array = bytes1.toArrayBufferView(Int32Array);
const uint32Array = bytes1.toArrayBufferView(Uint32Array);
const float32Array = bytes1.toArrayBufferView(Float32Array);
const float64Array = bytes1.toArrayBufferView(Float64Array);
const bigInt64Array = bytes1.toArrayBufferView(BigInt64Array);
const bigUint64Array = bytes1.toArrayBufferView(BigUint64Array);
const dataView = bytes1.toArrayBufferView(DataView);

const bytesFromInt8Array = ByteSequence.fromArrayBufferView(int8Array);
bytesFromInt8Array.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

#### Converting the instance to a [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)
```javascript
const binaryString = bytes1.toBinaryString();
// → "å¯\u{8C}å£«å±±"

const bytesFromBinaryString = ByteSequence.fromBinaryString(binaryString);
bytesFromBinaryString.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

#### Converting the instance to a string containing Base64 encoded bytes
```javascript
const base64Encoded = bytes1.toBase64Encoded();
// → "5a+M5aOr5bGx"

const bytesFromBase64Encoded = ByteSequence.fromBase64Encoded(base64Encoded);
bytesFromBase64Encoded.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### Base64 options
[`Base64Options`](https://i-xi-dev.github.io/bytes.es/index.html#Base64Options)

Example: [Base64 URL encoding](https://datatracker.ietf.org/doc/html/rfc4648#section-5)
```javascript
const base64Options = {
  table: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ],
  padEnd: false,
};
const base64Encoded2 = bytes1.toBase64Encoded(base64Options);
// → "5a-M5aOr5bGx"

const bytesFromBase64Encoded2 = ByteSequence.fromBase64Encoded(base64Encoded2, base64Options);
bytesFromBase64Encoded2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Converting the instance to a string containing percent encoded bytes
```javascript
const percentEncoded = bytes1.toPercentEncoded();
// → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"

const bytesFromPercentEncoded = ByteSequence.fromPercentEncoded(percentEncoded);
bytesFromPercentEncoded.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### Percent encoding options
[`PercentOptions`](https://i-xi-dev.github.io/bytes.es/index.html#PercentOptions)

Example: URL component encoding
```javascript
const percentOptions = {
  encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
};
const percentEncoded2 = bytes1.toPercentEncoded(percentOptions);
// → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
//   This result is match to the result of (globalThis.encodeURIComponent("富士山"))

const bytesFromPercentEncoded2 = ByteSequence.fromPercentEncoded(percentEncoded2, percentOptions);
bytesFromPercentEncoded2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

Example: Percent encode for the value of application/x-www-form-urlencoded
```javascript
const percentOptions2 = {
  encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
  spaceAsPlus: true,
};
const percentEncoded3 = bytes1.toPercentEncoded(percentOptions2);
// → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
//   This result is match to the result of (globalThis.encodeURIComponent("富士山").replaceAll(/[!'()~]/g, (c) => `%${ c.charCodeAt(0).toString(16).toUpperCase() }`))
//   And also, this result is match to the result of (const url = new URL("http://example.com/"); url.searchParams.set("p1", "富士山"); url.search.replace("?p1=", ""));

const bytesFromPercentEncoded3 = ByteSequence.fromPercentEncoded(percentEncoded3, percentOptions2);
bytesFromPercentEncoded3.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Converting the instance to a string based on the specified format
```javascript
const formatted = bytes1.format();
// → "E5AF8CE5A3ABE5B1B1"

const formatted2 = bytes1.toString();
// → "E5AF8CE5A3ABE5B1B1"

const bytesFromFormatted = ByteSequence.parse(formatted);
bytesFromFormatted.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### Format options
[`ByteFormatOptions`](https://i-xi-dev.github.io/bytes.es/index.html#ByteFormatOptions)

Example
```javascript
const formatOptions = {
  upperCase: false,
};
const formatted2 = bytes1.format(formatOptions);
// → "e5af8ce5a3abe5b1b1"

// toString method has no arguments
const formatted2 = bytes1.toString(formatOptions);
// → "E5AF8CE5A3ABE5B1B1"

const bytesFromFormatted2 = ByteSequence.parse(formatted2, formatOptions);
bytesFromFormatted2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Converting the instance to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
```javascript
const blob = bytes1.toBlob();
// new Uint8Array(await blob.arrayBuffer()) → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const bytesFromBlob = await ByteSequence.fromBlob(blob);
bytesFromBlob.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### Blob options
```javascript
const blobOptions = {
  type: "text/plain; charset=UTF-8",
};
const blob = bytes1.toBlob(blobOptions);
// new Uint8Array(await blob.arrayBuffer()) → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
// blob.type → "text/plain;charset=UTF-8"

const bytesFromBlob = await ByteSequence.fromBlob(blob);
bytesFromBlob.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Converting the instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

Node.js not support the `File` object

```javascript
const file = bytes1.toFile();
// new Uint8Array(await file.arrayBuffer()) → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

const bytesFromFile = await ByteSequence.fromBlob(file);
bytesFromFile.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### File options
```javascript
const fileOptions = {
  type: "text/plain; charset=UTF-8",
  lastModified: 1640995200000,
};
const file2 = bytes1.toFile(fileOptions);
// new Uint8Array(await file2.arrayBuffer()) → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
// file2.type → "text/plain;charset=UTF-8"
// file2.lastModified → 1640995200000

const bytesFromFile2 = await ByteSequence.fromBlob(file2);
bytesFromFile2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Converting the instance to a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
```javascript
const dataUrl = bytes1.toDataURL();
// dataUrl.toString() → "data:text/plain;charset=US-ASCII;base64,5a+M5aOr5bGx"

const bytesFromDataUrl = ByteSequence.fromDataURL(dataUrl);
bytesFromDataUrl.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### Data URL options
```javascript
const dataUrlOptions = {
  type: "text/plain; charset=UTF-8",
};
const dataUrl2 = bytes1.toDataURL(dataUrlOptions);
// dataUrl2.toString() → "data:text/plain;charset=UTF-8;base64,5a+M5aOr5bGx"

const bytesFromDataUrl2 = ByteSequence.fromDataURL(dataUrl2);
bytesFromDataUrl2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Converting the instance to a text
UTF-8 encoding (does not add or remove the BOM)
```javascript
// UTF-8 decode
const utf8Text = bytes1.utf8DecodeTo();
// → "富士山"

// UTF-8 encode
const bytesFromUtf8Text = ByteSequence.utf8EncodeFrom(utf8Text);
bytesFromUtf8Text.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

##### Other text encodings

Example in Node.js: EUC-JP encoding
```javascript
import iconv from "iconv-lite";
const bytes1X = ByteSequence.fromArray([ 0xC9, 0xD9, 0xBB, 0xCE, 0xBB, 0xB3 ]);

const eucJpText = bytes1X.textDecodeTo({
  // decode: (encoded: Uint8Array) => string
  decode(encoded) {
    return iconv.decode(Buffer.from(encoded), "EUC-JP");
  },
});
// → "富士山"

const bytesFromEucJpText = ByteSequence.textEncodeFrom(eucJpText, {
  // encode: (toEncode: string) => Uint8Array
  encode(toEncode) {
    return iconv.encode(toEncode, "EUC-JP");
  },
});
bytesFromEucJpText.getUint8View();
// → Uint8Array[ 0xC9, 0xD9, 0xBB, 0xCE, 0xBB, 0xB3 ]
```

Example: UTF-8 encoding (add or remove the BOM)
```javascript
const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: false });
const utf8Encoder = new TextEncoder();
const bytes1Y = ByteSequence.fromArray([ 0xEF, 0xBB, 0xBF, 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]);

const utf8Text2 = bytes1.textDecodeTo({
  // decode: (encoded: Uint8Array) => string
  decode(encoded) {
    return utf8Decoder.decode(encoded);
  },
});
// → "富士山"

const bytesFromUtf8Text2 = ByteSequence.textEncodeFrom(utf8Text2, {
  // encode: (toEncode: string) => Uint8Array
  encode(toEncode) {
    const prepend = toEncode.startsWith("\uFEFF") ? "" : "\uFEFF";
    return utf8Encoder.encode(prepend + toEncode);
  },
});
bytesFromUtf8Text2.getUint8View();
// → Uint8Array[ 0xEF, 0xBB, 0xBF, 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```


#### Generating a digest of the instance
```javascript
const sha256DigestBytes = await bytes1.toSha256Digest();
// sha256DigestBytes is also a ByteSequence object.
// sha256DigestBytes.format() → "E294AB9D429F9A9A2678D996E5DBD40CBF62363A5ED417F654C5F0BA861E4200"

// also supports SHA-384 and SHA-512
const sha384DigestBytes = await bytes1.toSha384Digest();
const sha512DigestBytes = await bytes1.toSha512Digest();
```

##### Other digest algorithm
Example in Node.js
```javascript
import { createHash } from "node:crypto";
const md5 = {
  // compute: (input: Uint8Array) => Promise<Uint8Array>
  async compute(input) {
    const hash = createHash("md5");
    hash.update(input);
    return hash.digest();
  }
};

const md5DigestBytes = await bytes1.toDigest(md5);
// md5DigestBytes.format() → "52A6AD27415BD86EC64B57EFBEA27F98"
```


#### Generating a [subresource integrity](https://www.w3.org/TR/SRI/) value of the instance
```javascript
const sha256Integrity = await bytes1.sha256Integrity;
// → "sha256-4pSrnUKfmpomeNmW5dvUDL9iNjpe1Bf2VMXwuoYeQgA="

// also supports SHA-384 and SHA-512
const sha384Integrity = await bytes1.sha384Integrity;
const sha512Integrity = await bytes1.sha512Integrity;
```

#### Creating an instance by reading the [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of `Uint8Array`
```javascript
// stream: ReadableStream<Uint8Array>
const bytesFromStream = await ByteSequence.fromStream(stream);
```

If you want to read [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer), you can use [`stream.Readable.toWeb`](https://nodejs.org/dist/latest-v17.x/docs/api/stream.html#streamreadabletowebstreamreadable) method (Node.js 17.0.0+)
```javascript
import { Readable } from "node:stream";

const bytesFromStream = await ByteSequence.fromStream(Readable.toWeb(nodeJsStream));
```


#### Editing the byte sequence
Gets the underlying `ArrayBuffer`
```javascript
const bytes1c = bytes1.duplicate();
const bytes1Buffer = bytes1c.buffer;

const bytes1BufferView = new Uint8Array(bytes1Buffer);

bytes1BufferView[0] = 0;
bytes1BufferView[1] = 0;
bytes1BufferView[2] = 0;

bytes1c.getUint8View();
// → Uint8Array[ 0x00, 0x00, 0x00, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

Gets the `ArrayBufferView` that views the underlying `ArrayBuffer`
```javascript
const bytes1c2 = bytes1.duplicate();

const uint8ViewPart = bytes1c2.getUint8View(6, 3);
// → Uint8Array[ 0xE5, 0xB1, 0xB1 ]

uint8ViewPart[0] = 0;
uint8ViewPart[1] = 0;
uint8ViewPart[2] = 0;

bytes1c2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x00, 0x00, 0x00 ]
```

```javascript
const bytes1c3 = bytes1.duplicate();

const int8ViewPart = bytes1c3.getView(Int8Array, 0, 3);
// → Int8Array[ -27, -81, -116 ]

int8ViewPart[0] = 0;
int8ViewPart[1] = 0;
int8ViewPart[2] = 0;

bytes1c3.getView(Uint8Array);
// → Uint8Array[ 0x00, 0x00, 0x00, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

#### Duplicating the byte sequence
Duplicates with the new underlying `ArrayBuffer`
```javascript
const bytes1d = bytes1.duplicate();

bytes1d.getUint8View()[0] = 0;
bytes1d.toUint8Array();
// → Uint8Array[ 0x00, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]

bytes1.toUint8Array();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```

Duplicates the subsequence with the new underlying `ArrayBuffer`
```javascript
const bytes1d2 = bytes1.subsequence(6, 9);

bytes1d2.getUint8View()[0] = 0;
bytes1d2.getUint8View()[1] = 0;
bytes1d2.getUint8View()[2] = 0;
bytes1d2.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x00, 0x00, 0x00 ]

bytes1.getUint8View();
// → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
```
