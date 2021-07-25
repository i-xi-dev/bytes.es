import { TextDecoder, TextEncoder } from "util";
globalThis.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;

import { webcrypto } from "crypto";
globalThis.crypto = webcrypto;

import { Blob } from "buffer";
globalThis.Blob = Blob;

//XXX Event, EventTargetがJest実行時のglobalThisに存在しない。importできないのでどうしようもない？
