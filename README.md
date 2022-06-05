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

---

#### Creating an instance

Creates an instance with a new underlying buffer

- [ByteSequence.allocate()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#allocate)
- [ByteSequence.generateRandom()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#generateRandom)
- [ByteSequence.fromArrayBuffer()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromArrayBuffer)
- [ByteSequence.fromArrayBufferView()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromArrayBufferView)
- [ByteSequence.fromBufferSource()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromBufferSource)
- [ByteSequence.fromArray()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromArray)
- [ByteSequence.from()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#from)
- [ByteSequence.of()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#of)
- [ByteSequence.fromBinaryString()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromBinaryString)
- [ByteSequence.fromBase64Encoded()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromBase64Encoded)
- [ByteSequence.fromPercentEncoded()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromPercentEncoded)
- [ByteSequence.parse()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#parse)
- [ByteSequence.utf8EncodeFrom()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#utf8EncodeFrom)
- [ByteSequence.textEncodeFrom()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#textEncodeFrom)
- [ByteSequence.fromBlob()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromBlob)
- [ByteSequence.fromDataURL()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromDataURL)
- [ByteSequence.fromStream()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromStream)
- [ByteSequence.fromRequestOrResponse()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#fromRequestOrResponse)

- [ByteSequence.describedFromBlob()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#describedFromBlob)
- [ByteSequence.describedFromDataURL()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#describedFromDataURL)
- [ByteSequence.describedFromRequestOrResponse()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#describedFromRequestOrResponse)

Creates an instance with the specified underlying buffer

- [ByteSequence.wrapArrayBuffer()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#wrapArrayBuffer)

---

#### Converting the instance to an `ArrayBuffer`

- [ByteSequence.prototype.toArrayBuffer()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toArrayBuffer)

---

#### Converting the instance to an [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

- [ByteSequence.prototype.toUint8Array()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toUint8Array)
- [ByteSequence.prototype.toDataView()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toDataView)
- [ByteSequence.prototype.toArrayBufferView()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toArrayBufferView)

---

#### Converting the instance to a number array

- [ByteSequence.prototype.toArray()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toArray)
- [ByteSequence.prototype.toJSON()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toJSON)

---

#### Converting the instance to a [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary)

- [ByteSequence.prototype.toBinaryString()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toBinaryString)

---

#### Converting the instance to a string containing Base64 encoded bytes

- [ByteSequence.prototype.toBase64Encoded()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toBase64Encoded)

---

#### Converting the instance to a string containing percent encoded bytes

- [ByteSequence.prototype.toPercentEncoded()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toPercentEncoded)

---

#### Converting the instance to a string based on the specified format

- [ByteSequence.prototype.format()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#format)
- [ByteSequence.prototype.toString()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toString)

---

#### Converting the instance to a text

- [ByteSequence.prototype.utf8DecodeTo()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#utf8DecodeTo)
- [ByteSequence.prototype.textDecodeTo()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#textDecodeTo)

---

#### Converting the instance to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

- [ByteSequence.prototype.toBlob()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toBlob)

---

#### Converting the instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

Node.js not support the `File` object

- [ByteSequence.prototype.toFile()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toFile)

---

#### Converting the instance to a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

- [ByteSequence.prototype.toDataURL()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toDataURL)

---

#### Converting the instance to a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)

- [ByteSequence.prototype.toRequest()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toRequest)

---

#### Converting the instance to a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)

- [ByteSequence.prototype.toResponse()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toResponse)

---

#### Generating a digest of the instance

- [ByteSequence.prototype.toSha256Digest()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toSha256Digest)
- [ByteSequence.prototype.toSha384Digest()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toSha384Digest)
- [ByteSequence.prototype.toSha512Digest()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toSha512Digest)
- [ByteSequence.prototype.toDigest()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#toDigest)

---

#### Generating a [subresource integrity](https://www.w3.org/TR/SRI/) value of the instance

- [ByteSequence.prototype.sha256Integrity](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#sha256Integrity)
- [ByteSequence.prototype.sha384Integrity](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#sha384Integrity)
- [ByteSequence.prototype.sha512Integrity](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#sha512Integrity)

---

#### Editing the byte sequence

Gets the underlying `ArrayBuffer`
- [ByteSequence.prototype.buffer](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#buffer)

Gets the `ArrayBufferView` that views the underlying `ArrayBuffer`
- [ByteSequence.prototype.getUint8View()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#getUint8View)
- [ByteSequence.prototype.getDataView()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#getDataView)
- [ByteSequence.prototype.getView()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#getView)

---

#### Duplicating the byte sequence

Duplicates with the new underlying `ArrayBuffer`
- [ByteSequence.prototype.duplicate()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#duplicate)

Duplicates the subsequence with the new underlying `ArrayBuffer`
- [ByteSequence.prototype.subsequence()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#subsequence)
- [ByteSequence.prototype.segment()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#segment)

---

#### Comparing the byte sequence

- [ByteSequence.prototype.equals()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#equals)
- [ByteSequence.prototype.startsWith()](https://i-xi-dev.github.io/bytes.es/classes/ByteSequence.html#startsWith)

