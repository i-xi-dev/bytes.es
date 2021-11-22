import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto;

import { Blob } from "node:buffer";
globalThis.Blob = Blob;

import { ReadableStream } from "node:stream/web";
globalThis.ReadableStream = ReadableStream;

export {
  DigestAlgorithm,
  TextEncoding,
  ByteSequence,
  MediaType,
  Resource,
} from "../dist/index.js";
