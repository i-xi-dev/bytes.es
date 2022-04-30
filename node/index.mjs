import { webcrypto } from "node:crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import { Blob } from "node:buffer";
if (!globalThis.Blob) {
  globalThis.Blob = Blob;
}

import { ReadableStream } from "node:stream/web";
if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = ReadableStream;
}

export * from "../dist/index.js";
