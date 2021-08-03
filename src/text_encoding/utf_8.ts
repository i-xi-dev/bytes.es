//

import { Exception } from "../_.js";
import {
  BOM,
  resolveDecodeOptions,
  resolveEncodeOptions,
  TextDecodeOptions,
  TextEncodeOptions,
  TextEncodingImplementation,
} from "./_.js";

/**
 * 符号化方式名
 */
const NAME = "UTF-8";

/**
 * バイト列を文字列に復号し、結果のバイト列を返却
 * 
 * TextDecoderに丸投げ。
 * 
 * @param encoded 符号化されたバイト列
 * @param options 復号オプション
 * @returns 復号した文字列
 */
function decode(encoded: Uint8Array, options: TextDecodeOptions = {}): string {
  const resolvedOptions = resolveDecodeOptions(options);

  try {
    const decoder = new TextDecoder(NAME, {
      fatal: (resolvedOptions.fallback === "exception"),
      ignoreBOM: (resolvedOptions.removeBom === true) ? false : true,
    });
    return decoder.decode(encoded);
  }
  catch (exception) {
    // encodedのバイトの並びがおかしい場合
    throw new Exception("EncodingError", "decode error", [ exception ]);
  }
}

/**
 * 文字列をバイト列に符号化し、結果のバイト列を返却
 * 
 * TextEncoderに丸投げ。（符号化できない文字は存在しないので、失敗は起こりえない）
 * 
 * @param toEncode 文字列
 * @param options 符号化オプション
 * @returns 符号化したバイト列
 */
function encode(toEncode: string, options: TextEncodeOptions = {}): Uint8Array {
  const resolvedOptions = resolveEncodeOptions(options);

  const encoder = new TextEncoder();
  if ((resolvedOptions.addBom === true) && (toEncode.startsWith(BOM) !== true)) {
    return encoder.encode(BOM + toEncode);
  }
  return encoder.encode(toEncode);
}

/**
 * UTF-8 encoding of Unicode characters
 */
export const Utf8: TextEncodingImplementation = {
  name: NAME,
  decode,
  encode,
};
