
import { Exception, getCrypto } from "./_";
import { uint8 } from "./byte/type";
import {
  Base64,
  Base64Options,
  Format,
  FormatOptions,
  FormatRadix,
  Percent,
  PercentDecodeOptions,
  PercentEncodeOptions,
  ReadableStreamType,
  Sha256,
  StreamReader,
  StreamReadOptions,
} from "./byte/index";
import { TextDecodeOptions, TextEncodeOptions, TextEncoding } from "./text_encoding/index";

/**
 * バイト列を表す整数の配列
 */
type ByteArray = Array<uint8> | Uint8Array | Uint8ClampedArray;

/**
 * バイト列を表すオブジェクト
 */
type Bytes = ByteSequence | ByteArray;

/**
 * バイト列
 */
class ByteSequence {
  /**
   * 内部表現
   */
  #bytes: Uint8Array;

  /**
   * ArrayBufferをラップするインスタンスを生成
   *     ※外部からのArrayBufferの変更は当インスタンスに影響する
   */
  constructor(buffer: ArrayBuffer) {
    this.#bytes = new Uint8Array(buffer);
    Object.freeze(this);
  }

  /**
   * バイト数
   */
  get count(): number {
    return this.#bytes.byteLength;
  }

  /**
   * 自身が参照しているArrayBufferへの参照を返却
   *     ※返却値に変更をくわえた場合、当インスタンスに影響する
   */
  get buffer(): ArrayBuffer {
    return this.#bytes.buffer;
  }

  /**
   * 自身のArrayBufferのビューを返却
   * @param byteOffset ビューのオフセット
   * @param byteCount ビューのバイト数
   * @returns 自身のArrayBufferのビュー
   */
  view(byteOffset = 0, byteCount: number = (this.count - byteOffset)): Uint8Array {
    if (Number.isSafeInteger(byteOffset) !== true) {
      throw new TypeError("byteOffset");
    }
    if ((byteOffset < 0) || (byteOffset > this.count)) {
      throw new RangeError("byteOffset");
    }

    if (Number.isSafeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    if ((byteCount < 0) || (byteCount > (this.count - byteOffset))) {
      throw new RangeError("byteCount");
    }

    return new Uint8Array(this.#bytes.buffer, byteOffset, byteCount);
  }

  // viewで取得すればいい
  // at(index: number): uint8;

  // viewで取得すればいい
  // [Symbol.iterator](): IterableIterator<uint8>;

  // viewで取得すればいい
  // async *[Symbol.asyncIterator](): AsyncIterableIterator<uint8>;

  // viewで取得すればいい
  // get(byteOffset: number, byteCount: number = 1): Uint8Array;

  // viewで取得すればいい
  // set(byteOffset: number, bytes: Bytes): void;

  /**
   * 指定したバイト数でインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   *     ※各バイトは0
   * @param byteCount 生成するバイト列のバイト数
   * @returns 生成したインスタンス
   */
  static create(byteCount: number): ByteSequence {
    if (Number.isSafeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    if (byteCount < 0) {
      throw new RangeError("byteCount");
    }

    return new ByteSequence(new ArrayBuffer(byteCount));
  }

  /**
   * ランダムなバイトからなるインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * @param {number} byteCount - 生成するバイト列のバイト数
   *     RandomSource.getRandomValuesの制約により、最大値は65536
   * @returns 生成したインスタンス
   */
  static generateRandom(byteCount: number): ByteSequence {
    if (Number.isSafeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    if ((byteCount < 0) || (byteCount > 65536)) {
      throw new RangeError("byteCount");
    }

    const randomBytes = getCrypto().getRandomValues(new Uint8Array(byteCount));
    return new ByteSequence(randomBytes.buffer);
  }

  /**
   * バイト列をもとにインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   *     ※bytesがArrayBufferViewの場合、ビューの範囲外は無視する
   * @param bytes バイト列
   * @returns 生成したインスタンス
   */
  static from(bytes: Bytes): ByteSequence {
    if (bytes instanceof ByteSequence) {
      return bytes.clone();
    }

    return new ByteSequence(Uint8Array.from(bytes).buffer);
  }

  /**
   * バイト列を表す整数の配列をもとにインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * @param bytes バイト列を表す整数の配列
   * @returns 生成したインスタンス
   */
  static of(...bytes: Array<uint8>): ByteSequence {
    return ByteSequence.from(bytes);
  }

  /**
   * 自身のバイト列を表す整数の配列を生成し返却
   * @returns バイト列を表す整数の配列
   */
  toArray(): Array<uint8> {
    return Array.from(this.#bytes) as Array<uint8>;
  }

  /**
   * 自身のバイト列を表す整数の配列を生成し返却
   *     ※ArrayBufferは新たに生成する
   * @returns バイト列を表す整数の配列
   */
  toUint8Array(): Uint8Array {
    return new Uint8Array(this.#bytes.buffer.slice(0));
  }

  /**
   * バイト列を表すBinary stringをもとにインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * @deprecated
   * @param binaryString バイト列を表すBinary string
   * @returns 生成したインスタンス
   */
  static fromBinaryString(binaryString: string): ByteSequence {
    if (/^[\u{0}-\u{FF}]*$/u.test(binaryString) !== true) {
      throw new TypeError("binaryString");
    }

    const bytes = [ ...binaryString ].map((char) => {
      return char.charCodeAt(0) as uint8;
    });
    return ByteSequence.from(bytes);
  }

  /**
   * 自身のバイト列を表すBinary stringを生成し返却
   * @deprecated
   * @returns Binary string
   */
  toBinaryString(): string {
    const chars = Array.from(this.#bytes, (byte) => {
      return String.fromCharCode(byte);
    });
    return chars.join("");
  }

  /**
   * バイト列をフォーマットした文字列からインスタンスを生成し返却
   *     ※ArrayBufferは新たに生成する
   * @param toParse バイト列をフォーマットした文字列
   * @param radix フォーマット結果の基数
   * @param options フォーマットオプション
   * @returns 生成したインスタンス
   */
  static parse(toParse: string, radix: FormatRadix = 16, options?: FormatOptions): ByteSequence {
    const parsed = Format.parse(toParse, radix, options);
    return new ByteSequence(parsed.buffer);
  }

  /**
   * 自身のバイト列をフォーマットした文字列を生成し返却
   * @param radix フォーマット結果の基数
   * @param options フォーマットオプション
   * @returns バイト列をフォーマットした文字列
   */
  format(radix: FormatRadix = 16, options?: FormatOptions): string {
    return Format.format(this.#bytes, radix, options);
  }

  /**
   * Base64符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * @param base64Encoded Base64符号化された文字列
   * @param options 符号化方式のオプション
   * @returns 生成したインスタンス
   */
  static fromBase64(base64Encoded: string, options?: Base64Options): ByteSequence {
    const decoded = Base64.decode(base64Encoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * 自身のバイト列をBase64符号化した文字列を返却
   * @param options 符号化方式のオプション
   * @returns Base64符号化した文字列
   */
  toBase64(options?: Base64Options): string {
    return Base64.encode(this.view(), options);
  }

  /**
   * パーセント符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * @param percentEncoded パーセント符号化された文字列
   * @param options 符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromPercent(percentEncoded: string, options?: PercentDecodeOptions): ByteSequence {
    const decoded = Percent.decode(percentEncoded, options);
    return new ByteSequence(decoded.buffer);
  }

  /**
   * 自身のバイト列をパーセント符号化した文字列を返却
   * @param options 符号化方式のオプション
   * @returns パーセント符号化した文字列
   */
  toPercent(options?: PercentEncodeOptions): string {
    return Percent.encode(this.view(), options);
  }

  /**
   * 自身のバイト列のハッシュを生成し返却
   * @param algorithmName ハッシュアルゴリズム名
   * @param options ハッシュアルゴリズムのオプション
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toSha256(): Promise<ByteSequence> {
    const digest = await Sha256.compute(this.#bytes);
    return new ByteSequence(digest.buffer);
  }

  /**
   * 自身のバイト列をフォーマットした文字列を生成し返却
   * @override
   * @returns 自身のバイト列をフォーマットした文字列
   */
  toString(): string {
    return this.format();
  }

  /**
   * 自身のバイト列を表す整数の配列を生成し返却
   * @returns 自身のバイト列を表す整数の配列
   */
  toJSON(): Array<uint8> {
    return this.toArray();
  }

  /**
   * 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否かを返却
   * @param otherBytes バイト列
   * @returns 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否か
   */
  #startsWith(otherBytes: ByteArray): boolean {
    for (let i = 0; i < otherBytes.length; i++) {
      if (otherBytes[i] !== this.#bytes[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 自身のバイト列と、他のオブジェクトの表すバイト列が等しいか否かを返却
   * @param bytes バイト列
   * @returns 自身のバイト列と、他のオブジェクトの表すバイト列が等しいか否か
   */
  equals(bytes: Bytes): boolean {
    let otherBytes: ByteArray;
    if (bytes instanceof ByteSequence) {
      otherBytes = bytes.#bytes;
    }
    else {
      otherBytes = bytes;
    }

    if (otherBytes.length !== this.count) {
      return false;
    }

    return this.#startsWith(otherBytes);
  }

  /**
   * 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否かを返却
   * @param bytes バイト列
   * @returns 自身のバイト列が、指定したバイト列と同じ並びで始まっているか否か
   */
  startsWith(bytes: Bytes): boolean {
    let otherBytes: ByteArray;
    if (bytes instanceof ByteSequence) {
      otherBytes = bytes.#bytes;
    }
    else {
      otherBytes = bytes;
    }

    if (otherBytes.length > this.count) {
      return false;
    }

    return this.#startsWith(otherBytes);
  }

  /**
   * 自身のバイト列の複製を生成し返却
   *     ※参照するArrayBufferも複製する
   * @returns 自身のバイト列の複製
   */
  clone(): ByteSequence {
    const clonedBuffer = this.#bytes.buffer.slice(0);
    return new ByteSequence(clonedBuffer);
  }

  /**
   * 自身のバイト列の部分複製を生成し返却
   *     ※参照するArrayBufferも複製する
   *     ※コピーではなくビューが欲しい場合は、bufferプロパティでArrayBufferを取得してビューを作ればよい（new Uint8Array(xf0ByteSequence.buffer, 24, 128)など）
   * @param start 開始インデックス
   * @param end 終了インデックス
   * @returns 自身のバイト列の部分複製
   */
  subsequence(start = 0, end?: number): ByteSequence {
    if (Number.isSafeInteger(start) !== true) {
      throw new TypeError("start");
    }
    if ((start < 0) || (start > this.count)) {
      throw new RangeError("start");
    }

    if (typeof end === "number") {
      if (Number.isSafeInteger(end) !== true) {
        throw new TypeError("end");
      }
      if (end < start) {
        throw new RangeError("end");
      }
    }

    const slicedBuffer = this.#bytes.buffer.slice(start, end);
    return new ByteSequence(slicedBuffer);
  }

  /**
   * 指定したバイト数毎に自身のバイト列の部分複製を生成し返却するジェネレーター
   *     ※参照するArrayBufferも複製する
   * @param segmentByteCount 分割するバイト数
   * @returns 自身のバイト列の部分複製を返却するジェネレーター
   */
  *segmentedSequences(segmentByteCount: number): Generator<ByteSequence, void, void> {
    if (Number.isSafeInteger(segmentByteCount) !== true) {
      throw new TypeError("segmentByteCount");
    }
    if (segmentByteCount <= 0) {
      throw new RangeError("segmentByteCount");
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
   * 可読ストリームを読み取り、読み取ったバイト列からインスタンスを生成し返却
   * @experimental
   * @param stream 可読ストリーム
   *     ※NodeJS.ReadStreamの場合、チャンクがBufferのストリーム
   * @param totalByteCount ストリームから読み取るバイト数
   * @param options 読み取りオプション
   * @returns 生成したインスタンス
   */
  static async fromByteStream(stream: ReadableStreamType, totalByteCount?: number, options?: StreamReadOptions): Promise<ByteSequence> {
    if (typeof totalByteCount === "number") {
      if (Number.isSafeInteger(totalByteCount) !== true) {
        throw new TypeError("totalByteCount");
      }
      if (totalByteCount < 0) {
        throw new RangeError("totalByteCount");
      }
    }

    // 中断不可、で読取
    const bytes = await StreamReader.read(stream, totalByteCount, options);
    return ByteSequence.from(bytes);
  }

  /**
   * 文字列を指定した符号化方式で符号化したバイト列からインスタンスを生成し返却
   * @param text 文字列
   * @param encodingName 文字符号化方式名
   * @param options 文字符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromText(text: string, encodingName = "UTF-8", options?: TextEncodeOptions): ByteSequence {
    const encoding = TextEncoding.for(encodingName);
    if (encoding === undefined) {
      throw new Exception("NotFoundException", "encodingName not found");
    }
    const bytes = encoding.encode(text, options);
    return new ByteSequence(bytes.buffer);
  }

  /**
   * 文字列として復号し、結果の文字列を返却
   * @param encodingName 文字符号化方式名
   * @param options 文字符号化方式オプション
   * @returns 文字列
   */
  asText(encodingName = "UTF-8", options?: TextDecodeOptions): string {
    const encoding = TextEncoding.for(encodingName);
    if (encoding === undefined) {
      throw new Exception("NotFoundException", "encodingName not found");
    }
    return encoding.decode(this.view(), options);
  }





}
Object.freeze(ByteSequence);

export { ByteSequence };
