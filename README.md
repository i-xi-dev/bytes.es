# @i-xi-dev/bytes

A JavaScript byte array library for the browser, Deno and Node.js

## Requirement

### `ByteSequence.fromBlob`, `ByteSequence.prototype.toBlob` and `ByteSequence.prototype.toStream` methods

These require [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />15.7+ |

###  `ByteSequence.prototype.toFile` method

This requires [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />19.2+ |

### `ByteSequence.fromStream` method

This requires [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />16.5+ |

### `ByteSequence.fromRequestOrResponse`, `ByteSequence.prototype.toRequest` and `ByteSequence.prototype.toResponse` methods

These require [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />18.0+ |

### `ByteSequence.generateRandom`, `ByteSequence.prototype.toSha256Digest`, `ByteSequence.prototype.toSha384Digest` and `ByteSequence.prototype.toSha512Digest` and `ByteSequence.prototype.toSha1Digest` methods, `ByteSequence.prototype.sha256Integrity`, `ByteSequence.prototype.sha384Integrity` and `ByteSequence.prototype.sha512Integrity` properties

These require [`Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />15.0+ |

### Other than above

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Installation

### npm

```console
$ npm i @i-xi-dev/bytes@4.4.2
```

```javascript
import { ByteSequence, ByteOrder } from "@i-xi-dev/bytes";
```

### CDN

Example for UNPKG

```javascript
import { ByteSequence, ByteOrder } from "https://www.unpkg.com/@i-xi-dev/bytes@4.4.2/esm/mod.js";
```

## Usage

### [`ByteSequence`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence) class

![Conversion](assets/conversion.svg)

---

#### Creating an instance

Creates an instance with a new underlying buffer

- [ByteSequence.allocate()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#allocate)
- [ByteSequence.generateRandom()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#generateRandom)
- [ByteSequence.fromArrayBuffer()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromArrayBuffer)
- [ByteSequence.fromArrayBufferView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromArrayBufferView)
- [ByteSequence.fromBufferSource()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromBufferSource)
- [ByteSequence.fromArray()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromArray)
- [ByteSequence.fromUint8Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromUint8Iterable)
- [ByteSequence.fromAsyncUint8Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromAsyncUint8Iterable)
- [ByteSequence.fromUint16Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromUint16Iterable)
- [ByteSequence.fromAsyncUint16Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromAsyncUint16Iterable)
- [ByteSequence.fromUint32Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromUint32Iterable)
- [ByteSequence.fromAsyncUint32Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromAsyncUint32Iterable)
- [ByteSequence.fromBigUint64Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromBigUint64Iterable)
- [ByteSequence.fromAsyncBigUint64Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromAsyncBigUint64Iterable)
- [ByteSequence.from()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#from)
- [ByteSequence.of()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#of)
- [ByteSequence.fromBinaryString()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromBinaryString)
- [ByteSequence.fromBase64Encoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromBase64Encoded)
- [ByteSequence.fromPercentEncoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromPercentEncoded)
- [ByteSequence.parse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#parse)
- [ByteSequence.fromText()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromText)
- [ByteSequence.fromBlob()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromBlob)
- [ByteSequence.fromDataURL()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromDataURL)
- [ByteSequence.fromStream()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromStream)
- [ByteSequence.fromRequestOrResponse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#fromRequestOrResponse)

- [ByteSequence.withMetadataFromBlob()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#withMetadataFromBlob)
- [ByteSequence.withMetadataFromDataURL()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#withMetadataFromDataURL)
- [ByteSequence.withMetadataFromRequestOrResponse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#withMetadataFromRequestOrResponse)

Creates an instance with the specified underlying buffer

- [ByteSequence.wrapArrayBuffer()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#wrapArrayBuffer)

---

#### Converting the instance to an `ArrayBuffer`

- [ByteSequence.prototype.toArrayBuffer()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toArrayBuffer)

---

#### Converting the instance to an [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

- [ByteSequence.prototype.toUint8Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint8Array)
- [ByteSequence.prototype.toUint8ClampedArray()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint8ClampedArray)
- [ByteSequence.prototype.toUint16Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint16Array)
- [ByteSequence.prototype.toUint32Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint32Array)
- [ByteSequence.prototype.toBigUint64Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toBigUint64Array)
- [ByteSequence.prototype.toInt8Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toInt8Array)
- [ByteSequence.prototype.toInt16Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toInt16Array)
- [ByteSequence.prototype.toInt32Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toInt32Array)
- [ByteSequence.prototype.toBigInt64Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toBigInt64Array)
- [ByteSequence.prototype.toFloat32Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toFloat32Array)
- [ByteSequence.prototype.toFloat64Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toFloat64Array)
- [ByteSequence.prototype.toDataView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toDataView)
- deprecated [ByteSequence.prototype.toArrayBufferView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toArrayBufferView)

---

#### Converting the instance to a number array

- [ByteSequence.prototype.toUint8Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint8Iterable)
- [ByteSequence.prototype.toUint16Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint16Iterable)
- [ByteSequence.prototype.toUint32Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toUint32Iterable)
- [ByteSequence.prototype.toBigUint64Iterable()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toBigUint64Iterable)
- [ByteSequence.prototype.toArray()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toArray)
- [ByteSequence.prototype.toJSON()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toJSON)

---

#### Converting the instance to a [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)

- [ByteSequence.prototype.toBinaryString()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toBinaryString)

---

#### Converting the instance to a string containing Base64 encoded bytes

- [ByteSequence.prototype.toBase64Encoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toBase64Encoded)

---

#### Converting the instance to a string containing percent encoded bytes

- [ByteSequence.prototype.toPercentEncoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toPercentEncoded)

---

#### Converting the instance to a string based on the specified format

- [ByteSequence.prototype.format()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#format)
- [ByteSequence.prototype.toString()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toString)

---

#### Converting the instance to a text

- [ByteSequence.prototype.toText()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toText)

---

#### Converting the instance to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

- [ByteSequence.prototype.toBlob()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toBlob)

---

#### Converting the instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

Node.js not support the `File` object

- [ByteSequence.prototype.toFile()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toFile)

---

#### Converting the instance to a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

- [ByteSequence.prototype.toDataURL()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toDataURL)

---

#### Converting the instance to a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

- [ByteSequence.prototype.toStream()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toStream)

---

#### Converting the instance to a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)

- [ByteSequence.prototype.toRequest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toRequest)

---

#### Converting the instance to a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)

- [ByteSequence.prototype.toResponse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toResponse)

---

#### Generating a digest of the instance

- [ByteSequence.prototype.toSha256Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toSha256Digest)
- [ByteSequence.prototype.toSha384Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toSha384Digest)
- [ByteSequence.prototype.toSha512Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toSha512Digest)
- [ByteSequence.prototype.toSha1Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toSha1Digest)
- [ByteSequence.prototype.toMd5Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toMd5Digest)
- [ByteSequence.prototype.toDigest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#toDigest)

---

#### Generating a [subresource integrity](https://www.w3.org/TR/SRI/) value of the instance

- [ByteSequence.prototype.sha256Integrity](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#sha256Integrity)
- [ByteSequence.prototype.sha384Integrity](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#sha384Integrity)
- [ByteSequence.prototype.sha512Integrity](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#sha512Integrity)

---

#### Editing the byte sequence

Gets the underlying `ArrayBuffer`

- [ByteSequence.prototype.buffer](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#buffer)

Gets the `ArrayBufferView` that views the underlying `ArrayBuffer`

- [ByteSequence.prototype.asUint8Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asUint8Array)
- [ByteSequence.prototype.asUint8ClampedArray()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asUint8ClampedArray)
- [ByteSequence.prototype.asUint16Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asUint16Array)
- [ByteSequence.prototype.asUint32Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asUint32Array)
- [ByteSequence.prototype.asBigUint64Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asBigUint64Array)
- [ByteSequence.prototype.asInt8Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asInt8Array)
- [ByteSequence.prototype.asInt16Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asInt16Array)
- [ByteSequence.prototype.asInt32Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asInt32Array)
- [ByteSequence.prototype.asBigInt64Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asBigInt64Array)
- [ByteSequence.prototype.asFloat32Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asFloat32Array)
- [ByteSequence.prototype.asFloat64Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asFloat64Array)
- [ByteSequence.prototype.asDataView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#asDataView)
- deprecated [ByteSequence.prototype.getUint8View()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#getUint8View)
- deprecated [ByteSequence.prototype.getDataView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#getDataView)
- deprecated [ByteSequence.prototype.getView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#getView)

---

#### Duplicating the byte sequence

Duplicates with the new underlying `ArrayBuffer`

- [ByteSequence.prototype.duplicate()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#duplicate)

Duplicates the subsequence with the new underlying `ArrayBuffer`

- [ByteSequence.prototype.subsequence()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#subsequence)
- [ByteSequence.prototype.segment()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#segment)

---

#### Comparing the byte sequence

- [ByteSequence.prototype.equals()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#equals)
- [ByteSequence.prototype.startsWith()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.4.2/mod.ts/~/ByteSequence#startsWith)


## Examples

- [Convert from string](https://i-xi-dev.github.io/bytes.es/example/from_string.html)
