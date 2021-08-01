//

import { Exception } from "../_";
import { BOM, TextDecodeOptions, TextEncodeOptions, TextEncodingImplementation } from "./_";

/**
 * 符号化方式名
 */
const NAME = "US-ASCII";

/**
 * バイト列を文字列に復号し、結果のバイト列を返却
 * 
 * TextDecoderに丸投げした後、範囲チェックする。（TextDecoderの"US-ASCII"は"ISO-8859-1"と同じである為）
 * 
 * @param encoded 符号化されたバイト列
 * @param options 復号オプション
 * @returns 復号した文字列
 */
function decode(encoded: Uint8Array, options: TextDecodeOptions = {}): string {
  const decoder = new TextDecoder(NAME, {
    fatal: (options.fallback === "exception"), // ISO-8859-1扱いになる為、エラーは起こりえない
  });
  const decoded = decoder.decode(encoded);

  if (/^[\u{0}-\u{7F}]*$/u.test(decoded) !== true) {
    if (options.fallback === "exception") {
      throw new Exception("EncodingError", "decode error");
    }
    return decoded.replaceAll(/[^\u{0}-\u{7F}]/gu, "\u{FFFD}");
  }
  return decoded;
}

/**
 * 文字列をバイト列に符号化し、結果のバイト列を返却
 * 
 * 範囲のみチェックし、後はTextEncoderに丸投げ。
 * 
 * @param toEncode 文字列
 * @param options 符号化オプション
 * @returns 符号化したバイト列
 */
function encode(toEncode: string, options: TextEncodeOptions = {}): Uint8Array {
  if (/^[\u{0}-\u{7F}]*$/u.test(toEncode) !== true) {
    throw new Exception("EncodingError", "encode error");
    // TODO options.fallback未実装
  }

  const encoder = new TextEncoder();
  if ((options.addBom === true) && (toEncode.startsWith(BOM) !== true)) {
    return encoder.encode(BOM + toEncode);
  }
  return encoder.encode(toEncode);
}

/**
 * US-ASCII encoding of US-ASCII characters
 */
export const UsAscii: TextEncodingImplementation = {
  name: NAME,
  decode,
  encode,
};
