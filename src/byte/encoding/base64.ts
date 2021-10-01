//

import { Exception } from "../../_.js";
import { uint8 } from "../type.js";

/**
 * 変換テーブル種別
 */
const TableVariant = {
  /** RFC 4648 Base64 (standard) */
  RFC4648: "rfc4648",

  /** RFC 4648 Base64url (URL and Filename Safe standard) */
  RFC4648_URL: "rfc4648-url",
} as const;
type TableVariant = typeof TableVariant[keyof typeof TableVariant];

/**
 * Base64符号化方式オプション
 */
type Options = {
  /** 変換テーブル種別 */
  table?: TableVariant,

  /** パディングを付加するか否か */
  usePadding?: boolean,
};

/**
 * Base64符号化の復号オプション
 */
type DecodeOptions = Options & {
  /**
   * 復号を寛容に行うか否か
   * （https://infra.spec.whatwg.org/#forgiving-base64-decode の仕様で復号するか否か）
   * 
   * ※trueの場合、usePaddingは無視する
   */
  forgiving?: boolean,
};

/**
 * Base64符号化の符号化オプション
 */
type EncodeOptions = Options & {
};

/**
 * 未設定を許可しないBase64符号化方式オプション
 */
type ResolvedOptions = {
  /** 変換テーブルの62番目の文字 */
  _62ndChar: string,

  /** 変換テーブルの63番目の文字 */
  _63rdChar: string,

  /** 変換テーブル */
  table: ReadonlyArray<string>,

  /** @see {@link Options.usePadding} */
  usePadding: boolean,

  /** @see {@link DecodeOptions.forgiving} */
  forgiving: boolean,
};

/**
 * 0～61番目の文字までの変換テーブル
 */
const BASE_TABLE: ReadonlyArray<string> = [
  "A",  // 0
  "B",  // 1
  "C",  // 2
  "D",  // 3
  "E",  // 4
  "F",  // 5
  "G",  // 6
  "H",  // 7
  "I",  // 8
  "J",  // 9
  "K",  // 10
  "L",  // 11
  "M",  // 12
  "N",  // 13
  "O",  // 14
  "P",  // 15
  "Q",  // 16
  "R",  // 17
  "S",  // 18
  "T",  // 19
  "U",  // 20
  "V",  // 21
  "W",  // 22
  "X",  // 23
  "Y",  // 24
  "Z",  // 25
  "a",  // 26
  "b",  // 27
  "c",  // 28
  "d",  // 29
  "e",  // 30
  "f",  // 31
  "g",  // 32
  "h",  // 33
  "i",  // 34
  "j",  // 35
  "k",  // 36
  "l",  // 37
  "m",  // 38
  "n",  // 39
  "o",  // 40
  "p",  // 41
  "q",  // 42
  "r",  // 43
  "s",  // 44
  "t",  // 45
  "u",  // 46
  "v",  // 47
  "w",  // 48
  "x",  // 49
  "y",  // 50
  "z",  // 51
  "0",  // 52
  "1",  // 53
  "2",  // 54
  "3",  // 55
  "4",  // 56
  "5",  // 57
  "6",  // 58
  "7",  // 59
  "8",  // 60
  "9",  // 61
  // "+",  // 62
  // "/",  // 63
];

/**
 * パディング文字
 */
const PADDING_CHAR = "=";

/**
 * 変換テーブルのデフォルト
 */
const DEFAULT_TABLE = TableVariant.RFC4648;

/**
 * パディングが必要か否かのデフォルト
 */
const DEFAULT_USE_PADDING = true;

/**
 * 復号を寛容に行うか否かのデフォルト
 */
const DEFAULT_FORGIVING = false;

/**
 * Base64符号化方式オプションを補正したコピーを返却
 * 
 * @param options Base64符号化方式オプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めたBase64符号化方式オプション
 */
function resolveOptions(options: DecodeOptions | EncodeOptions = {}): ResolvedOptions {
  const tableType: TableVariant = (options.table) ? options.table : DEFAULT_TABLE;
  let _62ndChar: string;
  let _63rdChar: string;

  switch (tableType) {
  case TableVariant.RFC4648:
    _62ndChar = "+";
    _63rdChar = "/";
    break;
  case TableVariant.RFC4648_URL:
    _62ndChar = "-";
    _63rdChar = "_";
    break;
  }

  const table = [ ...BASE_TABLE ];
  table.push(_62ndChar);
  table.push(_63rdChar);
  // if ((new Set(table)).size !== table.length) {
  //   // 62,63を自由に指定できるようにはしていないうちは不要
  // }
  Object.freeze(table);

  const usePadding: boolean = (typeof options.usePadding === "boolean") ? options.usePadding : DEFAULT_USE_PADDING;
  // if (table.includes(PADDING_CHAR)) {
  //   // 62,63を自由に指定できるようにはしていないうちは不要
  // }

  let forgiving = DEFAULT_FORGIVING;
  if ("forgiving" in options) {
    forgiving = (options.forgiving === true);
  }

  return {
    _62ndChar,
    _63rdChar,
    table,
    usePadding,
    forgiving,
  };
}

/**
 * 文字列が符号化方式オプションに合致しているか否かを返却
 * 
 * @param encoded 文字列
 * @param resolvedOptions 解決済のBase64符号化方式オプション
 * @returns 文字列が符号化方式オプションに合致しているか否か
 */
function isEncoded(encoded: string, resolvedOptions: ResolvedOptions): boolean {
  const _62ndCharPattern = `\\u{${ resolvedOptions._62ndChar.charCodeAt(0).toString(16) }}`;
  const _63rdCharPattern = `\\u{${ resolvedOptions._63rdChar.charCodeAt(0).toString(16) }}`;
  const bodyPattern = `[A-Za-z0-9${ _62ndCharPattern }${ _63rdCharPattern }]`;
  let regex: RegExp;
  if ((resolvedOptions.usePadding === true) && (resolvedOptions.forgiving !== true)) {
    const paddingPattern = `\\u{${ PADDING_CHAR.charCodeAt(0).toString(16) }}`;
    regex = new RegExp(`^(${ bodyPattern }+${ paddingPattern }*|${ bodyPattern }*)$`, "u");
  }
  else {
    regex = new RegExp(`^${ bodyPattern }*$`, "u");
  }

  return regex.test(encoded);
}

/**
 * 文字列をバイト列にBase64復号し、結果のバイト列を返却
 * 
 * {@link https://infra.spec.whatwg.org/#forgiving-base64-decode Infra Standard}および、
 * {@link https://datatracker.ietf.org/doc/html/rfc4648 RFC 4648}の仕様に従った。
 * 改行には非対応（必要であれば改行を除去してからdecodeすべし）。
 * 
 * @param encoded Base64符号化された文字列
 * @param options Base64符号化方式オプション
 * @returns バイト列
 */
function decode(encoded: string, options?: DecodeOptions): Uint8Array {
  const resolvedOptions: ResolvedOptions = resolveOptions(options);

  let work: string = encoded;
  if (resolvedOptions.forgiving === true) {
    // work = work.replaceAll(/[\u{9}\u{A}\u{C}\u{D}\u{20}]/gu, "");
    work = work.replace(/[\u{9}\u{A}\u{C}\u{D}\u{20}]/gu, "");
  }

  if (resolvedOptions.forgiving === true) {
    // work.lengthの箇所は、仕様では符号位置数だがlengthを使用する
    // length !== 符号位置数の場合の処理結果が正しくなくなるが、そうなったとしてもisEncodedでエラーとなる為問題は無いはず

    if ((work.length % 4) === 0) {
      for (let i = 0; i < 2; i++) {
        if (work.endsWith(PADDING_CHAR)) {
          work = work.substring(0, (work.length - 1));
        }
        else {
          break;
        }
      }
    }

    if ((work.length % 4) === 1) {
      throw new Exception("EncodingError", "forgiving decode error");
    }
  }

  if (isEncoded(work, resolvedOptions) !== true) {
    throw new Exception("EncodingError", "decode error (1)");
  }

  const paddingStart = work.indexOf(PADDING_CHAR);
  let paddingCount: number;
  let encodedBody: string;
  if ((resolvedOptions.usePadding === true) && (resolvedOptions.forgiving !== true)) {
    if ((work.length % 4) !== 0) {
      throw new Exception("EncodingError", "decode error (2)");
    }

    if (paddingStart >= 0) {
      paddingCount = work.length - paddingStart;
      encodedBody = work.substring(0, paddingStart);
    }
    else {
      paddingCount = 0;
      encodedBody = work;
    }
  }
  else {
    // if (paddingStart >= 0) {
    //  throw new Exception("InvalidCharacterError", "decode error (3)"); (1)で例外になる
    // }
    paddingCount = (work.length % 4 === 0) ? 0 : 4 - (work.length % 4);
    encodedBody = work;
  }

  let _6bit1: number;
  let _6bit2: number;
  let _6bit3: number;
  let _6bit4: number;
  let _8bitI = 0;
  const encodedByteCount = ((encodedBody.length + paddingCount) * 3 / 4) - paddingCount;
  const decodedBytes = new Uint8Array(encodedByteCount);

  let i = 0;
  if (encodedBody.length >= 4) {
    for (i = 0; i < encodedBody.length; i = i + 4) {
      // 8-bit (1)
      _6bit1 = resolvedOptions.table.indexOf(encodedBody[i] as string);
      _6bit2 = resolvedOptions.table.indexOf(encodedBody[i + 1] as string);
      decodedBytes[_8bitI++] = (_6bit1 << 2) | (_6bit2 >> 4);

      // 8-bit (2)
      if (typeof encodedBody[i + 2] !== "string") {
        decodedBytes[_8bitI++] = ((_6bit2 & 0b001111) << 4);
        break;
      }
      _6bit3 = resolvedOptions.table.indexOf(encodedBody[i + 2] as string);
      decodedBytes[_8bitI++] = ((_6bit2 & 0b001111) << 4) | (_6bit3 >> 2);

      // 8-bit (3)
      if (typeof encodedBody[i + 3] !== "string") {
        decodedBytes[_8bitI++] = ((_6bit3 & 0b000011) << 6);
        break;
      }
      _6bit4 = resolvedOptions.table.indexOf(encodedBody[i + 3] as string);
      decodedBytes[_8bitI++] = ((_6bit3 & 0b000011) << 6) | _6bit4;
    }
  }
  return decodedBytes;
}

/**
 * バイト列を文字列にBase64符号化し、結果の文字列を返却
 * 
 * {@link https://infra.spec.whatwg.org/#forgiving-base64-decode Infra Standard}および、
 * {@link https://datatracker.ietf.org/doc/html/rfc4648 RFC 4648}の仕様に従った。
 * 改行には非対応（必要であればencode結果を改行すべし）。
 * 
 * @param toEncode バイト列
 * @param options Base64符号化方式オプション
 * @returns Base64符号化された文字列
 */
function encode(toEncode: Uint8Array, options?: EncodeOptions): string {
  const resolvedOptions: ResolvedOptions = resolveOptions(options);

  let _6bit1e: string;
  let _6bit2e: string;
  let _6bit3e: string;
  let _6bit4e: string;
  let encodedChars = "";
  for (let i = 0; i < toEncode.byteLength; i = i + 3) { 
    const [ _n8bit1, _n8bit2, _n8bit3 ] = toEncode.subarray(i, i + 3);
    const _8bit1: uint8 = _n8bit1 as uint8;
    const _8bit2: uint8 = (_n8bit2 !== undefined) ? (_n8bit2 as uint8) : 0;

    // 6-bit (1)
    _6bit1e = resolvedOptions.table[_8bit1 >> 2] as string;

    // 6-bit (2)
    _6bit2e = resolvedOptions.table[((_8bit1 & 0b00000011) << 4) | (_8bit2 >> 4)] as string;

    if (_n8bit2 !== undefined) {
      const _8bit3: uint8 = (_n8bit3 !== undefined) ? (_n8bit3 as uint8) : 0;

      // 6-bit (3)
      _6bit3e = resolvedOptions.table[((_8bit2 & 0b00001111) << 2) | (_8bit3 >> 6)] as string;

      if (_n8bit3 !== undefined) {
        // 6-bit (4)
        _6bit4e = resolvedOptions.table[_8bit3 & 0b00111111] as string;
      }
      else {
        _6bit4e = (resolvedOptions.usePadding === true) ? PADDING_CHAR : "";
      }
    }
    else {
      _6bit3e = (resolvedOptions.usePadding === true) ? PADDING_CHAR : "";
      _6bit4e = (resolvedOptions.usePadding === true) ? PADDING_CHAR : "";
    }
    encodedChars = encodedChars.concat(_6bit1e + _6bit2e + _6bit3e + _6bit4e);
  }
  return encodedChars;
}

export {
  DecodeOptions as Base64DecodeOptions,
  EncodeOptions as Base64EncodeOptions,
};

/**
 * Base64 encoding
 */
export const Base64 = Object.freeze({
  decode,
  encode,
});
