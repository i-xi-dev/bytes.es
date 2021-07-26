//

// パーセント符号化方式

import { Exception } from "../../_";
import { isByte, uint8 } from "../type";
import { Format } from "../format";

/**
 * パーセント符号化方式オプション
 */
type Options = {
  /** 0x00-0x1F,0x25,0x7F-0xFF以外に"%XX"への変換対象とするバイトの配列 */
  inclusions?: Array<uint8>,

  /**
   * inclusionsに0x20が含まれているときに、0x20を"+"に符号化するか否か
   *     inclusionsに0x20が含まれていなければ無視する
   *     trueにするときは、inclusionsに"+"(0x2B)を追加する必要がある
   */
  spaceAsPlus?: boolean,
};

/**
 * パーセント符号化の復号オプション
 */
type DecodeOptions = Options & {
  /**
   * パーセント符号化方式オプションに合致しない文字列が出現した場合エラーにするか否か
   *     ※エンコードには影響しない
   *     ※strict=falseでのデコード結果は、同じオプションで再エンコードしても元に戻らない可能性あり
   *     ※strict=falseの場合、デコード結果のlengthとbuffer.lengthが一致しなくなる可能性あり
   */
   strict?: boolean,

   /**
    * "%"に後続する16進数の大文字小文字を無視するか否か
    */
   caseInsensitive?: boolean,
};

/**
 * パーセント符号化の符号化オプション
 */
type EncodeOptions = Options & {
};

/**
 * 未設定を許可しないパーセント符号化の復号オプション
 */
type ResolvedOptions = {
  /** 0x00-0x1F,0x25,0x7F-0xFF以外に"%XX"への変換対象とするバイトの配列 */
  inclusions: Array<uint8>,
  /** inclusionsに0x20が含まれているときに、0x20を"+"に符号化するか否か */
  spaceAsPlus: boolean,
  /** デコード時、パーセント符号化方式オプションに合致しない文字列が出現した場合エラーにするか否か（エンコードでは無視する） */
  strict: boolean,
  /** デコード時、"%"に後続する16進数の大文字小文字を無視するか否か（エンコードでは無視する） */
  caseInsensitive: boolean,
};

/**
 * "%XX"への変換対象とするバイトの配列のデフォルト
 */
const DEFAULT_INCLUSIONS: ReadonlyArray<uint8> = [];

/**
 * 0x20を"+"に符号化するか否かのデフォルト
 */
const DEFAULT_SPACE_AS_PLUS = false;

/**
 * デコード時、パーセント符号化方式オプションに合致しない文字列が出現した場合エラーにするか否かのデフォルト
 */
const DEFAULT_STRICT = true;

/**
 * デコード時、"%"に後続する16進数の大文字小文字を無視するか否かのデフォルト
 */
const DEFAULT_CASE_INSENSITIVE = false;

/**
 * 変換対象とするバイトの配列を正規化し返却
 *     ・変換対象とするバイトの配列を重複排除しソートして返却
 *     ・配列ではない場合はDEFAULT_INCLUSIONSを返却
 * 
 * @param inclusions 変換対象とするバイトの配列
 * @returns 正規化した変換対象バイト配列
 */
function normalizeInclusions(inclusions?: Array<uint8>): Array<uint8> {
  if (Array.isArray(inclusions)) {
    if (inclusions.every((byte) => isByte(byte) && ((byte < 0x20 || byte > 0x7E || byte === 0x25) !== true))) {
      return [ ...new Set(inclusions) ].sort();
    }
    else {
      throw new TypeError("options.inclusions");
    }
  }
  return [ ...DEFAULT_INCLUSIONS ].sort();
}

/**
 * パーセント符号化の復号オプションを補正したコピーを返却
 * 
 * @param options パーセント符号化のオプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めたパーセント符号化のオプション
 */
function resolveOptions(options: DecodeOptions | EncodeOptions = {}): ResolvedOptions {
  const inclusions = normalizeInclusions(options.inclusions);
  const spaceAsPlus: boolean = (typeof options.spaceAsPlus === "boolean") ? options.spaceAsPlus : DEFAULT_SPACE_AS_PLUS;
  let strict: boolean = DEFAULT_STRICT;
  if ("strict" in options) {
    strict = (typeof options.strict === "boolean") ? options.strict : DEFAULT_STRICT;
  }
  let caseInsensitive: boolean = DEFAULT_CASE_INSENSITIVE;
  if ("caseInsensitive" in options) {
    caseInsensitive = (typeof options.caseInsensitive === "boolean") ? options.caseInsensitive : DEFAULT_CASE_INSENSITIVE;
  }

  if ((spaceAsPlus === true) && (inclusions.includes(0x2B) !== true)) {
    throw new TypeError("options.inclusions, options.spaceAsPlus");
  }

  return {
    inclusions,
    spaceAsPlus,
    strict,
    caseInsensitive,
  };
}

/**
 * パーセント符号化された文字列から、"%XX"の形にエンコードされているバイトの数を取得する正規表現を生成し返却
 * 
 * @param resolvedOptions パーセント符号化のオプション
 * @returns パーセント符号化された文字列から、"%XX"の形にエンコードされているバイトの数を取得する正規表現
 */
function encodedPattern(resolvedOptions: ResolvedOptions): RegExp {
  let pattern = "%([0189A-F][0-9A-F]|25|7F";
  const inclusionsStr = resolvedOptions.inclusions.map((i) => i.toString(16).toUpperCase()).join("|");
  if (inclusionsStr.length > 0) {
    pattern = pattern + "|" + inclusionsStr;
  }
  pattern = pattern + ")";

  const flags = (resolvedOptions.caseInsensitive === true) ? "gi" : "g";
  return new RegExp(pattern, flags);
}

/**
 * バイトが"%XX"の形にする対象か否かを返却
 * 
 * @param byte バイト
 * @param inclusions 0x00-0x1F,0x25,0x7F-0xFF以外に"%XX"への変換対象とするバイトの配列
 * @returns バイトが"%XX"の形にする対象か否か
 */
function isTargetByte(byte: uint8, inclusions: Array<uint8>): boolean {
  return ((byte < 0x20) || (byte > 0x7E) || (byte === 0x25) || inclusions.includes(byte));
}

/**
 * 文字列をバイト列にパーセント復号し、結果のバイト列を返却
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

  const encodedCount = [ ...encoded.matchAll(encodedPattern(resolvedOptions)) ].length;
  const decoded = new Uint8Array(encoded.length - (encodedCount * 3) + encodedCount);

  const hexRegExp = (resolvedOptions.caseInsensitive === true) ? /^[0-9A-Fa-f]{2}$/ : /^[0-9A-F]{2}$/;
  const spaceAsPlus = (resolvedOptions.spaceAsPlus === true) && resolvedOptions.inclusions.includes(0x20);

  let i = 0;
  let j = 0;
  while (i < encoded.length) {
    const c = encoded.charAt(i);

    let byte: uint8;
    if (c === "%") {
      const byteString = encoded.substring((i + 1), (i + 3));
      if (hexRegExp.test(byteString) !== true) {
        throw new Exception("EncodingError", "decode error (2)");
      }
      byte = Number.parseInt(byteString, 16) as uint8;

      if (isTargetByte(byte, resolvedOptions.inclusions)) {
        i = i + 3;
      }
      else {
        if (resolvedOptions.strict === true) {
          throw new Exception("EncodingError", "decode error (3)");
        }
        i = i + 3;
      }
    }
    else if (c === "+") {
      if (spaceAsPlus === true) {
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
 * 0x20～0x7E(0x25を除く)は、オプションのinclusionsで指定されていなければ"%XX"形式にしないことに注意。
 * すなわち、URLエンコードとして使用するにはURLコンポーネントに応じた変換対象を追加する必要がある。
 * 
 * @param toEncode バイト列
 * @param options パーセント符号化の符号化オプション
 * @returns パーセント符号化された文字列
 */
function encode(toEncode: Uint8Array, options?: EncodeOptions): string {
  const resolvedOptions: ResolvedOptions = resolveOptions(options);
  const formatOptions = { upperCase: true, prefix: "%" };

  let work: Array<uint8> = [];
  let encoded = "";
  for (const byte of toEncode) {
    if (isTargetByte(byte as uint8, resolvedOptions.inclusions)) {
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

export const Percent = {
  decode,
  encode,
};
