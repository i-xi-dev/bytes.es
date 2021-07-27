//

//

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
 * Cryptoオブジェクトを返却
 * 
 * @returns Cryptoオブジェクト
 */
export function getCrypto(): Crypto {
  if (_crypto) {
    return _crypto;
  }
  throw new Exception("NotSupportedError", "Crypto unsupported");
}

/**
 * Blobコンストラクター
 */
export type BlobConstructor = {
  new (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob;
  prototype: Blob;
};
let _BlobConstructor: BlobConstructor;
if (globalThis.Blob) {
  _BlobConstructor = Blob;
}
else if (globalThis.process) {
  _BlobConstructor = (await import("buffer")).Blob as BlobConstructor;
}

/**
 * Blobコンストラクターを返却
 * 
 * @returns Blobコンストラクター
 */
export function getBlobConstructor(): BlobConstructor {
  if (_BlobConstructor) {
    return _BlobConstructor;
  }
  throw new Exception("NotSupportedError", "Blob unsupported");
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
 * 
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
 * DOMのProgressEventと同じインターフェースのイベント
 * Node.js用
 */
class _ProgressEvent extends Event implements ProgressEvent<EventTarget> {
  /**
   * 進捗状況を計測可能か否か
   */
  #lengthComputable: boolean;

  /**
   * 実行済の実行量
   */
  #loaded: number;

  /**
   * 合計の実行量
   */
  #total: number;

  /**
   * @param type イベント型名
   * @param init EventInit
   */
  constructor(type: string, init?: ProgressEventInit) {
    super(type, init);

    this.#lengthComputable = (init && (typeof init.lengthComputable === "boolean")) ? init.lengthComputable : false;
    this.#loaded = (init && (typeof init.loaded === "number") && Number.isSafeInteger(init.loaded) && (init.loaded >= 0)) ? init.loaded : 0;
    this.#total = (init && (typeof init.total === "number") && Number.isSafeInteger(init.total) && (init.total >= 0)) ? init.total : 0;
  }

  /**
   * 進捗状況を計測可能か否か
   */
  get lengthComputable(): boolean {
    return this.#lengthComputable;
  }

  /**
   * 実行済の実行量
   */
  get loaded(): number {
    return this.#loaded;
  }

  /**
   * 合計の実行量
   */
  get total(): number {
    return this.#total;
  }
}
const pe = (globalThis.ProgressEvent) ? globalThis.ProgressEvent : _ProgressEvent;
export { pe as ProgressEvent };

/**
 * 文字列が{@link https://mimesniff.spec.whatwg.org/#http-token-code-point HTTP token code point}のみからなる文字列
 * であるか否かを返却
 * 
 * @param str 文字列
 * @returns 結果
 */
export function matchHttpToken(str: string): boolean {
  return /^[\u{21}\u{23}-\u{27}\u{2A}\u{2B}\u{2D}\u{2E}0-9A-Za-z\u{5E}\u{5F}\u{60}\u{7C}\u{7E}]*$/u.test(str);
}

/**
 * 文字列が{@link https://mimesniff.spec.whatwg.org/#http-quoted-string-token-code-point HTTP quoted-string token code point}のみからなる文字列
 * であるか否かを返却
 * 
 * @param str 文字列
 * @returns 結果
 */
export function matchHttpQuotedStringToken(str: string): boolean {
  return /^[\u{9}\u{20}-\u{7E}\u{80}-\u{FF}]*$/u.test(str);
}

/**
 * 文字列から先頭および末尾の{@link https://infra.spec.whatwg.org/#ascii-whitespace ASCII whitespace}を削除した文字列を返却
 * 
 * @param str 文字列
 * @returns 文字列
 */
export function trimAsciiSpace(str: string): string {
  return str.replace(/^[\u{9}\u{A}\u{C}\u{D}\u{20}]+/u, "").replace(/[\u{9}\u{A}\u{C}\u{D}\u{20}]+$/u, "");
}

/**
 * 文字列から先頭および末尾の{@link https://fetch.spec.whatwg.org/#http-whitespace HTTP whitespace}を削除した文字列を返却
 * 
 * @param str 文字列
 * @returns 文字列
 */
export function trimHttpSpace(str: string): string {
  return str.replace(/^[\u{9}\u{A}\u{D}\u{20}]+/u, "").replace(/[\u{9}\u{A}\u{D}\u{20}]+$/u, "");
}

/**
 * 文字列から末尾の{@link https://fetch.spec.whatwg.org/#http-whitespace HTTP whitespace}を削除した文字列を返却
 * 
 * @param str 文字列
 * @returns 文字列
 */
export function trimHttpSpaceEnd(str: string): string {
  return str.replace(/[\u{9}\u{A}\u{D}\u{20}]+$/u, "");
}

/**
 * 文字列から先頭の{@link https://fetch.spec.whatwg.org/#http-whitespace HTTP whitespace}の連続を取得し返却
 *     存在しない場合、空文字列を返却
 * 
 * @param str 文字列
 * @returns 結果
 */
export function collectHttpSpaceStart(str: string): string {
  const regex = /[\u{9}\u{A}\u{D}\u{20}]/u;
  let httpSpace = "";
  for (const c of str) {
    if (regex.test(c) !== true) {
      break;
    }
    httpSpace = httpSpace + c;
  }
  return httpSpace;
}

type ResultString = {
  value: string,
  length: number,
};

/**
 * 文字列の先頭のHTTP quoted stringを取得し返却
 *     仕様は https://fetch.spec.whatwg.org/#collect-an-http-quoted-string
 * 
 * @param str 先頭がU+0022の文字列
 * @returns 結果
 */
export function httpQuotedString(str: string): ResultString {
  let work = "";
  let escaped = false;

  const text2 = str.substring(1);
  let i = 0;
  for (i = 0; i < text2.length; i++) {
    const c: string = text2[i] as string;

    if (escaped === true) {
      work = work + c;
      escaped = false;
      continue;
    }
    else {
      if (c === '"') {
        break;
      }
      else if (c === "\\") {
        escaped = true;
        continue;
      }
      else {
        work = work + c;
        continue;
      }
    }
  }

  if (escaped === true) {
    work = work + "\\";
  }

  return {
    value: work,
    length: (i + 1),
  };
}
