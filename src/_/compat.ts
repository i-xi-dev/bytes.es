//

import { Exception } from "../_.js";

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto Crypto} object
 */
let _crypto: Crypto;
if (globalThis.crypto?.subtle) { // globalThis.cryptoがCrypto型かどうかでは判定できない（Node, Jest環境）Cryptoが値扱いの為
  // ブラウザー, Deno
  _crypto = globalThis.crypto;
}
else if (globalThis.process) {
  // Node.js 条件不十分？
  _crypto = ((await import("node:crypto")).webcrypto as unknown) as Crypto;
}

/**
 * @returns The Crypto object.
 */
function getCrypto(): Crypto {
  if (_crypto) {
    return _crypto;
  }
  throw new Exception("NotSupportedError", "Crypto unsupported");
}

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob Blob} constructor
 */
type BlobConstructor = {
  new (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob;
  prototype: Blob;
};
let _BlobConstructor: BlobConstructor;
if (globalThis.Blob) {
  _BlobConstructor = Blob;
}
else if (globalThis.process) {
  _BlobConstructor = (await import("node:buffer")).Blob as BlobConstructor;
}

/**
 * @returns The Blob constructor.
 */
function getBlobConstructor(): BlobConstructor {
  if (_BlobConstructor) {
    return _BlobConstructor;
  }
  throw new Exception("NotSupportedError", "Blob unsupported");
}

type ReadableStreamConstructor = {
  new <R = any>(underlyingSource?: UnderlyingSource<R> | undefined, strategy?: QueuingStrategy<R> | undefined): ReadableStream<R>;
  prototype: ReadableStream;
};
declare module "node:stream/web" {
  export var ReadableStream: ReadableStreamConstructor;
}
let _ReadableStreamConstructor: ReadableStreamConstructor;
if (globalThis.ReadableStream) {
  _ReadableStreamConstructor = ReadableStream;
}
else if (globalThis.process) {
  _ReadableStreamConstructor = (await import("node:stream/web")).ReadableStream as ReadableStreamConstructor;
}

function isTypeOfReadableStream(v: unknown): v is ReadableStream {
  return v instanceof _ReadableStreamConstructor;
}

/**
 * ProgressEvent for non-browser enviorments
 * 
 * Implements the {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent ProgressEvent} interface.
 */
class _ProgressEvent extends Event implements ProgressEvent<EventTarget> {
  /**
   * 進捗状況を計測可能か否か
   */
  #lengthComputable: boolean;

  /**
   * 実行済の実行量
   */
  #loaded: number;

  /**
   * 合計の実行量
   */
  #total: number;

  /**
   * @param type イベント型名
   * @param init EventInit
   */
  constructor(type: string, init?: ProgressEventInit) {
    super(type, init);

    this.#lengthComputable = (init && (typeof init.lengthComputable === "boolean")) ? init.lengthComputable : false;
    this.#loaded = (init && (typeof init.loaded === "number") && Number.isSafeInteger(init.loaded) && (init.loaded >= 0)) ? init.loaded : 0;
    this.#total = (init && (typeof init.total === "number") && Number.isSafeInteger(init.total) && (init.total >= 0)) ? init.total : 0;
  }

  /**
   * 進捗状況を計測可能か否か
   */
  get lengthComputable(): boolean {
    return this.#lengthComputable;
  }

  /**
   * 実行済の実行量
   */
  get loaded(): number {
    return this.#loaded;
  }

  /**
   * 合計の実行量
   */
  get total(): number {
    return this.#total;
  }
}
const pe = (globalThis.ProgressEvent) ? globalThis.ProgressEvent : _ProgressEvent;

export {
  getBlobConstructor,
  getCrypto,
  isTypeOfReadableStream,
  pe as ProgressEvent,
};
