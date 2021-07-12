
import { getCrypto } from "./_";
import { uint8 } from "./byte/type";
import {
  Base64EncodingOptions,
  ByteFormat,
  ByteFormatName,
  ByteFormatOptions,
  ByteEncoding,
  ByteEncodingOptions,
  ByteStreamReader,
  DigestAlgorithm,
  DigestAlgorithmOptions,
  PercentEncodingOptions,
} from "./byte/index";

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
  constructor (buffer: ArrayBuffer) {
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
  view(byteOffset?: number, byteCount?: number): Uint8Array {
    let offset = 0;
    if (typeof byteOffset === "number") {
      if (Number.isSafeInteger(byteOffset) !== true) {
        throw new TypeError("byteOffset");
      }
      if ((byteOffset < 0) || (byteOffset >= this.count)) {
        throw new RangeError("byteOffset");
      }
      offset = byteOffset;
    }

    let count = this.count - offset;
    if (typeof byteCount === "number") {
      if (Number.isSafeInteger(byteCount) !== true) {
        throw new TypeError("byteCount");
      }
      if ((byteCount <= 0) || (byteCount > (this.count - offset))) {
        throw new RangeError("byteCount");
      }
      count = byteCount;
    }

    return new Uint8Array(this.#bytes.buffer, offset, count);
  }

  // viewで取得すればいい
  // /**
  // * 指定した位置のバイトを返却
  // * @param index 位置
  // * @returns バイト
  // */
  // at(index: number): uint8 {
  //   return this.#bytes.at(index);
  // }

  // viewで取得すればいい
  // /**
  //  * 1バイト単位のイテレーターを返却
  //  * @returns 1バイト単位のイテレーター
  //  */
  // [Symbol.iterator](): IterableIterator<uint8> {
  //   return this.#bytes[Symbol.iterator]() as IterableIterator<uint8>;
  // }

  // async *[Symbol.asyncIterator]() {
  //  yield* this[Symbol.iterator]();
  // }

  // viewで取得すればいい
  // /**
  //  * 指定した範囲のバイト列を返却
  //  *     ※ArrayBufferは新たに生成する
  //  * @param byteOffset 取得開始位置
  //  * @param byteCount 取得するバイト数
  //  * @returns バイト列
  //  */
  // get(byteOffset: number, byteCount: number = 1): Uint8Array {
  //   if (Number.isSafeInteger(byteOffset) !== true) {
  //     throw new TypeError("byteOffset");
  //   }
  //   if ((byteOffset < 0) || (byteOffset >= this.count)) {
  //     throw new RangeError("byteOffset");
  //   }

  //   if (Number.isSafeInteger(byteCount) !== true) {
  //     throw new TypeError("byteCount");
  //   }
  //   // if ((byteCount <= 0) || (byteCount > (this.count - byteOffset))) {
  //   //   throw new RangeError("byteCount");
  //   // }
  //   // 0以上、上限なしとする
  //   if (byteCount < 0) {
  //     throw new RangeError("byteCount");
  //   }

  //   return Uint8Array.from(this.#bytes.subarray(byteOffset, (byteOffset + byteCount)));
  // }

  // viewで取得すればいい
  // /**
  //  * 指定した範囲のバイトを書き換え
  //  * @param byteOffset 書き換え開始位置
  //  * @param bytes バイト列
  //  */
  // set(byteOffset: number, bytes: Bytes): void {
  //   if (Number.isSafeInteger(byteOffset) !== true) {
  //     throw new TypeError("byteOffset");
  //   }
  //   if ((byteOffset < 0) || (byteOffset >= this.count)) {
  //     throw new RangeError("byteOffset");
  //   }

  //   let source: Array<uint8> | Uint8Array | Uint8ClampedArray;
  //   if (bytes instanceof ByteSequence) {
  //     source = bytes.#bytes;
  //   }
  //   else {
  //     source = bytes;
  //   }
  //   //TODO source.length <= (this.count - byteOffset) ではなかったらどうなる

  //   this.#bytes.set(source, byteOffset);
  // }

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
   * @param formatName フォーマット名
   * @param options フォーマットオプション
   * @returns 生成したインスタンス
   */
  static parse(toParse: string, formatName: ByteFormatName = "hexadecimal", options?: ByteFormatOptions): ByteSequence {
    const formatter = ByteFormat.for(formatName, options);
    const bytes = formatter.parse(toParse);
    return new ByteSequence(bytes.buffer);
  }

  /**
   * 自身のバイト列をフォーマットした文字列を生成し返却
   * @param formatName フォーマット名
   * @param options フォーマットオプション
   * @returns バイト列をフォーマットした文字列
   */
  format(formatName: ByteFormatName = "hexadecimal", options?: ByteFormatOptions): string {
    const formatter = ByteFormat.for(formatName, options);
    return formatter.format(this.#bytes);
  }

  /**
   * 符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * @param encoded 符号化された文字列
   * @param encodingName バイト列符号化方式名
   * @param options 符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromEncoded(encoded: string, encodingName: string, options?: ByteEncodingOptions): ByteSequence {
    const encoding = ByteEncoding.for(encodingName, options);
    return new ByteSequence(encoding.decode(encoded).buffer);
  }

  /**
   * 自身のバイト列を符号化した文字列を返却
   * @param encodingName バイト列符号化方式名
   * @param options 符号化方式のオプション
   * @returns バイト列を符号化した文字列
   */
  toEncoded(encodingName: string, options?: ByteEncodingOptions): string {
    const encoding = ByteEncoding.for(encodingName, options);
    return encoding.encode(this.view());
  }

  /**
   * Base64符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * @param base64Encoded Base64符号化された文字列
   * @param options 符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromBase64Encoded(base64Encoded: string, options?: Base64EncodingOptions): ByteSequence {
    return ByteSequence.fromEncoded(base64Encoded, "base64", options);
  }

  /**
   * 自身のバイト列をBase64符号化した文字列を返却
   * @param options 符号化方式のオプション
   * @returns Base64符号化した文字列
   */
  toBase64Encoded(options?: Base64EncodingOptions): string {
    return this.toEncoded("base64", options);
  }

  /**
   * パーセント符号化された文字列をバイト列に復号し、バイト列からインスタンスを生成し返却
   * @param percentEncoded パーセント符号化された文字列
   * @param options 符号化方式オプション
   * @returns 生成したインスタンス
   */
  static fromPercentEncoded(percentEncoded: string, options?: PercentEncodingOptions): ByteSequence {
    return ByteSequence.fromEncoded(percentEncoded, "percent", options);
  }

  /**
   * 自身のバイト列をパーセント符号化した文字列を返却
   * @param options 符号化方式のオプション
   * @returns パーセント符号化した文字列
   */
  toPercentEncoded(options?: PercentEncodingOptions): string {
    return this.toEncoded("percent", options);
  }

  /**
   * 自身のバイト列のハッシュを生成し返却
   * @param algorithmName ハッシュアルゴリズム名
   * @param options ハッシュアルゴリズムのオプション
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toDigest(algorithmName: string, options?: DigestAlgorithmOptions): Promise<ByteSequence> {
    const algorithm = DigestAlgorithm.for(algorithmName, options);
    const digestBytes = await algorithm.compute(this.#bytes);
    return new ByteSequence(digestBytes.buffer);
  }

  /**
   * 自身のバイト列のSHA-256ハッシュを生成し返却
   * @returns 生成したハッシュのバイト列で解決されるPromise
   */
  async toSha256Digest(): Promise<ByteSequence> {
    return this.toDigest("sha-256");
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
  subsequence(start: number, end?: number): ByteSequence {
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
      if ((end < start) || (end > this.count)) {
        throw new RangeError("end");
      }
    }

    const slicedBuffer = this.#bytes.buffer.slice(start, end);
    return new ByteSequence(slicedBuffer);
  }

  // *segments(segmentByteCount: number) {
  //   precondition(() => Number.isSafeInteger(segmentByteCount) && (segmentByteCount > 0));

  //   let i = 0;
  //   let itemLength = segmentByteCount;
  //   while (i < this.count) {
  //     if ((i + segmentByteCount) > this.count) {
  //       itemLength = this.count - i;
  //     }
  //     yield this.get(i, itemLength); //TODO padするか否か
  //     i = i + segmentByteCount;
  //   }
  // }

  /**
   * 可読ストリームを読み取り、自身にロードする
   * ストリームを終端まで読んだら終了
   * @param stream 可読ストリーム
   *     ※NodeJS.ReadStreamの場合、チャンクがBufferのストリーム
   * @param byteOffset 自身へのセット開始位置
   *     省略した場合0
   * @param byteCount ストリームから読み取るバイト数
   *     省略した場合、自身のcount
   */
  async loadFromStream(stream: ReadableStream<Uint8Array> | NodeJS.ReadStream, byteOffset = 0, byteCount = (this.count - byteOffset)): Promise<void> {
    if (Number.isSafeInteger(byteOffset) !== true) {
      throw new TypeError("byteOffset");
    }
    if ((byteOffset < 0) || (byteOffset >= this.count)) {
      throw new RangeError("byteOffset");
    }

    if (Number.isSafeInteger(byteCount) !== true) {
      throw new TypeError("byteCount");
    }
    if ((byteCount < 0) || (byteCount > (this.count - byteOffset))) {
      throw new RangeError("byteCount");
    }

    const reader = new ByteStreamReader();
    // 中断不可、サイズ不一致はエラー、で読取
    const bytes = await reader.read(stream, byteCount);
    this.#bytes.set(bytes, byteOffset);
  }

  /**
   * 可読ストリームを読み取り、読み取ったバイト列からインスタンスを生成し返却
   * @param stream 可読ストリーム
   *     ※NodeJS.ReadStreamの場合、チャンクがBufferのストリーム
   * @param totalByteCount ストリームから読み取るバイト数
   * @param acceptSizeMismatch totalByteCountを指定した場合に、streamから読み取ったバイト数とtotalByteCountの不一致を許容するか否か
   * @returns 生成したインスタンス
   */
  static async fromStream(stream: ReadableStream<Uint8Array> | NodeJS.ReadStream, totalByteCount?: number, acceptSizeMismatch = true): Promise<ByteSequence> {
    if (typeof totalByteCount === "number") {
      if (Number.isSafeInteger(totalByteCount) !== true) {
        throw new TypeError("totalByteCount");
      }
      if (totalByteCount < 0) {
        throw new RangeError("totalByteCount");
      }
    }

    const reader = new ByteStreamReader();
    // 中断不可、で読取
    const bytes = await reader.read(stream, totalByteCount, { acceptSizeMismatch });
    return ByteSequence.from(bytes);
  }

  //TODO
  //readAsText(): string {
    
  //}







}
Object.freeze(ByteSequence);

export { ByteSequence };
