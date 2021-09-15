//

import { Exception } from "../../_.js";
import { uint8 } from "../type.js";
import { Format } from "../format.js";

/**
 * 符号化集合の種別
 * ※C0 control符号化集合はデフォルトで必ず符号化する
 *   ここで表すものは0x00-0x1F,0x25,0x7F-0xFF への追加の符号化集合
 * ※URL Standardの定義と異なり、0x25("%")は必ず含むこととする
 *   （例えばfragment percent-encode setが%を含んでいないのは、URLの仕様上は（%復号された）fragmentに%が出現することがないからである
 *     ここでは、URLそのものの仕様には踏み込まないので、%は含める）
 */
const EncodeSetType = {
  /** Code points of the C0 control percent-encode set */
  NONE: "none",

  /** Code points of the URL fragment percent-encode set */
  URI_FRAGMENT: "uri-fragment",

  /** Code points of the URL query percent-encode set */
  URI_QUERY: "uri-query",

  /** Code points of the URL special-query percent-encode set */
  URI_SPECIAL_QUERY: "uri-special-query",

  /** Code points of the URL path percent-encode set */
  URI_PATH: "uri-path",

  /** Code points of the URL userinfo percent-encode set */
  URI_USERINFO: "uri-userinfo",

  /** Code points of the URL component percent-encode set (except 0x25) */
  URI_COMPONENT: "uri-component",

  /** Code points of the application/x-www-form-urlencoded percent-encode set (except 0x25) */
  FORM_URLENCODED: "form-urlencoded",

  /** All code points except 0x25 */
  ALL: "all",
} as const;
type EncodeSetType = typeof EncodeSetType[keyof typeof EncodeSetType];

/**
 * パーセント符号化方式オプション
 */
type Options = {
  /**
   * 符号化時、encodeSetに0x20が含まれているときに、0x20を"+"に符号化するか否か
   *     encodeSetに0x20が含まれていなければ無視する
   *     trueにするときは、encodeSetに"+"(0x2B)が含まれている必要がある
   * 復号時、"+"を0x20に復号するか否か
   */
  spaceAsPlus?: boolean,
};

/**
 * パーセント符号化の復号オプション
 */
type DecodeOptions = Options & {
};

/**
 * パーセント符号化の符号化オプション
 */
type EncodeOptions = Options & {
  /**
   * 0x00-0x1F,0x25,0x7F-0xFF以外に"%XX"への変換対象とするバイトの配列
   */
  encodeSet?: EncodeSetType,
};

/**
 * 未設定を許可しないパーセント符号化の復号オプション
 */
type ResolvedOptions = {
  /** @see {@link EncodeOptions.encodeSet} */
  encodeSet: Set<uint8>,

  /** @see {@link Options.spaceAsPlus} */
  spaceAsPlus: boolean,
};

/**
 * 0x20を"+"に符号化するか否かのデフォルト
 */
const DEFAULT_SPACE_AS_PLUS = false;

/**
 * 符号化集合
 */
const EncodeSetMap: Record<EncodeSetType, Set<uint8>> = {
  /** Code points of the C0 control percent-encode set */
  [EncodeSetType.NONE]: new Set([]),

  /** Code points of the URL fragment percent-encode set */
  [EncodeSetType.URI_FRAGMENT]: new Set([ 0x20, 0x22, 0x3C, 0x3E, 0x60 ]),

  /** Code points of the URL query percent-encode set */
  [EncodeSetType.URI_QUERY]: new Set([ 0x20, 0x22, 0x23, 0x3C, 0x3E ]),

  /** Code points of the URL special-query percent-encode set */
  [EncodeSetType.URI_SPECIAL_QUERY]: new Set([ 0x20, 0x22, 0x23, 0x27, 0x3C, 0x3E ]),

  /** Code points of the URL path percent-encode set */
  [EncodeSetType.URI_PATH]: new Set([ 0x20, 0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60, 0x7B, 0x7D ]),

  /** Code points of the URL userinfo percent-encode set */
  [EncodeSetType.URI_USERINFO]: new Set([ 0x20, 0x22, 0x23, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ]),

  /** Code points of the URL component percent-encode set */
  [EncodeSetType.URI_COMPONENT]: new Set([ 0x20, 0x22, 0x23, 0x24, 0x26, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D ]),

  /** Code points of the application/x-www-form-urlencoded percent-encode set */
  [EncodeSetType.FORM_URLENCODED]: new Set([ 0x20, 0x21, 0x22, 0x23, 0x24, 0x26, 0x27, 0x28, 0x29, 0x2B, 0x2C, 0x2F, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x5B, 0x5C, 0x5D, 0x5E, 0x60, 0x7B, 0x7C, 0x7D, 0x7E ]),

  /** All code points except 0x25 */
  [EncodeSetType.ALL]: new Set([
    0x20,
    0x21,
    0x22,
    0x23,
    0x24,
    0x26,
    0x27,
    0x28,
    0x29,
    0x2A,
    0x2B,
    0x2C,
    0x2D,
    0x2E,
    0x2F,
    0x30,
    0x31,
    0x32,
    0x33,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x3A,
    0x3B,
    0x3C,
    0x3D,
    0x3E,
    0x3F,
    0x40,
    0x41,
    0x42,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4A,
    0x4B,
    0x4C,
    0x4D,
    0x4E,
    0x4F,
    0x50,
    0x51,
    0x52,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5A,
    0x5B,
    0x5C,
    0x5D,
    0x5E,
    0x5F,
    0x60,
    0x61,
    0x62,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6A,
    0x6B,
    0x6C,
    0x6D,
    0x6E,
    0x6F,
    0x70,
    0x71,
    0x72,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7A,
    0x7B,
    0x7C,
    0x7D,
    0x7E,
  ]),
};

/**
 * パーセント符号化の復号オプションを補正したコピーを返却
 * 
 * @param options パーセント符号化のオプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めたパーセント符号化のオプション
 */
function resolveOptions(options: DecodeOptions | EncodeOptions = {}): ResolvedOptions {
  let encodeTypeSet: EncodeSetType = EncodeSetType.ALL;
  if (("encodeSet" in options) && options.encodeSet) {
    if (Object.values(EncodeSetType).includes(options.encodeSet)) {
      encodeTypeSet = options.encodeSet;
    }
  }
  const encodeSet = EncodeSetMap[encodeTypeSet];
  const spaceAsPlus: boolean = (typeof options.spaceAsPlus === "boolean") ? options.spaceAsPlus : DEFAULT_SPACE_AS_PLUS;

  return {
    encodeSet,
    spaceAsPlus,
  };
}

/**
 * バイトが"%XX"の形にする対象か否かを返却
 * 
 * @param byte バイト
 * @param encodeSet 0x00-0x1F,0x25,0x7F-0xFF以外に"%XX"への変換対象とするバイトのセット
 * @returns バイトが"%XX"の形にする対象か否か
 */
function isTargetByte(byte: uint8, encodeSet: Set<uint8>): boolean {
  return ((byte < 0x20) || (byte > 0x7E) || (byte === 0x25) || encodeSet.has(byte));
}

/**
 * 文字列をバイト列にパーセント復号し、結果のバイト列を返却
 * 
 * {@link https://url.spec.whatwg.org/#string-percent-decode URL Standard}の仕様に従った。
 * 
 * @param encoded パーセント符号化された文字列
 * @param options パーセント符号化の復号オプション
 * @returns バイト列
 */
function decode(encoded: string, options?: DecodeOptions): Uint8Array {
  if (/^[\u0020-\u007E]*$/.test(encoded) !== true) {
    throw new Exception("EncodingError", "decode error (1)");
  }

  const resolvedOptions: ResolvedOptions = resolveOptions(options);

  const decoded = new Uint8Array(encoded.length); // 0x20-0x7E以外を含んでいたらエラーにしている為decoded.lengthがencoded.lengthより増えることは無い
  const hexRegExp = /^[0-9A-Fa-f]{2}$/;

  let i = 0;
  let j = 0;
  while (i < encoded.length) {
    const c = encoded.charAt(i);

    let byte: uint8;
    if (c === "%") {
      const byteString = encoded.substring((i + 1), (i + 3));
      if (hexRegExp.test(byteString)) {
        byte = Number.parseInt(byteString, 16) as uint8;
        i = i + 3;
      }
      else {
        byte = c.charCodeAt(0) as uint8;
        i = i + 1;
      }
    }
    else if (c === "+") {
      if (resolvedOptions.spaceAsPlus === true) {
        byte = 0x20;
      }
      else {
        byte = 0x2B;// c.charCodeAt(0) as uint8;
      }
      i = i + 1;
    }
    else {
      byte = c.charCodeAt(0) as uint8;
      i = i + 1;
    }

    decoded[j++] = byte;
  }

  if (decoded.length > j) {
    return decoded.subarray(0, j);
  }
  return decoded;
}

/**
 * バイト列を文字列にパーセント符号化し、結果の文字列を返却
 * 
 * {@link https://url.spec.whatwg.org/ URL Standard}の仕様に従い、"%"に後続する16進数は大文字で固定。
 * （小文字にする必要性は無いと思われるので、小文字にするオプションは提供しない）
 * 
 * デフォルトでは全バイトを"%XX"の形に符号化する。
 * URLエンコードとして使用するには、URLコンポーネントに応じてoptions.encodeSetを設定すること。
 * 
 * @param toEncode バイト列
 * @param options パーセント符号化の符号化オプション
 * @returns パーセント符号化された文字列
 */
function encode(toEncode: Uint8Array, options?: EncodeOptions): string {
  const resolvedOptions: ResolvedOptions = resolveOptions(options);
  if ((resolvedOptions.spaceAsPlus === true) && (resolvedOptions.encodeSet.has(0x2B) !== true)) {
    throw new TypeError("options.encodeSet, options.spaceAsPlus");
  }

  const formatOptions = { upperCase: true, prefix: "%" };

  let work: Array<uint8> = [];
  let encoded = "";
  for (const byte of toEncode) {
    if (isTargetByte(byte as uint8, resolvedOptions.encodeSet)) {
      if (byte === 0x20) {
        if (resolvedOptions.spaceAsPlus === true) {
          encoded = encoded + Format.format(Uint8Array.from(work), 16, formatOptions) + "+";
          work = [];
        }
        else {
          work.push(byte);
        }
      }
      else {
        work.push(byte as uint8);
      }
    }
    else {
      // 上記以外はbinary stringと同じ
      encoded = encoded + Format.format(Uint8Array.from(work), 16, formatOptions) + String.fromCharCode(byte);
      work = [];
    }
  }
  encoded = encoded + Format.format(Uint8Array.from(work), 16, formatOptions);
  return encoded;
}

export {
  DecodeOptions as PercentDecodeOptions,
  EncodeOptions as PercentEncodeOptions,
};

/**
 * Percent encoding
 */
export const Percent = Object.freeze({
  decode,
  encode,
});
