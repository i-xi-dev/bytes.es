//

// UTF-8符号化方式

import { Exception } from "../_";
import { BOM, TextDecodeOptions, TextEncodeOptions, TextEncodingImpl } from "./_";

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
  try {
    const decoder = new TextDecoder(NAME, {
      fatal: (options.fallback === "exception"),
      ignoreBOM: (options.removeBom === true) ? false : true,
    });
    return decoder.decode(encoded);
  }
  catch (exception) {
    throw new Exception("EncodingError", "decode error", [ exception ]);
  }
}

/**
 * 文字列をバイト列に符号化し、結果のバイト列を返却
 * 
 * TextEncoderに丸投げ。
 * 
 * @param toEncode 文字列
 * @param options 符号化オプション
 * @returns 符号化したバイト列
 */
function encode(toEncode: string, options: TextEncodeOptions = {}): Uint8Array {
  const encoder = new TextEncoder();
  if ((options.addBom === true) && (toEncode.startsWith(BOM) !== true)) {
    return encoder.encode(BOM + toEncode);
  }
  return encoder.encode(toEncode);
}

export const Utf8: TextEncodingImpl = {
  name: NAME,
  decode,
  encode,
};
