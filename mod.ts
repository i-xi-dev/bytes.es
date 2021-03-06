import {
  // AbortError,
  InvalidStateError,
} from "https://raw.githubusercontent.com/i-xi-dev/exception.es/1.0.0/mod.ts";
import { Base64 } from "https://raw.githubusercontent.com/i-xi-dev/base64.es/3.0.6/mod.ts";
import { BytesFormat } from "https://raw.githubusercontent.com/i-xi-dev/bytes-format.es/1.0.5/mod.ts";
import {
  Integer,
  Uint8,
  type uint8,
} from "https://raw.githubusercontent.com/i-xi-dev/int.es/1.1.1/mod.ts";
import { Isomorphic } from "https://raw.githubusercontent.com/i-xi-dev/isomorphic.es/2.0.1/mod.ts";
import { MediaType } from "https://raw.githubusercontent.com/i-xi-dev/mimetype.es/1.1.9/mod.ts";
import { Percent } from "https://raw.githubusercontent.com/i-xi-dev/percent.es/4.0.12/mod.ts";
import {
  _Blob,
  _crypto,
  _ProgressEvent,
} from "https://raw.githubusercontent.com/i-xi-dev/compat.es/1.1.2/mod.ts";
import { StringUtils } from "https://raw.githubusercontent.com/i-xi-dev/str.es/1.0.5/mod.ts";
import { HttpUtils } from "https://raw.githubusercontent.com/i-xi-dev/http-utils.es/2.0.3/mod.ts";
import { Reading } from "https://raw.githubusercontent.com/i-xi-dev/reading.es/1.0.2/mod.ts";
import { BytesStream } from "https://raw.githubusercontent.com/i-xi-dev/bytes-stream.es/3.0.2/mod.ts";

type int = number;

/**
 * Digest algorithm
 */
interface DigestAlgorithm {
  /**
   * Computes the digest for the byte sequence.
   *
   * @param input The input to compute the digest.
   * @returns The `Promise` that fulfills with a computed digest.
   */
  compute: (input: Uint8Array) => Promise<Uint8Array>;
}

/**
 * @internal
 */
namespace _DigestImpl {
  /**
   * SHA-256 digest algorithm
   */
  export const Sha256 = Object.freeze({
    /**
     * Computes the SHA-256 digest for the byte sequence.
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await _crypto.subtle.digest("SHA-256", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha256);

  /**
   * SHA-384 digest algorithm
   */
  export const Sha384 = Object.freeze({
    /**
     * Computes the SHA-384 digest for the byte sequence.
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await _crypto.subtle.digest("SHA-384", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha384);

  /**
   * SHA-512 digest algorithm
   */
  export const Sha512 = Object.freeze({
    /**
     * Computes the SHA-512 digest for the byte sequence.
     *
     * @see {@link Algorithm.compute}
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await _crypto.subtle.digest("SHA-512", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha512);
}
Object.freeze(_DigestImpl);

const {
  ASCII_WHITESPACE,
} = HttpUtils.Pattern;

namespace _Http {
  export const Header = {
    CONTENT_ENCODING: "Content-Encoding",
    CONTENT_LANGUAGE: "Content-Language",
    CONTENT_LENGTH: "Content-Length",
    CONTENT_LOCATION: "Content-Location",
    CONTENT_TYPE: "Content-Type",
  } as const;

  export const Method = {
    CONNECT: "CONNECT",
    DELETE: "DELETE",
    GET: "GET",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    PATCH: "PATCH",
    POST: "POST",
    PUT: "PUT",
    TRACE: "TRACE",
  } as const;
}
Object.freeze(_Http);

namespace _ArrayBufferView {
  export function isTypedArrayConstructor(
    value: unknown,
  ): value is
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    | Int8ArrayConstructor
    | Uint16ArrayConstructor
    | Int16ArrayConstructor
    | Uint32ArrayConstructor
    | Int32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor
    | BigUint64ArrayConstructor
    | BigInt64ArrayConstructor {
    return ((value === Uint8Array) || (value === Uint8ClampedArray) ||
      (value === Int8Array) || (value === Uint16Array) ||
      (value === Int16Array) || (value === Uint32Array) ||
      (value === Int32Array) || (value === Float32Array) ||
      (value === Float64Array) || (value === BigUint64Array) ||
      (value === BigInt64Array));
  }

  export function isDataViewConstructor(
    value: unknown,
  ): value is DataViewConstructor {
    return value === DataView;
  }

  export type Constructor<T> = {
    new (a: ArrayBuffer, b?: number, c?: number): T;
  };
}
Object.freeze(_ArrayBufferView);

namespace _Uint8Utils {
  export function isArrayOfUint8(value: unknown): value is Array<uint8> {
    if (Array.isArray(value)) {
      return value.every((i) => Uint8.isUint8(i));
    }
    return false;
  }
}
Object.freeze(_Uint8Utils);

namespace _Iterable {
  export function toArray<T>(iterable: Iterable<T>): Array<T> {
    if (Array.isArray(iterable)) {
      return iterable as Array<T>;
    }
    if (iterable && iterable[Symbol.iterator]) {
      return [...iterable];
    }
    throw new TypeError("iterable");
  }
}
Object.freeze(_Iterable);

let _utf8TextEncoder: TextEncoder;
let _utf8TextDecoder: TextDecoder;

namespace _Utf8 {
  export function getEncoder(): TextEncoder {
    if ((_utf8TextEncoder instanceof TextEncoder) !== true) {
      _utf8TextEncoder = new TextEncoder();
    }
    return _utf8TextEncoder;
  }

  export function getDecoder(): TextDecoder {
    if ((_utf8TextDecoder instanceof TextDecoder) !== true) {
      _utf8TextDecoder = new TextDecoder("utf-8", {
        fatal: true,
        ignoreBOM: true,
      });
    }
    return _utf8TextDecoder;
  }
}
Object.freeze(_Utf8);

namespace _HttpUtilsEx {
  /**
   * Headers#get?????????????????????????????????
   * ???????????????????????????????????????","?????????????????????????????????????????????
   *
   * ????????????Headers#getAll????????????????????????????????????????????????????????????
   *  ??? Headers#get???????????????????????????????????????????????????","???????????????????????????????????????????????????????????????????????????
   *    ????????????????????????????????????????????????getAll????????????????????????
   *
   * {@link https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split} ???split?????????????????????????????????
   *
   * @param value Headers#get??????????????????
   * @returns ????????????
   */
  export function splitHeaderValue(value: string): Array<string> {
    const u0022OrU002C = "[\\u{22}\\u{2C}]+";
    const values: Array<string> = [];

    if (/[\u0022\u002C]/.test(value) !== true) {
      const trimmed = StringUtils.trim(
        value,
        HttpUtils.Pattern.HTTP_TAB_OR_SPACE,
      );
      if (trimmed.length > 0) {
        return [trimmed];
      } else {
        return [];
      }
    }

    let i = 0;
    let vEnd = false;
    let cc = 0;
    let v = "";
    while (i < value.length) {
      const collected = StringUtils.collectStart(
        value.substring(i),
        u0022OrU002C,
      );
      i = i + collected.length;
      v = v + collected;
      const remains = value.substring(i);
      if (remains.startsWith("\u0022")) {
        const result = HttpUtils.collectHttpQuotedString(remains);
        v = v + remains.substring(0, result.progression);
        i = i + result.progression;
        if (result.following === true) {
          continue;
        }
      } else {
        //  ????????? ","?????????
        i = i + 1;
        vEnd = true;
        if (remains.startsWith("\u002C")) {
          cc = cc + 1;
        }
      }

      if (vEnd === true) {
        values.push(StringUtils.trim(v, HttpUtils.Pattern.HTTP_TAB_OR_SPACE));
        v = "";
        vEnd = false;
      }
    }
    if (v !== "") {
      values.push(StringUtils.trim(v, HttpUtils.Pattern.HTTP_TAB_OR_SPACE));
    }
    if (values.length < (cc + 1)) {
      // ?????????","??????????????? //XXX ??????????????????cc?????????????????????????????????
      values.push("");
    }

    return values;
  }

  /**
   * Request?????????Response?????????????????????Content-Type??????????????????????????????
   *
   * {@link https://fetch.spec.whatwg.org/#content-type-header Fetch standard}????????????????????????
   * (await Body.blob()).type ???????????????????????????
   *
   * @param headers ????????????
   * @returns Content-Type????????????????????????MediaType??????????????????
   */
  export function extractContentType(headers: Headers): MediaType {
    // 5.
    if (headers.has("Content-Type") !== true) {
      throw new Error("Content-Type field not found");
    }

    // 4, 5.
    const typesString = headers.get("Content-Type") as string;
    const typeStrings = splitHeaderValue(typesString);
    if (typeStrings.length <= 0) {
      throw new Error("Content-Type value not found");
    }

    // 1, 2, 3.
    let textEncoding = "";
    let mediaTypeEssence = "";
    let mediaType: MediaType | null = null;
    // 6.
    for (const typeString of typeStrings) {
      try {
        // 6.1.
        const tempMediaType = MediaType.fromString(typeString);

        // 6.3.
        mediaType = tempMediaType;

        // 6.4.
        if (mediaTypeEssence !== mediaType.essence) {
          // 6.4.1.
          textEncoding = "";
          // 6.4.2.
          if (mediaType.hasParameter("charset")) {
            textEncoding = mediaType.getParameterValue("charset") as string;
          }
          // 6.4.3.
          mediaTypeEssence = mediaType.essence;
        } else {
          // 6.5.
          if (
            (mediaType.hasParameter("charset") !== true) &&
            (textEncoding !== "")
          ) {
            // TODO mediaType.withParameters()
          }
        }
      } catch (exception) {
        console.log(exception); // TODO ??????
        // 6.2. "*/*"???MediaType.fromString???????????????????????????
        continue;
      }
    }

    // 7, 8.
    if (mediaType !== null) {
      return mediaType;
    } else {
      throw new Error("extraction failure");
    }
  }

  export function createHeaders(init?: HeadersInit): HeadersInit {
    const headers = new Headers(init);

    // Content-Type
    // init.headers?????????????????????????????????????????????
    try {
      const mediaType = extractContentType(headers);
      headers.set(_Http.Header.CONTENT_TYPE, mediaType.toString());
    } catch (exception) {
      void exception;
      headers.delete(_Http.Header.CONTENT_TYPE);
    }

    // Content-Length
    // ???????????????

    return [...headers.entries()]; // Node.js??? HeadersInit???Headers??????????????????
  }
}
Object.freeze(_HttpUtilsEx);

namespace _DataURL {
  export function parse(dataUrl: URL | string): {
    data: Uint8Array;
    type: string;
  } {
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
    // https://fetch.spec.whatwg.org/#data-urls ?????????????????????????????????????????????
    parsed.hash = "";

    // 3, 4
    let bodyStringWork = parsed.toString().substring(5);

    // 5, 6, 7
    if (bodyStringWork.includes(",") !== true) {
      throw new TypeError("U+002C not found");
    }

    // ?????????????????????","???????????????????????????????????????????????????????????????
    // https://fetch.spec.whatwg.org/#data-urls ?????????
    // ???????????????????????????quoted???????????????????????????????????????","??????????????????????????????????????????????????????
    // ?????????????????????????????????????????????
    const mediaTypeOriginal = bodyStringWork.split(",")[0] as string;
    let mediaTypeStr = StringUtils.trim(mediaTypeOriginal, ASCII_WHITESPACE);

    // 8, 9
    bodyStringWork = bodyStringWork.substring(mediaTypeOriginal.length + 1);

    // 10
    let bytes = Percent.decode(bodyStringWork);

    // 11
    const base64Indicator = /;[\u0020]*base64$/i;
    const base64: boolean = base64Indicator.test(mediaTypeStr);
    if (base64 === true) {
      // 11.1
      bodyStringWork = Isomorphic.decode(bytes);

      // 11.2, 11.3
      bytes = Base64.decode(bodyStringWork);

      // 11.4, 11.5, 11.6
      mediaTypeStr = mediaTypeStr.replace(base64Indicator, "");
    }

    return {
      data: bytes,
      type: mediaTypeStr,
    };
  }
}

const ByteUnit = {
  B: "B",
  KB: "kB",
  KIB: "KiB",
  MB: "MB",
  MIB: "MiB",
  GB: "GB",
  GIB: "GiB",
  TB: "TB",
  TIB: "TiB",
  PB: "PB",
  PIB: "PiB",
  // EB: "EB",
  // EIB: "EiB",
  // ZB: "ZB",
  // ZIB: "ZiB",
  // YB: "YB",
  // YIB: "YiB",
} as const;
type ByteUnit = typeof ByteUnit[keyof typeof ByteUnit];

const _BYTES: Record<ByteUnit, int> = {
  [ByteUnit.B]: 1,
  [ByteUnit.KB]: 1_000, // 10 ** 3
  [ByteUnit.MB]: 1_000_000, // 10 ** 6
  [ByteUnit.GB]: 1_000_000_000, // 10 ** 9
  [ByteUnit.TB]: 1_000_000_000_000, // 10 ** 12
  [ByteUnit.PB]: 1_000_000_000_000_000, // 10 ** 15
  // [ByteUnit.EB]: 1_000_000_000_000_000_000n, // 10 ** 18
  // [ByteUnit.ZB]: 1_000_000_000_000_000_000_000n, // 10 ** 21
  // [ByteUnit.YB]: 1_000_000_000_000_000_000_000_000n, // 10 ** 24
  [ByteUnit.KIB]: 1_024, // 2 ** 10
  [ByteUnit.MIB]: 1_048_576, // 2 ** 20
  [ByteUnit.GIB]: 1_073_741_824, // 2 ** 30
  [ByteUnit.TIB]: 1_099_511_627_776, // 2 ** 40
  [ByteUnit.PIB]: 1_125_899_906_842_624, // 2 ** 50
  // [ByteUnit.EIB]: 1_152_921_504_606_846_976n, // 2 ** 60
  // [ByteUnit.ZIB]: 1_180_591_620_717_411_303_424n, // 2 ** 70
  // [ByteUnit.YIB]: 1_208_925_819_614_629_174_706_176n, // 2 ** 80
} as const;

class ByteCount {
  #byteCount: int;

  constructor(byteCount: int) {
    this.#byteCount = byteCount;
    Object.freeze(this);
  }

  // static of(value: number, unit: string = ByteUnit.B): ByteCount {
  //   return new ByteCount(Math.ceil(value * _BYTES[unit]));
  // }

  to(unit: string): number {
    if (typeof unit !== "string") {
      throw new TypeError("unit is not type of string");
    }

    const lowerUnit = unit.toLowerCase();
    const found = Object.values(ByteUnit).find(u => u.toLowerCase() === lowerUnit);
    if (found) {
      return this.#byteCount / _BYTES[found];
    }
    throw new RangeError("unknown unit");
  }

  valueOf(): int {
    return this.#byteCount;
  }
}
Object.freeze(ByteCount);

/**
 * Byte sequence
 */
class ByteSequence {
  /**
   * ????????????
   */
  #buffer: ArrayBuffer;

  /**
   * ????????????????????????
   */
  #view: Uint8Array;

  // ArrayBuffer?????????????????????????????????????????????
  // ??????????????????ArrayBuffer????????????????????????????????????????????????
  //TODO private
  /**
   * @param bytes - An `ArrayBuffer` object.
   */
  private constructor(bytes: ArrayBuffer) {
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
   * //   ??? 1024
   * ```
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const byteCount = bytes.byteLength;
   * // byteCount
   * //   ??? 8
   * ```
   */
  get byteLength(): number {
    return this.#buffer.byteLength;
  }

  /**
   * Gets the number of bytes as `ByteCount`.
   * 
   * | parameter of `ByteCount.prototype.to()` | unit |
   * | :--- | :--- |
   * | `"B"` | byte |
   * | `"kB"` | kilobyte |
   * | `"KiB"` | kibibyte |
   * | `"MB"` | megabyte |
   * | `"MiB"` | mebibyte |
   * | `"GB"` | gigabyte |
   * | `"GiB"` | gibibyte |
   * | `"TB"` | terabyte |
   * | `"TiB"` | tebibyte |
   * | `"PB"` | petabyte |
   * | `"PiB"` | pebibyte |
   * 
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(1024);
   * const kib = bytes.size.to("KiB");
   * // kib
   * //   ??? 1
   * ```
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(5_120_000);
   * const kib = bytes.size.to("KiB");
   * // (new Intl.NumberFormat("en")).format(kib) + " KiB"
   * //   ??? "5,000 KiB"
   * ```
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(5_000_000);
   * const kb = bytes.size.to("kB");
   * // (new Intl.NumberFormat("en", { style: "unit", unit: "kilobyte" })).format(kb)
   * //   ??? "5,000 kB"
   * ```
   */
  get size(): ByteCount {
    return new ByteCount(this.#buffer.byteLength);
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
   * //   ??? Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   *
   * // new Uint8Array(bytes.buffer)
   * //   ??? Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * //   ??? "sha256-4pSrnUKfmpomeNmW5dvUDL9iNjpe1Bf2VMXwuoYeQgA="
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
   * Creates a new instance of `ByteSequence` of the specified size.
   * Its bytes are filled with zeros.
   *
   * @param byteLength - The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(1024);
   * // bytes.byteLength
   * //   ??? 1024
   * ```
   */
  static allocate(byteLength: number): ByteSequence {
    if (Integer.isNonNegativeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    return new ByteSequence(new ArrayBuffer(byteLength));
  }

  /**
   * Creates a new instance of `ByteSequence` with the specified underlying `ArrayBuffer`.
   *
   * @param buffer - The `ArrayBuffer`.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `buffer` is not type of `ArrayBuffer`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.wrapArrayBuffer(srcBuffer);
   * const srcBufferRef = bytes.buffer;
   * // (srcBufferRef === srcBuffer)
   * //   ??? true
   * ```
   */
  static wrapArrayBuffer(buffer: ArrayBuffer): ByteSequence {
    if (buffer instanceof ArrayBuffer) {
      return new ByteSequence(buffer);
    }
    throw new TypeError("buffer");
  }

  // TODO byteOffset
  // TODO byteLength
  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the specified `ArrayBuffer`.
   *
   * @param buffer - The `ArrayBuffer`.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `buffer` is not type of `ArrayBuffer`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.fromArrayBuffer(srcBuffer);
   * const dstBuffer = bytes.buffer;
   * // (dstBuffer === srcBuffer)
   * //   ??? false
   * ```
   */
  static fromArrayBuffer(buffer: ArrayBuffer): ByteSequence {
    if (buffer instanceof ArrayBuffer) {
      return new ByteSequence(buffer.slice(0));
    }
    throw new TypeError("buffer");
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
   * //   ??? Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   *
   * const srcView = new Uint8Array(bytes.buffer);
   * // srcView
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  toArrayBuffer(): ArrayBuffer {
    return this.#buffer.slice(0);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the underlying `ArrayBuffer` of the specified [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView).
   *
   * @param bufferView - The object that represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferView` is not type of `ArrayBufferView`.
   * @example
   * ```javascript
   * const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const bytes = ByteSequence.fromArrayBufferView(uint8Array);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const buffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const dataView = new DataView(buffer);
   * const bytes = ByteSequence.fromArrayBufferView(dataView);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromArrayBufferView(bufferView: ArrayBufferView): ByteSequence {
    if (ArrayBuffer.isView(bufferView)) {
      const buffer = bufferView.buffer.slice(
        bufferView.byteOffset,
        bufferView.byteOffset + bufferView.byteLength,
      );
      return new ByteSequence(buffer);
    }
    throw new TypeError("bufferView");
  }

  /**
   * Returns the [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @param ctor - The `ArrayBufferView`s constructor.
   *    The default is `Uint8Array`.
   * @returns The `ArrayBufferView`.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const uint8Array = bytes.toArrayBufferView(Uint8ClampedArray);
   * // uint8Array
   * //   ??? Uint8ClampedArray[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   *
   * uint8Array.fill(0);
   * // uint8Array
   * //   ??? Uint8ClampedArray[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
   *
   * // bytes.toArrayBufferView(Uint8ClampedArray)
   * //   ??? Uint8ClampedArray[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * Returns the `Uint8Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Uint8Array`.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const uint8Array = bytes.toUint8Array();
   * // uint8Array
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * uint8Array.fill(0);
   * // uint8Array
   * //   ??? Uint8Array[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
   *
   * // bytes.toUint8Array()
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   *
   * dataView.setUint8(0, 0);
   * dataView.setUint8(1, 0);
   * dataView.setUint8(2, 0);
   * dataView.setUint8(3, 0);
   * // new Uint8Array(dataView.buffer)
   * //   ??? Uint8Array[ 0, 0, 0, 0, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   *
   * // new Uint8Array(bytes.toDataView().buffer)
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  toDataView(): DataView {
    return this.toArrayBufferView(DataView);
  }

  // TODO byteOffset
  // TODO byteLength
  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the underlying `ArrayBuffer` of the specified [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource).
   *
   * @param bufferSource - The object that represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferSource` is not type of `BufferSource`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.fromBufferSource(srcBuffer);
   * const dstBuffer = bytes.buffer;
   * // (dstBuffer === srcBuffer)
   * //   ??? false
   * // new Uint8Array(dstBuffer)
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const bytes = ByteSequence.fromBufferSource(uint8Array);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromBufferSource(bufferSource: BufferSource): ByteSequence {
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
   * @param byteArray - The 8-bit unsigned integer `Array` represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteArray` is not an 8-bit unsigned integer `Array`.
   * @example
   * ```javascript
   * const array = [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ];
   * const bytes = ByteSequence.fromArray(array);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromArray(byteArray: Array<number>): ByteSequence {
    if (_Uint8Utils.isArrayOfUint8(byteArray)) {
      return ByteSequence.fromArrayBufferView(Uint8Array.from(byteArray));
    }
    throw new TypeError("byteArray");
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
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  toArray(): Array<number> {
    return [...this.#view] as Array<uint8>;
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified `ByteSequence`, `BufferSource`, or 8-bit unsigned integer `Array`.
   *
   * @param sourceBytes - The `Bytes` object represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferSource` is not type of `Bytes`.
   */
  static from(sourceBytes: Bytes): ByteSequence {
    if (sourceBytes instanceof ByteSequence) {
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
   * @param bytes - The iterator of 8-bit unsigned integers.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bytes` is not an 8-bit unsigned integer iterator.
   */
  static of(...bytes: Array<number>): ByteSequence {
    return ByteSequence.fromArray(bytes);
  }

  /**
   * Creates a new instance of `ByteSequence` of the specified size.
   * Its bytes are filled with random values.
   *
   * @param byteLength - The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   * @throws {RangeError} The `byteLength` is greater than 65536.
   * @example
   * ```javascript
   * const randomBytes = ByteSequence.generateRandom(1024);
   * // randomBytes.byteLength
   * //   ??? 1024
   * ```
   */
  static generateRandom(byteLength: number): ByteSequence {
    if (Integer.isNonNegativeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    if (byteLength > 65536) { // XXX ??????????????????????????????
      throw new RangeError("byteLength");
    }

    const randomBytes = _crypto.getRandomValues(new Uint8Array(byteLength));
    return new ByteSequence(randomBytes.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the [isomorphic encoded](https://infra.spec.whatwg.org/#isomorphic-encode) string.
   *
   * @param binaryString - The [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary).
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromBinaryString("????\u{8C}????????????");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromBinaryString(binaryString: string): ByteSequence {
    const bytes = Isomorphic.encode(binaryString);
    return new ByteSequence(bytes.buffer);
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
   * //   ??? "????\u{8C}????????????"
   * ```
   */
  toBinaryString(): string {
    return Isomorphic.decode(this.#buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains formatted bytes.
   *
   * @param formattedBytes - The string to parse.
   * @param options - The `BytesFormat.Options` dictionary.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   * @throws {TypeError} The `formattedBytes` contains the character sequence that does not match the specified format.
   * @example
   * ```javascript
   * const bytes = ByteSequence.parse("E5AF8CE5A3ABE5B1B1");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const options = {
   *   lowerCase: true,
   * };
   * const bytes = ByteSequence.parse("e5af8ce5a3abe5b1b1", options);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static parse(
    formattedBytes: string,
    options?: BytesFormat.Options,
  ): ByteSequence {
    const parsed = BytesFormat.parse(formattedBytes, options);
    return new ByteSequence(parsed.buffer);
  }

  /**
   * Returns the string contains formatted bytes.
   *
   * @param options - The `BytesFormat.Options` dictionary.
   * @returns The string contains formatted bytes.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const str = bytes.format();
   * // str
   * //   ??? "E5AF8CE5A3ABE5B1B1"
   * ```
   * @example
   * ```javascript
   * const options = {
   *   lowerCase: true,
   * };
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const str = bytes.format(options);
   * // str
   * //   ??? "e5af8ce5a3abe5b1b1"
   * ```
   */
  format(options?: BytesFormat.Options): string {
    return BytesFormat.format(this.#view, options);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Base64-encoded bytes.
   *
   * @param base64Encoded - The string to decode.
   * @param options - The [`Base64.Options`](https://i-xi-dev.github.io/base64.es/modules/Base64.html#Options-1) dictionary.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromBase64Encoded("5a+M5aOr5bGx");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromBase64Encoded(
    base64Encoded: string,
    options?: Base64.Options,
  ): ByteSequence {
    const decoded = Base64.decode(base64Encoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * Returns the string contains Base64-encoded bytes of this byte sequence.
   *
   * @param options - The [`Base64.Options`](https://i-xi-dev.github.io/base64.es/modules/Base64.html#Options-1) dictionary.
   * @returns The string contains Base64-encoded bytes.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const encoded = bytes.toBase64Encoded();
   * // encoded
   * //   ??? "5a+M5aOr5bGx"
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
   * //   ??? "5a-M5aOr5bGx"
   * ```
   */
  toBase64Encoded(options?: Base64.Options): string {
    return Base64.encode(this.#view, options);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Percent-encoded bytes.
   *
   * @param percentEncoded - The string to decode.
   * @param options - The `Percent.Options` dictionary.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromPercentEncoded("%E5%AF%8C%E5%A3%AB%E5%B1%B1");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * // URL component decoding
   *
   * const urlComponent = {
   *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
   * };
   * const bytes = ByteSequence.fromPercentEncoded("%E5%AF%8C%E5%A3%AB%E5%B1%B1", urlComponent);
   * // bytes.toText()
   * //   ??? "?????????"
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
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // bytes.toText()
   * //   ??? "?????????"
   * ```
   */
  static fromPercentEncoded(
    percentEncoded: string,
    options?: Percent.Options,
  ): ByteSequence {
    const decoded = Percent.decode(percentEncoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * Returns the string contains Percent-encoded bytes of this byte sequence.
   *
   * @param options - The `Percent.Options` dictionary.
   * @returns The string contains Percent-encoded bytes.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const encoded = bytes.toPercentEncoded();
   * // encoded
   * //   ??? "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
   * ```
   * @example
   * ```javascript
   * // URL component encoding
   *
   * const urlComponent = {
   *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
   * };
   * const bytes = ByteSequence.fromText("?????????");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * const encoded = bytes.toPercentEncoded(urlComponent);
   * // encoded
   * //   ??? "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
   * ```
   * @example
   * ```javascript
   * // encoding for the value of application/x-www-form-urlencoded
   *
   * const formUrlEnc = {
   *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
   *   spaceAsPlus: true,
   * };
   * const bytes = ByteSequence.fromText("?????????");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * const encoded = bytes.toPercentEncoded(formUrlEnc);
   * // encoded
   * //   ??? "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
   * ```
   */
  toPercentEncoded(options?: Percent.Options): string {
    return Percent.encode(this.#view, options);
  }

  /**
   * Computes the digest for this byte sequence.
   *
   * @param algorithm - The digest algorithm.
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
   * //   ??? "52A6AD27415BD86EC64B57EFBEA27F98"
   * ```
   */
  async toDigest(
    algorithm: DigestAlgorithm,
  ): Promise<ByteSequence> {
    const digest = await algorithm.compute(this.#view);
    return new ByteSequence(digest.buffer);
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
   * //   ??? "E294AB9D429F9A9A2678D996E5DBD40CBF62363A5ED417F654C5F0BA861E4200"
   * ```
   */
  toSha256Digest(): Promise<ByteSequence> {
    return this.toDigest(_DigestImpl.Sha256);
  }

  /**
   * Computes the SHA-384 digest for this byte sequence.
   *
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-384 digest.
   */
  toSha384Digest(): Promise<ByteSequence> {
    return this.toDigest(_DigestImpl.Sha384);
  }

  /**
   * Computes the SHA-512 digest for this byte sequence.
   *
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-512 digest.
   */
  toSha512Digest(): Promise<ByteSequence> {
    return this.toDigest(_DigestImpl.Sha512);
  }

  /**
   * Computes the SRI integrity (Base64-encoded digest).
   *
   * @param algorithm - The digest algorithm.
   * @returns The `Promise` that fulfills with a SRI integrity (base64-encoded digest).
   * @see [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
   */
  async #integrity(
    algorithm: DigestAlgorithm,
    prefix: string,
  ): Promise<string> {
    // algorithm???2021-12?????????SHA-256,SHA-384,SHA-512????????????
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
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * generated from the specified string by the specified text encoding.
   *
   * @param text - The string.
   * @param encoder - The text encoder, for example `TextEncoder`.
   *    The default is UTF-8 encoder, which does not add or remove BOM.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromText("?????????");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
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
   * const bytes = ByteSequence.fromText("?????????", eucJp);
   * // bytes.toArray()
   * //   ??? [ 0xC9, 0xD9, 0xBB, 0xCE, 0xBB, 0xB3 ]
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
   * const bytes = ByteSequence.fromText("?????????", utf8);
   * // bytes.toArray()
   * //   ??? [ 0xEF, 0xBB, 0xBF, 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromText( //encodeFromText
    text: string,
    encoder: { encode: (input?: string) => Uint8Array } = _Utf8.getEncoder(),
  ): ByteSequence {
    const encoded = encoder.encode(text);
    if (encoder instanceof TextEncoder) {
      return new ByteSequence(encoded.buffer);
    }
    // Node.js???Buffer???????????????????????????????????????????????????
    return ByteSequence.fromArrayBufferView(encoded);
  }

  /**
   * Returns a decoded string by the specified text encoding of this bytes.
   *
   * @param decoder - The text decoder, for example `TextDecoder`.
   *    The default is UTF-8 decoder, which does not add or remove BOM.
   * @returns A string decoded in the specified text encoding.
   * @throws TODO ??????????????????????????????
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const text = bytes.toText();
   * // text
   * //   ??? "?????????"
   * ```
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
   * const text = bytes.toText(eucJp);
   * // text
   * //   ??? "?????????"
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
   * const text = bytes.toText(utf8);
   * // text
   * //   ??? "?????????"
   * ```
   */
  toText( //decodeToText
    decoder: { decode: (input?: Uint8Array) => string } = _Utf8.getDecoder(),
  ): string {
    return decoder.decode(this.#view);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
   *
   * @experimental
   * @param blob - The `Blob` object (including `File` object).
   * @returns The `Promise` that fulfills with a new `ByteSequence` object.
   * @throws {Error} `blob.arrayBuffer()` is failed.
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const bytes = await ByteSequence.fromBlob(blob);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const file = new File([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ], "samp.dat");
   * const bytes = await ByteSequence.fromBlob(file);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static async fromBlob(blob: Blob): Promise<ByteSequence> {
    try {
      const buffer = await blob.arrayBuffer(); // TODO Node.js??????stream()??????????????????????????????????????????stream??????????????????
      return ByteSequence.wrapArrayBuffer(buffer);
    } catch (exception) {
      void exception;
      // Blob#arrayBuffer?????? NotFoundError | SecurityError | NotReadableError

      // XXX throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  /**
   * Returns the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object representing this byte sequence.
   *
   * @param options - The [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag) object, but `endings` property is ignored.
   * @returns The `Blob` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const blob = bytes.toBlob({ type: "application/octet-stream" });
   * // new Uint8Array(await blob.arrayBuffer())
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // blob.type
   * //   ??? "application/octet-stream"
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
   * @param fileName - The file name.
   * @param options - The `FilePropertyBag` object, but `endings` property is ignored.
   * @returns The `File` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const file = bytes.toFile("samp.dat", {
   *   type: "application/octet-stream",
   *   lastModified: 1640995200000,
   * });
   * // new Uint8Array(await file.arrayBuffer())
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // file.name
   * //   ??? "samp.dat"
   * // file.type
   * //   ??? "application/octet-stream"
   * // file.lastModified
   * //   ??? 1640995200000
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
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   *
   * @see [https://fetch.spec.whatwg.org/#data-urls](https://fetch.spec.whatwg.org/#data-urls)
   * @param dataUrl - The data URL.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `dataUrl` parsing is failed.
   * @throws {TypeError} The URL scheme of the `dataUrl` is not "data".
   * @throws {TypeError} The `dataUrl` does not contain `","`.
   * @example
   * ```javascript
   * const bytes = await ByteSequence.fromDataURL("data:application/octet-stream;base64,5a+M5aOr5bGx");
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromDataURL(dataUrl: URL | string): ByteSequence {
    const { data } = _DataURL.parse(dataUrl);
    return new ByteSequence(data.buffer);
  }

  /**
   * Returns the [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) representing this byte sequence.
   *
   * @param options - The [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag) object, but `endings` property is ignored.
   * @returns The [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   * @throws {TypeError}
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const dataUrl = bytes.toDataURL({ type: "application/octet-stream" });
   * // dataUrl.toString()
   * //   ??? "data:application/octet-stream;base64,5a+M5aOr5bGx"
   * ```
   */
  toDataURL(options?: BlobPropertyBag): URL {
    // FileReader??????????????????????????????????????????????????????????????????Base64???????????????????????????
    // XXX Base64?????????????????????
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
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of `Uint8Array`.
   *
   * If you want to read [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) of [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer), you can use [`stream.Readable.toWeb`](https://nodejs.org/dist/latest-v17.x/docs/api/stream.html#streamreadabletowebstreamreadable) method (Node.js 17.0.0+)
   *
   * @experimental
   * @param source - The `ReadableStream` of `Uint8Array` or the async iterator of `Uint8Array`.
   * @param options - The `BytesStream.ReadingOptions` object.
   * @param onProgressChange - The `ProgressEvent` listener.
   *    | `type` | x |
   *    | :--- | :--- |
   *    | `"loadstart"`, `"progress"`, `"loadend"` | These will be fired. |
   *    | `"load"` | This will not fire. Instead, the `Promise` is resolved. |
   *    | `"abort"`, `"timeout"`, `"error"` | These will not fire. Instead, the `Promise` is rejected. |
   * @returns The `Promise` that fulfills with a new `ByteSequence` object.
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const stream = blob.stream();
   * const bytes = await ByteSequence.fromStream(stream);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static async fromStream(
    source: BytesStream.Source,
    options?: Reading.Options,
    onProgressChange?: (event: ProgressEvent) => void,
  ): Promise<ByteSequence> {
    const task = BytesStream.ReadingTask.create(source, options);

    if (typeof onProgressChange === "function") {
      const listenerOptions = {
        once: true,
        passive: true,
      };
      const progressListenerOptions = {
        passive: true,
      };

      task.addEventListener(
        "loadstart",
        onProgressChange as EventListener,
        listenerOptions,
      );
      task.addEventListener(
        "progress",
        onProgressChange as EventListener,
        progressListenerOptions,
      );
      // "load"????????????resolve????????????????????????????????????
      // "abort"????????????reason???AbortError???reject??????????????????????????????????????????
      // "timeout"???AbortSignal.timeout????????????????????????????????????
      // "error"????????????reason???AbortError?????????reject??????????????????????????????????????????
      task.addEventListener(
        "loadend",
        onProgressChange as EventListener,
        listenerOptions,
      );
    }

    const bytes = await task.run();
    return new ByteSequence(bytes.buffer);
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
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ]);
   * const response = new Response(blob);
   * const bytes = await ByteSequence.fromRequestOrResponse(response);
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static async fromRequestOrResponse(
    reqOrRes: Request | Response,
    options: RequestOrResponseReadingOptions = {},
  ): Promise<ByteSequence> {
    if (typeof options?.verifyHeaders === "function") {
      const [verified, message] = options.verifyHeaders(reqOrRes.headers);
      if (verified !== true) {
        throw new Error(message);
      }
    }

    if (reqOrRes.bodyUsed === true) {
      throw new InvalidStateError("bodyUsed:true");
    }

    let bytes: ByteSequence;
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
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const request = bytes.toRequest("http://example.com/foo", {
   *   method: "POST",
   *   headers: new Headers({
   *     "Content-Type": "application/octet-stream",
   *   }),
   * });
   * // new Uint8Array(await request.arrayBuffer())
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // request.headers.get("Content-Type")
   * //   ??? "application/octet-stream"
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
      body: this.#buffer, // options.body????????????????????????????????????
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
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // response.headers.get("Content-Type")
   * //   ??? "application/octet-stream"
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
   * //   ??? Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   *
   * // bytes.toArray()
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  duplicate(): ByteSequence {
    return new ByteSequence(this.toArrayBuffer());
  }

  /**
   * Returns a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * duplicated from a subsequence of the underlying `ArrayBuffer` of this instance.
   *
   * @param start - The subsequence start index.
   * @param end - The subsequence end index.
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
   * //   ??? Uint8Array[ 0x0, 0xB1, 0xB1 ]
   *
   * // bytes.toArray()
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  subsequence(start: number, end?: number): ByteSequence {
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

    return new ByteSequence(this.#buffer.slice(start, end));
  }

  /**
   * Returns a new iterator that contains byte sequences divided by the specified length.
   *
   * @param segmentByteLength - The segment length, in bytes.
   * @returns A new iterator.
   * @throws {TypeError} The `segmentByteLength` is not non-negative integer.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const subsequenceClones = [ ...bytes.segment(3) ];
   * // subsequenceClones[0]
   * //   ??? Uint8Array[ 0xE5, 0xAF, 0x8C ]
   * // subsequenceClones[1]
   * //   ??? Uint8Array[ 0xE5, 0xA3, 0xAB ]
   * // subsequenceClones[2]
   * //   ??? Uint8Array[ 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  segment(segmentByteLength: number): IterableIterator<ByteSequence> {
    if (Integer.isPositiveInteger(segmentByteLength) !== true) {
      throw new TypeError("segmentByteLength");
    }

    return (function* (
      bytes: ByteSequence,
    ): Generator<ByteSequence, void, void> {
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
   * Returns the `ArrayBufferView` that views the underlying `ArrayBuffer` of this instance.
   *
   * @param ctor - The constructor of `ArrayBufferView`.
   *    The default is `Uint8Array`.
   * @param byteOffset - The offset, in bytes.
   * @param byteLength - The length of the `ArrayBufferView`, in bytes.
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
   * //   ??? Uint8Array[ 0xE5, 0xB1, 0xB1 ]
   *
   * uint8ViewPart.fill(0);
   *
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
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
   * Returns the `Uint8Array` that views the underlying `ArrayBuffer` of this instance.
   *
   * @param byteOffset - The offset, in bytes.
   * @param byteLength - The length of the `ArrayBufferView`, in bytes.
   * @returns The `Uint8Array`.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const uint8ViewPart = bytes.getUint8View(6, 3);
   * // uint8ViewPart
   * //   ??? Uint8Array[ 0xE5, 0xB1, 0xB1 ]
   *
   * uint8ViewPart.fill(0);
   *
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
   * ```
   */
  getUint8View(byteOffset?: number, byteLength?: number): Uint8Array {
    return this.getView(Uint8Array, byteOffset, byteLength);
  }

  /**
   * Returns the `DataView` that views the underlying `ArrayBuffer` of this instance.
   *
   * @param byteOffset - The offset, in bytes.
   * @param byteLength - The length of the `ArrayBufferView`, in bytes.
   * @returns The `DataView`.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const dataViewPart = bytes.getDataView(6, 3);
   * // dataViewPart
   * //   ??? Uint8Array[ 0xE5, 0xB1, 0xB1 ]
   *
   * dataViewPart.setUint8(0, 0);
   * dataViewPart.setUint8(1, 0);
   * dataViewPart.setUint8(2, 0);
   *
   * // bytes.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
   * ```
   */
  getDataView(byteOffset?: number, byteLength?: number): DataView {
    return this.getView(DataView, byteOffset, byteLength);
  }

  /**
   * ?????????????????????????????????????????????????????????????????????????????????????????????????????????
   *
   * @param otherBytes - ????????????
   * @returns ????????????????????????????????????????????????????????????????????????????????????????????????
   */
  #startsWith(otherBytes: BufferSource | Array<uint8>): boolean {
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
   * @param otherBytes - The object that represents a byte sequence.
   * @returns If this is equal to the specified byte sequence, `true`; otherwise, `false`.
   * @throws {TypeError} The `otherBytes` is not type of `Bytes`.
   */
  equals(otherBytes: Bytes): boolean {
    if (otherBytes instanceof ByteSequence) {
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
   * @param otherBytes - The object that represents a byte sequence.
   * @returns If this starts with the specified byte sequence, `true`; otherwise, `false`.
   * @throws {TypeError} The `otherBytes` is not type of `Bytes`.
   */
  startsWith(otherBytes: Bytes): boolean {
    if (otherBytes instanceof ByteSequence) {
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

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
   *
   * @experimental
   * @param blob - The `Blob` object (including `File` object).
   * @returns The `Promise` that fulfills with a new `ByteSequence` and a [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag).
   * @throws {Error} `blob.arrayBuffer()` is failed.
   * @throws {TypeError} `blob.type` parsing is failed.
   * @example
   * ```javascript
   * const blob = new Blob([ Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1) ], { type: "application/octet-stream" });
   * const { data, options } = await ByteSequence.describedFromBlob(blob);
   * // data.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   ??? "application/octet-stream"
   * ```
   */
  static async withMetadataFromBlob(
    blob: Blob,
  ): Promise<{
    data: ByteSequence;
    options?: BlobPropertyBag | FilePropertyBag;
    fileName?: string;
  }> {
    const data = await ByteSequence.fromBlob(blob);
    // try {
    let mediaType: MediaType | null = null;
    if (blob.type) {
      mediaType = MediaType.fromString(blob.type); // ?????????????????????????????????????????????
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

    return Object.freeze({
      data,
      options,
      fileName,
    });
    // }
    // catch (exception) {
    //   // MediaType??????????????????

    //   // XXX throw new Error("reading failed", { cause: exception });
    //   throw exception;
    // }
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   *
   * @experimental
   * @see [https://fetch.spec.whatwg.org/#data-urls](https://fetch.spec.whatwg.org/#data-urls)
   * @param dataUrl - The data URL.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `dataUrl` parsing is failed.
   * @throws {TypeError} The URL scheme of the `dataUrl` is not "data".
   * @throws {TypeError} The `dataUrl` does not contain `","`.
   * @example
   * ```javascript
   * const { data, options } = await ByteSequence.describedFromDataURL("data:application/octet-stream;base64,5a+M5aOr5bGx");
   * // data.toArray()
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   ??? "application/octet-stream"
   * ```
   */
  static withMetadataFromDataURL(
    dataUrl: URL | string,
  ): {
    data: ByteSequence;
    options?: BlobPropertyBag | FilePropertyBag;
    //fileName?: string
  } {
    const { data, type } = _DataURL.parse(dataUrl);
    let mediaTypeWork = type;

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
      data: ByteSequence.wrapArrayBuffer(data.buffer),
      options: {
        type: mediaType.toString(),
      },
    };
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
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   ??? "application/octet-stream"
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
   * //   ??? [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   ??? "application/octet-stream"
   * ```
   */
  static async withMetadataFromRequestOrResponse(
    reqOrRes: Request | Response,
    options: RequestOrResponseReadingOptions = {},
  ): Promise<{
    data: ByteSequence;
    options?: BlobPropertyBag | FilePropertyBag;
    fileName?: string;
  }> {
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
      //TODO fileName content-disposition?????????????????????
    };
  }
}
Object.freeze(ByteSequence);

type BytesSource = Iterable<number>;

// /**
//  * @experimental
//  */
//   type AsyncBytesSource = AsyncIterable<number>;

/**
 * A typedef that representing a `ByteSequence`, [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource), or `Iterable` of 8-bit unsigned integers.
 */
type Bytes = ByteSequence | BufferSource | BytesSource;

/**
 * @experimental
 */
type RequestOrResponseReadingOptions = Reading.Options & {
  // TODO verifyContentType

  verifyHeaders?: (headers: Headers) => [verified: boolean, message?: string];
};

export { ByteSequence };
