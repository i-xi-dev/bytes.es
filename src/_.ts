
/**
 * Cryptoオブジェクト
 */
let _crypto: Crypto;
if (globalThis.crypto?.subtle) { // XXX globalThis.cryptoがCrypto型かどうかでは判定できない（Node, Jest環境）Cryptoが値扱いの為
  // ブラウザー, Deno
  _crypto = globalThis.crypto;
}
else if (globalThis.process) {
  // Node.js 条件不十分？
  _crypto = ((await import("crypto")).webcrypto as unknown) as Crypto;
}

/**
 * 例外
 */
export class Exception extends Error {
  /**
   * 元の例外の配列
   */
  #causes: Array<Error>;

  /**
   * @param name 名称
   * @param message メッセージ
   * @param causes 元の例外の配列
   */
  constructor(name: string, message: string, causes: Array<Error> = []) {
    super(message);

    this.name = name;
    this.#causes = [];
    for (const cause of causes) {
      this.#causes.push(cause);
    }

    Object.freeze(this.#causes);
    Object.freeze(this);
  }

  /**
   * 元の例外の配列
   */
  get causes(): Array<Error> {
    return this.#causes;
  }
}

/**
 * 文字列を、指定したUTF-16コードユニット数ごとに分割し返却
 *     ※サロゲートペア、合成文字が分割される可能性あり
 * @param str 分割する文字列
 * @param segmentLength 分割単位とするUTF-16コードユニット数
 * @param paddingUnit 分割結果の配列の最後の要素がunitGroupSizeに満たない場合、最後の要素の末尾を埋める文字列
 * @returns strをunitGroupSize UTF-16コードユニットごとに分割した文字列配列
 */
export function devideStringByLength(str: string, segmentLength: number, paddingUnit?: string): Array<string> {
  if (Number.isSafeInteger(segmentLength) !== true) {
    throw new TypeError("TODO");
  }
  if (segmentLength <= 0) {
    throw new TypeError("TODO");
  }
  if ((typeof paddingUnit === "string") && (paddingUnit.length !== 1)) {
    throw new TypeError("TODO");
  }

  const segemntsCount = Math.ceil(str.length / segmentLength);
  const segments: Array<string> = new Array<string>(segemntsCount);
  let pos = 0;
  for (let i = 0; i < segemntsCount; i++) {
    segments[i] = str.substring(pos, pos + segmentLength);
    pos = pos + segmentLength;
  }

  if (typeof paddingUnit === "string") {
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) {
      segments[segments.length - 1] = lastSegment.padEnd(segmentLength, paddingUnit);
    }
  }

  return segments;
}

/**
 * Cryptoオブジェクトを返却
 * @returns Cryptoオブジェクト
 */
export function getCrypto(): Crypto {
  if (_crypto) {
    return _crypto;
  }
  throw new Exception("NotSupportedError", "Crypto unsupported");
}

/**
 * DOMのProgressEventと同じインターフェースのイベント
 * Node.js用
 */
class _ProgressEvent extends Event implements ProgressEvent<EventTarget> {
  /**
   * 進捗状況を計測可能か否か
   */
  readonly lengthComputable: boolean;

  /**
   * 実行済の実行量
   */
  readonly loaded: number;

  /**
   * 合計の実行量
   */
  readonly total: number;

  /**
   * @param type イベント型名
   * @param init EventInit
   */
  constructor(type: string, init?: ProgressEventInit) {
    super(type, init);

    this.lengthComputable = (init && (typeof init.lengthComputable === "boolean")) ? init.lengthComputable : false;
    this.loaded = (init && (typeof init.loaded === "number") && Number.isSafeInteger(init.loaded) && (init.loaded >= 0)) ? init.loaded : 0;
    this.total = (init && (typeof init.total === "number") && Number.isSafeInteger(init.total) && (init.total >= 0)) ? init.total : 0;
  }

  // /**
  //  * 進捗状況を計測可能か否か
  //  */
  // get lengthComputable(): boolean {
  //   return this.#lengthComputable;
  // }

  // /**
  //  * 実行済の実行量
  //  */
  // get loaded(): number {
  //   return this.#loaded;
  // }

  // /**
  //  * 合計の実行量
  //  */
  // get total(): number {
  //   return this.#total;
  // }
}
const pe = (globalThis.ProgressEvent) ? globalThis.ProgressEvent : _ProgressEvent;
export { pe as ProgressEvent };
