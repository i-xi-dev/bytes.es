//

import {
  _Blob,
  _crypto,
  Base64,
  type byte,
  BytesFormat,
  HttpUtils,
  Integer,
  InvalidStateError,
  IsomorphicEncoding,
  MediaType,
  Percent,
  StringUtils,
} from "./deps.ts";
import {
  _ArrayBufferView,
  _Http,
  _HttpUtilsEx,
  _Iterable,
  _Uint8Utils,
  _Utf8,
} from "./x.ts";
import { _DigestImpl } from "./digest.ts";
import { ByteStream } from "./byte_stream.ts";

type int = number;

const {
  ASCII_WHITESPACE,
} = HttpUtils.Pattern;

function _fromDataURL(dataUrl: URL | string): [ByteSequence.$, string] {
  let parsed: URL;
  try {
    parsed = (dataUrl instanceof URL)
      ? new URL(dataUrl.toString())
      : new URL(dataUrl);
  } catch (exception) {
    void exception;
    throw new TypeError("dataUrl parse error");
  }

  // 1
  if (parsed.protocol !== "data:") {
    throw new TypeError(`URL scheme is not "data"`);
  }

  // 2
  // https://fetch.spec.whatwg.org/#data-urls に従い、フラグメントは無視する
  parsed.hash = "";

  // 3, 4
  let bodyStringWork = parsed.toString().substring(5);

  // 5, 6, 7
  if (bodyStringWork.includes(",") !== true) {
    throw new TypeError("U+002C not found");
  }

  // 最初に出現した","をメディアタイプとデータの区切りとみなす。
  // https://fetch.spec.whatwg.org/#data-urls に従い
  // ・メディアタイプのquotedなパラメーター値に含まれた","とみなせる場合であっても区切りとする
  // ・クエリはデータの一部とみなす
  const mediaTypeOriginal = bodyStringWork.split(",")[0] as string;
  let mediaTypeSrc = StringUtils.trim(mediaTypeOriginal, ASCII_WHITESPACE);

  // 8, 9
  bodyStringWork = bodyStringWork.substring(mediaTypeOriginal.length + 1);

  // 10
  let bytes = ByteSequence.fromPercentEncoded(bodyStringWork);

  // 11
  const base64Indicator = /;[\u0020]*base64$/i;
  const base64: boolean = base64Indicator.test(mediaTypeSrc);
  if (base64 === true) {
    // 11.1
    bodyStringWork = bytes.toBinaryString();

    // 11.2, 11.3
    bytes = ByteSequence.fromBase64Encoded(bodyStringWork);

    // 11.4, 11.5, 11.6
    mediaTypeSrc = mediaTypeSrc.replace(base64Indicator, "");
  }

  return [bytes, mediaTypeSrc];
}

namespace ByteSequence {
  /**
   * A typedef that representing a `ByteSequence`, [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource), or `Iterable` of 8-bit unsigned integers.
   */
  export type Source = $ | BufferSource | Iterable<number>;

  /**
   * @experimental
   */
  export type AsyncSource = AsyncIterable<number>;

  /**
   * Digest algorithm
   */
  export interface DigestAlgorithm {
    /**
     * Computes the digest for the byte sequence.
     *
     * @param input The input to compute the digest.
     * @returns The `Promise` that fulfills with a computed digest.
     */
    compute: (input: Uint8Array) => Promise<Uint8Array>;
  }

  /**
   * @experimental
   */
  export type Described = {
    /**
     * A byte sequence.
     */
    data: $;

    fileName?: string;

    /**
     * A [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag)
     * or a [`FilePropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-FilePropertyBag).
     *
     * The `endings` property is always omitted.
     */
    options?: BlobPropertyBag | FilePropertyBag;
  };

  /**
   * The [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of `Uint8Array` or the async iterator of `Uint8Array`.
   *
   * @experimental
   */
  export type StreamLike =
    | AsyncIterable<Uint8Array>
    | ReadableStream<Uint8Array>
    | Iterable<Uint8Array>;
  // XXX ReadableStreamは、そのうちAsyncIterableになる

  /**
   * @experimental
   */
  export type StreamReadingOptions = {
    /**
     * The total number of bytes in the byte stream.
     */
    totalByteLength?: number;

    /**
     * The `AbortSignal` object.
     */
    signal?: AbortSignal;

    /**
     * The event listener for the `loadstart` event.
     */
    onloadstart?: (event: ProgressEvent) => void;

    /**
     * The event listener for the `progress` event.
     */
    onprogress?: (event: ProgressEvent) => void;

    /**
     * The event listener for the `load` event.
     */
    onload?: (event: ProgressEvent) => void;

    /**
     * The event listener for the `abort` event.
     */
    onabort?: (event: ProgressEvent) => void;

    /**
     * The event listener for the `timeout` event.
     */
    ontimeout?: (event: ProgressEvent) => void;

    /**
     * The event listener for the `error` event.
     */
    onerror?: (event: ProgressEvent) => void;

    /**
     * The event listener for the `loadend` event.
     */
    onloadend?: (event: ProgressEvent) => void;
    // XXX abortはrejectしない設定とか？
    // XXX サイズが想定と違ったらrejectする設定とか
  };

  /**
   * @experimental
   */
  export type RequestOrResponseReadingOptions = StreamReadingOptions & {
    // TODO verifyContentType

    verifyHeaders?: (headers: Headers) => [verified: boolean, message?: string];
  };

  /**
   * 2, 8, 10, or 16.
   */
  export type FormatRadix = 2 | 8 | 10 | 16;
  //XXX BytesFormat.Radix

  /**
   * The formatting options object with the following optional fields.
   */
  export type FormatOptions = {
    /**
     * The radix of the formatted string.
     * 2, 8, 10, and 16 are available values.
     * The default is `16`.
     */
     radix?: ByteSequence.FormatRadix;

     /**
      * The length of the `"0"` padded formatted string for each byte.
      * The default is determined by `radix`.
      *
      * | `radix` | default of `paddedLength` |
      * | ---: | ---: |
      * | `16` | `2` |
      * | `10` | `3` |
      * | `8` | `3` |
      * | `2` | `8` |
      */
     paddedLength?: int;
 
     /**
      * Whether the formatted string is lowercase or not.
      * The default is `false`.
      */
     lowerCase?: boolean;
 
     /**
      * The prefix of the formatted string for each byte.
      * The default is `""`.
      */
     prefix?: string;
 
     /**
      * The suffix of the formatted string for each byte.
      * The default is `""`.
      */
     suffix?: string;
 
     /**
      * The separator between the formatted strings of each byte.
      * The default is `""`.
      */
     separator?: string;
  };
  //XXX BytesFormat.Options

  /**
   * Byte sequence
   */
  export class $ {
    /**
     * 内部表現
     */
    #buffer: ArrayBuffer;

    /**
     * 内部表現のビュー
     */
    #view: Uint8Array;

    /**
     * ArrayBufferをラップするインスタンスを生成
     *     ※外部からのArrayBufferの変更は当インスタンスに影響する
     */
    constructor(bytes: ArrayBuffer) {
      // if ((bytes instanceof ArrayBuffer) !== true) {
      //   throw new TypeError("bytes");
      // }
      console.assert(bytes instanceof ArrayBuffer);

      this.#buffer = bytes;
      this.#view = new Uint8Array(this.#buffer);
      Object.freeze(this);
    }

    /**
     * Gets the number of bytes.
     *
     * @example
     * ```javascript
     * const bytes = ByteSequence.allocate(1024);
     * const byteCount = bytes.byteLength;
     * // byteCount
     * //   → 1024
     * ```
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const byteCount = bytes.byteLength;
     * // byteCount
     * //   → 8
     * ```
     */
    get byteLength(): number {
      return this.#buffer.byteLength;
    }

    /**
     * Gets the underlying `ArrayBuffer`.
     *
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const bufferRef = new Uint8Array(bytes.buffer);
     * bufferRef[0] = 0x0;
     * // bufferRef
     * //   → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     *
     * // new Uint8Array(bytes.buffer)
     * //   → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    get buffer(): ArrayBuffer {
      return this.#buffer;
    }

    /**
     * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-256 digest for this byte sequence.
     *
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const integrity = await bytes.sha256Integrity;
     * // integrity
     * //   → "sha256-4pSrnUKfmpomeNmW5dvUDL9iNjpe1Bf2VMXwuoYeQgA="
     * ```
     */
    get sha256Integrity(): Promise<string> {
      return this.#integrity(_DigestImpl.Sha256, "sha256-");
    }

    /**
     * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-384 digest for this byte sequence.
     */
    get sha384Integrity(): Promise<string> {
      return this.#integrity(_DigestImpl.Sha384, "sha384-");
    }

    /**
     * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-512 digest for this byte sequence.
     */
    get sha512Integrity(): Promise<string> {
      return this.#integrity(_DigestImpl.Sha512, "sha512-");
    }

    /**
     * Returns the `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
     *
     * @returns The `ArrayBuffer`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const dstBuffer = bytes.toArrayBuffer();
     * dstBuffer[0] = 0x0;
     * const dstView = new Uint8Array(dstBuffer);
     * // dstView
     * //   → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     *
     * const srcView = new Uint8Array(bytes.buffer);
     * // srcView
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    toArrayBuffer(): ArrayBuffer {
      return this.#buffer.slice(0);
    }

    /**
     * Returns the `Uint8Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
     *
     * @returns The `Uint8Array`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const uint8Array = bytes.toUint8Array();
     * // uint8Array
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * uint8Array.fill(0);
     * // uint8Array
     * //   → Uint8Array[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
     *
     * // bytes.toUint8Array()
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    toUint8Array(): Uint8Array {
      return this.toArrayBufferView(Uint8Array);
    }

    /**
     * Returns the `DataView` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
     *
     * @returns The `DataView`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const dataView = bytes.toDataView();
     * // new Uint8Array(dataView.buffer)
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     *
     * dataView.setUint8(0, 0);
     * dataView.setUint8(1, 0);
     * dataView.setUint8(2, 0);
     * dataView.setUint8(3, 0);
     * // new Uint8Array(dataView.buffer)
     * //   → Uint8Array[ 0, 0, 0, 0, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     *
     * // new Uint8Array(bytes.toDataView().buffer)
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    toDataView(): DataView {
      return this.toArrayBufferView(DataView);
    }

    /**
     * Returns the [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
     *
     * @param ctor The `ArrayBufferView`s constructor.
     *    The default is `Uint8Array`.
     * @returns The `ArrayBufferView`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const uint8Array = bytes.toArrayBufferView(Uint8ClampedArray);
     * // uint8Array
     * //   → Uint8ClampedArray[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     *
     * uint8Array.fill(0);
     * // uint8Array
     * //   → Uint8ClampedArray[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
     *
     * // bytes.toArrayBufferView(Uint8ClampedArray)
     * //   → Uint8ClampedArray[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    toArrayBufferView<T extends ArrayBufferView>(
      ctor: _ArrayBufferView.Constructor<T> =
        Uint8Array as unknown as _ArrayBufferView.Constructor<T>,
    ): T {
      let bytesPerElement: number;
      if (_ArrayBufferView.isTypedArrayConstructor(ctor)) {
        bytesPerElement = ctor.BYTES_PER_ELEMENT;
      } else if (_ArrayBufferView.isDataViewConstructor(ctor)) {
        bytesPerElement = 1;
      } else {
        throw new TypeError("ctor");
      }

      return new ctor(
        this.toArrayBuffer(),
        0,
        this.byteLength / bytesPerElement,
      );
    }

    /**
     * Returns the 8-bit unsigned integer `Array` representing this byte sequence.
     *
     * @returns The `Array` of 8-bit unsigned integers.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const array = bytes.toArray();
     * // array
     * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    toArray(): Array<number> {
      return [...this.#view] as Array<byte>;
    }

    /**
     * Returns the [isomorphic decoded](https://infra.spec.whatwg.org/#isomorphic-decode) string of this byte sequence.
     *
     * @returns The [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary).
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const binaryString = bytes.toBinaryString();
     * // binaryString
     * //   → "å¯\u{8C}å£«å±±"
     * ```
     */
    toBinaryString(): string {
      return IsomorphicEncoding.decode(this.#buffer);
    }

    /**
     * Returns the string contains formatted bytes.
     *
     * @param options The `ByteSequence.FormatOptions` dictionary.
     * @returns The string contains formatted bytes.
     * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
     * @throws {TypeError} The `options.paddedLength` is not positive integer.
     * @throws {RangeError} The `options.paddedLength` is below the lower limit.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const str = bytes.format();
     * // str
     * //   → "E5AF8CE5A3ABE5B1B1"
     * ```
     * @example
     * ```javascript
     * const options = {
     *   lowerCase: true,
     * };
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const str = bytes.format(options);
     * // str
     * //   → "e5af8ce5a3abe5b1b1"
     * ```
     */
    format(options?: ByteSequence.FormatOptions): string {
      return BytesFormat.format(this.#view, options);
    }

    /**
     * Returns the string contains Base64-encoded bytes of this byte sequence.
     *
     * @param options The [`Base64.Options`](https://i-xi-dev.github.io/base64.es/modules/Base64.html#Options-1) dictionary.
     * @returns The string contains Base64-encoded bytes.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const encoded = bytes.toBase64Encoded();
     * // encoded
     * //   → "5a+M5aOr5bGx"
     * ```
     * @example
     * ```javascript
     * // Base64 URL (https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoding
     *
     * const base64Url = {
     *   table: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ],
     *   noPadding: true,
     * };
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const encoded = bytes.toBase64Encoded(base64Url);
     * // encoded
     * //   → "5a-M5aOr5bGx"
     * ```
     */
    toBase64Encoded(options?: Base64.Options): string {
      return Base64.encode(this.#view, options);
    }

    /**
     * Returns the string contains Percent-encoded bytes of this byte sequence.
     *
     * @param options The [`Percent.Options`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/percent.es/4.0.5/mod.ts/~/Percent.Options) dictionary.
     * @returns The string contains Percent-encoded bytes.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const encoded = bytes.toPercentEncoded();
     * // encoded
     * //   → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
     * ```
     * @example
     * ```javascript
     * // URL component encoding
     *
     * const urlComponent = {
     *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
     * };
     * const bytes = ByteSequence.utf8EncodeFrom("富士山");
     * // bytes.toArray()
     * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * const encoded = bytes.toPercentEncoded(urlComponent);
     * // encoded
     * //   → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
     * ```
     * @example
     * ```javascript
     * // encoding for the value of application/x-www-form-urlencoded
     *
     * const formUrlEnc = {
     *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
     *   spaceAsPlus: true,
     * };
     * const bytes = ByteSequence.utf8EncodeFrom("富士山");
     * // bytes.toArray()
     * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * const encoded = bytes.toPercentEncoded(formUrlEnc);
     * // encoded
     * //   → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
     * ```
     */
    toPercentEncoded(options?: Percent.Options): string {
      return Percent.encode(this.#view, options);
    }

    /**
     * Computes the SHA-256 digest for this byte sequence.
     *
     * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-256 digest.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const digestBytes = await bytes.toSha256Digest();
     * // digestBytes.format()
     * //   → "E294AB9D429F9A9A2678D996E5DBD40CBF62363A5ED417F654C5F0BA861E4200"
     * ```
     */
    toSha256Digest(): Promise<$> {
      return this.toDigest(_DigestImpl.Sha256);
    }

    /**
     * Computes the SHA-384 digest for this byte sequence.
     *
     * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-384 digest.
     */
    toSha384Digest(): Promise<$> {
      return this.toDigest(_DigestImpl.Sha384);
    }

    /**
     * Computes the SHA-512 digest for this byte sequence.
     *
     * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-512 digest.
     */
    toSha512Digest(): Promise<$> {
      return this.toDigest(_DigestImpl.Sha512);
    }

    /**
     * Computes the digest for this byte sequence.
     *
     * @param algorithm The digest algorithm.
     * @returns The `Promise` that fulfills with a `ByteSequence` object of the digest.
     * @example
     * ```javascript
     * // Node.js
     *
     * import { createHash } from "node:crypto";
     * const md5 = {
     *   // compute: (input: Uint8Array) => Promise<Uint8Array>
     *   async compute(input) {
     *     const hash = createHash("md5");
     *     hash.update(input);
     *     return hash.digest();
     *   }
     * };
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const digestBytes = await bytes.toDigest(md5);
     * // digestBytes.format()
     * //   → "52A6AD27415BD86EC64B57EFBEA27F98"
     * ```
     */
    async toDigest(
      algorithm: ByteSequence.DigestAlgorithm,
    ): Promise<$> {
      const digest = await algorithm.compute(this.#view);
      return new $(digest.buffer);
    }

    /**
     * Computes the SRI integrity (Base64-encoded digest).
     *
     * @param algorithm The digest algorithm.
     * @returns The `Promise` that fulfills with a SRI integrity (base64-encoded digest).
     * @see [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
     */
    async #integrity(
      algorithm: ByteSequence.DigestAlgorithm,
      prefix: string,
    ): Promise<string> {
      // algorithmは2021-12時点でSHA-256,SHA-384,SHA-512のどれか
      const digestBytes = await this.toDigest(algorithm);
      return prefix + digestBytes.toBase64Encoded();
    }

    /**
     * Returns the string contains hexadecimal formatted bytes.
     * Equivalents to the `format` method with no parameters.
     *
     * @override
     * @returns The string contains hexadecimal formatted bytes.
     */
    toString(): string {
      return this.format();
    }

    /**
     * The alias for the `toArray` method.
     *
     * @returns The `Array` of 8-bit unsigned integers.
     */
    toJSON(): Array<number> {
      return this.toArray();
    }

    /**
     * Returns a UTF-8 decoded string of this bytes.
     * Neither adds nor removes BOM.
     *
     * @returns A string decoded in UTF-8.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const text = bytes.utf8DecodeTo();
     * // text
     * //   → "富士山"
     * ```
     */
    utf8DecodeTo(): string {
      return _Utf8.getDecoder().decode(this.#view);
    }

    /**
     * Returns a decoded string by the specified text encoding of this bytes.
     *
     * @param decoder The text decoder, for example `TextDecoder`.
     * @returns A string decoded in the specified text encoding.
     * @example
     * ```javascript
     * // EUC-JP decoding (Node.js)
     *
     * import iconv from "iconv-lite";
     * const eucJp = {
     *   // decode: (encoded: Uint8Array) => string
     *   decode(encoded) {
     *     return iconv.decode(Buffer.from(encoded), "EUC-JP");
     *   },
     * };
     * const bytes = ByteSequence.of(0xC9, 0xD9, 0xBB, 0xCE, 0xBB, 0xB3);
     * const text = bytes.textDecodeTo(eucJp);
     * // text
     * //   → "富士山"
     * ```
     * @example
     * ```javascript
     * // UTF-8 decoding (remove the BOM)
     *
     * const decoder = new TextDecoder("utf-8", { ignoreBOM: false });
     * const utf8 = {
     *   // decode: (encoded: Uint8Array) => string
     *   decode(encoded) {
     *     return decoder.decode(encoded);
     *   },
     * };
     * const bytes = ByteSequence.of(0xEF, 0xBB, 0xBF, 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const text = bytes.textDecodeTo(utf8);
     * // text
     * //   → "富士山"
     * ```
     */
    textDecodeTo(
      decoder: { decode: (input?: Uint8Array) => string } = _Utf8.getDecoder(),
    ): string {
      return decoder.decode(this.#view);
    }

    /**
     * Returns the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object representing this byte sequence.
     *
     * @param options The [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag) object, but `endings` property is ignored.
     * @returns The `Blob` object.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const blob = bytes.toBlob({ type: "application/octet-stream" });
     * // new Uint8Array(await blob.arrayBuffer())
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * // blob.type
     * //   → "application/octet-stream"
     * ```
     */
    toBlob(options?: BlobPropertyBag): Blob {
      const mediaType: MediaType | null = (typeof options?.type === "string")
        ? MediaType.fromString(options.type)
        : null;

      return new _Blob([this.#buffer], {
        type: mediaType?.toString(),
      });
    }

    /**
     * Returns the [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object representing this byte sequence.
     *
     * @param fileName The file name.
     * @param options The `FilePropertyBag` object, but `endings` property is ignored.
     * @returns The `File` object.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const file = bytes.toFile("samp.dat", {
     *   type: "application/octet-stream",
     *   lastModified: 1640995200000,
     * });
     * // new Uint8Array(await file.arrayBuffer())
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * // file.name
     * //   → "samp.dat"
     * // file.type
     * //   → "application/octet-stream"
     * // file.lastModified
     * //   → 1640995200000
     * ```
     */
    toFile(fileName: string, options?: FilePropertyBag): File {
      if ((typeof fileName === "string") && (fileName.length > 0)) {
        // ok
      } else {
        throw new TypeError("fileName");
      }

      const mediaType: MediaType | null = (typeof options?.type === "string")
        ? MediaType.fromString(options.type)
        : null;

      return new File([this.#buffer], fileName, {
        type: mediaType ? mediaType.toString() : "",
        lastModified: options?.lastModified ? options.lastModified : Date.now(),
      });
    }

    /**
     * Returns the [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) representing this byte sequence.
     *
     * @param options The [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag) object, but `endings` property is ignored.
     * @returns The [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
     * @throws {TypeError}
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const dataUrl = bytes.toDataURL({ type: "application/octet-stream" });
     * // dataUrl.toString()
     * //   → "data:application/octet-stream;base64,5a+M5aOr5bGx"
     * ```
     */
    toDataURL(options?: BlobPropertyBag): URL {
      // FileReaderの仕様に倣い、テキストかどうかに関係なく常時Base64エンコードする仕様
      // XXX Base64なしも対応する
      const mediaType: MediaType | null = (typeof options?.type === "string")
        ? MediaType.fromString(options.type)
        : null;
      if (mediaType) {
        // let encoding = "";
        // let dataEncoded: string;
        // if (base64) {
        const encoding = ";base64";
        const dataEncoded = this.toBase64Encoded();
        // }

        return new URL(
          "data:" + mediaType.toString() + encoding + "," + dataEncoded,
        );
      }
      throw new TypeError("MIME type not resolved");
    }

    /**
     * @experimental
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const request = bytes.toRequest("http://example.com/foo", {
     *   method: "POST",
     *   headers: new Headers({
     *     "Content-Type": "application/octet-stream",
     *   }),
     * });
     * // new Uint8Array(await request.arrayBuffer())
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * // request.headers.get("Content-Type")
     * //   → "application/octet-stream"
     * ```
     */
    toRequest(url: string, options: RequestInit): Request {
      const headers = _HttpUtilsEx.createHeaders(options?.headers);
      const method = options.method ?? _Http.Method.GET;
      if (
        ([_Http.Method.GET, _Http.Method.HEAD] as string[]).includes(
          method.toUpperCase(),
        ) === true
      ) {
        throw new TypeError("options.method");
      }
      try {
        const urltest = new URL(url);
        void urltest;
      } catch (exception) {
        void exception; //TODO {cause:exception}
        throw new TypeError("url");
      }
      return new Request(url, {
        method,
        headers,
        body: this.#buffer, // options.bodyはいかなる場合も無視する
        referrer: options?.referrer,
        referrerPolicy: options?.referrerPolicy,
        mode: options?.mode,
        credentials: options?.credentials,
        cache: options?.cache,
        redirect: options?.redirect,
        integrity: options?.integrity,
        keepalive: options?.keepalive,
        signal: options?.signal,
        // window
      });
    }

    /**
     * @experimental
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const response = bytes.toResponse({
     *   headers: new Headers({
     *     "Content-Type": "application/octet-stream",
     *   }),
     * });
     * // new Uint8Array(await response.arrayBuffer())
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * // response.headers.get("Content-Type")
     * //   → "application/octet-stream"
     * ```
     */
    toResponse(options: ResponseInit): Response {
      const headers = _HttpUtilsEx.createHeaders(options?.headers);
      return new Response(this.#buffer, {
        status: options?.status,
        statusText: options?.statusText,
        headers,
      });
    }

    /**
     * Returns a new instance of `ByteSequence` with new underlying `ArrayBuffer`
     * duplicated from the underlying `ArrayBuffer` of this instance.
     *
     * @returns A new `ByteSequence` object.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const clone = bytes.duplicate();
     *
     * clone.getUint8View()[0] = 0;
     * // clone.toArray()
     * //   → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     *
     * // bytes.toArray()
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    duplicate(): ByteSequence.$ {
      return new $(this.toArrayBuffer());
    }

    /**
     * Returns a new instance of `ByteSequence` with new underlying `ArrayBuffer`
     * duplicated from a subsequence of the underlying `ArrayBuffer` of this instance.
     *
     * @param start The subsequence start index.
     * @param end The subsequence end index.
     * @returns A new `ByteSequence` object.
     * @throws {TypeError} The `start` is not non-negative integer.
     * @throws {RangeError} The `start` is greater than the `byteLength` of this.
     * @throws {TypeError} The `end` is not non-negative integer.
     * @throws {RangeError} The `end` is less than the `start`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const subsequenceClone = bytes.subsequence(6, 9);
     *
     * subsequenceClone.getUint8View()[0] = 0;
     * // subsequenceClone.toArray()
     * //   → Uint8Array[ 0x0, 0xB1, 0xB1 ]
     *
     * // bytes.toArray()
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    subsequence(start: number, end?: number): $ {
      if (Integer.isNonNegativeInteger(start) !== true) {
        throw new TypeError("start");
      }
      if (start > this.byteLength) {
        throw new RangeError("start");
      }

      if (typeof end === "number") {
        if (Integer.isNonNegativeInteger(end) !== true) {
          throw new TypeError("end");
        }
        if (end < start) {
          throw new RangeError("end");
        }
      }

      return new $(this.#buffer.slice(start, end));
    }

    /**
     * Returns a new iterator that contains byte sequences divided by the specified length.
     *
     * @param segmentByteLength The segment length, in bytes.
     * @returns A new iterator.
     * @throws {TypeError} The `segmentByteLength` is not non-negative integer.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const subsequenceClones = [ ...bytes.segment(3) ];
     * // subsequenceClones[0]
     * //   → Uint8Array[ 0xE5, 0xAF, 0x8C ]
     * // subsequenceClones[1]
     * //   → Uint8Array[ 0xE5, 0xA3, 0xAB ]
     * // subsequenceClones[2]
     * //   → Uint8Array[ 0xE5, 0xB1, 0xB1 ]
     * ```
     */
    segment(segmentByteLength: number): IterableIterator<$> {
      if (Integer.isPositiveInteger(segmentByteLength) !== true) {
        throw new TypeError("segmentByteLength");
      }

      return (function* (
        bytes: $,
      ): Generator<$, void, void> {
        let i = 0;
        let itemLength = segmentByteLength;
        while (i < bytes.byteLength) {
          if ((i + segmentByteLength) > bytes.byteLength) {
            itemLength = bytes.byteLength - i;
          }
          yield bytes.subsequence(i, i + itemLength);
          i = i + segmentByteLength;
        }
      })(this);
    }

    /**
     * Returns the `Uint8Array` that views the underlying `ArrayBuffer` of this instance.
     *
     * @param byteOffset The offset, in bytes.
     * @param byteLength The length of the `ArrayBufferView`, in bytes.
     * @returns The `Uint8Array`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const uint8ViewPart = bytes.getUint8View(6, 3);
     * // uint8ViewPart
     * //   → Uint8Array[ 0xE5, 0xB1, 0xB1 ]
     *
     * uint8ViewPart.fill(0);
     *
     * // bytes.toArray()
     * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
     * ```
     */
    getUint8View(byteOffset?: number, byteLength?: number): Uint8Array {
      return this.getView(Uint8Array, byteOffset, byteLength);
    }

    /**
     * Returns the `DataView` that views the underlying `ArrayBuffer` of this instance.
     *
     * @param byteOffset The offset, in bytes.
     * @param byteLength The length of the `ArrayBufferView`, in bytes.
     * @returns The `DataView`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const dataViewPart = bytes.getDataView(6, 3);
     * // dataViewPart
     * //   → Uint8Array[ 0xE5, 0xB1, 0xB1 ]
     *
     * dataViewPart.setUint8(0, 0);
     * dataViewPart.setUint8(1, 0);
     * dataViewPart.setUint8(2, 0);
     *
     * // bytes.toArray()
     * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
     * ```
     */
    getDataView(byteOffset?: number, byteLength?: number): DataView {
      return this.getView(DataView, byteOffset, byteLength);
    }

    /**
     * Returns the `ArrayBufferView` that views the underlying `ArrayBuffer` of this instance.
     *
     * @param ctor The constructor of `ArrayBufferView`.
     *    The default is `Uint8Array`.
     * @param byteOffset The offset, in bytes.
     * @param byteLength The length of the `ArrayBufferView`, in bytes.
     * @returns The `ArrayBufferView`.
     * @throws {TypeError} The `viewConstructor` is not a constructor of `ArrayBufferView`.
     * @throws {TypeError} The `byteOffset` is not non-negative integer.
     * @throws {RangeError} The `byteOffset` is greater than the `byteLength` of this.
     * @throws {RangeError} The `byteOffset` is not divisible by `viewConstructor.BYTES_PER_ELEMENT`.
     * @throws {TypeError} The `byteLength` is not non-negative integer.
     * @throws {RangeError} The `byteLength` is greater than the result of subtracting `byteOffset` from the `byteLength` of this.
     * @throws {RangeError} The `byteLength` is not divisible by `viewConstructor.BYTES_PER_ELEMENT`.
     * @example
     * ```javascript
     * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
     * const uint8ViewPart = bytes.getView(Uint8Array, 6, 3);
     * // uint8ViewPart
     * //   → Uint8Array[ 0xE5, 0xB1, 0xB1 ]
     *
     * uint8ViewPart.fill(0);
     *
     * // bytes.toArray()
     * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
     * ```
     */
    getView<T extends ArrayBufferView>(
      ctor: _ArrayBufferView.Constructor<T> =
        Uint8Array as unknown as _ArrayBufferView.Constructor<T>,
      byteOffset = 0,
      byteLength: number = (this.byteLength - byteOffset),
    ): T {
      let bytesPerElement: number;
      if (_ArrayBufferView.isTypedArrayConstructor(ctor)) {
        bytesPerElement = ctor.BYTES_PER_ELEMENT;
        new Uint8ClampedArray();
      } else if (_ArrayBufferView.isDataViewConstructor(ctor)) {
        bytesPerElement = 1;
      } else {
        throw new TypeError("ctor");
      }

      if (Integer.isNonNegativeInteger(byteOffset) !== true) {
        throw new TypeError("byteOffset");
      } else if (
        (byteOffset > this.byteLength) || ((byteOffset % bytesPerElement) !== 0)
      ) {
        throw new RangeError("byteOffset");
      }

      if (Integer.isNonNegativeInteger(byteLength) !== true) {
        throw new TypeError("byteLength");
      } else if (
        ((byteOffset + byteLength) > this.byteLength) ||
        ((byteLength % bytesPerElement) !== 0)
      ) {
        throw new RangeError("byteLength");
      }

      return new ctor(this.#buffer, byteOffset, byteLength / bytesPerElement);
    }

    /**
     * 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否かを返却
     *
     * @param otherBytes バイト列
     * @returns 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否か
     */
    #startsWith(otherBytes: BufferSource | Array<byte>): boolean {
      const thisView = this.#view;
      if (
        (otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)
      ) {
        const otherView = new Uint8Array(
          (otherBytes instanceof ArrayBuffer) ? otherBytes : otherBytes.buffer,
        );
        for (let i = 0; i < otherView.byteLength; i++) {
          if (otherView[i] !== thisView[i]) {
            return false;
          }
        }
        return true;
      } else if (_Uint8Utils.isArrayOfUint8(otherBytes)) {
        for (let i = 0; i < otherBytes.length; i++) {
          if (otherBytes[i] !== thisView[i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    }

    /**
     * Determines whether this byte sequence is equal to the byte sequence represented by another object.
     *
     * @param otherBytes The object that represents a byte sequence.
     * @returns If this is equal to the specified byte sequence, `true`; otherwise, `false`.
     * @throws {TypeError} The `otherBytes` is not type of `ByteSequence.Source`.
     */
    equals(otherBytes: ByteSequence.Source): boolean {
      if (otherBytes instanceof $) {
        if (otherBytes.byteLength !== this.byteLength) {
          return false;
        }
        return this.#startsWith(otherBytes.buffer);
      }

      if (
        (otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)
      ) {
        if (otherBytes.byteLength !== this.byteLength) {
          return false;
        }
        return this.#startsWith(otherBytes);
      }

      const array = _Iterable.toArray(otherBytes);
      if (_Uint8Utils.isArrayOfUint8(array)) {
        if (array.length !== this.byteLength) {
          return false;
        }
        return this.#startsWith(array);
      }
      throw new TypeError("otherBytes");
    }

    /**
     * Determines whether this byte sequence starts with the specified byte sequence.
     *
     * @param otherBytes The object that represents a byte sequence.
     * @returns If this starts with the specified byte sequence, `true`; otherwise, `false`.
     * @throws {TypeError} The `otherBytes` is not type of `ByteSequence.Source`.
     */
    startsWith(otherBytes: ByteSequence.Source): boolean {
      if (otherBytes instanceof $) {
        return this.#startsWith(otherBytes.buffer);
      }

      if (
        (otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)
      ) {
        return this.#startsWith(otherBytes);
      }

      const array = _Iterable.toArray(otherBytes);
      if (_Uint8Utils.isArrayOfUint8(array)) {
        return this.#startsWith(array);
      }

      throw new TypeError("otherBytes");
    }

    at(index: number): number | undefined {
      return this.#view.at(index);
    }

    [Symbol.iterator](): IterableIterator<number> {
      return this.#view[Symbol.iterator]();
    }

    // XXX every()
    // XXX some()

    // XXX forEach()
    // XXX map()
    // XXX reduce()

    // XXX fill()
    // XXX set()
  }

  /**
   * Creates a new instance of `ByteSequence` of the specified size.
   * Its bytes are filled with zeros.
   *
   * @param byteLength The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(1024);
   * // bytes.byteLength
   * //   → 1024
   * ```
   */
  export function allocate(byteLength: number): $ {
    if (Integer.isNonNegativeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    return new $(new ArrayBuffer(byteLength));
  }

  /**
   * Creates a new instance of `ByteSequence` with the specified underlying `ArrayBuffer`.
   *
   * @param buffer The `ArrayBuffer`.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `buffer` is not type of `ArrayBuffer`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.wrapArrayBuffer(srcBuffer);
   * const srcBufferRef = bytes.buffer;
   * // (srcBufferRef === srcBuffer)
   * //   → true
   * ```
   */
  export function wrapArrayBuffer(buffer: ArrayBuffer): $ {
    if (buffer instanceof ArrayBuffer) {
      return new $(buffer);
    }
    throw new TypeError("buffer");
  }

  // TODO byteOffset
  // TODO byteLength
  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the specified `ArrayBuffer`.
   *
   * @param buffer The `ArrayBuffer`.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `buffer` is not type of `ArrayBuffer`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.fromArrayBuffer(srcBuffer);
   * const dstBuffer = bytes.buffer;
   * // (dstBuffer === srcBuffer)
   * //   → false
   * ```
   */
  export function fromArrayBuffer(buffer: ArrayBuffer): $ {
    if (buffer instanceof ArrayBuffer) {
      return new $(buffer.slice(0));
    }
    throw new TypeError("buffer");
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the underlying `ArrayBuffer` of the specified [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView).
   *
   * @param bufferView The object that represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferView` is not type of `ArrayBufferView`.
   * @example
   * ```javascript
   * const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const bytes = ByteSequence.fromArrayBufferView(uint8Array);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const buffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const dataView = new DataView(buffer);
   * const bytes = ByteSequence.fromArrayBufferView(dataView);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function fromArrayBufferView(bufferView: ArrayBufferView): $ {
    if (ArrayBuffer.isView(bufferView)) {
      const buffer = bufferView.buffer.slice(
        bufferView.byteOffset,
        bufferView.byteOffset + bufferView.byteLength,
      );
      return new $(buffer);
    }
    throw new TypeError("bufferView");
  }

  // TODO byteOffset
  // TODO byteLength
  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the underlying `ArrayBuffer` of the specified [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource).
   *
   * @param bufferSource The object that represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferSource` is not type of `BufferSource`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.fromBufferSource(srcBuffer);
   * const dstBuffer = bytes.buffer;
   * // (dstBuffer === srcBuffer)
   * //   → false
   * // new Uint8Array(dstBuffer)
   * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const bytes = ByteSequence.fromBufferSource(uint8Array);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function fromBufferSource(bufferSource: BufferSource): $ {
    if (bufferSource instanceof ArrayBuffer) {
      return ByteSequence.fromArrayBuffer(bufferSource);
    }
    return ByteSequence.fromArrayBufferView(bufferSource);
  }

  // TODO offset
  // TODO length
  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 8-bit unsigned integer `Array`.
   *
   * @param byteArray The 8-bit unsigned integer `Array` represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteArray` is not an 8-bit unsigned integer `Array`.
   * @example
   * ```javascript
   * const array = [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ];
   * const bytes = ByteSequence.fromArray(array);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function fromArray(byteArray: Array<number>): $ {
    if (_Uint8Utils.isArrayOfUint8(byteArray)) {
      return ByteSequence.fromArrayBufferView(Uint8Array.from(byteArray));
    }
    throw new TypeError("byteArray");
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified `ByteSequence`, `BufferSource`, or 8-bit unsigned integer `Array`.
   *
   * @param sourceBytes The `ByteSequence.Source` object represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferSource` is not type of `ByteSequence.Source`.
   */
  export function from(sourceBytes: ByteSequence.Source): $ {
    if (sourceBytes instanceof $) {
      return sourceBytes.duplicate();
    }

    if (sourceBytes instanceof ArrayBuffer) {
      return ByteSequence.fromArrayBuffer(sourceBytes);
    }

    if (ArrayBuffer.isView(sourceBytes)) {
      return ByteSequence.fromArrayBufferView(sourceBytes);
    }

    const array = _Iterable.toArray(sourceBytes);
    if (_Uint8Utils.isArrayOfUint8(array)) {
      return ByteSequence.fromArray([...sourceBytes]);
    }
    throw new TypeError("sourceBytes");
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 8-bit unsigned integer iterator.
   *
   * @param bytes The iterator of 8-bit unsigned integers.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bytes` is not an 8-bit unsigned integer iterator.
   */
  export function of(...bytes: Array<number>): $ {
    return ByteSequence.fromArray(bytes);
  }

  /**
   * Creates a new instance of `ByteSequence` of the specified size.
   * Its bytes are filled with random values.
   *
   * @param {number} byteLength The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   * @throws {RangeError} The `byteLength` is greater than 65536.
   * @example
   * ```javascript
   * const randomBytes = ByteSequence.generateRandom(1024);
   * // randomBytes.byteLength
   * //   → 1024
   * ```
   */
  export function generateRandom(byteLength: number): $ {
    if (Integer.isNonNegativeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    if (byteLength > 65536) { // XXX 連結すれば良いのでは
      throw new RangeError("byteLength");
    }

    const randomBytes = _crypto.getRandomValues(new Uint8Array(byteLength));
    return new $(randomBytes.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the [isomorphic encoded](https://infra.spec.whatwg.org/#isomorphic-encode) string.
   *
   * @param binaryString The [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary).
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromBinaryString("å¯\u{8C}å£«å±±");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function fromBinaryString(binaryString: string): $ {
    const bytes = IsomorphicEncoding.encode(binaryString);
    return new $(bytes.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains formatted bytes.
   *
   * @param formattedBytes The string to parse.
   * @param options The `ByteSequence.FormatOptions` dictionary.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   * @throws {TypeError} The `formattedBytes` contains the character sequence that does not match the specified format.
   * @example
   * ```javascript
   * const bytes = ByteSequence.parse("E5AF8CE5A3ABE5B1B1");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const options = {
   *   lowerCase: true,
   * };
   * const bytes = ByteSequence.parse("e5af8ce5a3abe5b1b1", options);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function parse(
    formattedBytes: string,
    options?: ByteSequence.FormatOptions,
  ): $ {
    const parsed = BytesFormat.parse(formattedBytes, options);
    return new $(parsed.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Base64-encoded bytes.
   *
   * @param base64Encoded The string to decode.
   * @param options The [`Base64.Options`](https://i-xi-dev.github.io/base64.es/modules/Base64.html#Options-1) dictionary.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromBase64Encoded("5a+M5aOr5bGx");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * // Base64 URL (https://datatracker.ietf.org/doc/html/rfc4648#section-5) decoding
   *
   * const base64Url = {
   *   table: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ],
   *   noPadding: true,
   * };
   * const bytes = ByteSequence.fromBase64Encoded("5a-M5aOr5bGx", base64Url);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function fromBase64Encoded(
    base64Encoded: string,
    options?: Base64.Options,
  ): $ {
    const decoded = Base64.decode(base64Encoded, options);
    return new $(decoded.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Percent-encoded bytes.
   *
   * @param percentEncoded The string to decode.
   * @param options The [`Percent.Options`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/percent.es/4.0.5/mod.ts/~/Percent.Options) dictionary.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromPercentEncoded("%E5%AF%8C%E5%A3%AB%E5%B1%B1");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * // URL component decoding
   *
   * const urlComponent = {
   *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
   * };
   * const bytes = ByteSequence.fromPercentEncoded("%E5%AF%8C%E5%A3%AB%E5%B1%B1", urlComponent);
   * // bytes.utf8DecodeTo()
   * //   → "富士山"
   * ```
   * @example
   * ```javascript
   * // decoding for the value of application/x-www-form-urlencoded
   *
   * const formUrlEnc = {
   *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
   *   spaceAsPlus: true,
   * };
   * const bytes = ByteSequence.fromPercentEncoded("%E5%AF%8C%E5%A3%AB%E5%B1%B1", formUrlEnc);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // bytes.utf8DecodeTo()
   * //   → "富士山"
   * ```
   */
  export function fromPercentEncoded(
    percentEncoded: string,
    options?: Percent.Options,
  ): $ {
    const decoded = Percent.decode(percentEncoded, options);
    return new $(decoded.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * generated from the specified string by UTF-8 encoding.
   * Neither adds nor removes BOM.
   *
   * @param text The string.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.utf8EncodeFrom("富士山");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function utf8EncodeFrom(text: string): $ {
    const encoded = _Utf8.getEncoder().encode(text);
    return new $(encoded.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * generated from the specified string by the specified text encoding.
   *
   * @param text The string.
   * @param encoder The text encoder, for example `TextEncoder`.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * // EUC-JP encoding (Node.js)
   *
   * import iconv from "iconv-lite";
   * const eucJp = {
   *   // encode: (toEncode: string) => Uint8Array
   *   encode(toEncode) {
   *     return iconv.encode(toEncode, "EUC-JP");
   *   },
   * };
   * const bytes = ByteSequence.textEncodeFrom("富士山", eucJp);
   * // bytes.toArray()
   * //   → [ 0xC9, 0xD9, 0xBB, 0xCE, 0xBB, 0xB3 ]
   * ```
   * @example
   * ```javascript
   * // UTF-8 encoding (add the BOM)
   *
   * const encoder = new TextEncoder();
   * const utf8 = {
   *   // encode: (toEncode: string) => Uint8Array
   *   encode(toEncode) {
   *     const prepend = toEncode.startsWith("\uFEFF") ? "" : "\uFEFF";
   *     return encoder.encode(prepend + toEncode);
   *   },
   * };
   * const bytes = ByteSequence.textEncodeFrom("富士山", utf8);
   * // bytes.toArray()
   * //   → [ 0xEF, 0xBB, 0xBF, 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function textEncodeFrom(
    text: string,
    encoder: { encode: (input?: string) => Uint8Array } = _Utf8.getEncoder(),
  ): $ {
    const encoded = encoder.encode(text);
    // return new $(encoded.buffer);// Node.jsのBufferを返すエンコーダーだとプールが余計
    return ByteSequence.fromArrayBufferView(encoded);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
   *
   * @experimental
   * @param blob The `Blob` object (including `File` object).
   * @returns The `Promise` that fulfills with a new `ByteSequence` object.
   * @throws {Error} `blob.arrayBuffer()` is failed.
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const bytes = await ByteSequence.fromBlob(blob);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const file = new File([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ], "samp.dat");
   * const bytes = await ByteSequence.fromBlob(file);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export async function fromBlob(blob: Blob): Promise<$> {
    try {
      const buffer = await blob.arrayBuffer(); // TODO Node.jsでもstream()を取得できるようになったのでstreamの方を読む？
      return ByteSequence.wrapArrayBuffer(buffer);
    } catch (exception) {
      void exception;
      // Blob#arrayBufferでの NotFoundError | SecurityError | NotReadableError

      // XXX throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
   *
   * @experimental
   * @param blob The `Blob` object (including `File` object).
   * @returns The `Promise` that fulfills with a new `ByteSequence` and a [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag).
   * @throws {Error} `blob.arrayBuffer()` is failed.
   * @throws {TypeError} `blob.type` parsing is failed.
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ], { type: "application/octet-stream" });
   * const { data, options } = await ByteSequence.describedFromBlob(blob);
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
   * ```
   */
  export async function describedFromBlob(
    blob: Blob,
  ): Promise<ByteSequence.Described> {
    const data = await ByteSequence.fromBlob(blob);
    // try {
    let mediaType: MediaType | null = null;
    if (blob.type) {
      mediaType = MediaType.fromString(blob.type); // パース失敗で例外になる場合あり
    }

    let fileName: string | undefined = undefined;
    let fileLastModified: number | undefined = undefined;
    if (("File" in globalThis) && (blob instanceof File)) {
      fileName = blob.name;
      fileLastModified = blob.lastModified;
    }

    const options = (mediaType || fileLastModified)
      ? {
        type: mediaType?.toString(),
        lastModified: fileLastModified,
      }
      : undefined;

    return {
      data,
      fileName,
      options,
    };
    // }
    // catch (exception) {
    //   // MediaTypeのパース失敗

    //   // XXX throw new Error("reading failed", { cause: exception });
    //   throw exception;
    // }
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   *
   * @see [https://fetch.spec.whatwg.org/#data-urls](https://fetch.spec.whatwg.org/#data-urls)
   * @param dataUrl The data URL
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `dataUrl` parsing is failed.
   * @throws {TypeError} The URL scheme of the `dataUrl` is not "data".
   * @throws {TypeError} The `dataUrl` does not contain `","`.
   * @example
   * ```javascript
   * const bytes = await ByteSequence.fromDataURL("data:application/octet-stream;base64,5a+M5aOr5bGx");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export function fromDataURL(dataUrl: URL | string): $ {
    const [bytes] = _fromDataURL(dataUrl);
    return bytes;
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   *
   * @experimental
   * @see [https://fetch.spec.whatwg.org/#data-urls](https://fetch.spec.whatwg.org/#data-urls)
   * @param dataUrl The data URL
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `dataUrl` parsing is failed.
   * @throws {TypeError} The URL scheme of the `dataUrl` is not "data".
   * @throws {TypeError} The `dataUrl` does not contain `","`.
   * @example
   * ```javascript
   * const { data, options } = await ByteSequence.describedFromDataURL("data:application/octet-stream;base64,5a+M5aOr5bGx");
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
   * ```
   */
  export function describedFromDataURL(
    dataUrl: URL | string,
  ): ByteSequence.Described {
    const [bytes, mediaTypeSrc] = _fromDataURL(dataUrl);
    let mediaTypeWork = mediaTypeSrc;

    // 12
    if (mediaTypeWork.startsWith(";")) {
      mediaTypeWork = "text/plain" + mediaTypeWork;
    }

    // 13, 14
    let mediaType: MediaType;
    try {
      mediaType = MediaType.fromString(mediaTypeWork);
    } catch (exception) {
      void exception;
      mediaType = MediaType.fromString("text/plain;charset=US-ASCII");
    }

    return {
      data: bytes,
      options: {
        type: mediaType.toString(),
      },
    };
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of `Uint8Array`.
   *
   * If you want to read [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer), you can use [`stream.Readable.toWeb`](https://nodejs.org/dist/latest-v17.x/docs/api/stream.html#streamreadabletowebstreamreadable) method (Node.js 17.0.0+)
   *
   * @experimental
   * @param streamLike The `ReadableStream` of `Uint8Array` or the async iterator of `Uint8Array`.
   * @param options The `ByteSequence.StreamReadingOptions` object.
   * @returns The `Promise` that fulfills with a new `ByteSequence` object.
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const stream = blob.stream();
   * const bytes = await ByteSequence.fromStream(stream);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export async function fromStream(
    streamLike: ByteSequence.StreamLike,
    options?: ByteSequence.StreamReadingOptions,
  ): Promise<$> {
    const reader = new ByteStream.Reader();

    const listenerOptions = {
      once: true,
      passive: true,
    };
    const progressListenerOptions = {
      passive: true,
    };
    if (typeof options?.onloadstart === "function") {
      reader.addEventListener(
        "loadstart",
        options.onloadstart as EventListener,
        listenerOptions,
      );
    }
    if (typeof options?.onprogress === "function") {
      reader.addEventListener(
        "progress",
        options.onprogress as EventListener,
        progressListenerOptions,
      );
    }
    if (typeof options?.onload === "function") {
      reader.addEventListener(
        "load",
        options.onload as EventListener,
        listenerOptions,
      );
    }
    if (typeof options?.onabort === "function") {
      reader.addEventListener(
        "abort",
        options.onabort as EventListener,
        listenerOptions,
      );
    }
    if (typeof options?.ontimeout === "function") {
      reader.addEventListener(
        "timeout",
        options.ontimeout as EventListener,
        listenerOptions,
      );
    }
    if (typeof options?.onerror === "function") {
      reader.addEventListener(
        "error",
        options.onerror as EventListener,
        listenerOptions,
      );
    }
    if (typeof options?.onloadend === "function") {
      reader.addEventListener(
        "loadend",
        options.onloadend as EventListener,
        listenerOptions,
      );
    }

    const bytes = await reader.read(streamLike, {
      totalByteLength: options?.totalByteLength,
      signal: options?.signal,
    });
    return new $(bytes.buffer);
  }

  /**
   * @experimental
   * @example
   * ```javascript
   * const request = new Request("http://example.com/foo", {
   *   method: "POST",
   *   body: new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]),
   * });
   * const bytes = await ByteSequence.fromRequestOrResponse(request);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const response = new Response(blob);
   * const bytes = await ByteSequence.fromRequestOrResponse(response);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  export async function fromRequestOrResponse(
    reqOrRes: Request | Response,
    options: ByteSequence.RequestOrResponseReadingOptions = {},
  ): Promise<$> {
    if (typeof options?.verifyHeaders === "function") {
      const [verified, message] = options.verifyHeaders(reqOrRes.headers);
      if (verified !== true) {
        throw new Error(message);
      }
    }

    if (reqOrRes.bodyUsed === true) {
      throw new InvalidStateError("bodyUsed:true");
    }

    let bytes: $;
    if (reqOrRes.body) {
      bytes = await ByteSequence.fromStream(reqOrRes.body, options);
    } else {
      bytes = ByteSequence.allocate(0);
    }

    return bytes;
  }

  /**
   * @experimental
   * @example
   * ```javascript
   * const request = new Request("http://example.com/foo", {
   *   method: "POST",
   *   headers: new Headers({
   *     "Content-Type": "application/octet-stream",
   *   }),
   *   body: new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]),
   * });
   * const { data, options } = await ByteSequence.describedFromRequestOrResponse(request);
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
   * ```
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const response = new Response(blob, {
   *   headers: new Headers({
   *     "Content-Type": "application/octet-stream",
   *   }),
   * });
   * const { data, options } = await ByteSequence.describedFromRequestOrResponse(response);
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
   * ```
   */
  export async function describedFromRequestOrResponse(
    reqOrRes: Request | Response,
    options: ByteSequence.RequestOrResponseReadingOptions = {},
  ): Promise<ByteSequence.Described> {
    let mediaType: MediaType | null = null;
    try {
      mediaType = _HttpUtilsEx.extractContentType(reqOrRes.headers);
    } catch (exception) {
      void exception;
    }

    const properties = mediaType
      ? {
        type: mediaType.toString(),
      }
      : undefined;

    const data = await ByteSequence.fromRequestOrResponse(reqOrRes, options);
    return {
      data,
      options: properties,
    };
  }
}

Object.freeze(ByteSequence);

export { ByteSequence };
