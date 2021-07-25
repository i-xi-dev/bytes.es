//

// バイト列のフォーマッター

import { devideStringByLength, Exception } from "../_";
import { isByte, uint8 } from "./type";

/**
 * フォーマッターで対応する基数
 */
type Radix = 2 | 8 | 10 | 16;

/**
 * フォーマッターのオプション
 */
type Options = {
  /** 前方埋め結果の文字列長 */
  paddedLength?: number;
  /** 16進数のa-fを大文字にするか否か */
  upperCase?: boolean;
  /** プレフィックス */
  prefix?: string;
  /** サフィックス */
  suffix?: string;
};
// TODO ParserOptions caseInsensitive,

/**
 * 未設定を許可しないフォーマッターのオプション
 */
type ResolvedOptions = {
  /** 前方埋め結果の文字列長 */
  paddedLength: number;
  /** 16進数のa-fを大文字にするか否か */
  upperCase: boolean;
  /** プレフィックス */
  prefix: string;
  /** サフィックス */
  suffix: string;
};

/**
 * パディング文字
 */
const PADDING_CHAR = "0";

/**
 * フォーマット結果の16進数のa-fを大文字にするか否かのデフォルト
 */
const DEFAULT_UPPER_CASE = false;

/**
 * フォーマット結果のプレフィックスのデフォルト
 */
const DEFAULT_PREFIX = "";

/**
 * フォーマット結果のサフィックスのデフォルト
 */
const DEFAULT_SUFFIX = "";

/**
 * フォーマッターオプションを補正したコピーを返却
 * 
 * @param radix フォーマット結果の基数
 * @param options フォーマッターオプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めたフォーマッターオプション
 */
function resolveOptions(radix: Radix, options: Options = {}): ResolvedOptions {
  const minPaddedLength: number = minPaddedLengthOf(radix);
  const paddedLength: number = (typeof options.paddedLength === "number") ? options.paddedLength : minPaddedLength;
  if (Number.isSafeInteger(paddedLength) !== true) {
    throw new TypeError("paddedLength");
  }
  if (paddedLength < minPaddedLength) {
    throw new RangeError("paddedLength");
  }
  const upperCase: boolean = (typeof options.upperCase === "boolean") ? options.upperCase : DEFAULT_UPPER_CASE;
  const prefix: string = (typeof options.prefix === "string") ? options.prefix : DEFAULT_PREFIX;
  const suffix: string = (typeof options.suffix === "string") ? options.suffix : DEFAULT_SUFFIX;

  return {
    paddedLength,
    upperCase,
    prefix,
    suffix,
  };
}

/**
 * 基数に応じた前方ゼロ埋め結果の最小文字列長を返却
 * 
 * @param radix フォーマット結果の基数
 * @returns フォーマット結果の前方ゼロ埋め結果の最小文字列長
 */
function minPaddedLengthOf(radix: Radix): number {
  switch (radix) {
  case 2:
    return 8;
  case 8:
    return 3;
  case 10:
    return 3;
  case 16:
    return 2;
  default:
    // neverだがjsから利用した場合、普通に到達する
    throw new Exception("NotFoundError", "unsupported radix");
  }
}

/**
 * 文字列を8-bit符号なし整数にパースし返却
 * 
 * @param formatted 文字列
 * @param radix フォーマット結果の基数
 * @param resolvedOptions フォーマッターオプション
 * @returns 8-bit符号なし整数
 */
function parseByte(formatted: string, radix: Radix, resolvedOptions: ResolvedOptions): uint8 {
  let work = formatted;
  if (resolvedOptions.prefix.length > 0) {
    if (formatted.startsWith(resolvedOptions.prefix) !== true) {
      throw new Exception("InvalidCharacterError", "unprefixed");
    }
    work = work.substring(resolvedOptions.prefix.length);
  }
  if (resolvedOptions.suffix.length > 0) {
    if (formatted.endsWith(resolvedOptions.suffix) !== true) {
      throw new Exception("InvalidCharacterError", "unsuffixed");
    }
    work = work.substring(0, (work.length - resolvedOptions.suffix.length));
  }

  const integer = Number.parseInt(work, radix);
  if (isByte(integer)) {
    return integer;
  }

  // 今のところ到達しない（事前に#testを通る）
  throw new Exception("InvalidCharacterError", "parse error");
}

/**
 * 文字列がフォーマットオプションに合致しているか否かを返却
 * 
 * @param formatted 文字列
 * @param radix フォーマット結果の基数
 * @param resolvedOptions フォーマッターオプション
 * @returns 文字列がフォーマットオプションに合致しているか否か
 */
function isFormatted(formatted: string, radix: Radix, resolvedOptions: ResolvedOptions): boolean {
  let charsPattern: string;
  switch (radix) {
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
    if (resolvedOptions.upperCase === true) {
      charsPattern = "[0-9A-F]";
    }
    else {
      charsPattern = "[0-9a-f]";
    }
    break;
  }
  const prefixPattern = (resolvedOptions.prefix.length > 0) ? `.{${ resolvedOptions.prefix.length }}` : "";
  const suffixPattern = (resolvedOptions.suffix.length > 0) ? `.{${ resolvedOptions.suffix.length }}` : "";
  const bodyLength = minPaddedLengthOf(radix);
  const paddingLength = resolvedOptions.paddedLength - bodyLength;
  const paddingPattern = (paddingLength > 0) ? `[${ PADDING_CHAR }]{${ paddingLength }}` : ""; // XXX PADDING_CHARが要エスケープの場合が未実装
  const regex = new RegExp(`^(${ prefixPattern }${ paddingPattern }${ charsPattern }{${ bodyLength }}${ suffixPattern })*$`, "s");

  return regex.test(formatted);
}

/**
 * 文字列をバイト列にパースし返却
 * 
 * @param toParse 文字列
 * @param radix フォーマット結果の基数
 * @param resolvedOptions フォーマッターオプション
 * @returns バイト列
 */
function parse(toParse: string, radix: Radix, options?: Options): Uint8Array {
  const resolvedOptions = resolveOptions(radix, options);
  if (isFormatted(toParse, radix, resolvedOptions) !== true) {
    throw new Exception("DataError", "parse error");
  }

  const elementLength = resolvedOptions.paddedLength + resolvedOptions.prefix.length + resolvedOptions.suffix.length;
  const byteStringArray = devideStringByLength(toParse, elementLength);

  return Uint8Array.from(byteStringArray, (byteString) => {
    return parseByte(byteString, radix, resolvedOptions);
  });
}

/**
 * 8-bit符号なし整数を文字列にフォーマットし返却
 * 
 * @param byte 8-bit符号なし整数
 * @param radix フォーマット結果の基数
 * @param resolvedOptions フォーマッターオプション
 * @returns 文字列
 */
function formatByte(byte: uint8, radix: Radix, resolvedOptions: ResolvedOptions): string {
  let str = byte.toString(radix);
  if (resolvedOptions.upperCase === true) {
    str = str.toUpperCase();
  }
  str = str.padStart(resolvedOptions.paddedLength, PADDING_CHAR);
  return resolvedOptions.prefix + str + resolvedOptions.suffix;
}

/**
 * バイト列を文字列にフォーマットし返却
 * 
 * @param bytes バイト列
 * @param radix フォーマット結果の基数
 * @param resolvedOptions フォーマッターオプション
 * @returns 文字列
 */
function format(bytes: Uint8Array, radix: Radix, options?: Options): string {
  const resolvedOptions = resolveOptions(radix, options);
  const byteStringArray = [ ...bytes ].map((byte) => {
    return formatByte(byte as uint8, radix, resolvedOptions);
  });
  return byteStringArray.join("");
}

export {
  Radix as FormatRadix,
  Options as FormatOptions,
};

export const Format = {
  parse,
  format,
};
