//

import {
  type uint8,
  type ByteFormatOptions,
  type DigestAlgorithm,
  type TransferOptions,
  ByteBuffer,
  ByteFormat,
  IsomorphicEncoding,
  NumberUtils,
  Sha256,
  Sha384,
  Sha512,
  StreamUtils,
  StringUtils,
  TransferProgress,
  Uint8,
} from "@i-xi-dev/fundamental";
import {
  type Base64Options,
  Base64,
} from "@i-xi-dev/base64";
import {
  type PercentOptions,
  Percent,
} from "@i-xi-dev/percent";
import { MediaType } from "@i-xi-dev/mimetype";
import {
  type ResourceMetadata,
  type ResourceMetadataStore,
  MetadataMap,
} from "./metadata";
// import { WebMessageUtils } from "./web_message_utils";

const {
  ASCII_WHITESPACE,
} = StringUtils.RangePattern;

/**
 * A typedef that representing a `ByteSequence`, [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource), or `Array` of 8-bit unsigned integers.
 */
type Bytes = ByteSequence | BufferSource | Array<number>;

const utf8TextEncoder = new TextEncoder();

const utf8TextDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

// type WebMessage = Request | Response;

// type WebMessageReadingOptions = {
//   ignoreHttpStatus: boolean,
//   readAs: "blob" | "stream",
// };// XXX default options

function isTypedArrayConstructor(value: unknown): value is (Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor | BigUint64ArrayConstructor | BigInt64ArrayConstructor) {
  return ((value === Uint8Array) || (value === Uint8ClampedArray) || (value === Int8Array) || (value === Uint16Array) || (value === Int16Array) || (value === Uint32Array) || (value === Int32Array) || (value === Float32Array) || (value === Float64Array) || (value === BigUint64Array) || (value === BigInt64Array));
}

function isDataViewConstructor(value: unknown): value is DataViewConstructor {
  return value === DataView;
}

type ArrayBufferViewConstructor<T> = { new(a: ArrayBuffer, b?: number, c?: number): T };

/**
 * Byte sequence
 */
class ByteSequence {
  /**
   * A metadata store for the instances of byte sequence.
   */
  static MetadataStore: ResourceMetadataStore<ByteSequence> = new MetadataMap();

  static #storeMetadata(instance: ByteSequence, metadata: ResourceMetadata): void {
    (ByteSequence.MetadataStore as MetadataMap<ByteSequence>).put(instance, metadata);
  }

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
   */
  get byteLength(): number {
    return this.#buffer.byteLength;
  }

  /**
   * Gets the underlying `ArrayBuffer`.
   */
  get buffer(): ArrayBuffer {
    return this.#buffer;
  }

  /**
   * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-256 digest for this byte sequence.
   */
  get sha256Integrity(): Promise<string> {
    return this.#integrity(Sha256, "sha256-");
  }

  /**
   * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-384 digest for this byte sequence.
   */
  get sha384Integrity(): Promise<string> {
    return this.#integrity(Sha384, "sha384-");
  }

  /**
   * Returns the `Promise` that fulfills with a [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) string with Base64-encoded SHA-512 digest for this byte sequence.
   */
  get sha512Integrity(): Promise<string> {
    return this.#integrity(Sha512, "sha512-");
  }

  /**
   * Creates a new instance of `ByteSequence` of the specified size.
   * Its bytes are filled with zeros.
   * 
   * @param byteLength - The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   */
  static allocate(byteLength: number): ByteSequence {
    if (NumberUtils.isNonNegativeInteger(byteLength) !== true) {
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
   * @param ctor - The `ArrayBufferView`s constructor.
   * @returns The `ArrayBufferView`.
   */
  toArrayBufferView<T extends ArrayBufferView>(ctor: ArrayBufferViewConstructor<T> = Uint8Array as unknown as ArrayBufferViewConstructor<T>): T {
    let bytesPerElement: number;
    if (isTypedArrayConstructor(ctor)) {
      bytesPerElement = ctor.BYTES_PER_ELEMENT;
    }
    else if (isDataViewConstructor(ctor)) {
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
   * @param bufferSource - The object that represents a byte sequence.
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
   * @param byteArray - The 8-bit unsigned integer `Array` representing this byte sequence.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteArray` is not an 8-bit unsigned integer `Array`.
   */
  static fromArray(byteArray: Array<number>): ByteSequence {
    if (Array.isArray(byteArray) && byteArray.every((byte) => Uint8.isUint8(byte))) {
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
   * Creates a new instance of `ByteSequence` of the specified size.
   * Its bytes are filled with random values.
   * 
   * @param {number} byteLength - The size, in bytes.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `byteLength` is not non-negative integer.
   * @throws {RangeError} The `byteLength` is greater than 65536.
   */
  static generateRandom(byteLength: number): ByteSequence {
    if (NumberUtils.isNonNegativeInteger(byteLength) !== true) {
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
   * @param binaryString - The [binary string](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary).
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
   * @param formattedBytes - The string to parse.
   * @param options - The `ByteFormatOptions` dictionary.
   * @returns A new `ByteSequence` object.
   */
  static parse(formattedBytes: string, options?: ByteFormatOptions): ByteSequence {
    const parsed = ByteFormat.parse(formattedBytes, options);
    return new ByteSequence(parsed.buffer);
  }

  /**
   * Returns the string contains formatted bytes.
   * 
   * @param options - The `ByteFormatOptions` dictionary.
   * @returns The string contains formatted bytes.
   */
  format(options?: ByteFormatOptions): string {
    return ByteFormat.format(this.#view, options);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Base64-encoded bytes.
   * 
   * @param base64Encoded - The string to decode.
   * @param options - The `Base64Options` dictionary.
   * @returns A new `ByteSequence` object.
   */
  static fromBase64Encoded(base64Encoded: string, options?: Base64Options): ByteSequence {
    const decoded = Base64.decode(base64Encoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * Returns the string contains Base64-encoded bytes of this byte sequence.
   * 
   * @param options - The `Base64Options` dictionary.
   * @returns The string contains Base64-encoded bytes.
   */
  toBase64Encoded(options?: Base64Options): string {
    return Base64.encode(this.#view, options);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the string contains Percent-encoded bytes.
   * 
   * @param percentEncoded - The string to decode.
   * @param options - The `PercentOptions` dictionary.
   * @returns A new `ByteSequence` object.
   */
  static fromPercentEncoded(percentEncoded: string, options?: PercentOptions): ByteSequence {
    const decoded = Percent.decode(percentEncoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * Returns the string contains Percent-encoded bytes of this byte sequence.
   * 
   * @param options - The `PercentOptions` dictionary.
   * @returns The string contains Percent-encoded bytes.
   */
  toPercentEncoded(options?: PercentOptions): string {
    return Percent.encode(this.#view, options);
  }

  /**
   * Computes the SHA-256 digest for this byte sequence.
   * 
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-256 digest.
   */
  async toSha256Digest(): Promise<ByteSequence> {
    return this.toDigest(Sha256);
  }

  /**
   * Computes the SHA-384 digest for this byte sequence.
   * 
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-384 digest.
   */
  async toSha384Digest(): Promise<ByteSequence> {
    return this.toDigest(Sha384);
  }

  /**
   * Computes the SHA-512 digest for this byte sequence.
   * 
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the SHA-512 digest.
   */
  async toSha512Digest(): Promise<ByteSequence> {
    return this.toDigest(Sha512);
  }

  /**
   * Computes the digest for this byte sequence.
   * 
   * @param algorithm - The digest algorithm.
   * @returns The `Promise` that fulfills with a `ByteSequence` object of the digest.
   */
  async toDigest(algorithm: DigestAlgorithm): Promise<ByteSequence> {
    const digest = await algorithm.compute(this.#view);
    return new ByteSequence(digest.buffer);
  }

  /**
   * Computes the SRI integrity (Base64-encoded digest).
   * 
   * @param algorithm - The digest algorithm.
   * @returns The `Promise` that fulfills with a SRI integrity (base64-encoded digest).
   * @see [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
   */
  async #integrity(algorithm: DigestAlgorithm, prefix: string): Promise<string> {
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
   * @param text - The string.
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
   * @param text - The string.
   * @param encoder - The text encoder, for example `TextEncoder`.
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
   * @param decoder - The text decoder, for example `TextDecoder`.
   * @returns A string decoded in the specified text encoding.
   */
  textDecodeTo(decoder: { decode: (input?: Uint8Array) => string } = utf8TextDecoder): string {
    return decoder.decode(this.#view);
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
   * 
   * @param blob - The `Blob` object (including `File` object).
   * @returns The `Promise` that fulfills with a new `ByteSequence` object.
   * @throws {Error} `blob.arrayBuffer()` is failed.
   */
  static async fromBlob(blob: Blob): Promise<ByteSequence> {
    try {
      const buffer = await blob.arrayBuffer(); // XXX Node.jsでもstream()を取得できるようになった
      const bytes = ByteSequence.wrapArrayBuffer(buffer);
      const metadata: ResourceMetadata = {};
      if (blob.type) {
        metadata.mediaType = MediaType.fromString(blob.type); // パース失敗で例外になる場合あり
      }
      if (globalThis.File && (blob instanceof File)) {
        metadata.fileName = blob.name;
      }
      if (metadata.mediaType || metadata.fileName) {
        ByteSequence.#storeMetadata(bytes, metadata);
      }

      return bytes;
    }
    catch (exception) {
      // Blob#arrayBufferでの NotFoundError | SecurityError | NotReadableError
      // またはMediaTypeのパース失敗

      // XXX throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  /**
   * Returns the [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object representing this byte sequence.
   * 
   * @param options - The `BlobPropertyBag` object, but `endings` property is ignored.
   * @returns The `Blob` object.
   */
  toBlob(options?: BlobPropertyBag): Blob {
    const resolvedMediaType: MediaType | null = this.#resolveMediaType(options?.type);

    return new Blob([ this.#buffer ], {
      type: resolvedMediaType ? resolvedMediaType.toString() : "",
    });
  }

  /**
   * Returns the [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object representing this byte sequence.
   * 
   * @param fileName - The file name.
   * @param options - The `FilePropertyBag` object, but `endings` property is ignored.
   * @returns The `File` object.
   */
  toFile(fileName?: string, options?: FilePropertyBag): File {
    const resolvedFileName: string | undefined = this.#resolveFileName(fileName);
    if ((typeof resolvedFileName === "string") && (resolvedFileName.length > 0)) {
      // ok
    }
    else {
      throw new TypeError("fileName");
    }

    const resolvedMediaType: MediaType | null = this.#resolveMediaType(options?.type);

    return new File([ this.#buffer ], resolvedFileName, {
      type: resolvedMediaType ? resolvedMediaType.toString() : "",
      lastModified: options?.lastModified ? options.lastModified : Date.now(),
    });
  }

  #resolveMediaType(preferredMediaType?: MediaType | string): MediaType | null {
    if (typeof preferredMediaType === "string") {
      return MediaType.fromString(preferredMediaType);
    }
    else if (preferredMediaType instanceof MediaType) {
      return preferredMediaType;
    }
    else {
      return ByteSequence.MetadataStore.getMediaType(this);
    }
  }

  #resolveFileName(preferredFileName?: string): string | undefined {
    if ((typeof preferredFileName === "string") && (preferredFileName.length > 0)) {
      return preferredFileName;
    }
    else {
      return ByteSequence.MetadataStore.getFileName(this);
    }
  }

  /**
   * Creates a new instance of `ByteSequence` with new underlying `ArrayBuffer`
   * created from the specified [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   * 
   * @see [https://fetch.spec.whatwg.org/#data-urls](https://fetch.spec.whatwg.org/#data-urls)
   * @param dataUrl - The data URL
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `dataUrl` parsing is failed.
   * @throws {TypeError} The URL scheme of the `dataUrl` is not "data".
   * @throws {TypeError} The `dataUrl` does not contain `","`.
   */
  static fromDataURL(dataUrl: URL | string): ByteSequence {
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
    // https://fetch.spec.whatwg.org/#data-urls に従い、（また、ブラウザの実装にあわせ）
    // ・フラグメントは無視する
    parsed.hash = "";

    // 3, 4
    let bodyStringWork = parsed.toString().substring(5);

    // 5, 6, 7
    if (bodyStringWork.includes(",") !== true) {
      throw new TypeError("U+002C not found");
    }

    // 最初に出現した","をメディアタイプとデータの区切りとみなす。
    // https://fetch.spec.whatwg.org/#data-urls に従い、（また、ブラウザの実装にあわせ）
    // ・メディアタイプのquotedなパラメーター値に含まれた","とみなせる場合であっても区切りとする
    // ・クエリはデータの一部とみなす
    const mediaTypeOriginal = bodyStringWork.split(",")[0] as string;
    let mediaTypeWork = StringUtils.trim(mediaTypeOriginal, ASCII_WHITESPACE);

    // 8, 9
    bodyStringWork = bodyStringWork.substring(mediaTypeOriginal.length + 1);

    // 10
    let bytes = ByteSequence.fromPercentEncoded(bodyStringWork);

    // 11
    const base64Indicator = /;[\u0020]*base64$/i;
    const base64: boolean = base64Indicator.test(mediaTypeWork);
    if (base64 === true) {
      // 11.1
      bodyStringWork = bytes.toBinaryString();

      // 11.2, 11.3
      bytes = ByteSequence.fromBase64Encoded(bodyStringWork);

      // 11.4, 11.5, 11.6
      mediaTypeWork = mediaTypeWork.replace(base64Indicator, "");
    }

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
    ByteSequence.#storeMetadata(bytes, { mediaType });

    return bytes;
  }

  /**
   * Returns the [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) representing this byte sequence.
   * 
   * @param options - The `BlobPropertyBag` object, but `endings` property is ignored.
   * @returns The [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
   * @throws {TypeError}
   */
  toDataURL(options?: BlobPropertyBag): URL {
    // FileReaderの仕様に倣い、テキストかどうかに関係なく常時Base64エンコードする仕様
    // XXX Base64なしも対応する
    const resolvedMediaType: MediaType | null = this.#resolveMediaType(options?.type);
    if (resolvedMediaType) {
      // let encoding = "";
      // let dataEncoded: string;
      // if (base64) {
      const encoding = ";base64";
      const dataEncoded = this.toBase64Encoded();
      // }

      return new URL("data:" + resolvedMediaType.toString() + encoding + "," + dataEncoded);
    }
    throw new TypeError("MIME type not resolved");
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
   * @param start - The subsequence start index.
   * @param end - The subsequence end index.
   * @returns A new `ByteSequence` object.
   * @throws {TypeError} The `start` is not non-negative integer.
   * @throws {RangeError} The `start` is greater than the `byteLength` of this.
   * @throws {TypeError} The `end` is not non-negative integer.
   * @throws {RangeError} The `end` is less than the `start`.
   */
  subsequence(start: number, end?: number): ByteSequence {
    if (NumberUtils.isNonNegativeInteger(start) !== true) {
      throw new TypeError("start");
    }
    if (start > this.byteLength) {
      throw new RangeError("start");
    }

    if (typeof end === "number") {
      if (NumberUtils.isNonNegativeInteger(end) !== true) {
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
   * @param byteOffset - The offset, in bytes.
   * @param byteLength - The length of the `ArrayBufferView`, in bytes.
   * @returns The `Uint8Array`.
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
   */
  getDataView(byteOffset?: number, byteLength?: number): DataView {
    return this.getView(DataView, byteOffset, byteLength);
  }

  /**
   * Returns the `ArrayBufferView` that views the underlying `ArrayBuffer` of this instance.
   * 
   * @param viewConstructor - The constructor of `ArrayBufferView`.
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
   */
  getView<T extends ArrayBufferView>(ctor: ArrayBufferViewConstructor<T> = Uint8Array as unknown as ArrayBufferViewConstructor<T>, byteOffset = 0, byteLength: number = (this.byteLength - byteOffset)): T {
    let bytesPerElement: number;
    if (isTypedArrayConstructor(ctor)) {
      bytesPerElement = ctor.BYTES_PER_ELEMENT;
      new Uint8ClampedArray();
    }
    else if (isDataViewConstructor(ctor)) {
      bytesPerElement = 1;
    }
    else {
      throw new TypeError("ctor");
    }

    if (NumberUtils.isNonNegativeInteger(byteOffset) !== true) {
      throw new TypeError("byteOffset");
    }
    else if ((byteOffset > this.byteLength) || ((byteOffset % bytesPerElement) !== 0)) {
      throw new RangeError("byteOffset");
    }

    if (NumberUtils.isNonNegativeInteger(byteLength) !== true) {
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
   * @param otherBytes - バイト列
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
    else if (Array.isArray(otherBytes) && otherBytes.every((byte) => Uint8.isUint8(byte))) {
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
    else if ((otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)) {
      if (otherBytes.byteLength !== this.byteLength) {
        return false;
      }
      return this.#startsWith(otherBytes);
    }
    else if (Array.isArray(otherBytes) && otherBytes.every((byte) => Uint8.isUint8(byte))) {
      if (otherBytes.length !== this.byteLength) {
        return false;
      }
      return this.#startsWith(otherBytes as Array<uint8>);
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
    else if ((otherBytes instanceof ArrayBuffer) || ArrayBuffer.isView(otherBytes)) {
      return this.#startsWith(otherBytes);
    }
    else if (Array.isArray(otherBytes) && otherBytes.every((byte) => Uint8.isUint8(byte))) {
      return this.#startsWith(otherBytes as Array<uint8>);
    }
    throw new TypeError("otherBytes");
  }

  /**
   * Returns a new iterator that contains byte sequences divided by the specified length.
   * 
   * @param segmentByteLength - The segment length, in bytes.
   * @returns A new iterator.
   * @throws {TypeError} The `segmentByteLength` is not non-negative integer.
   */
  segment(segmentByteLength: number): IterableIterator<ByteSequence> {
    if (NumberUtils.isPositiveInteger(segmentByteLength) !== true) {
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

  /**
   * @experimental
   * @param stream - 
   * @param options - 
   * @returns 
   */
  static createStreamReadingProgress(stream: ReadableStream<Uint8Array>, options?: TransferOptions): TransferProgress<ByteSequence> {
    const reader: ReadableStreamDefaultReader<Uint8Array> = stream.getReader();
    const totalUnitCount: number | undefined = ((typeof options?.total === "number") && NumberUtils.isNonNegativeInteger(options.total)) ? options.total : undefined;
    const buffer: ByteBuffer = new ByteBuffer(totalUnitCount);

    return new TransferProgress<Uint8Array, ByteSequence>({
      chunkGenerator: StreamUtils.streamToAsyncGenerator<Uint8Array>(reader),

      transferChunk(chunkBytes: Uint8Array): number {
        buffer.put(chunkBytes);
        return buffer.position;
      },

      terminate(): void {
        // this.#stream.cancel()しても読取終了まで待ちになるので、reader.cancel()する
        void reader.cancel().catch(); // XXX closeで良い？
      },

      transferredResult(): ByteSequence {
        let bytes: Uint8Array;
        if (buffer.capacity !== buffer.position) {
          bytes = buffer.slice();
        }
        else {
          bytes = buffer.subarray();
        }
        return new ByteSequence(bytes.buffer);
      },
    }, options);
  }

  /**
   * @experimental
   * @param stream - 
   * @param totalByteLength - 
   * @returns 
   */
  static async fromStream(stream: ReadableStream<Uint8Array>, totalByteLength?: number): Promise<ByteSequence> {
    const progress = ByteSequence.createStreamReadingProgress(stream, { total: totalByteLength });
    const bytes = await progress.initiate();
    return new ByteSequence(bytes.buffer);
  }

  // /**
  //  * 想定用途
  //  * ・ブラウザのfetchでのResponseのcontent取得
  //  * ・DenoのfetchでのResponseのcontent取得
  //  * ・Denoのstd/httpでのRequestのcontent取得
  //  * など
  //  * 
  //  * @experimental
  //  * XXX options を任意に
  //  * XXX signal,timeout
  //  * XXX createReadingProgress
  //  * @throws {Error}
  //  */
  // static async fromWebMessage(message: WebMessage, options: WebMessageReadingOptions): Promise<ByteSequence | null> {
  //   if (message.body) {
  //     if (message instanceof Response) {
  //       if ((message.ok !== true) && (options.ignoreHttpStatus !== true)) {
  //         throw new Error(`HTTP status: ${ message.status }`);
  //       }
  //     }

  //     if (options.readAs === "blob") {
  //       const blob = await message.blob();
  //       return ByteSequence.fromBlob(blob);
  //     }

  //     const mediaType = WebMessageUtils.extractContentType(message.headers);
  //     if (message.body !== null) {
  //       // メモ
  //       // ・Transfer-Encodingがchunkedであってもfetch API側でまとめてくれるので、考慮不要
  //       // ・Content-Encodingで圧縮されていてもfetch API側で展開してくれるので、展開は考慮不要
  //       //    ただしその場合、Content-Lengthは展開結果のバイト数ではない

  //       const size = WebMessageUtils.extractContentLength(message.headers);
  //       const bytes = await ByteSequence.fromStream(message.body, size ? size : undefined);
  //       ByteSequence.#storeMetadata(bytes, { mediaType });
  //       return bytes;
  //     }
  //   }
  //   return null;
  // }
}
Object.freeze(ByteSequence);

export {
  type Bytes,
  ByteSequence,
};
