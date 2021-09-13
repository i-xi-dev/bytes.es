globalThis.crypto = (await import("node:crypto")).webcrypto;
globalThis.Blob = (await import("node:buffer")).Blob;
globalThis.ReadableStream = (await import("node:stream/web")).ReadableStream;

export { DigestAlgorithm } from "./dist/byte/index.js";
export { TextEncoding } from "./dist/text_encoding/index.js";
export { ByteSequence } from "./dist/byte_sequence.js";
export { MediaType } from "./dist/media_type.js";
export { Resource } from "./dist/resource.js";
