//

// バイト列

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
import { WebMessageUtils } from "./web_message_utils";

const {
  ASCII_WHITESPACE,
} = StringUtils.RangePattern;

/**
 * バイト列を表す整数の配列
 */
type ByteArray = Array<number> | BufferSource;

/**
 * バイト列を表すオブジェクト
 */
type Bytes = ByteSequence | ByteArray;

const utf8TextEncoder = new TextEncoder();

const utf8TextDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

type Metadata = {
  mediaType: MediaType | null,
  // fileName, ...
}

type WebMessage = Request | Response;

type WebMessageReadingOptions = {
  ignoreHttpStatus: boolean,
  readAs: "blob" | "stream",
};// TODO default options

/**
 * バイト列
 */
class ByteSequence {
  // TODO 丸ごとコピーしたときmetadataもコピーすべき？duplicateとかfromとか
  static #metadataStore = new WeakMap<ByteSequence, Metadata>();

  /**
   * 内部表現
   */
  #buffer: ArrayBuffer;

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
    Object.freeze(this);
  }

  /**
   * バイト数
   */
  get count(): number {
    return this.#buffer.byteLength;
  }

  /**
   * 自身が参照しているArrayBufferへの参照を返却
   *     ※返却値に変更をくわえた場合、当インスタンスに影響する
   */
  get buffer(): ArrayBuffer {
    return this.#buffer;
  }

  /**
   * 自身のArrayBufferのビューを返却
   */
  get view(): Uint8Array {
    return new Uint8Array(this.#buffer); // freezeなどされても困るので毎度生成する
  }

  static #storedMediaType(bytes: ByteSequence): MediaType | null {
    const mediaType = ByteSequence.#metadataStore.get(bytes)?.mediaType;
    return mediaType ? mediaType : null;
  }
  
  /**
   * Create a new instance of `ByteSequence` of the specified size.
   * Its bytes are initialized to 0.
   * 
   * @param byteCount - The size, in bytes.
   * @returns A new `ByteSequence` object.
   */
  static allocate(byteCount: number): ByteSequence {
    if (NumberUtils.isNonNegativeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    return new ByteSequence(new ArrayBuffer(byteCount));
  }

  /**
   * バイト列をもとにインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成しない
   *     ※bytesがArrayBufferViewの場合、ビューのbyteOffset,byteLengthは無視する（ビュー.bufferを使用するのみ）
   * 
   * @param bytes バイト列
   * @returns 生成したインスタンス
   */
  static wrap(bytes: BufferSource): ByteSequence {
    let bytesSrc: ArrayBuffer;
    if (ArrayBuffer.isView(bytes)) {
      bytesSrc = bytes.buffer;
    }
    else if (bytes instanceof ArrayBuffer) {
      bytesSrc = bytes;
    }
    else {
      throw new TypeError("bytes");
    }
    return new ByteSequence(bytesSrc);
  }

  /**
   * バイト列をもとにインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   *     ※bytesがArrayBufferViewの場合、ビューの範囲外は無視する
   * 
   * @param bytes バイト列
   * @returns 生成したインスタンス
   */
  static from(bytes: Bytes): ByteSequence {
    let bytesSrc: ArrayBuffer;
    if (bytes instanceof ByteSequence) {
      bytesSrc = bytes.buffer.slice(0);
    }
    else if (ArrayBuffer.isView(bytes)) {
      bytesSrc = bytes.buffer.slice(bytes.byteOffset, (bytes.byteOffset + bytes.byteLength));
    }
    else if (bytes instanceof ArrayBuffer) {
      bytesSrc = bytes.slice(0);
    }
    else if (Array.isArray(bytes) && bytes.every((byte) => Uint8.isUint8(byte))) {
      bytesSrc = Uint8Array.from(bytes).buffer;
    }
    else {
      throw new TypeError("bytes");
    }
    return new ByteSequence(bytesSrc);
  }

  /**
   * 自身のバイト列を表す整数の配列を生成し返却
   *     ※ArrayBufferは新たに生成する
   * 
   * @returns バイト列を表す整数の配列
   */
  toUint8Array(): Uint8Array {
    return new Uint8Array(this.#buffer.slice(0));
  }

  /**
   * 自身のバイト列を表す整数の配列を生成し返却
   * 
   * @returns バイト列を表す整数の配列
   */
  toArray(): Array<uint8> {
    return Array.from(this.toUint8Array()) as Array<uint8>;
  }

  /**
   * バイト列を表す整数の配列をもとにインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * 
   * @param bytes - バイト列を表す整数の配列
   * @returns 生成したインスタンス
   */
  static of(...bytes: Array<number>): ByteSequence {
    return ByteSequence.from(bytes);
  }

  /**
   * ランダムなバイトからなるインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * 
   * @param {number} byteCount - 生成するバイト列のバイト数
   *     RandomSource.getRandomValuesの制約により、最大値は65536
   * @returns 生成したインスタンス
   */
  static generateRandom(byteCount: number): ByteSequence {
    if (NumberUtils.isNonNegativeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    if (byteCount > 65536) {
      throw new RangeError("byteCount");
    }

    const randomBytes = crypto.getRandomValues(new Uint8Array(byteCount));
    return new ByteSequence(randomBytes.buffer);
  }

  /**
   * バイト列を表すBinary stringを同型符号化し、インスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * 
   * @param binaryString - バイト列を表すBinary string
   * @returns 生成したインスタンス
   */
  static fromBinaryString(binaryString: string): ByteSequence {
    const bytes = IsomorphicEncoding.encode(binaryString);
    return new ByteSequence(bytes.buffer);
  }

  /**
   * 自身のバイト列を同型復号し、結果のBinary stringを生成し返却
   * 
   * @returns Binary string
   */
  toBinaryString(): string {
    return IsomorphicEncoding.decode(this.#buffer);
  }

  /**
   * バイト列をフォーマットした文字列からインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * 
   * @param format - フォーマッター
   * @returns 生成したインスタンス
   */
  static parse(toParse: string, options?: ByteFormatOptions): ByteSequence {
    const parsed = ByteFormat.parse(toParse, options);
    return new ByteSequence(parsed.buffer);
  }

  /**
   * 自身のバイト列をフォーマットした文字列を生成し返却
   * 
   * @param format - フォーマッター
   * @returns バイト列をフォーマットした文字列
   */
  format(options?: ByteFormatOptions): string {
    return ByteFormat.format(this.view, options);
  }

  /**
   * Base64符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * 
   * @param base64Encoded - Base64符号化された文字列
   * @param options - 符号化方式のオプション
   * @returns 生成したインスタンス
   */
  static fromBase64Encoded(base64Encoded: string, options?: Base64Options): ByteSequence {
    const decoded = Base64.decode(base64Encoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * 自身のバイト列をBase64符号化した文字列を返却
   * 
   * @param options - 符号化方式のオプション
   * @returns Base64符号化した文字列
   */
  toBase64Encoded(options?: Base64Options): string {
    return Base64.encode(this.view, options);
  }

  /**
   * パーセント符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * 
   * @param percentEncoded パーセント符号化された文字列
   * @param options 符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromPercentEncoded(percentEncoded: string, options?: PercentOptions): ByteSequence {
    const decoded = Percent.decode(percentEncoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * 自身のバイト列をパーセント符号化した文字列を返却
   * 
   * @param options - 符号化方式のオプション
   * @returns パーセント符号化した文字列
   */
  toPercentEncoded(options?: PercentOptions): string {
    return Percent.encode(this.view, options);
  }

  /**
   * 自身のバイト列をフォーマットした文字列を生成し返却
   * 
   * @override
   * @returns 自身のバイト列をフォーマットした文字列
   */
  toString(): string {
    return this.format();
  }

  /**
   * 自身のバイト列を表す整数の配列を生成し返却
   * 
   * @returns 自身のバイト列を表す整数の配列
   */
  toJSON(): Array<uint8> {
    return this.toArray();
  }

  /**
   * 自身のバイト列のSHA-256ハッシュを生成し返却
   * 
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toSha256Digest(): Promise<ByteSequence> {
    return this.toDigest(Sha256);
  }

  /**
   * 自身のバイト列のSHA-384ハッシュを生成し返却
   * 
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toSha384Digest(): Promise<ByteSequence> {
    return this.toDigest(Sha384);
  }

  /**
   * 自身のバイト列のSHA-512ハッシュを生成し返却
   * 
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toSha512Digest(): Promise<ByteSequence> {
    return this.toDigest(Sha512);
  }

  /**
   * 自身のバイト列のハッシュを生成し返却
   * 
   * @param algorithmName - ハッシュアルゴリズム
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toDigest(algorithm: DigestAlgorithm): Promise<ByteSequence> {
    const digest = await algorithm.compute(this.view);
    return new ByteSequence(digest.buffer);
  }

  /**
   * 自身のバイト列の部分複製を生成し返却
   *     ※参照するArrayBufferも複製する
   * 
   * @param start 開始インデックス
   * @param end 終了インデックス
   * @returns 自身のバイト列の部分複製
   */
  subsequence(start: number, end?: number): ByteSequence {
    if (NumberUtils.isNonNegativeInteger(start) !== true) {
      throw new TypeError("start");
    }
    if (start > this.count) {
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
   * 自身のバイト列の複製を生成し返却
   *     ※参照するArrayBufferも複製する
   * 
   * @returns 自身のバイト列の複製
   */
  duplicate(): ByteSequence {
    return new ByteSequence(this.#buffer.slice(0));
  }

  /**
   * 自身のArrayBufferのビューを返却
   * 
   * @param byteOffset - ビューのオフセット
   * @param byteCount - ビューのバイト数
   * @returns 自身のArrayBufferのビュー
   */
  viewScope(byteOffset: number, byteCount: number): Uint8Array {
    if (NumberUtils.isNonNegativeInteger(byteOffset) !== true) {
      throw new TypeError("byteOffset");
    }
    if (byteOffset > this.count) {
      throw new RangeError("byteOffset");
    }

    if (NumberUtils.isNonNegativeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    if (byteCount > (this.count - byteOffset)) {
      throw new RangeError("byteCount");
    }

    return new Uint8Array(this.#buffer, byteOffset, byteCount);
  }

  /**
   * 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否かを返却
   * 
   * @param otherBytes バイト列
   * @returns 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否か
   */
  #startsWith(otherBytes: ByteArray): boolean {
    const thisView = this.view;
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
   * 自身のバイト列と、他のオブジェクトの表すバイト列が等しいか否かを返却
   * 
   * @param bytes バイト列
   * @returns 自身のバイト列と、他のオブジェクトの表すバイト列が等しいか否か
   */
  equals(bytes: Bytes): boolean {
    if (bytes instanceof ByteSequence) {
      if (bytes.count !== this.count) {
        return false;
      }
      return this.#startsWith(bytes.buffer);
    }
    else {
      const bytesCount = ((bytes instanceof ArrayBuffer) || ArrayBuffer.isView(bytes)) ? bytes.byteLength : bytes.length;
      if (bytesCount !== this.count) {
        return false;
      }
      return this.#startsWith(bytes);
    }
  }

  /**
   * 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否かを返却
   * 
   * @param bytes バイト列
   * @returns 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否か
   */
  startsWith(bytes: Bytes): boolean {
    if (bytes instanceof ByteSequence) {
      return this.#startsWith(bytes.buffer);
    }
    else {
      return this.#startsWith(bytes);
    }
  }

  /**
   * 指定したバイト数毎に自身のバイト列の部分複製を生成し返却するジェネレーター
   *     ※参照するArrayBufferも複製する
   * 
   * @param segmentByteCount 分割するバイト数
   * @returns 自身のバイト列の部分複製を返却するジェネレーター
   */
  segments(segmentByteCount: number): Generator<ByteSequence, void, void> {
    if (NumberUtils.isPositiveInteger(segmentByteCount) !== true) {
      throw new TypeError("segmentByteCount");
    }

    return (function*(bytes: ByteSequence): Generator<ByteSequence, void, void> {
      let i = 0;
      let itemLength = segmentByteCount;
      while (i < bytes.count) {
        if ((i + segmentByteCount) > bytes.count) {
          itemLength = bytes.count - i;
        }
        yield bytes.subsequence(i, i + itemLength);
        i = i + segmentByteCount;
      }
    })(this);
  }

  /**
   * 文字列をUTF-8で符号化したバイト列からインスタンスを生成し返却
   * 
   * @param text 文字列
   * @returns 生成したインスタンス
   */
  static utf8EncodeFrom(text: string): ByteSequence {
    const encoded = utf8TextEncoder.encode(text);
    return new ByteSequence(encoded.buffer);
  }

  /**
   * バイト列をUTF-8で復号し、文字列を返却
   * 
   * @param encodingName 文字符号化方式名
   * @returns 文字列
   */
  utf8DecodeTo(): string {
    return utf8TextDecoder.decode(this.view);
  }
  // TODO BOM

  /**
   * 文字列を指定した符号化器で符号化したバイト列からインスタンスを生成し返却
   * 
   * @param text 文字列
   * @param encoder 符号化器
   * @returns 生成したインスタンス
   */
  static textEncodeFrom(text: string, encoder: { encode: (input?: string) => Uint8Array } = utf8TextEncoder): ByteSequence {
    const encoded = encoder.encode(text);
    // return new ByteSequence(encoded.buffer);// Node.jsのBufferを返すエンコーダーだとプールが余計
    return ByteSequence.from(encoded);
  }

  /**
   * バイト列を指定した復号器で復号し、文字列を返却
   * 
   * @param encodingName 文字符号化方式名
   * @param decoder 復号器
   * @returns 文字列
   */
  textDecodeTo(decoder: { decode: (input?: Uint8Array) => string } = utf8TextDecoder): string {
    return decoder.decode(this.view);
  }

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
   * 可読ストリームを読み取り、読み取ったバイト列からインスタンスを生成し返却
   * 
   * @experimental
   * @param stream - Uint8Arrayの可読ストリーム
   * @param totalByteCount - ストリームから読み取るバイト数
   * @returns 生成したインスタンス
   */
  static async fromStream(stream: ReadableStream<Uint8Array>, totalByteCount?: number): Promise<ByteSequence> {
    const progress = ByteSequence.createStreamReadingProgress(stream, { total: totalByteCount });
    const bytes = await progress.initiate();
    return new ByteSequence(bytes.buffer);
  }

  /**
   * Blobからインスタンスを生成し返却
   * 
   * @param blob Blob
   * @returns 生成したインスタンス
   */
  static async fromBlob(blob: Blob): Promise<ByteSequence> {
    try {
      const buffer = await blob.arrayBuffer(); // XXX Node.jsでもstream()を取得できるようになった
      const bytes = ByteSequence.wrap(buffer);
      if (blob.type) {
        const mediaType = MediaType.fromString(blob.type); // パース失敗で例外になる場合あり
        ByteSequence.#metadataStore.set(bytes, { mediaType });
      }

      return bytes;
    }
    catch (exception) {
      // Blob#arrayBufferでの NotFoundError | SecurityError | NotReadableError
      // またはMediaTypeのパース失敗

      // TODO throw new Error("reading failed", { cause: exception });
      throw new Error("reading failed");
    }
  }

  /**
   * 自身のメディアタイプとバイト列からBlobを生成し返却
   * 
   * @returns Blob
   */
  toBlob(preferredType?: MediaType | string): Blob {
    const resolvedType: MediaType | null = this.#resolveMediaType(preferredType);
    let options: BlobPropertyBag | undefined;
    if (resolvedType) {
      options = { type: resolvedType.toString() };
    }
    return new Blob([ this.#buffer ], options);
  }

  #resolveMediaType(preferredType?: MediaType | string): MediaType | null {
    if (typeof preferredType === "string") {
      return MediaType.fromString(preferredType);
    }
    else if (preferredType instanceof MediaType) {
      return preferredType;
    }
    else {
      return ByteSequence.#storedMediaType(this);
    }
  }

  /**
   * Data URLからインスタンスを生成し返却
   * 
   * {@link [Fetch Standard](https://fetch.spec.whatwg.org/#data-urls)}の仕様に従った。
   * 最初に出現した","をメディアタイプとデータの区切りとみなす。（メディアタイプのquotedなパラメーター値に含まれた","とみなせる場合であっても区切りとする）
   * クエリはデータの一部とみなす。
   * 
   * @param dataUrl Data URL
   * @returns 生成したインスタンス
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
    parsed.hash = "";

    // 3, 4
    let bodyStringWork = parsed.toString().substring(5);

    // 5, 6, 7
    if (bodyStringWork.includes(",") !== true) {
      throw new TypeError("U+002C not found");
    }

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
    ByteSequence.#metadataStore.set(bytes, { mediaType });

    return bytes;
  }

  /**
   * 自身のメディアタイプとバイト列からData URLを生成し返却
   * 
   * FileReaderの仕様に倣い、テキストかどうかに関係なく常時Base64エンコードする。
   * //XXX Base64なしもできるようにする？
   * 
   * @returns Data URL
   */
  toDataURL(preferredType?: string | MediaType): URL {
    const resolvedType: MediaType | null = this.#resolveMediaType(preferredType);
    if (resolvedType) {
      // let encoding = "";
      // let dataEncoded: string;
      // if (base64) {
      const encoding = ";base64";
      const dataEncoded = this.toBase64Encoded();
      // }

      return new URL("data:" + resolvedType.toString() + encoding + "," + dataEncoded);
    }
    throw new TypeError("MIME type not resolved");
  }

  /**
   * Computes the SRI integrity (Base64-encoded digest).
   * 
   * @see {@link [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)}
   * @param algorithm The digest algorithm.
   * @returns The {@link [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)} that
   *     fulfills with a SRI integrity (base64-encoded digest).
   */
  async #toIntegrity(algorithm: DigestAlgorithm, prefix: string): Promise<string> {
    // algorithmは2021-12時点でSHA-256,SHA-384,SHA-512のどれか
    const digestBytes = await this.toDigest(algorithm);
    return prefix + digestBytes.toBase64Encoded();
  }

  async toSha256Integrity(): Promise<string> {
    return this.#toIntegrity(Sha256, "sha256-");
  }

  async toSha384Integrity(): Promise<string> {
    return this.#toIntegrity(Sha384, "sha384-");
  }

  async toSha512Integrity(): Promise<string> {
    return this.#toIntegrity(Sha512, "sha512-");
  }

  /**
   * 想定用途
   * ・ブラウザのfetchでのResponseのcontent取得
   * ・DenoのfetchでのResponseのcontent取得
   * ・Denoのstd/httpでのRequestのcontent取得
   * など
   * 
   * @experimental
   * TODO options を任意に
   * TODO signal,timeout
   * TODO createReadingProgress
   */
  static async fromWebMessage(message: WebMessage, options: WebMessageReadingOptions): Promise<ByteSequence | null> {
    if (message.body) {
      if (message instanceof Response) {
        if ((message.ok !== true) && (options.ignoreHttpStatus !== true)) {
          throw new Error(`HTTP status: ${ message.status }`);
        }
      }

      if (options.readAs === "blob") {
        const blob = await message.blob();
        return ByteSequence.fromBlob(blob);
      }

      const mediaType = WebMessageUtils.extractContentType(message.headers);
      if (message.body !== null) {
        // メモ
        // ・Transfer-Encodingがchunkedであってもfetch API側でまとめてくれるので、考慮不要
        // ・Content-Encodingで圧縮されていてもfetch API側で展開してくれるので、展開は考慮不要
        //    ただしその場合、Content-Lengthは展開結果のバイト数ではない

        const size = WebMessageUtils.extractContentLength(message.headers);
        const bytes = await ByteSequence.fromStream(message.body, size ? size : undefined);
        ByteSequence.#metadataStore.set(bytes, { mediaType });
        return bytes;
      }
    }
    return null;
  }
}
Object.freeze(ByteSequence);

export { ByteSequence };
