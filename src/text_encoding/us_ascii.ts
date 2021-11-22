//

import { Exception } from "../_";
import {
  resolveDecodeOptions,
  resolveEncodeOptions,
  TextDecodeOptions,
  TextEncodeOptions,
  TextEncodingImplementation,
} from "./_";

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
 *     removeBomは無視する
 * @returns 復号した文字列
 */
function decode(encoded: Uint8Array, options: TextDecodeOptions = {}): string {
  const resolvedOptions = resolveDecodeOptions(options);

  const decoder = new TextDecoder(NAME, {
    fatal: false, // ISO-8859-1扱いになる為、エラーは起こりえない
  });
  const decoded = decoder.decode(encoded);

  if (/^[\u{0}-\u{7F}]*$/u.test(decoded) !== true) {
    if (resolvedOptions.fallback === "exception") {
      throw new Exception("EncodingError", "decode error");
    }
    // return decoded.replaceAll(/[^\u{0}-\u{7F}]/gu, "\u{FFFD}");
    return decoded.replace(/[^\u{0}-\u{7F}]/gu, "\u{FFFD}");
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
 *     addBomは無視する
 * @returns 符号化したバイト列
 */
function encode(toEncode: string, options: TextEncodeOptions = {}): Uint8Array {
  const resolvedOptions = resolveEncodeOptions(options);

  if (/^[\u{0}-\u{7F}]*$/u.test(toEncode) !== true) {
    if (resolvedOptions.fallback === "exception") {
      throw new Exception("EncodingError", "encode error");
    }
    const encoder = new TextEncoder();
    // return encoder.encode(toEncode.replaceAll(/[^\u{0}-\u{7F}]/gu, "\u{3F}"));
    return encoder.encode(toEncode.replace(/[^\u{0}-\u{7F}]/gu, "\u{3F}"));
  }

  const encoder = new TextEncoder();
  return encoder.encode(toEncode);
}

/**
 * US-ASCII encoding of US-ASCII characters
 */
export const UsAscii: TextEncodingImplementation = Object.freeze({
  name: NAME,
  decode,
  encode,
});
