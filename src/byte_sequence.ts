import {
  _Blob,
  _crypto,
  _File,
  ArrayBufferViewConstructor,
  Base64,
  BufferUtils,
  ByteOrder,
  BytesFormat,
  BytesSize,
  BytesStream,
  DataURL,
  Digest,
  Http,
  InvalidStateError,
  Isomorphic,
  MediaType,
  Percent,
  Reading,
  SafeInteger,
  // StringEx,
  Uint8,
} from "../deps.ts";
import { _HttpUtilsEx, _Utf8 } from "./utils.ts";

/**
 * Byte sequence
 */
export class ByteSequence {
  /**
   * 内部表現
   */
  #buffer: ArrayBuffer;

  /**
   * 内部表現のビュー
   */
  #view: Uint8Array;

  // ArrayBufferをラップするインスタンスを生成
  // ※外部からのArrayBufferの変更は当インスタンスに影響する
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
   * Gets the number of bytes as `BytesSize`.
   *
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(1024);
   * const kib = bytes.size.to("kibibyte");
   * // kib
   * //   → 1
   * ```
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(5_120_000);
   * const kib = bytes.size.to("kibibyte");
   * // (new Intl.NumberFormat("en")).format(kib) + " KiB"
   * //   → "5,000 KiB"
   * ```
   * @example
   * ```javascript
   * const bytes = ByteSequence.allocate(5_000_000);
   * const kb = bytes.size.to("kilobyte");
   * // (new Intl.NumberFormat("en", { style: "unit", unit: "kilobyte" })).format(kb)
   * //   → "5,000 kB"
   * ```
   */
  get size(): BytesSize {
    return new BytesSize(this.#buffer.byteLength);
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
    return this.#integrity(Digest.Sha256, "sha256-");
  }

  /**
   * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-384 digest for this byte sequence.
   */
  get sha384Integrity(): Promise<string> {
    return this.#integrity(Digest.Sha384, "sha384-");
  }

  /**
   * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-512 digest for this byte sequence.
   */
  get sha512Integrity(): Promise<string> {
    return this.#integrity(Digest.Sha512, "sha512-");
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
   * //   → 1024
   * ```
   */
  static allocate(byteLength: number): ByteSequence {
    if (SafeInteger.isNonNegativeSafeInteger(byteLength) !== true) {
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
   * //   → true
   * ```
   */
  static wrapArrayBuffer(buffer: ArrayBuffer): ByteSequence {
    if (buffer instanceof ArrayBuffer) {
      return new ByteSequence(buffer);
    }
    throw new TypeError("buffer");
  }
  //TODO ArrayBudderをresizeした場合のテスト

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
   * //   → false
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
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * that duplicates the underlying `ArrayBuffer` of the specified [`ArrayBufferView`](https://webidl.spec.whatwg.org/#ArrayBufferView).
   *
   * @param bufferView - The object that represents a byte sequence.
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
   * Returns the `Int8Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Int8Array`.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const int8Array = bytes.toInt8Array();
   * // int8Array
   * //   → Int8Array[ -27, -81, -116, -27, -93, -85, -27, -79, -79 ]
   */
  toInt8Array(): Int8Array {
    return new Int8Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Int8Array.BYTES_PER_ELEMENT,
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
    return new Uint8Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Uint8ClampedArray` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Uint8ClampedArray`.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const uint8ClampedArray = bytes.toUint8ClampedArray();
   * // uint8ClampedArray
   * //   → Uint8ClampedArray[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  toUint8ClampedArray(): Uint8ClampedArray {
    return new Uint8ClampedArray(
      this.toArrayBuffer(),
      0,
      this.byteLength / Uint8ClampedArray.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Int16Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Int16Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 2.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0);
   * const int16Array = bytes.toInt16Array();
   * // int16Array
   * //   When the platform byte order is little-endian
   * //   → Int16Array[ -20_507, -6_772, -21_597, -19_995, 177 ]
   * //   When the platform byte order is big-endian
   * //   → Int16Array[ -6_737, -29_467, -23_637, -6_735, -20_224 ]
   * ```
   */
  toInt16Array(): Int16Array {
    if (this.byteLength % Int16Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new Int16Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Int16Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Uint16Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Uint16Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 2.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0);
   * const uint16Array = bytes.toUint16Array();
   * // uint16Array
   * //   When the platform byte order is little-endian
   * //   → Uint16Array[ 0xAFE5, 0xE58C, 0xABA3, 0xB1E5, 0x00B1 ]
   * //   When the platform byte order is big-endian
   * //   → Uint16Array[ 0xE5AF, 0x8CE5, 0xA3AB, 0xE5B1, 0xB100 ]
   * ```
   */
  toUint16Array(): Uint16Array {
    if (this.byteLength % Uint16Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new Uint16Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Uint16Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Int32Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Int32Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 4.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0);
   * const int32Array = bytes.toInt32Array();
   * // int32Array
   * //   When the platform byte order is little-endian
   * //   → Int32Array[ -443_764_763, -1_310_348_381, 177 ]
   * //   When the platform byte order is big-endian
   * //   → Int32Array[ -441_479_963, -1_549_015_631, -1_325_400_064 ]
   * ```
   */
  toInt32Array(): Int32Array {
    if (this.byteLength % Int32Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new Int32Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Int32Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Uint32Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Uint32Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 4.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0);
   * const uint32Array = bytes.toUint32Array();
   * // uint32Array
   * //   When the platform byte order is little-endian
   * //   → Uint32Array[ 0xE58CAFE5, 0xB1E5ABA3, 0x000000B1 ]
   * //   When the platform byte order is big-endian
   * //   → Uint32Array[ 0xE5AF8CE5, 0xA3ABE5B1, 0xB1000000 ]
   * ```
   */
  toUint32Array(): Uint32Array {
    if (this.byteLength % Uint32Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new Uint32Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Uint32Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Float32Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Float32Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 4.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0);
   * const float32Array = bytes.toFloat32Array();
   * // float32Array
   * //   When the platform byte order is little-endian
   * //   → Float32Array[ -8.304699862546052e+22, -6.68429001038362e-9, 2.4802982818549262e-43 ]
   * //   When the platform byte order is big-endian
   * //   → Float32Array[ -1.0362664748269274e+23, -1.8637135243899587e-17, -1.862645149230957e-9 ]
   * ```
   */
  toFloat32Array(): Float32Array {
    if (this.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new Float32Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Float32Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `Float64Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `Float64Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 8.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0, 0, 0, 0, 0);
   * const float64Array = bytes.toFloat64Array();
   * // float64Array
   * //   When the platform byte order is little-endian
   * //   → Float64Array[ -2.5118824744887084e-68, 8.74e-322 ]
   * //   When the platform byte order is big-endian
   * //   → Float64Array[ -6.54593944702149e+181, -1.131959884853339e-72 ]
   * ```
   */
  toFloat64Array(): Float64Array {
    if (this.byteLength % Float64Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new Float64Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / Float64Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `BigInt64Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `BigInt64Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 8.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0, 0, 0, 0, 0);
   * const int64Array = bytes.toBigInt64Array();
   * // int64Array
   * //   When the platform byte order is little-endian
   * //   → BigInt64Array[ -5_627_903_438_910_345_243n, 177n ]
   * //   When the platform byte order is big-endian
   * //   → BigInt64Array[ -1_896_142_000_178_338_383n, -5_692_549_928_996_306_944n ]
   * ```
   */
  toBigInt64Array(): BigInt64Array {
    if (this.byteLength % BigInt64Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new BigInt64Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / BigInt64Array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * Returns the `BigUint64Array` that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @returns The `BigUint64Array`.
   * @throws {RangeError} This `byteLength` is not a multiple of 8.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0, 0, 0, 0, 0);
   * const uint64Array = bytes.toBigUint64Array();
   * // uint64Array
   * //   When the platform byte order is little-endian
   * //   → BigUint64Array[ 0xB1E5ABA3E58CAFE5n, 0x00000000000000B1n ]
   * //   When the platform byte order is big-endian
   * //   → BigUint64Array[ 0xE5AF8CE5A3ABE5B1n, 0xB100000000000000n ]
   * ```
   */
  toBigUint64Array(): BigUint64Array {
    if (this.byteLength % BigUint64Array.BYTES_PER_ELEMENT !== 0) {
      throw new RangeError("byteLength");
    }

    return new BigUint64Array(
      this.toArrayBuffer(),
      0,
      this.byteLength / BigUint64Array.BYTES_PER_ELEMENT,
    );
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
    return new DataView(this.toArrayBuffer(), 0, this.byteLength);
  }

  /**
   * Returns the [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) that views a new `ArrayBuffer` duplicated from the underlying `ArrayBuffer` of this instance.
   *
   * @deprecated
   * @param ctor - The `ArrayBufferView`s constructor.
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
    ctor: ArrayBufferViewConstructor<T> =
      Uint8Array as unknown as ArrayBufferViewConstructor<T>,
  ): T {
    let bytesPerElement: number;
    if (ArrayBufferViewConstructor.isTypedArrayConstructor(ctor)) {
      bytesPerElement = ctor.BYTES_PER_ELEMENT;
    } else if (ArrayBufferViewConstructor.isDataViewConstructor(ctor)) {
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
  static fromBufferSource(bufferSource: BufferSource): ByteSequence {
    if (bufferSource instanceof ArrayBuffer) {
      return ByteSequence.fromArrayBuffer(bufferSource);
    }
    return ByteSequence.fromArrayBufferView(bufferSource);
  }

  //XXX fromInt8Iterable

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 8-bit unsigned integer `Iterable`.
   *
   * @param source - The 8-bit unsigned integer `Iterable` represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `source` does not have `[Symbol.iterator]` method`.
   * @throws {RangeError} The `source` is not an 8-bit unsigned integer `Iterable`.
   * @example
   * ```javascript
   * const array = [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ];
   * const bytes = ByteSequence.fromUint8Iterable(array);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromUint8Iterable(source: Iterable<number>): ByteSequence {
    const bytes = BufferUtils.fromUint8Iterable(source);
    return ByteSequence.wrapArrayBuffer(bytes);
  }

  //XXX fromAsyncInt8Iterable

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 8-bit unsigned integer `AsyncIterable`.
   *
   * @param source - The 8-bit unsigned integer `AsyncIterable` represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `source` does not have `[Symbol.asyncIterator]` method`.
   * @throws {RangeError} The `source` is not an 8-bit unsigned integer `AsyncIterable`.
   */
  static async fromAsyncUint8Iterable(
    source: AsyncIterable<number>,
  ): Promise<ByteSequence> {
    const bytes = await BufferUtils.fromAsyncUint8Iterable(source);
    return ByteSequence.wrapArrayBuffer(bytes);
  }

  //XXX fromInt16Iterable

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 16-bit unsigned integer `Iterable`.
   *
   * @param source - The 16-bit unsigned integer `Iterable` represents a byte sequence.
   * @param byteOrder - The byte order. If omitted, write in the platform byte order.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `source` does not have `[Symbol.iterator]` method`.
   * @throws {RangeError} The `source` is not an 16-bit unsigned integer `Iterable`.
   */
  static fromUint16Iterable(
    source: Iterable<number>,
    byteOrder?: ByteOrder,
  ): ByteSequence {
    const bytes = BufferUtils.fromUint16Iterable(source, byteOrder);
    return ByteSequence.wrapArrayBuffer(bytes);
  }

  //XXX fromAsyncInt16Iterable

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 16-bit unsigned integer `AsyncIterable`.
   *
   * @param source - The 16-bit unsigned integer `AsyncIterable` represents a byte sequence.
   * @param byteOrder - The byte order. If omitted, write in the platform byte order.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `source` does not have `[Symbol.asyncIterator]` method`.
   * @throws {RangeError} The `source` is not an 16-bit unsigned integer `AsyncIterable`.
   */
  static async fromAsyncUint16Iterable(
    source: AsyncIterable<number>,
    byteOrder?: ByteOrder,
  ): Promise<ByteSequence> {
    const bytes = await BufferUtils.fromAsyncUint16Iterable(source, byteOrder);
    return ByteSequence.wrapArrayBuffer(bytes);
  }

  //XXX fromInt32Iterable

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 32-bit unsigned integer `Iterable`.
   *
   * @param source - The 32-bit unsigned integer `Iterable` represents a byte sequence.
   * @param byteOrder - The byte order. If omitted, write in the platform byte order.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `source` does not have `[Symbol.iterator]` method`.
   * @throws {RangeError} The `source` is not an 32-bit unsigned integer `Iterable`.
   */
  static fromUint32Iterable(
    source: Iterable<number>,
    byteOrder?: ByteOrder,
  ): ByteSequence {
    const bytes = BufferUtils.fromUint32Iterable(source, byteOrder);
    return ByteSequence.wrapArrayBuffer(bytes);
  }

  //XXX fromAsyncInt32Iterable

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified 32-bit unsigned integer `AsyncIterable`.
   *
   * @param source - The 32-bit unsigned integer `AsyncIterable` represents a byte sequence.
   * @param byteOrder - The byte order. If omitted, write in the platform byte order.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `source` does not have `[Symbol.asyncIterator]` method`.
   * @throws {RangeError} The `source` is not an 32-bit unsigned integer `AsyncIterable`.
   */
  static async fromAsyncUint32Iterable(
    source: AsyncIterable<number>,
    byteOrder?: ByteOrder,
  ): Promise<ByteSequence> {
    const bytes = await BufferUtils.fromAsyncUint32Iterable(source, byteOrder);
    return ByteSequence.wrapArrayBuffer(bytes);
  }

  //XXX fromBigInt64Iterable
  //XXX fromAsyncBigInt64Iterable

  //TODO fromBigUint64Iterable
  //TODO fromAsyncBigUint64Iterable

  //XXX fromFloat32Iterable
  //XXX fromAsyncFloat32Iterable
  //XXX fromFloat64Iterable
  //XXX fromAsyncFloat64Iterable

  /**
   * The alias for the `fromUint8Iterable` method.
   *
   * @param byteArray - The 8-bit unsigned integer `Array` represents a byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteArray` is not `Array`.
   * @throws {RangeError} The `byteArray` is not an 8-bit unsigned integer `Array`.
   */
  static fromArray(byteArray: Array<number>): ByteSequence {
    return this.fromUint8Iterable(byteArray);
  }

  /**
   * Returns the 8-bit unsigned integer `Iterable` representing this byte sequence.
   *
   * @returns The `Iterable` of 8-bit unsigned integers.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const uint8s = bytes.toUint8Iterable();
   * // [...uint8s]
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  toUint8Iterable(): Iterable<Uint8> {
    //return BufferUtils.toUint8Iterable(this.#buffer);
    return [...this.#view] as Iterable<Uint8>;
  }

  /**
   * Returns a 16-bit unsigned integer `Iterable` represented by this byte sequence.
   *
   * @param byteOrder - The byte order. If omitted, the platform byte order is used.
   * @returns The `Iterable` of 16-bit unsigned integers.
   * @throws {RangeError} This `byteLength` is not a multiple of 2.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0);
   * const uint16s = bytes.toUint16Iterable();
   * // [...uint16s]
   * //   When the platform byte order is little-endian
   * //   → [ 0xAFE5, 0xE58C, 0xABA3, 0xB1E5, 0x00B1 ]
   * //   When the platform byte order is big-endian
   * //   → [ 0xE5AF, 0x8CE5, 0xA3AB, 0xE5B1, 0xB100 ]
   *
   * const uint16sLe = bytes.toUint16Iterable(ByteOrder.LITTLE_ENDIAN);
   * // [...uint16sLe]
   * //   → [ 0xAFE5, 0xE58C, 0xABA3, 0xB1E5, 0x00B1 ]
   *
   * const uint16sBe = bytes.toUint16Iterable(ByteOrder.BIG_ENDIAN);
   * // [...uint16sBe]
   * //   → [ 0xE5AF, 0x8CE5, 0xA3AB, 0xE5B1, 0xB100 ]
   * ```
   */
  toUint16Iterable(byteOrder?: ByteOrder): Iterable<number> {
    // BufferUtils.toUint16Iterableは読み取りしかしないので、this.#bufferをコピーせずに渡す
    return BufferUtils.toUint16Iterable(this.#buffer, byteOrder);
  }

  /**
   * Returns a 32-bit unsigned integer `Iterable` represented by this byte sequence.
   *
   * @param byteOrder - The byte order. If omitted, the platform byte order is used.
   * @returns The `Iterable` of 32-bit unsigned integers.
   * @throws {RangeError} This `byteLength` is not a multiple of 4.
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1, 0, 0, 0);
   * const uint32s = bytes.toUint32Iterable();
   * // [...uint32s]
   * //   When the platform byte order is little-endian
   * //   → [ 0xE58CAFE5, 0xB1E5ABA3, 0x000000B1 ]
   * //   When the platform byte order is big-endian
   * //   → [ 0xE5AF8CE5, 0xA3ABE5B1, 0xB1000000 ]
   *
   * const uint32sLe = bytes.toUint32Iterable(ByteOrder.LITTLE_ENDIAN);
   * // [...uint32sLe]
   * //   → [ 0xE58CAFE5, 0xB1E5ABA3, 0x000000B1 ]
   *
   * const uint32sBe = bytes.toUint32Iterable(ByteOrder.BIG_ENDIAN);
   * // [...uint32sBe]
   * //   → [ 0xE5AF8CE5, 0xA3ABE5B1, 0xB1000000 ]
   * ```
   */
  toUint32Iterable(byteOrder?: ByteOrder): Iterable<number> {
    // BufferUtils.toUint32Iterableは読み取りしかしないので、this.#bufferをコピーせずに渡す
    return BufferUtils.toUint32Iterable(this.#buffer, byteOrder);
  }

  //XXX toBigInt64Iterable
  //TODO toBigUint64Iterable
  //XXX toFloat32Iterable
  //XXX toFloat64Iterable

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
    return [...this.toUint8Iterable()] as Array<Uint8>;
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

    try {
      const bytes = BufferUtils.fromUint8Iterable(sourceBytes);
      return ByteSequence.wrapArrayBuffer(bytes);
    } catch (exception) {
      throw new TypeError(`sourceBytes (${exception.message})`);
    }
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
   * //   → 1024
   * ```
   */
  static generateRandom(byteLength: number): ByteSequence {
    if (SafeInteger.isNonNegativeSafeInteger(byteLength) !== true) {
      throw new TypeError("byteLength");
    }
    if (byteLength > 65536) { // XXX 連結すれば良いのでは
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
   * const bytes = ByteSequence.fromBinaryString("å¯\u{8C}å£«å±±");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * //   → "å¯\u{8C}å£«å±±"
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
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   * @example
   * ```javascript
   * // Base64 URL (https://datatracker.ietf.org/doc/html/rfc4648#section-5) decoding
   *
   * const base64Url = {
   *   tableLastChars: ["-", "_"],
   *   noPadding: true,
   * };
   * const bytes = ByteSequence.fromBase64Encoded("5a-M5aOr5bGx", base64Url);
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * //   → "5a+M5aOr5bGx"
   * ```
   * @example
   * ```javascript
   * // Base64 URL (https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoding
   *
   * const base64Url = {
   *   tableLastChars: ["-", "_"],
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
   * // bytes.toText()
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
   * // bytes.toText()
   * //   → "富士山"
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
   * //   → "%E5%AF%8C%E5%A3%AB%E5%B1%B1"
   * ```
   * @example
   * ```javascript
   * // URL component encoding
   *
   * const urlComponent = {
   *   encodeSet: [ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ],
   * };
   * const bytes = ByteSequence.fromText("富士山");
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
   * const bytes = ByteSequence.fromText("富士山");
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
   * Computes the digest for this byte sequence.
   *
   * @param algorithm - The digest algorithm.
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the digest.
   * @example
   * ```javascript
   * const md5 = {
   *   // compute: (input: BuuferSource) => Promise<ArrayBuffer>
   *   async compute(input) {
   *     // ...
   *   }
   * };
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const digestBytes = await bytes.toDigest(md5);
   * // digestBytes.format()
   * //   → "52A6AD27415BD86EC64B57EFBEA27F98"
   * ```
   */
  async toDigest(
    algorithm: Digest.Algorithm,
  ): Promise<ByteSequence> {
    const digest = await algorithm.compute(this.#view);
    return new ByteSequence(digest);
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
  toSha256Digest(): Promise<ByteSequence> {
    return this.toDigest(Digest.Sha256);
  }

  /**
   * Computes the SHA-384 digest for this byte sequence.
   *
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-384 digest.
   */
  toSha384Digest(): Promise<ByteSequence> {
    return this.toDigest(Digest.Sha384);
  }

  /**
   * Computes the SHA-512 digest for this byte sequence.
   *
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-512 digest.
   */
  toSha512Digest(): Promise<ByteSequence> {
    return this.toDigest(Digest.Sha512);
  }

  /**
   * Computes the SHA-1 digest for this byte sequence.
   *
   * @deprecated
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-1 digest.
   */
  toSha1Digest(): Promise<ByteSequence> {
    return this.toDigest(Digest.Sha1);
  }

  /**
   * Computes the MD5 digest for this byte sequence.
   *
   * @deprecated
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the MD5 digest.
   */
  toMd5Digest(): Promise<ByteSequence> {
    return this.toDigest(Digest.Md5);
  }

  /**
   * Computes the SRI integrity (Base64-encoded digest).
   *
   * @param algorithm - The digest algorithm.
   * @returns The `Promise` that fulfills with a SRI integrity (base64-encoded digest).
   * @see [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
   */
  async #integrity(
    algorithm: Digest.Algorithm,
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
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * generated from the specified string by the specified text encoding.
   *
   * @param text - The string.
   * @param encoder - The text encoder, for example `TextEncoder`.
   *    The default is UTF-8 encoder, which does not add or remove BOM.
   * @returns A new `ByteSequence` object.
   * @example
   * ```javascript
   * const bytes = ByteSequence.fromText("富士山");
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
   * const bytes = ByteSequence.fromText("富士山", eucJp);
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
   * const bytes = ByteSequence.fromText("富士山", utf8);
   * // bytes.toArray()
   * //   → [ 0xEF, 0xBB, 0xBF, 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
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
    // Node.jsのBufferを返すエンコーダーだとプールが余計
    return ByteSequence.fromArrayBufferView(encoded);
  }

  /**
   * Returns a decoded string by the specified text encoding of this bytes.
   *
   * @param decoder - The text decoder, for example `TextDecoder`.
   *    The default is UTF-8 decoder, which does not add or remove BOM.
   * @returns A string decoded in the specified text encoding.
   * @throws TODO デコードできなかった
   * @example
   * ```javascript
   * const bytes = ByteSequence.of(0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1);
   * const text = bytes.toText();
   * // text
   * //   → "富士山"
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
   * const text = bytes.toText(utf8);
   * // text
   * //   → "富士山"
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
  static async fromBlob(blob: Blob): Promise<ByteSequence> {
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
   * Returns the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object representing this byte sequence.
   *
   * @param options - The [`BlobPropertyBag`](https://www.w3.org/TR/FileAPI/#dfn-BlobPropertyBag) object, but `endings` property is ignored.
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

    return new _File([this.#buffer], fileName, {
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
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static fromDataURL(dataUrl: URL | string): ByteSequence {
    const { data } = DataURL.Resource.from(dataUrl);
    return new ByteSequence(data);
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
   * //   → "data:application/octet-stream;base64,5a+M5aOr5bGx"
   * ```
   */
  toDataURL(options?: BlobPropertyBag): URL {
    // XXX Base64なしも対応する
    if (options?.type) {
      const resource = DataURL.Resource.create(
        options.type,
        this.toArrayBuffer(),
      );
      return resource.toURL();
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
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  static async fromStream(
    source: BytesStream.Source,
    options?: Reading.Options,
    onProgressChange?: (event: ProgressEvent) => void,
  ): Promise<ByteSequence> {
    if (
      Response && (source instanceof ReadableStream) && !options &&
      !onProgressChange
    ) {
      const bytes = await (new Response(source)).arrayBuffer();
      return new ByteSequence(bytes);
    } else {
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
        // "load"はない。resolveされたら完了なので不要。
        // "abort"はない。reasonがAbortErrorでrejectされたらアボートなので不要。
        // "timeout"はAbortSignal.timeoutが登場したので廃止した。
        // "error"はない。reasonがAbortError以外でrejectされたら異常終了なので不要。
        task.addEventListener(
          "loadend",
          onProgressChange as EventListener,
          listenerOptions,
        );
      }

      const bytes = await task.run();
      return new ByteSequence(bytes.buffer);
    }
  }

  /**
   * @experimental
   */
  toStream(): ReadableStream<Uint8Array> {
    return this.toBlob().stream();
  }

  // static async fromCompressed(): Promise<ByteSequence> {
  // }

  // async toCompressed(): Promise<ByteSequence> {
  // }

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
   * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // request.headers.get("Content-Type")
   * //   → "application/octet-stream"
   * ```
   */
  toRequest(url: string, options: RequestInit): Request {
    const headers = _HttpUtilsEx.createHeaders(options?.headers);
    const method = options.method ?? Http.Method.GET;
    if (
      ([Http.Method.GET, Http.Method.HEAD] as string[]).includes(
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
   * //   → Uint8Array[ 0x0, 0xB1, 0xB1 ]
   *
   * // bytes.toArray()
   * //   → Uint8Array[ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  subsequence(start: number, end?: number): ByteSequence {
    if (SafeInteger.isNonNegativeSafeInteger(start) !== true) {
      throw new TypeError("start");
    }
    if (start > this.byteLength) {
      throw new RangeError("start");
    }

    if (typeof end === "number") {
      if (SafeInteger.isNonNegativeSafeInteger(end) !== true) {
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
   * //   → Uint8Array[ 0xE5, 0xAF, 0x8C ]
   * // subsequenceClones[1]
   * //   → Uint8Array[ 0xE5, 0xA3, 0xAB ]
   * // subsequenceClones[2]
   * //   → Uint8Array[ 0xE5, 0xB1, 0xB1 ]
   * ```
   */
  segment(segmentByteLength: number): IterableIterator<ByteSequence> {
    if (SafeInteger.isPositiveSafeInteger(segmentByteLength) !== true) {
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
   * //   → Uint8Array[ 0xE5, 0xB1, 0xB1 ]
   *
   * uint8ViewPart.fill(0);
   *
   * // bytes.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0x0, 0x0, 0x0 ]
   * ```
   */
  getView<T extends ArrayBufferView>(
    ctor: ArrayBufferViewConstructor<T> =
      Uint8Array as unknown as ArrayBufferViewConstructor<T>,
    byteOffset = 0,
    byteLength: number = (this.byteLength - byteOffset),
  ): T {
    let bytesPerElement: number;
    if (ArrayBufferViewConstructor.isTypedArrayConstructor(ctor)) {
      bytesPerElement = ctor.BYTES_PER_ELEMENT;
      new Uint8ClampedArray();
    } else if (ArrayBufferViewConstructor.isDataViewConstructor(ctor)) {
      bytesPerElement = 1;
    } else {
      throw new TypeError("ctor");
    }

    if (SafeInteger.isNonNegativeSafeInteger(byteOffset) !== true) {
      throw new TypeError("byteOffset");
    } else if (
      (byteOffset > this.byteLength) || ((byteOffset % bytesPerElement) !== 0)
    ) {
      throw new RangeError("byteOffset");
    }

    if (SafeInteger.isNonNegativeSafeInteger(byteLength) !== true) {
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
   * @param byteOffset - The offset, in bytes.
   * @param byteLength - The length of the `ArrayBufferView`, in bytes.
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
   * Determines whether this byte sequence is equal to the byte sequence represented by another object.
   *
   * @param otherBytes - The object that represents a byte sequence.
   * @returns If this is equal to the specified byte sequence, `true`; otherwise, `false`.
   * @throws {TypeError} The `otherBytes` is not type of `Bytes`.
   */
  equals(otherBytes: Bytes): boolean {
    if (otherBytes instanceof ByteSequence) {
      return BufferUtils.bytesAEqualsBytesB(this.#view, otherBytes.#view);
    } else if (
      (otherBytes instanceof ArrayBuffer) ||
      (otherBytes instanceof Uint8Array) ||
      (otherBytes instanceof Uint8ClampedArray)
    ) {
      return BufferUtils.bytesAEqualsBytesB(this.#view, otherBytes);
    } else if (ArrayBuffer.isView(otherBytes)) {
      return BufferUtils.bytesAEqualsBytesB(this.#view, otherBytes.buffer);
    }

    try {
      const bytes = BufferUtils.fromUint8Iterable(otherBytes);
      return BufferUtils.bytesAEqualsBytesB(this.#view, bytes);
    } catch (exception) {
      throw new TypeError(`otherBytes (${exception.message})`);
    }
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
      return BufferUtils.bytesAStartsWithBytesB(this.#view, otherBytes.#view);
    } else if (
      (otherBytes instanceof ArrayBuffer) ||
      (otherBytes instanceof Uint8Array) ||
      (otherBytes instanceof Uint8ClampedArray)
    ) {
      return BufferUtils.bytesAStartsWithBytesB(this.#view, otherBytes);
    } else if (ArrayBuffer.isView(otherBytes)) {
      return BufferUtils.bytesAStartsWithBytesB(this.#view, otherBytes.buffer);
    }

    try {
      const bytes = BufferUtils.fromUint8Iterable(otherBytes);
      return BufferUtils.bytesAStartsWithBytesB(this.#view, bytes);
    } catch (exception) {
      throw new TypeError(`otherBytes (${exception.message})`);
    }
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
   * const { data, options } = await ByteSequence.withMetadataFromBlob(blob);
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
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
      mediaType = MediaType.fromString(blob.type); // パース失敗で例外になる場合あり
    }

    let fileName: string | undefined = undefined;
    let fileLastModified: number | undefined = undefined;
    if (("File" in globalThis) && (blob instanceof _File)) {
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
    //   // MediaTypeのパース失敗

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
   * const { data, options } = await ByteSequence.withMetadataFromDataURL("data:application/octet-stream;base64,5a+M5aOr5bGx");
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
   * ```
   */
  static withMetadataFromDataURL(
    dataUrl: URL | string,
  ): {
    data: ByteSequence;
    options?: BlobPropertyBag | FilePropertyBag;
    //fileName?: string
  } {
    const resource = DataURL.Resource.from(dataUrl);
    return {
      data: ByteSequence.wrapArrayBuffer(resource.data),
      options: {
        type: resource.type,
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
   * const { data, options } = await ByteSequence.withMetadataFromRequestOrResponse(request);
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
   * const { data, options } = await ByteSequence.withMetadataFromRequestOrResponse(response);
   * // data.toArray()
   * //   → [ 0xE5, 0xAF, 0x8C, 0xE5, 0xA3, 0xAB, 0xE5, 0xB1, 0xB1 ]
   * // options.type
   * //   → "application/octet-stream"
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
      mediaType = MediaType.fromHeaders(reqOrRes.headers);
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
      //TODO fileName content-dispositionからとるとか？
    };
  }
}

type BytesSource = Iterable<number>;

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
