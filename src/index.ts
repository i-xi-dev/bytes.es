//

import {
  type int,
  type uint8,
  Byte,
  Http,
  HttpUtils,
  Integer,
  InvalidStateError,
  IsomorphicEncoding,
  StringUtils,
} from "@i-xi-dev/fundamental";
import { Base64 } from "@i-xi-dev/base64";
import { Percent } from "@i-xi-dev/percent";
import { MediaType } from "@i-xi-dev/mimetype";
import { ByteStream } from "./byte_stream";

namespace _Uint8Utils {
  export function isArrayOfUint8(value: unknown): value is Array<uint8> {
    if (Array.isArray(value)) {
      return value.every((i) => Byte.isUint8(i));
    }
    return false;
  }
}
Object.freeze(_Uint8Utils);

namespace _DigestImpl {
  /**
   * SHA-256 digest algorithm
   */
  export const Sha256: ByteSequence.DigestAlgorithm = Object.freeze({
    /**
     * Computes the SHA-256 digest for the byte sequence.
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await globalThis.crypto.subtle.digest("SHA-256", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha256);

  /**
   * SHA-384 digest algorithm
   */
  export const Sha384: ByteSequence.DigestAlgorithm = Object.freeze({
    /**
     * Computes the SHA-384 digest for the byte sequence.
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await globalThis.crypto.subtle.digest("SHA-384", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha384);

  /**
   * SHA-512 digest algorithm
   */
  export const Sha512: ByteSequence.DigestAlgorithm = Object.freeze({
    /**
     * Computes the SHA-512 digest for the byte sequence.
     * 
     * @see {@link Algorithm.compute}
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await globalThis.crypto.subtle.digest("SHA-512", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha512);
}
Object.freeze(_DigestImpl);

const {
  ASCII_WHITESPACE,
} = HttpUtils.CodePointRange;

const utf8TextEncoder = new TextEncoder();

const utf8TextDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

function _isTypedArrayConstructor(value: unknown): value is (Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor | BigUint64ArrayConstructor | BigInt64ArrayConstructor) {
  return ((value === Uint8Array) || (value === Uint8ClampedArray) || (value === Int8Array) || (value === Uint16Array) || (value === Int16Array) || (value === Uint32Array) || (value === Int32Array) || (value === Float32Array) || (value === Float64Array) || (value === BigUint64Array) || (value === BigInt64Array));
}

function _isDataViewConstructor(value: unknown): value is DataViewConstructor {
  return value === DataView;
}

type ArrayBufferViewConstructor<T> = { new(a: ArrayBuffer, b?: number, c?: number): T };

function _iterableToArray<T>(iterable: Iterable<T>): Array<T> {
  if (Array.isArray(iterable)) {
    return iterable as Array<T>;
  }
  if (iterable && iterable[Symbol.iterator]) {
    return [ ...iterable ];
  }
  throw new TypeError("iterable");
}

/**
 * RequestまたはResponseのヘッダーからContent-Typeの値を取得し返却する
 * 
 * {@link https://fetch.spec.whatwg.org/#content-type-header Fetch standard}の仕様に合わせた
 * (await Body.blob()).type と同じになるはず？
 * 
 * @param headers ヘッダー
 * @returns Content-Typeの値から生成したMediaTypeインスタンス
 */
export function _extractContentType(headers: Headers): MediaType {
  // 5.
  if (headers.has("Content-Type") !== true) {
    throw new Error("Content-Type field not found");
  }

  // 4, 5.
  const typesString = headers.get("Content-Type") as string;
  const typeStrings = HttpUtils.splitHeaderValue(typesString);
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
      }
      else {
        // 6.5.
        if ((mediaType.hasParameter("charset") !== true) && (textEncoding !== "")) {
          // TODO mediaType.withParameters()
        }
      }
    }
    catch (exception) {
      console.log(exception);// TODO 消す
      // 6.2. "*/*"はMediaType.fromStringでエラーにしている
      continue;
    }
  }

  // 7, 8.
  if (mediaType !== null) {
    return mediaType;
  }
  else {
    throw new Error("extraction failure");
  }
}

function _createHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);

  // Content-Type
  // init.headersで指定されていれば、それを指定
  try {
    const mediaType = _extractContentType(headers);
    headers.set(Http.Header.CONTENT_TYPE, mediaType.toString());
  }
  catch (exception) {
    void exception;
    headers.delete(Http.Header.CONTENT_TYPE);
  }

  // Content-Length
  // 何もしない

  return headers;
}

/**
 * 対応する基数
 */
const _FORMAT_RADIXES = [ 2, 8, 10, 16 ] as const;

/**
 * @param value 検査する値
 * @returns `value`は`ByteSequence.Format.Radix`型であるか否か
 */
function _isFormatRadix(value: unknown): value is ByteSequence.Format.Radix {
  if (typeof value === "number") {
    return (_FORMAT_RADIXES as ReadonlyArray<number>).includes(value);
  }
  return false;
}

/**
 * `ByteSequence.Format.Options`の各項目を省略不可にしたオプション
 */
type _ResolvedFormatOptions = {
  /** 基数 */
  radix: ByteSequence.Format.Radix;

  /** 前方埋め結果の文字列長 */
  paddedLength: int;

  /** 16進数のa-fを小文字にするか否か */
  lowerCase: boolean;

  /** 各バイトのプレフィックス */
  prefix: string;

  /** 各バイトのサフィックス */
  suffix: string;

  /** 各バイトの連結子 */
  separator: string;
};

/**
 * フォーマット基数に応じた前方ゼロ埋め結果の最小文字列長を返却
 *
 * @param radix フォーマット基数
 * @returns フォーマット結果の前方ゼロ埋め結果の最小文字列長
 */
function _minPaddedLengthOf(radix: ByteSequence.Format.Radix): int {
  switch (radix) {
  case 2:
    return 8;
  case 8:
    return 3;
  case 10:
    return 3;
  case 16:
    return 2;
    // default:
    //   return -1 as never;
  }
}

/**
 * オプションの省略項目にデフォルト値をセットした`_ResolvedFormatOptions`を返却
 *
 * @param options 省略項目があるかもしれないオプション
 * @returns 省略項目なしオプション
 * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
 * @throws {TypeError} The `options.paddedLength` is not positive integer.
 * @throws {RangeError} The `options.paddedLength` is below the lower limit.
 */
function _resolveFormatOptions(
  options: ByteSequence.Format.Options | _ResolvedFormatOptions = {},
): _ResolvedFormatOptions {
  if (_isFormatRadix(options.radix) || (options.radix === undefined)) {
    // ok
  }
  else {
    throw new TypeError("radix");
  }
  const radix: ByteSequence.Format.Radix = _isFormatRadix(options.radix) ? options.radix : 16;

  if (
    Integer.isPositiveInteger(options.paddedLength) ||
    (options.paddedLength === undefined)
  ) {
    // ok
  }
  else {
    throw new TypeError("paddedLength");
  }
  const minPaddedLength: int = _minPaddedLengthOf(radix);
  const paddedLength: int = Number.isSafeInteger(options.paddedLength)
    ? options.paddedLength as int
    : minPaddedLength;
  if (paddedLength < minPaddedLength) {
    throw new RangeError("paddedLength");
  }

  let lowerCase: boolean;
  if (typeof options.lowerCase === "boolean") {
    lowerCase = options.lowerCase;
  }
  else {
    lowerCase = false;
  }

  let prefix: string;
  if (typeof options.prefix === "string") {
    prefix = options.prefix;
  }
  else {
    prefix = "";
  }

  let suffix: string;
  if (typeof options.suffix === "string") {
    suffix = options.suffix;
  }
  else {
    suffix = "";
  }

  let separator: string;
  if (typeof options.separator === "string") {
    separator = options.separator;
  }
  else {
    separator = "";
  }

  return Object.freeze({
    radix,
    paddedLength,
    lowerCase,
    prefix,
    suffix,
    separator,
  });
}

/**
 * 1バイトを表す文字列を8-bit符号なし整数にパースし返却
 *
 * @param formatted 文字列
 * @returns 8-bit符号なし整数
 * @throws {TypeError} The `formatted` does not match the specified format.
 */
function _parseByte(
  formatted: string,
  options: _ResolvedFormatOptions,
  byteRegex: RegExp,
): uint8 {
  let work = formatted;

  if (options.prefix.length > 0) {
    if (work.startsWith(options.prefix)) {
      work = work.substring(options.prefix.length);
    }
    else {
      throw new TypeError("unprefixed");
    }
  }

  if (options.suffix.length > 0) {
    if (work.endsWith(options.suffix)) {
      work = work.substring(0, work.length - options.suffix.length);
    }
    else {
      throw new TypeError("unsuffixed");
    }
  }

  if (byteRegex.test(work) !== true) {
    throw new TypeError(`parse error: ${work}`);
  }

  const integer = Number.parseInt(work, options.radix);
  // if (isUint8(integer)) {
  return integer as uint8; // regex.testがtrueならuint8のはず
  // }
  // else
}

/**
 * オプションどおりにフォーマットした1バイトを表す文字列にマッチする正規表現を生成
 *
 * @param resolvedOptions オプション
 * @returns オプションから生成した正規表現
 */
function _createByteRegex(resolvedOptions: _ResolvedFormatOptions): RegExp {
  let charsPattern: string;
  switch (resolvedOptions.radix) {
  case 2:
    charsPattern = "[01]";
    break;
  case 8:
    charsPattern = "[0-7]";
    break;
  case 10:
    charsPattern = "[0-9]";
    break;
  case 16:
    charsPattern = "[0-9A-Fa-f]";
    break;
  }
  const bodyLength = _minPaddedLengthOf(resolvedOptions.radix);
  const paddingLength = resolvedOptions.paddedLength - bodyLength;
  const paddingPattern = (paddingLength > 0) ? `[0]{${paddingLength}}` : "";
  return new RegExp(`^${paddingPattern}${charsPattern}{${bodyLength}}$`);
}

/**
 * @param toParse
 * @param options
 * @param byteRegex
 * @returns
 * @throws {TypeError} The `toParse` contains the character sequence that does not match the specified format.
 */
function _parse(
  toParse: string,
  options: _ResolvedFormatOptions,
  byteRegex: RegExp,
): Uint8Array {
  let byteStringArray: Array<string>;
  if (options.separator.length > 0) {
    byteStringArray = toParse.split(options.separator);
    if (byteStringArray.length === 1 && byteStringArray[0] === "") {
      return new Uint8Array(0);
    }
  }
  else {
    const elementLength = options.paddedLength + options.prefix.length +
      options.suffix.length;
    byteStringArray = StringUtils.segment(toParse, {
      count: elementLength,
      unit: StringUtils.Unit.CHAR,
    });
  }

  return Uint8Array.from(byteStringArray, (byteString) => {
    return _parseByte(byteString, options, byteRegex);
  });
}

/**
 * 8-bit符号なし整数を文字列にフォーマットし返却
 *
 * @param byte 8-bit符号なし整数
 * @param options オプション
 * @returns 文字列
 */
function _formatByte(byte: uint8, options: _ResolvedFormatOptions): string {
  let str = byte.toString(options.radix);
  if (options.lowerCase !== true) {
    str = str.toUpperCase();
  }
  str = str.padStart(options.paddedLength, "0");
  return options.prefix + str + options.suffix;
}

function _format(bytes: Uint8Array, options: _ResolvedFormatOptions): string {
  const byteStringArray = [ ...bytes ].map((byte) => {
    return _formatByte(byte as uint8, options);
  });
  return byteStringArray.join(options.separator);
}

/**
 * Byte sequence
 */
class ByteSequence {
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
   * const bytesA = ByteSequence.allocate(1024);
   * // bytesA.byteLength → 1024
   * 
   * const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const bytesB = ByteSequence.fromArrayBufferView(uint8Array);
   * // bytesB.byteLength → 8
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
   * const bytes = ByteSequence.fromArray([ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]);
   * const dstBuffer = bytes.buffer;
   * dstBuffer[0] = 0x0;
   * // new Uint8Array(bytes.buffer) → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // new Uint8Array(dstBuffer) → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * const uint8Array = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const bytes = ByteSequence.fromArrayBufferView(uint8Array);
   * 
   * const sha256Integrity = await bytes.sha256Integrity;
   * // → "sha256-4pSrnUKfmpomeNmW5dvUDL9iNjpe1Bf2VMXwuoYeQgA="
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
   * @param byteLength The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(1024);
   * // bytes.byteLength → 1024
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
   * @param buffer The `ArrayBuffer`.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `buffer` is not type of `ArrayBuffer`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.wrapArrayBuffer(srcBuffer);
   * const dstBuffer = bytes.buffer;
   * // (dstBuffer === srcBuffer) → true
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
   * @param buffer The `ArrayBuffer`.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `buffer` is not type of `ArrayBuffer`.
   * @example
   * ```javascript
   * const srcBuffer = Uint8Array.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1).buffer;
   * const bytes = ByteSequence.fromArrayBuffer(srcBuffer);
   * const dstBuffer = bytes.buffer;
   * // (dstBuffer !== srcBuffer) → true
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
   * const bytes = ByteSequence.fromArray([ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]);
   * const dstBuffer = bytes.toArrayBuffer();
   * dstBuffer[0] = 0x0;
   * // new Uint8Array(bytes.buffer) → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // new Uint8Array(dstBuffer) → Uint8Array[ 0x0, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  toArrayBuffer(): ArrayBuffer {
    return this.#buffer.slice(0);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the underlying `ArrayBuffer` of the specified [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView).
   * 
   * @param bufferView The object that represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferView` is not type of `ArrayBufferView`.
   */
  static fromArrayBufferView(bufferView: ArrayBufferView): ByteSequence {
    if (ArrayBuffer.isView(bufferView)) {
      const buffer = bufferView.buffer.slice(bufferView.byteOffset, (bufferView.byteOffset + bufferView.byteLength));
      return new ByteSequence(buffer);
    }
    throw new TypeError("bufferView");
  }

  /**
   * Returns the `Uint8Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   * 
   * @returns The `Uint8Array`.
   */
  toUint8Array(): Uint8Array {
    return this.toArrayBufferView(Uint8Array);
  }

  /**
   * Returns the `DataView` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   * 
   * @returns The `DataView`.
   */
  toDataView(): DataView {
    return this.toArrayBufferView(DataView);
  }

  /**
   * Returns the [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   * 
   * @param ctor The `ArrayBufferView`s constructor.
   * @returns The `ArrayBufferView`.
   */
  toArrayBufferView<T extends ArrayBufferView>(ctor: ArrayBufferViewConstructor<T> = Uint8Array as unknown as ArrayBufferViewConstructor<T>): T {
    let bytesPerElement: number;
    if (_isTypedArrayConstructor(ctor)) {
      bytesPerElement = ctor.BYTES_PER_ELEMENT;
    }
    else if (_isDataViewConstructor(ctor)) {
      bytesPerElement = 1;
    }
    else {
      throw new TypeError("ctor");
    }

    return new ctor(this.toArrayBuffer(), 0, (this.byteLength / bytesPerElement));
  }

  // TODO byteOffset
  // TODO byteLength
  /**
   * The alias for the `fromArrayBuffer` and `fromArrayBufferView` methods.
   * 
   * @param bufferSource The object that represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferSource` is not type of [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource).
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
   * @param byteArray The 8-bit unsigned integer `Array` represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteArray` is not an 8-bit unsigned integer `Array`.
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
   */
  toArray(): Array<number> {
    return [ ...this.#view ] as Array<uint8>;
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified `ByteSequence`, `BufferSource`, or 8-bit unsigned integer `Array`.
   * 
   * @param sourceBytes The `ByteSequence.Source` object represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `bufferSource` is not type of `ByteSequence.Source`.
   */
  static from(sourceBytes: ByteSequence.Source): ByteSequence {
    if (sourceBytes instanceof ByteSequence) {
      return sourceBytes.duplicate();
    }

    if (sourceBytes instanceof ArrayBuffer) {
      return ByteSequence.fromArrayBuffer(sourceBytes);
    }

    if (ArrayBuffer.isView(sourceBytes)) {
      return ByteSequence.fromArrayBufferView(sourceBytes);
    }

    const array = _iterableToArray(sourceBytes);
    if (_Uint8Utils.isArrayOfUint8(array)) {
      return ByteSequence.fromArray([ ...sourceBytes ]);
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
  static of(...bytes: Array<number>): ByteSequence {
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
   */
  static generateRandom(byteLength: number): ByteSequence {
    if (Integer.isNonNegativeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    if (byteLength > 65536) { // XXX 連結すれば良いのでは
      throw new RangeError("byteLength");
    }

    const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength));
    return new ByteSequence(randomBytes.buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the [isomorphic encoded](https://infra.spec.whatwg.org/#isomorphic-encode) string.
   * 
   * @param binaryString The [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary).
   * @returns A new `ByteSequence` object.
   */
  static fromBinaryString(binaryString: string): ByteSequence {
    const bytes = IsomorphicEncoding.encode(binaryString);
    return new ByteSequence(bytes.buffer);
  }

  /**
   * Returns the [isomorphic decoded](https://infra.spec.whatwg.org/#isomorphic-decode) string of this byte sequence.
   * 
   * @returns The [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary).
   */
  toBinaryString(): string {
    return IsomorphicEncoding.decode(this.#buffer);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains formatted bytes.
   * 
   * @param formattedBytes The string to parse.
   * @param options The `ByteSequence.Format.Options` dictionary.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   * @throws {TypeError} The `formattedBytes` contains the character sequence that does not match the specified format.
   */
  static parse(formattedBytes: string, options?: ByteSequence.Format.Options): ByteSequence {
    const resolvedOptions = _resolveFormatOptions(options);
    const byteRegex = _createByteRegex(resolvedOptions);
    const parsed = _parse(formattedBytes, resolvedOptions, byteRegex);
    return new ByteSequence(parsed.buffer);
  }

  /**
   * Returns the string contains formatted bytes.
   * 
   * @param options The `ByteSequence.Format.Options` dictionary.
   * @returns The string contains formatted bytes.
   * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
   * @throws {TypeError} The `options.paddedLength` is not positive integer.
   * @throws {RangeError} The `options.paddedLength` is below the lower limit.
   */
  format(options?: ByteSequence.Format.Options): string {
    const resolvedOptions = _resolveFormatOptions(options);
    return _format(this.#view, resolvedOptions);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Base64-encoded bytes.
   * 
   * @param base64Encoded The string to decode.
   * @param options The [`Base64.Options`](https://i-xi-dev.github.io/base64.es/modules/Base64.html#Options-1) dictionary.
   * @returns A new `ByteSequence` object.
   */
  static fromBase64Encoded(base64Encoded: string, options?: Base64.Options): ByteSequence {
    const decoded = Base64.decode(base64Encoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * Returns the string contains Base64-encoded bytes of this byte sequence.
   * 
   * @param options The [`Base64.Options`](https://i-xi-dev.github.io/base64.es/modules/Base64.html#Options-1) dictionary.
   * @returns The string contains Base64-encoded bytes.
   */
  toBase64Encoded(options?: Base64.Options): string {
    return Base64.encode(this.#view, options);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Percent-encoded bytes.
   * 
   * @param percentEncoded The string to decode.
   * @param options The [`Percent.Options`](https://i-xi-dev.github.io/percent.es/modules/Percent.html#Options-1) dictionary.
   * @returns A new `ByteSequence` object.
   */
  static fromPercentEncoded(percentEncoded: string, options?: Percent.Options): ByteSequence {
    const decoded = Percent.decode(percentEncoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * Returns the string contains Percent-encoded bytes of this byte sequence.
   * 
   * @param options The [`Percent.Options`](https://i-xi-dev.github.io/percent.es/modules/Percent.html#Options-1) dictionary.
   * @returns The string contains Percent-encoded bytes.
   */
  toPercentEncoded(options?: Percent.Options): string {
    return Percent.encode(this.#view, options);
  }

  /**
   * Computes the SHA-256 digest for this byte sequence.
   * 
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-256 digest.
   */
  async toSha256Digest(): Promise<ByteSequence> {
    return this.toDigest(_DigestImpl.Sha256);
  }

  /**
   * Computes the SHA-384 digest for this byte sequence.
   * 
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-384 digest.
   */
  async toSha384Digest(): Promise<ByteSequence> {
    return this.toDigest(_DigestImpl.Sha384);
  }

  /**
   * Computes the SHA-512 digest for this byte sequence.
   * 
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-512 digest.
   */
  async toSha512Digest(): Promise<ByteSequence> {
    return this.toDigest(_DigestImpl.Sha512);
  }

  /**
   * Computes the digest for this byte sequence.
   * 
   * @param algorithm The digest algorithm.
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the digest.
   */
  async toDigest(algorithm: ByteSequence.DigestAlgorithm): Promise<ByteSequence> {
    const digest = await algorithm.compute(this.#view);
    return new ByteSequence(digest.buffer);
  }

  /**
   * Computes the SRI integrity (Base64-encoded digest).
   * 
   * @param algorithm The digest algorithm.
   * @returns The `Promise` that fulfills with a SRI integrity (base64-encoded digest).
   * @see [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
   */
  async #integrity(algorithm: ByteSequence.DigestAlgorithm, prefix: string): Promise<string> {
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
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * generated from the specified string by UTF-8 encoding.
   * Neither adds nor removes BOM.
   * 
   * @param text The string.
   * @returns A new `ByteSequence` object.
   */
  static utf8EncodeFrom(text: string): ByteSequence {
    const encoded = utf8TextEncoder.encode(text);
    return new ByteSequence(encoded.buffer);
  }

  /**
   * Returns a UTF-8 decoded string of this bytes.
   * Neither adds nor removes BOM.
   * 
   * @returns A string decoded in UTF-8.
   */
  utf8DecodeTo(): string {
    return utf8TextDecoder.decode(this.#view);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * generated from the specified string by the specified text encoding.
   * 
   * @param text The string.
   * @param encoder The text encoder, for example `TextEncoder`.
   * @returns A new `ByteSequence` object.
   */
  static textEncodeFrom(text: string, encoder: { encode: (input?: string) => Uint8Array } = utf8TextEncoder): ByteSequence {
    const encoded = encoder.encode(text);
    // return new ByteSequence(encoded.buffer);// Node.jsのBufferを返すエンコーダーだとプールが余計
    return ByteSequence.fromArrayBufferView(encoded);
  }

  /**
   * Returns a decoded string by the specified text encoding of this bytes.
   * 
   * @param decoder The text decoder, for example `TextDecoder`.
   * @returns A string decoded in the specified text encoding.
   */
  textDecodeTo(decoder: { decode: (input?: Uint8Array) => string } = utf8TextDecoder): string {
    return decoder.decode(this.#view);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
   * 
   * @param blob The `Blob` object (including `File` object).
   * @returns The `Promise` that fulfills with a new `ByteSequence` object.
   * @throws {Error} `blob.arrayBuffer()` is failed.
   */
  static async fromBlob(blob: Blob): Promise<ByteSequence> {
    try {
      const buffer = await blob.arrayBuffer(); // XXX Node.jsでもstream()を取得できるようになった
      return ByteSequence.wrapArrayBuffer(buffer);
    }
    catch (exception) {
      // Blob#arrayBufferでの NotFoundError | SecurityError | NotReadableError

      // XXX throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  // TODO 命名変えたい
  /**
   * @experimental
   */
  static async fromBlobWithProperties(blob: Blob): Promise<ByteSequence.Described> {
    const data = await ByteSequence.fromBlob(blob);
    try {
      let mediaType: MediaType | null = null;
      if (blob.type) {
        mediaType = MediaType.fromString(blob.type); // パース失敗で例外になる場合あり
      }

      // let fileName: string | undefined = undefined;
      // let fileLastModified: number | undefined = undefined;
      // if (globalThis.File && (blob instanceof File)) {
      //   fileName = blob.name;
      //   fileLastModified = blob.lastModified;
      // }

      // const properties = (mediaType || fileLastModified) ? {
      const properties = mediaType ? {
        type: mediaType?.toString(),
        // lastModified: fileLastModified,
      } : undefined;

      return {
        data,
        // name: fileName,
        properties,
      };
    }
    catch (exception) {
      // MediaTypeのパース失敗

      // XXX throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  /**
   * Returns the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object representing this byte sequence.
   * 
   * @param options The `BlobPropertyBag` object, but `endings` property is ignored.
   * @returns The `Blob` object.
   */
  toBlob(options?: BlobPropertyBag): Blob {
    const mediaType: MediaType | null = (options?.type === "string") ? MediaType.fromString(options.type) : null;

    return new Blob([ this.#buffer ], {
      type: mediaType ? mediaType.toString() : undefined,
    });
  }

  /**
   * Returns the [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object representing this byte sequence.
   * 
   * @param fileName The file name.
   * @param options The `FilePropertyBag` object, but `endings` property is ignored.
   * @returns The `File` object.
   */
  toFile(fileName: string, options?: FilePropertyBag): File {
    if ((typeof fileName === "string") && (fileName.length > 0)) {
      // ok
    }
    else {
      throw new TypeError("fileName");
    }

    const mediaType: MediaType | null = (options?.type === "string") ? MediaType.fromString(options.type) : null;

    return new File([ this.#buffer ], fileName, {
      type: mediaType ? mediaType.toString() : "",
      lastModified: options?.lastModified ? options.lastModified : Date.now(),
    });
  }

  static #fromDataURL(dataUrl: URL | string): [ ByteSequence, string ] {
    let parsed: URL;
    try {
      parsed = new URL(dataUrl);
    }
    catch (exception) {
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

    return [ bytes, mediaTypeSrc ];
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
   */
  static fromDataURL(dataUrl: URL | string): ByteSequence {
    const [ bytes ] = ByteSequence.#fromDataURL(dataUrl);
    return bytes;
  }

  // TODO 命名変えたい
  /**
   * @experimental
   */
  static fromDataURLWithProperties(dataUrl: URL | string): ByteSequence.Described {
    const [ bytes, mediaTypeSrc ] = ByteSequence.#fromDataURL(dataUrl);
    let mediaTypeWork = mediaTypeSrc;

    // 12
    if (mediaTypeWork.startsWith(";")) {
      mediaTypeWork = "text/plain" + mediaTypeWork;
    }

    // 13, 14
    let mediaType: MediaType;
    try {
      mediaType = MediaType.fromString(mediaTypeWork);
    }
    catch (exception) {
      void exception;
      mediaType = MediaType.fromString("text/plain;charset=US-ASCII");
    }

    return {
      data: bytes,
      properties: {
        type: mediaType.toString(),
      },
    };
  }

  /**
   * Returns the [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) representing this byte sequence.
   * 
   * @param options The `BlobPropertyBag` object, but `endings` property is ignored.
   * @returns The [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   * @throws {TypeError}
   */
  toDataURL(options?: BlobPropertyBag): URL {
    // FileReaderの仕様に倣い、テキストかどうかに関係なく常時Base64エンコードする仕様
    // XXX Base64なしも対応する
    const mediaType: MediaType | null = (options?.type === "string") ? MediaType.fromString(options.type) : null;
    if (mediaType) {
      // let encoding = "";
      // let dataEncoded: string;
      // if (base64) {
      const encoding = ";base64";
      const dataEncoded = this.toBase64Encoded();
      // }

      return new URL("data:" + mediaType.toString() + encoding + "," + dataEncoded);
    }
    throw new TypeError("MIME type not resolved");
  }

  /**
   * @experimental
   * @param streamLike 
   * @param options 
   */
  static async fromStream(streamLike: ByteSequence.StreamLike, options?: ByteSequence.AsyncReadingOptions): Promise<ByteSequence> {
    const reader = new ByteStream.Reader();

    const listenerOptions = {
      once: true,
      passive: true,
    };
    const progressListenerOptions = {
      passive: true,
    };
    if (typeof options?.onloadstart === "function") {
      reader.addEventListener("loadstart", options.onloadstart as EventListener, listenerOptions);
    }
    if (typeof options?.onprogress === "function") {
      reader.addEventListener("progress", options.onprogress as EventListener, progressListenerOptions);
    }
    if (typeof options?.onload === "function") {
      reader.addEventListener("load", options.onload as EventListener, listenerOptions);
    }
    if (typeof options?.onabort === "function") {
      reader.addEventListener("abort", options.onabort as EventListener, listenerOptions);
    }
    if (typeof options?.ontimeout === "function") {
      reader.addEventListener("timeout", options.ontimeout as EventListener, listenerOptions);
    }
    if (typeof options?.onerror === "function") {
      reader.addEventListener("error", options.onerror as EventListener, listenerOptions);
    }
    if (typeof options?.onloadend === "function") {
      reader.addEventListener("loadend", options.onloadend as EventListener, listenerOptions);
    }

    const bytes = await reader.read(streamLike, {
      totalByteLength: options?.totalByteLength,
      signal: options?.signal,
    });
    return new ByteSequence(bytes.buffer);
  }

  /**
   * @experimental
   */
  static async fromRequestOrResponse(reqOrRes: Request | Response, options: ByteSequence.RequestOrResponseReadingOptions): Promise<ByteSequence> {
    if (typeof options?.verifyHeaders === "function") {
      const [ verified, message ] = options.verifyHeaders(reqOrRes.headers);
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
    }
    else {
      bytes = ByteSequence.allocate(0);
    }

    return bytes;
  }

  // TODO 命名変えたい
  /**
   * @experimental
   */
  static async fromRequestOrResponseWithProperties(reqOrRes: Request | Response, options: ByteSequence.RequestOrResponseReadingOptions): Promise<ByteSequence.Described> {
    let mediaType: MediaType | null = null;
    try {
      mediaType = _extractContentType(reqOrRes.headers);
    }
    catch (exception) {
      void exception;
    }

    const properties = mediaType ? {
      type: mediaType.toString(),
    } : undefined;

    const data = await ByteSequence.fromRequestOrResponse(reqOrRes, options);
    return {
      data,
      properties,
    };
  }

  /**
   * @experimental
   */
  toRequest(url: string, options: RequestInit): Request {
    const headers = _createHeaders(options?.headers);
    const method = options.method ?? Http.Method.GET;
    if (([ Http.Method.GET, Http.Method.HEAD ] as string[]).includes(method.toUpperCase()) !== true) {
      throw new TypeError("options.method");
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
   */
  toResponse(options: ResponseInit): Response {
    const headers = _createHeaders(options?.headers);
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
   */
  duplicate(): ByteSequence {
    return new ByteSequence(this.toArrayBuffer());
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
   * Returns the `Uint8Array` that views the underlying `ArrayBuffer` of this instance.
   * 
   * @param byteOffset The offset, in bytes.
   * @param byteLength The length of the `ArrayBufferView`, in bytes.
   * @returns The `Uint8Array`.
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
   */
  getDataView(byteOffset?: number, byteLength?: number): DataView {
    return this.getView(DataView, byteOffset, byteLength);
  }

  /**
   * Returns the `ArrayBufferView` that views the underlying `ArrayBuffer` of this instance.
   * 
   * @param ctor The constructor of `ArrayBufferView`.
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
   */
  getView<T extends ArrayBufferView>(ctor: ArrayBufferViewConstructor<T> = Uint8Array as unknown as ArrayBufferViewConstructor<T>, byteOffset = 0, byteLength: number = (this.byteLength - byteOffset)): T {
    let bytesPerElement: number;
    if (_isTypedArrayConstructor(ctor)) {
      bytesPerElement = ctor.BYTES_PER_ELEMENT;
      new Uint8ClampedArray();
    }
    else if (_isDataViewConstructor(ctor)) {
      bytesPerElement = 1;
    }
    else {
      throw new TypeError("ctor");
    }

    if (Integer.isNonNegativeInteger(byteOffset) !== true) {
      throw new TypeError("byteOffset");
    }
    else if ((byteOffset > this.byteLength) || ((byteOffset % bytesPerElement) !== 0)) {
      throw new RangeError("byteOffset");
    }

    if (Integer.isNonNegativeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    else if (((byteOffset + byteLength) > this.byteLength) || ((byteLength % bytesPerElement) !== 0)) {
      throw new RangeError("byteLength");
    }

    return new ctor(this.#buffer, byteOffset, (byteLength / bytesPerElement));
  }

  /**
   * 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否かを返却
   * 
   * @param otherBytes バイト列
   * @returns 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否か
   */
  #startsWith(otherBytes: BufferSource | Array<uint8>): boolean {
    const thisView = this.#view;
    if ((otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)) {
      const otherView = new Uint8Array((otherBytes instanceof ArrayBuffer) ? otherBytes : otherBytes.buffer);
      for (let i = 0; i < otherView.byteLength; i++) {
        if (otherView[i] !== thisView[i]) {
          return false;
        }
      }
      return true;
    }
    else if (_Uint8Utils.isArrayOfUint8(otherBytes)) {
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
    if (otherBytes instanceof ByteSequence) {
      if (otherBytes.byteLength !== this.byteLength) {
        return false;
      }
      return this.#startsWith(otherBytes.buffer);
    }

    if ((otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)) {
      if (otherBytes.byteLength !== this.byteLength) {
        return false;
      }
      return this.#startsWith(otherBytes);
    }

    const array = _iterableToArray(otherBytes);
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
    if (otherBytes instanceof ByteSequence) {
      return this.#startsWith(otherBytes.buffer);
    }

    if ((otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)) {
      return this.#startsWith(otherBytes);
    }

    const array = _iterableToArray(otherBytes);
    if (_Uint8Utils.isArrayOfUint8(array)) {
      return this.#startsWith(array);
    }

    throw new TypeError("otherBytes");
  }

  /**
   * Returns a new iterator that contains byte sequences divided by the specified length.
   * 
   * @param segmentByteLength The segment length, in bytes.
   * @returns A new iterator.
   * @throws {TypeError} The `segmentByteLength` is not non-negative integer.
   */
  segment(segmentByteLength: number): IterableIterator<ByteSequence> {
    if (Integer.isPositiveInteger(segmentByteLength) !== true) {
      throw new TypeError("segmentByteLength");
    }

    return (function*(bytes: ByteSequence): Generator<ByteSequence, void, void> {
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

  // XXX at(): Uint8Arrayで出来る
  // XXX [Symbol.iterator](): Uint8Arrayで出来る

}

namespace ByteSequence {
  /**
   * A typedef that representing a `ByteSequence`, [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource), or `Iterable` of 8-bit unsigned integers.
   */
  export type Source = ByteSequence | BufferSource | Iterable<number>;

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

  export type Described = {
    data: ByteSequence,
    properties?: BlobPropertyBag,
  };

  // export type Described = {
  //   data: ByteSequence,
  //   name?: string,
  //   properties?: FilePropertyBag,
  // };

  export namespace Format {
    /**
     * 2, 8, 10, or 16.
     */
    export type Radix = typeof _FORMAT_RADIXES[number];

    /**
     * The object with the following optional fields.
     */
    export type Options = {
      /**
       * The radix of the formatted string.
       * 2, 8, 10, and 16 are available values.
       * The default is `16`.
       */
      radix?: Radix;

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
  }

  /**
   * @experimental
   */
  export type StreamLike = AsyncIterable<Uint8Array> | ReadableStream<Uint8Array> | Iterable<Uint8Array>;
  // XXX ReadableStreamは、そのうちAsyncIterableになる

  /**
   * @experimental
   */
  export type AsyncReadingOptions = {
    /**
     * The total number of bytes in the byte stream.
     */
    totalByteLength?: number,

    /**
     * The `AbortSignal` object.
     */
    signal?: AbortSignal,

    /**
     * The event listener for the `loadstart` event.
     */
    onloadstart?: (event: ProgressEvent) => void,

    /**
     * The event listener for the `progress` event.
     */
    onprogress?: (event: ProgressEvent) => void,

    /**
     * The event listener for the `load` event.
     */
    onload?: (event: ProgressEvent) => void,

    /**
     * The event listener for the `abort` event.
     */
    onabort?: (event: ProgressEvent) => void,

    /**
     * The event listener for the `timeout` event.
     */
    ontimeout?: (event: ProgressEvent) => void,

    /**
     * The event listener for the `error` event.
     */
    onerror?: (event: ProgressEvent) => void,

    /**
     * The event listener for the `loadend` event.
     */
    onloadend?: (event: ProgressEvent) => void,

    // XXX abortはrejectしない設定とか？
    // XXX サイズが想定と違ったらrejectする設定とか
  };

  /**
   * @experimental
   */
  export type RequestOrResponseReadingOptions = AsyncReadingOptions & {
    verifyHeaders?: (headers: Headers) => [ verified: boolean, message?: string ],
  };
}

Object.freeze(ByteSequence);

export {
  ByteSequence,
};
