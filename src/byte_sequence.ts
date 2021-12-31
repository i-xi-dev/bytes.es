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

/**
 * バイト列を表す整数の配列
 */
type ByteArray = Array<uint8> | BufferSource;

/**
 * バイト列を表すオブジェクト
 */
type Bytes = ByteSequence | ByteArray;

const utf8TextEncoder = new TextEncoder();

const utf8TextDecoder = new TextDecoder("utf-8", { fatal: true });

/**
 * バイト列
 */
class ByteSequence {
  /**
   * 内部表現
   */
  #buffer: ArrayBuffer;

  /**
   * ArrayBufferをラップするインスタンスを生成
   *     ※外部からのArrayBufferの変更は当インスタンスに影響する
   */
  private constructor(bytes: ArrayBuffer) {
    if ((bytes instanceof ArrayBuffer) !== true) {
      throw new TypeError("bytes");
    }
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
    return new Uint8Array(this.#buffer);
  }

  /**
   * 指定したバイト数でインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   *     ※各バイトは0
   * 
   * @param byteCount - 生成するバイト列のバイト数
   * @returns 生成したインスタンス
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
  static of(...bytes: Array<uint8>): ByteSequence {
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
    const decoded = Base64.decode(base64Encoded, Base64.resolveOptions(options));
    return new ByteSequence(decoded.buffer);
  }

  /**
   * 自身のバイト列をBase64符号化した文字列を返却
   * 
   * @param options - 符号化方式のオプション
   * @returns Base64符号化した文字列
   */
  toBase64Encoded(options?: Base64Options): string {
    return Base64.encode(this.view, Base64.resolveOptions(options));
  }

  /**
   * パーセント符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * 
   * @param percentEncoded パーセント符号化された文字列
   * @param options 符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromPercentEncoded(percentEncoded: string, options?: PercentOptions): ByteSequence {
    const decoded = Percent.decode(percentEncoded, Percent.resolveOptions(options));
    return new ByteSequence(decoded.buffer);
  }

  /**
   * 自身のバイト列をパーセント符号化した文字列を返却
   * 
   * @param options - 符号化方式のオプション
   * @returns パーセント符号化した文字列
   */
  toPercentEncoded(options?: PercentOptions): string {
    return Percent.encode(this.view, Percent.resolveOptions(options));
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
    else if (Array.isArray(otherBytes)) {
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
  *segments(segmentByteCount: number): Generator<ByteSequence, void, void> {
    if (NumberUtils.isPositiveInteger(segmentByteCount) !== true) {
      throw new TypeError("segmentByteCount");
    }

    let i = 0;
    let itemLength = segmentByteCount;
    while (i < this.count) {
      if ((i + segmentByteCount) > this.count) {
        itemLength = this.count - i;
      }
      yield this.subsequence(i, i + itemLength);
      i = i + segmentByteCount;
    }
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
  textDecodeTo(decoder: { decode: (input?: BufferSource) => string } = utf8TextDecoder): string {
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
}
Object.freeze(ByteSequence);

export { ByteSequence };
