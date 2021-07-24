//

// 文字符号化

/**
 * 文字符号化の復号オプション
 */
type DecodeOptions = {
  /**
   * 当該文字符号化方式では復号できないバイトが含まれていた場合にどうするか
   *     - exception: 例外とする
   *     - replacement: 置換する（置換文字は実装依存（U+FFFDなど））※情報は失われることに注意
   * 省略時"replacement"
   */
  fallback?: "exception" | "replacement",

  /**
   * 先頭のBOMを除去するか否か
   * 省略時false
   */
  removeBom?: boolean,
};

/**
 * 文字符号化の符号化オプション
 */
type EncodeOptions = {
  // XXX fallback 要る？

  /**
   * 先頭がBOMではない場合に先頭にBOMを付加するか否か
   * 省略時false
   * ※符号化方式によっては無視する
   */
  addBom?: boolean,
};

/**
 * BOM
 */
const BOM = "\u{FEFF}";

/**
 * 文字符号化方式
 */
interface TextEncodingImpl {
  /**
   * 名称
   */
  name: string,

  /**
   * バイト列を文字列に復号し、結果のバイト列を返却
   * 
   * @param encoded 符号化されたバイト列
   * @param options 復号オプション
   * @returns 復号した文字列
   */
  decode(encoded: Uint8Array, options?: DecodeOptions): string;

  /**
   * 文字列をバイト列に符号化し、結果のバイト列を返却
   * 
   * @param toEncode 文字列
   * @param options 符号化オプション
   * @returns 符号化したバイト列
   */
  encode(toEncode: string, options?: EncodeOptions): Uint8Array;
}

export {
  DecodeOptions as TextDecodeOptions,
  EncodeOptions as TextEncodeOptions,
  BOM,
  TextEncodingImpl,
};
