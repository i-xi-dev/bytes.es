
import { devideStringByLength, Exception } from "./_";
import { uint8, isByte } from "./type";

/**
 * フォーマッターで対応する基数
 */
type ByteFormatRadix = 2 | 8 | 10 | 16;

/**
 * フォーマッターのオプション
 */
export type ByteFormatOptions = {
  /** 基数 */
  radix?: ByteFormatRadix;
  /** 前方ゼロ埋め結果の文字列長 */
  zeroPaddedLength?: number;
  /** 16進数のa-fを大文字にするか否か */
  upperCase?: boolean;
  /** プレフィックス */
  prefix?: string;
  /** サフィックス */
  suffix?: string;
};

/**
 * バイトのフォーマッター
 *     不変オブジェクト
 */
class ByteFormat {
  /**
   * フォーマット結果の基数のデフォルト
   */
  static readonly #DEFAULT_RADIX: ByteFormatRadix = 16;

  /**
   * フォーマット結果の16進数のa-fを大文字にするか否かのデフォルト
   */
  static readonly #DEFAULT_UPPER_CASE: boolean = false;

  /**
   * フォーマット結果のプレフィックスのデフォルト
   */
  static readonly #DEFAULT_PREFIX: string = "";

  /**
   * フォーマット結果のサフィックスのデフォルト
   */
  static readonly #DEFAULT_SUFFIX: string = "";

  /**
   * フォーマット結果の基数
   */
  #radix: ByteFormatRadix;

  /**
   * フォーマット結果の前方ゼロ埋め結果の文字列長
   */
  #zeroPaddedLength: number;

  /**
   * フォーマット結果の16進数のa-fを大文字にするか否か
   */
  #upperCase: boolean;

  /**
   * フォーマット結果のプレフィックス
   */
  #prefix: string;

  /**
   * フォーマット結果のサフィックス
   */
  #suffix: string;

  /**
   * @param options フォーマットオプション
   */
  constructor(options: ByteFormatOptions = {}) {
    const radix: ByteFormatRadix = (typeof options.radix === "number") ? options.radix : ByteFormat.#DEFAULT_RADIX;
    const minZeroPaddedLength: number = ByteFormat.#minZeroPaddedLengthOf(radix);
    const zeroPaddedLength: number = (typeof options.zeroPaddedLength === "number") ? options.zeroPaddedLength : minZeroPaddedLength;
    if (Number.isSafeInteger(zeroPaddedLength) !== true) {
      throw new TypeError("zeroPaddedLength");
    }
    if (zeroPaddedLength < minZeroPaddedLength) {
      throw new RangeError("zeroPaddedLength");
    }
    const upperCase: boolean = (typeof options.upperCase === "boolean") ? options.upperCase : ByteFormat.#DEFAULT_UPPER_CASE;
    const prefix: string = (typeof options.prefix === "string") ? options.prefix : ByteFormat.#DEFAULT_PREFIX;
    const suffix: string = (typeof options.suffix === "string") ? options.suffix : ByteFormat.#DEFAULT_SUFFIX;

    this.#radix = radix;
    this.#zeroPaddedLength = zeroPaddedLength;
    this.#upperCase = upperCase;
    this.#prefix = prefix;
    this.#suffix = suffix;

    Object.freeze(this);
  }

  /**
   * 基数に応じた前方ゼロ埋め結果の最小文字列長を返却
   * @param radix フォーマット結果の基数
   * @returns フォーマット結果の前方ゼロ埋め結果の最小文字列長
   */
  static #minZeroPaddedLengthOf(radix: ByteFormatRadix): number {
    switch (radix) {
    case 2:
      return 8;
    case 8:
      return 3;
    case 10:
      return 3;
    case 16:
      return 2;
    }
  }

  /**
   * 文字列を8-bit符号なし整数にパースし返却
   * @param formatted 文字列
   * @returns 8-bit符号なし整数
   */
  #parseByte(formatted: string): uint8 {
    let work = formatted;
    if (this.#prefix.length > 0) {
      if (formatted.startsWith(this.#prefix) !== true) {
        throw new Exception("InvalidCharacterError", "unprefixed");
      }
      work = work.substring(this.#prefix.length);
    }
    if (this.#suffix.length > 0) {
      if (formatted.endsWith(this.#suffix) !== true) {
        throw new Exception("InvalidCharacterError", "unsuffixed");
      }
      work = work.substring(0, (work.length - this.#suffix.length));
    }

    const integer = Number.parseInt(work, this.#radix);
    if (isByte(integer)) {
      return integer;
    }

    // 今のところ到達しない（事前に#testを通る）
    throw new Exception("InvalidCharacterError", "parse error");
  }

  /**
   * 文字列がフォーマットオプションに合致しているか否かを返却
   * @param formatted 文字列
   * @returns 文字列がフォーマットオプションに合致しているか否か
   */
  #test(formatted: string): boolean {
    let charsPattern: string;
    switch (this.#radix) {
    case 2:
      charsPattern = "[01]";
      break;
    case 8:
      charsPattern = "[0-7]";
      break;
    case 10:
      charsPattern = "[0-9]";
      break;
    case 16:
      if (this.#upperCase === true) {
        charsPattern = "[0-9A-F]";
      }
      else {
        charsPattern = "[0-9a-f]";
      }
      break;
    }
    const prefixPattern = (this.#prefix.length > 0) ? `.{${ this.#prefix.length }}` : "";
    const suffixPattern = (this.#suffix.length > 0) ? `.{${ this.#suffix.length }}` : "";
    const bodyLength = ByteFormat.#minZeroPaddedLengthOf(this.#radix);
    const paddingLength = this.#zeroPaddedLength - bodyLength;
    const paddingPattern = (paddingLength > 0) ? `[0]{${ paddingLength }}` : "";
    const regex = new RegExp(`^(${ prefixPattern }${ paddingPattern }${ charsPattern }{${ bodyLength }}${ suffixPattern })*$`, "s");

    return regex.test(formatted);
  }

  /**
   * 文字列をバイト列にパースし返却
   * @param toParse 文字列
   * @returns バイト列
   */
  parse(toParse: string): Uint8Array {
    if (this.#test(toParse) !== true) {
      throw new Exception("DataError", "parse error");
    }

    const elementLength = this.#zeroPaddedLength + this.#prefix.length + this.#suffix.length;
    const byteStringArray = devideStringByLength(toParse, elementLength);

    return Uint8Array.from(byteStringArray, (byteString) => {
      return this.#parseByte(byteString);
    });
  }

  /**
   * 8-bit符号なし整数を文字列にフォーマットし返却
   * @param byte 8-bit符号なし整数
   * @returns 文字列
   */
  #formatByte(byte: uint8): string {
    let str = byte.toString(this.#radix);
    if (this.#upperCase === true) {
      str = str.toUpperCase();
    }
    str = str.padStart(this.#zeroPaddedLength, "0");
    return this.#prefix + str + this.#suffix;
  }

  /**
   * バイト列を文字列にフォーマットし返却
   * @param bytes バイト列
   * @returns 文字列
   */
  format(bytes: Uint8Array): string {
    const byteStringArray = [ ...bytes ].map((byte) => {
      return this.#formatByte(byte as uint8);
    });
    return byteStringArray.join("");
  }
}
Object.freeze(ByteFormat);

export { ByteFormat };
