# @i-xi-dev/bytes

A JavaScript byte array library for the browser, Deno and Node.js

## Requirement

### `ByteSequence.fromBlob` and `ByteSequence.prototype.toBlob` methods

These require [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />15.7+ |

###  `ByteSequence.prototype.toFile` method

This requires [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

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

### `ByteSequence.generateRandom`, `ByteSequence.prototype.toSha256Digest`, `ByteSequence.prototype.toSha384Digest` and `ByteSequence.prototype.toSha512Digest` methods, `ByteSequence.prototype.sha256Integrity`, `ByteSequence.prototype.sha384Integrity` and `ByteSequence.prototype.sha512Integrity` properties

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
$ npm i @i-xi-dev/bytes@4.0.2-alpha4
```

```javascript
import { ByteSequence } from "@i-xi-dev/bytes";
```

### CDN

Example for Skypack

```javascript
import { ByteSequence } from "https://cdn.skypack.dev/@i-xi-dev/bytes@4.0.2-alpha4";
```

## Usage

### [`ByteSequence`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence) class

![Conversion](assets/conversion.svg)

---

#### Creating an instance

Creates an instance with a new underlying buffer

- [ByteSequence.allocate()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#allocate)
- [ByteSequence.generateRandom()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#generateRandom)
- [ByteSequence.fromArrayBuffer()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromArrayBuffer)
- [ByteSequence.fromArrayBufferView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromArrayBufferView)
- [ByteSequence.fromBufferSource()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromBufferSource)
- [ByteSequence.fromArray()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromArray)
- [ByteSequence.from()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#from)
- [ByteSequence.of()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#of)
- [ByteSequence.fromBinaryString()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromBinaryString)
- [ByteSequence.fromBase64Encoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromBase64Encoded)
- [ByteSequence.fromPercentEncoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromPercentEncoded)
- [ByteSequence.parse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#parse)
- [ByteSequence.fromText()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromText)
- [ByteSequence.fromBlob()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromBlob)
- [ByteSequence.fromDataURL()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromDataURL)
- [ByteSequence.fromStream()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromStream)
- [ByteSequence.fromRequestOrResponse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#fromRequestOrResponse)

- [ByteSequence.withMetadataFromBlob()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#withMetadataFromBlob)
- [ByteSequence.withMetadataFromDataURL()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#withMetadataFromDataURL)
- [ByteSequence.withMetadataFromRequestOrResponse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#withMetadataFromRequestOrResponse)

Creates an instance with the specified underlying buffer

- [ByteSequence.wrapArrayBuffer()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#wrapArrayBuffer)

---

#### Converting the instance to an `ArrayBuffer`

- [ByteSequence.prototype.toArrayBuffer()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toArrayBuffer)

---

#### Converting the instance to an [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

- [ByteSequence.prototype.toUint8Array()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toUint8Array)
- [ByteSequence.prototype.toDataView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toDataView)
- [ByteSequence.prototype.toArrayBufferView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toArrayBufferView)

---

#### Converting the instance to a number array

- [ByteSequence.prototype.toArray()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toArray)
- [ByteSequence.prototype.toJSON()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toJSON)

---

#### Converting the instance to a [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)

- [ByteSequence.prototype.toBinaryString()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toBinaryString)

---

#### Converting the instance to a string containing Base64 encoded bytes

- [ByteSequence.prototype.toBase64Encoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toBase64Encoded)

---

#### Converting the instance to a string containing percent encoded bytes

- [ByteSequence.prototype.toPercentEncoded()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toPercentEncoded)

---

#### Converting the instance to a string based on the specified format

- [ByteSequence.prototype.format()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#format)
- [ByteSequence.prototype.toString()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toString)

---

#### Converting the instance to a text

- [ByteSequence.prototype.toText()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toText)

---

#### Converting the instance to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

- [ByteSequence.prototype.toBlob()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toBlob)

---

#### Converting the instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

Node.js not support the `File` object

- [ByteSequence.prototype.toFile()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toFile)

---

#### Converting the instance to a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

- [ByteSequence.prototype.toDataURL()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toDataURL)

---

#### Converting the instance to a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)

- [ByteSequence.prototype.toRequest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toRequest)

---

#### Converting the instance to a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)

- [ByteSequence.prototype.toResponse()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toResponse)

---

#### Generating a digest of the instance

- [ByteSequence.prototype.toSha256Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toSha256Digest)
- [ByteSequence.prototype.toSha384Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toSha384Digest)
- [ByteSequence.prototype.toSha512Digest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toSha512Digest)
- [ByteSequence.prototype.toDigest()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#toDigest)

---

#### Generating a [subresource integrity](https://www.w3.org/TR/SRI/) value of the instance

- [ByteSequence.prototype.sha256Integrity](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#sha256Integrity)
- [ByteSequence.prototype.sha384Integrity](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#sha384Integrity)
- [ByteSequence.prototype.sha512Integrity](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#sha512Integrity)

---

#### Editing the byte sequence

Gets the underlying `ArrayBuffer`

- [ByteSequence.prototype.buffer](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#buffer)

Gets the `ArrayBufferView` that views the underlying `ArrayBuffer`

- [ByteSequence.prototype.getUint8View()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#getUint8View)
- [ByteSequence.prototype.getDataView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#getDataView)
- [ByteSequence.prototype.getView()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#getView)

---

#### Duplicating the byte sequence

Duplicates with the new underlying `ArrayBuffer`

- [ByteSequence.prototype.duplicate()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#duplicate)

Duplicates the subsequence with the new underlying `ArrayBuffer`

- [ByteSequence.prototype.subsequence()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#subsequence)
- [ByteSequence.prototype.segment()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#segment)

---

#### Comparing the byte sequence

- [ByteSequence.prototype.equals()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#equals)
- [ByteSequence.prototype.startsWith()](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/bytes.es/4.0.2-alpha4/mod.ts/~/ByteSequence#startsWith)
