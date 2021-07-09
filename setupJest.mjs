import { TextEncoder } from "util";
globalThis.TextEncoder = TextEncoder;

import { webcrypto } from "crypto";
globalThis.crypto = webcrypto;

//XXX Event, EventTargetがJest実行時のglobalThisに存在しない。importできないのでどうしようもない？
