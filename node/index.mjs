import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto;

import { Blob } from "node:buffer";
globalThis.Blob = Blob;

import { ReadableStream } from "node:stream/web";
globalThis.ReadableStream = ReadableStream;

// export { DigestAlgorithm } from "../dist/byte/index.js";
// export { TextEncoding } from "../dist/text_encoding/index.js";
// export { ByteSequence } from "../dist/byte_sequence.js";
// export { MediaType } from "../dist/media_type.js";
// export { Resource } from "../dist/resource.js";
export {
  DigestAlgorithm,
  TextEncoding,
  ByteSequence,
  MediaType,
  Resource,
} from "../dist/bundle.js";
