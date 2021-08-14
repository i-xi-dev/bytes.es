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
 * 範囲パターン
 */
export const RangePattern = Object.freeze({
  /** {@link https://infra.spec.whatwg.org/#ascii-whitespace ASCII whitespace} */
  ASCII_WHITESPACE: "\\u0009\\u000A\\u000C\\u000D\\u0020",

  /** {@link https://mimesniff.spec.whatwg.org/#http-quoted-string-token-code-point HTTP quoted-string token code point} */
  HTTP_QUOTED_STRING_TOKEN: "\\u0009\\u0020-\\u007E\\u0080-\\u00FF",

  /** {@link https://fetch.spec.whatwg.org/#http-tab-or-space HTTP tab or space} */
  HTTP_TAB_OR_SPACE: "\\u0009\\u0020",

  /** {@link https://mimesniff.spec.whatwg.org/#http-token-code-point HTTP token code point} */
  HTTP_TOKEN: "\\u0021\\u0023-\\u0027\\u002A\\u002B\\u002D\\u002E0-9A-Za-z\\u005E\\u005F\\u0060\\u007C\\u007E",

  /** {@link https://fetch.spec.whatwg.org/#http-whitespace HTTP whitespace} */
  HTTP_WHITESPACE: "\\u0009\\u000A\\u000D\\u0020",
});

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
