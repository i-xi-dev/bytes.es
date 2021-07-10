import { Exception, ProgressEvent } from "./_";

/**
 * 読取器の状態
 */
const ReadingState = {
  /** 初期状態 */
  EMPTY: Symbol("ReadingState.EMPTY"),
  /** 読取中 */
  LOADING: Symbol("ReadingState.LOADING"),
  /** 読取終了後 */
  DONE: Symbol("ReadingState.DONE"),
} as const;
type ReadingState = typeof ReadingState[keyof typeof ReadingState];

/**
 * ストリーム読取オプション
 */
export type StreamReadingOptions = {
  /**
   * 中断シグナル（絶え間なく読めるストリームの場合、すべて読み取るまで中断されない）
   */
  abortSignal?: AbortSignal,

  // /**
  //  * 未実装（絶え間なく読めるストリームの場合、すべて読み取るまでタイムアウトされない（であろうと推測される））
  //  */
  // timeout?: number,
};

/**
 * バイトストリーム読取器
 */
class ByteStreamReader extends EventTarget {
  /**
   * 読み取るストリームのサイズを明示しなかった場合のバッファーサイズ
   */
  static #DEFAULT_BUFFER_SIZE = 1_048_576;

  /**
   * 状態
   */
  #state: ReadingState;

  /**
   */
  constructor() {
    super();
    this.#state = ReadingState.EMPTY;
    Object.seal(this);
  }

  /**
   * 可読ストリームを読み取り、チャンクを返却する非同期ジェネレーターを返却
   * ブラウザーとDeno用
   * @experimental
   * @param reader 可読ストリームのリーダー
   * @returns チャンクを返却する非同期ジェネレーター
   */
  static async *#createChunkGeneratorW(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Uint8Array, void, void> {
    // XXX ReadableStreamBYOBReaderにする？Chrome/Edgeでしか使えない2021-06
    // XXX ReadableStream自体が[Symbol.asyncIterator]を持つ仕様になる。実装はまだ無い？2021-06
    for (let i = await reader.read(); (i.done !== true); i = await reader.read()) {
      yield i.value;
    }
  }

  /**
   * 可読ストリームを読み取り、チャンクを返却する非同期ジェネレーターを返却
   * Node.js用
   * @param stream 可読ストリーム ※チャンクがBufferのストリーム
   * @returns チャンクを返却する非同期ジェネレーター
   */
  static async *#createChunkGeneratorN(stream: NodeJS.ReadableStream): AsyncGenerator<Uint8Array, void, void> {
    stream[Symbol.asyncIterator]();
    for await (const buffer of stream) {
      if (buffer instanceof Buffer) {
        yield new Uint8Array(buffer);
      }
      else {
        throw new TypeError("stream[Symbol.asyncIterator]");
      }
    }
  }

  /**
   * プログレスイベントを発火する
   * @param eventName - イベント名
   * @param loadedByteCount - 読み取ったバイト数
   * @param [totalByteCount] - 読み取り対象の総バイト数
   * @returns プログレスイベント
   */
  #notify(eventName: string, loadedByteCount: number, totalByteCount?: number): void {
    const event: ProgressEvent = new ProgressEvent(eventName, {
      lengthComputable: (totalByteCount !== undefined),
      loaded: loadedByteCount,
      total: (totalByteCount !== undefined) ? totalByteCount : 0,
    });
    this.dispatchEvent(event);
  }

  /**
   * 可読ストリームをすべて読み取り、1つのバイト列として返却する
   * @param stream 可読ストリーム
   * @param [totalByteCount] ストリームのバイト数
   *     不明な場合は省略（undefined）可
   * @param [options] - 読取オプション
   * @returns バイト列
   * @throws #stateが読み取り中のときに実行した場合スロー
   */
  async read(stream: ReadableStream<Uint8Array> | NodeJS.ReadableStream, totalByteCount?: number, options: StreamReadingOptions = {}): Promise<Uint8Array> {
    if (totalByteCount !== undefined) {
      if (Number.isSafeInteger(totalByteCount) !== true) {
        throw new TypeError("totalByteCount");
      }
      if (totalByteCount < 0) {
        throw new RangeError("totalByteCount");
      }
    }

    if (this.#state === ReadingState.LOADING) {
      throw new Exception("InvalidStateError", "invalid state");
    }
    this.#state = ReadingState.LOADING;

    let reader: ReadableStreamDefaultReader<Uint8Array>;
    let chunkGenerator: AsyncGenerator<Uint8Array, void, void>;
    if (globalThis.ReadableStream && (stream instanceof ReadableStream)) {
      reader = stream.getReader();
      chunkGenerator = ByteStreamReader.#createChunkGeneratorW(reader);
    }
    else {
      chunkGenerator = ByteStreamReader.#createChunkGeneratorN(stream as NodeJS.ReadableStream);
    }

    if (options.abortSignal) {
      if (options.abortSignal.aborted === true) {
        this.#state = ReadingState.DONE;
        throw new Exception("AbortError", "already aborted");
      }

      if (globalThis.ReadableStream && (stream instanceof ReadableStream)) {
        options.abortSignal.addEventListener("abort", (): void => {
          // stream.cancel()しても読取終了まで待ちになるので、reader.cancel()する
          void reader.cancel().catch(); // TODO closeで良い？
        }, {
          once: true,
        });
      }
      else {
        options.abortSignal.addEventListener("abort", () => {
          (stream as NodeJS.ReadStream).destroy();
        }, {
          once: true,
        });
      }
    }

    let buffer: Uint8Array;
    if (totalByteCount === undefined) {
      buffer = new Uint8Array(ByteStreamReader.#DEFAULT_BUFFER_SIZE);
    }
    else {
      buffer = new Uint8Array(totalByteCount);
    }
    let loadedByteCount = 0;
    for await (const chunkBytes of chunkGenerator) {
      buffer = ByteStreamReader.#addToBuffer(buffer, loadedByteCount, chunkBytes);
      loadedByteCount = loadedByteCount + chunkBytes.byteLength;

      this.#notify("progress", loadedByteCount, totalByteCount);
    }
    if (options.abortSignal?.aborted === true) {
      this.#state = ReadingState.DONE;
      throw new Exception("AbortError", "aborted");
    }

    let totalBytes: Uint8Array;
    if ((totalByteCount === undefined) || (buffer.byteLength > loadedByteCount)) {
      totalBytes = buffer.subarray(0, loadedByteCount);// XXX こっちが良い？ return buffer.buffer.slice(0, loadedByteCount);
    }
    else {
      totalBytes = buffer;
    }

    this.#state = ReadingState.DONE;
    return totalBytes;
  }

  /**
   * bufferのloadedByteCountの位置にchunkBytesをセットする
   * bufferのサイズが不足する場合、新たにサイズ拡張したUint8Arrayを生成しbufferの内容をコピーする
   * サイズ拡張したUint8Arrayを生成した場合、生成したUint8Arrayを返却し、それ以外の場合は引数bufferをそのまま返却する
   * @param buffer chunkBytesをセットする先のUint8Array
   * @param loadedByteCount bufferのchunkBytesをセットする開始位置
   * @param chunkBytes bufferの指定位置にセットするUint8Array
   * @returns bufferまたは、bufferを拡張したUint8Array
   */
  static #addToBuffer(buffer: Uint8Array, loadedByteCount: number, chunkBytes: Uint8Array): Uint8Array {
    let work = buffer;
    if ((loadedByteCount + chunkBytes.byteLength) > buffer.byteLength) {
      const extent = Math.max(chunkBytes.byteLength, ByteStreamReader.#DEFAULT_BUFFER_SIZE);
      const extendedBuffer = new Uint8Array(loadedByteCount + (extent * 10)); // XXX どのくらいが適正？
      extendedBuffer.set(buffer, 0);
      work = extendedBuffer;
    }
    work.set(chunkBytes, loadedByteCount);
    return work;
  }
}
Object.freeze(ByteStreamReader);

export { ByteStreamReader };
