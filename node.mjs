globalThis.crypto = (await import("node:crypto")).webcrypto;
globalThis.Blob = (await import("node:buffer")).Blob;
globalThis.ReadableStream = (await import("node:stream/web")).ReadableStream;

export { ByteSequence } from "./dist/byte_sequence.js";
export { Uri } from "./dist/uri.js";
export { Uuid } from "./dist/uuid.js";
export { MediaType } from "./dist/media_type.js";
export { Resource } from "./dist/resource.js";
