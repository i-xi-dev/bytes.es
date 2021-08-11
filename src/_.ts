//

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
 * 文字列から先頭および末尾の{@link https://fetch.spec.whatwg.org/#http-tab-or-space HTTP tab or space}を削除した文字列を返却
 * 
 * @param str
 * @returns 文字列
 */
export function trimHttpTabOrSpace(str: string): string {
  return str.replace(/^[\u{9}\u{20}]+/u, "").replace(/[\u{9}\u{20}]+$/u, "");
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
 * 文字列先頭から{@link https://fetch.spec.whatwg.org/#http-whitespace HTTP whitespace}の連続を取得し返却
 *     存在しない場合、空文字列を返却
 * 
 * @param str 文字列
 * @returns 結果
 */
export function collectHttpSpaceStart(str: string): string {
  return collectStart(str, /[\u{9}\u{A}\u{D}\u{20}]/u);
}

/**
 * 文字列先頭から収集対象の連続を取得し返却
 *     存在しない場合、空文字列を返却
 * 
 * @param str 文字列
 * @param regex 収集対象の正規表現
 * @returns 結果
 */
export function collectStart(str: string, regex: RegExp): string {
  let collected = "";
  for (const c of str) {
    if (regex.test(c) !== true) {
      break;
    }
    collected = collected + c;
  }
  return collected;
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

export function splitWebHeaderValue(value: string): Array<string> {
  const notU0022OrU002C = /[^\u0022\u002C]/;
  const values: Array<string> = [];
  let work = value;
  while (work.length > 0) {
    let splitted = collectStart(work, notU0022OrU002C);
    work = work.substring(splitted.length);
    if (work.startsWith("\u0022")) {
      const result = httpQuotedString(work);
      splitted = splitted + result.value;
      work = work.substring(result.length);
    }
    else { // work.startsWith("\u002C")
      work = work.substring(1);
    }
    values.push(trimHttpTabOrSpace(splitted));
  }
  return values;
}
