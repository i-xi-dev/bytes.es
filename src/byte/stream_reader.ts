//

// バイトストリーム読取

import { Exception, ProgressEvent } from "../_.js";

/**
 * 可読ストリームの型
 */
type Stream = ReadableStream<Uint8Array> | NodeJS.ReadStream;

/**
 * ストリーム読取オプション
 */
type Options = {
  /**
   * 読取ProgressEventのターゲット
   */
  listenerTarget?: EventTarget,

  /**
   * 中断シグナル（絶え間なく読めるストリームの場合、すべて読み取るまで中断されない）
   */
  signal?: AbortSignal,

  // /**
  //  * XXX 未実装（絶え間なく読めるストリームの場合、すべて読み取るまでタイムアウトされない）
  //  */
  // timeout?: number,

  /**
   * 見積サイズが明示されている場合に、見積サイズと実サイズの不一致を許容するか否か
   */
  acceptSizeMismatch?: boolean,
};

/**
 * 未設定を許可しないストリーム読取オプション
 */
type ResolvedOptions = {
  /**
   * @see {@link Options.listenerTarget}
   */
  listenerTarget: EventTarget | null,

  /**
   * @see {@link Options.signal}
   */
  signal: AbortSignal | null,

  /**
   * @see {@link Options.acceptSizeMismatch}
   */
  acceptSizeMismatch: boolean,
};

/**
 * ストリーム読取オプションを補正したコピーを返却
 * 
 * @param options ストリーム読取オプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めたストリーム読取オプション
 */
function resolveOptions(options: Options = {}): ResolvedOptions {
  const listenerTarget = (options.listenerTarget instanceof EventTarget) ? options.listenerTarget : null;
  const signal = (options.signal instanceof AbortSignal) ? options.signal : null;
  const acceptSizeMismatch: boolean = (typeof options.acceptSizeMismatch === "boolean") ? options.acceptSizeMismatch : false;

  return {
    listenerTarget,
    signal,
    acceptSizeMismatch,
  };
}

/**
 * 読み取るストリームのサイズを明示しなかった場合のバッファーサイズ
 */
const DEFAULT_BUFFER_SIZE = 1_048_576;

/**
 * 可読ストリームを読み取り、チャンクを返却する非同期ジェネレーターを返却
 * 
 * ブラウザーとDeno用
 * 
 * @experimental
 * @param reader 可読ストリームのリーダー
 * @returns チャンクを返却する非同期ジェネレーター
 */
async function* createChunkGeneratorW(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Uint8Array, void, void> {
  // XXX ReadableStreamBYOBReaderにする？Chrome/Edgeでしか使えない2021-06
  // XXX ReadableStream自体が[Symbol.asyncIterator]を持つ仕様になる。実装はまだ無い？2021-06
  for (let i = await reader.read(); (i.done !== true); i = await reader.read()) {
    yield i.value;
  }
}

/**
 * 可読ストリームを読み取り、チャンクを返却する非同期ジェネレーターを返却
 * 
 * Node.js用
 * 
 * @param stream 可読ストリーム ※チャンクがBufferのストリーム
 * @returns チャンクを返却する非同期ジェネレーター
 */
async function* createChunkGeneratorN(stream: NodeJS.ReadStream): AsyncGenerator<Uint8Array, void, void> {
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
 * イベントターゲットにプログレスイベントを発火する
 * 
 * @param target イベントターゲット
 * @param eventName イベント名
 * @param loadedByteCount 読み取ったバイト数
 * @param totalByteCount 読み取り対象の総バイト数
 */
function notify(target: EventTarget | null, eventName: string, loadedByteCount: number, totalByteCount?: number): void {
  if (target === null) {
    return;
  }

  const event: ProgressEvent = new ProgressEvent(eventName, {
    lengthComputable: (totalByteCount !== undefined),
    loaded: loadedByteCount,
    total: totalByteCount,
  });
  target.dispatchEvent(event);
}

/**
 * 可読ストリームをすべて読み取り、1つのバイト列として返却する
 * 
 * @param stream 可読ストリーム
 * @param totalByteCount ストリームの見積バイト数
 *     不明な場合は省略（undefined）可
 * @param options 読取オプション
 * @returns バイト列
 */
async function read(stream: Stream, totalByteCount?: number, options: Options = {}): Promise<Uint8Array> {
  if (totalByteCount !== undefined) {
    if (Number.isSafeInteger(totalByteCount) !== true) {
      throw new TypeError("totalByteCount");
    }
    if (totalByteCount < 0) {
      throw new RangeError("totalByteCount");
    }
  }

  const resolvedOptions: ResolvedOptions = resolveOptions(options);

  let reader: ReadableStreamDefaultReader<Uint8Array>;
  let chunkGenerator: AsyncGenerator<Uint8Array, void, void>;
  if (globalThis.ReadableStream && (stream instanceof ReadableStream)) {
    reader = stream.getReader();
    chunkGenerator = createChunkGeneratorW(reader);
  }
  else {
    chunkGenerator = createChunkGeneratorN(stream as NodeJS.ReadStream);
  }

  if (resolvedOptions.signal !== null) {
    if (resolvedOptions.signal.aborted === true) {
      throw new Exception("AbortError", "already aborted");
    }

    if (globalThis.ReadableStream && (stream instanceof ReadableStream)) {
      resolvedOptions.signal.addEventListener("abort", (): void => {
        // stream.cancel()しても読取終了まで待ちになるので、reader.cancel()する
        void reader.cancel().catch(); // XXX closeで良い？
      }, {
        once: true,
      });
    }
    else {
      resolvedOptions.signal.addEventListener("abort", () => {
        (stream as NodeJS.ReadStream).destroy();
      }, {
        once: true,
      });
    }
  }

  let buffer: Uint8Array;
  if (totalByteCount === undefined) {
    buffer = new Uint8Array(DEFAULT_BUFFER_SIZE);
  }
  else {
    buffer = new Uint8Array(totalByteCount);
  }
  let loadedByteCount = 0;
  for await (const chunkBytes of chunkGenerator) {
    if (resolvedOptions.acceptSizeMismatch !== true) {
      if ((typeof totalByteCount === "number") && ((loadedByteCount + chunkBytes.byteLength) > totalByteCount)) {
        // 見積サイズに対して超過
        throw new Exception("DataError", "Stream size too long");
      }
    }

    buffer = addToBuffer(buffer, loadedByteCount, chunkBytes);
    loadedByteCount = loadedByteCount + chunkBytes.byteLength;

    notify(resolvedOptions.listenerTarget, "progress", loadedByteCount, totalByteCount);
  }
  if (resolvedOptions.signal?.aborted === true) {
    throw new Exception("AbortError", "aborted");
  }

  if (resolvedOptions.acceptSizeMismatch !== true) {
    if ((typeof totalByteCount === "number") && (loadedByteCount < totalByteCount)) {
      // 見積サイズに対して不足
      throw new Exception("DataError", "Stream size too short");
    }
  }

  let totalBytes: Uint8Array;
  if ((totalByteCount === undefined) || (buffer.byteLength > loadedByteCount)) {
    totalBytes = buffer.subarray(0, loadedByteCount);// XXX こっちが良い？ return buffer.buffer.slice(0, loadedByteCount);
  }
  else {
    totalBytes = buffer;
  }

  return totalBytes;
}

/**
 * bufferのloadedByteCountの位置にchunkBytesをセットする
 * bufferのサイズが不足する場合、新たにサイズ拡張したUint8Arrayを生成しbufferの内容をコピーする
 * サイズ拡張したUint8Arrayを生成した場合、生成したUint8Arrayを返却し、それ以外の場合は引数bufferをそのまま返却する
 * 
 * @param buffer chunkBytesをセットする先のUint8Array
 * @param loadedByteCount bufferのchunkBytesをセットする開始位置
 * @param chunkBytes bufferの指定位置にセットするUint8Array
 * @returns bufferまたは、bufferを拡張したUint8Array
 */
function addToBuffer(buffer: Uint8Array, loadedByteCount: number, chunkBytes: Uint8Array): Uint8Array {
  let work = buffer;
  if ((loadedByteCount + chunkBytes.byteLength) > buffer.byteLength) {
    const extent = Math.max(chunkBytes.byteLength, DEFAULT_BUFFER_SIZE);
    const extendedBuffer = new Uint8Array(loadedByteCount + (extent * 10)); // XXX どのくらいが適正？
    extendedBuffer.set(buffer, 0);
    work = extendedBuffer;
  }
  work.set(chunkBytes, loadedByteCount);
  return work;
}
// TODO 最後に連結すべき

export {
  Stream as ReadableStreamType,
  Options as StreamReadOptions,
};

export const StreamReader = {
  read,
};
