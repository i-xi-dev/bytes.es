//

// 文字符号化

/**
 * フォールバックの型
 */
const Fallback = {
  /** 例外にする */
  EXCEPTION: "exception",

  /** 置換する */
  REPLACEMENT: "replacement",
} as const;
type Fallback = typeof Fallback[keyof typeof Fallback];

/**
 * 文字符号化の復号オプション
 */
type DecodeOptions = {
  /**
   * 当該文字符号化方式では復号できないバイトが含まれていた場合にどうするか
   *     - exception: 例外とする
   *     - replacement: 置換する（置換文字は実装依存（Encoding Standard準拠の復号器の場合U+FFFD））※情報は失われることに注意
   * 省略時"exception"
   */
  fallback?: Fallback,

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
  /**
   * 当該文字符号化方式では符号化できない文字が含まれていた場合にどうするか
   *     - exception: 例外とする
   *     - replacement: 置換する（置換文字は実装依存）※情報は失われることに注意
   * 省略時"exception"
   */
  fallback?: Fallback,

  /**
   * 先頭がBOMではない場合に先頭にBOMを付加するか否か
   * 省略時false
   * ※符号化方式によっては無視する
   */
  addBom?: boolean,
};

/**
 * 未設定を許可しない文字符号化の復号オプション
 */
type ResolvedDecodeOptions = {
  /**
   * @see {@link DecodeOptions.fallback}
   */
  fallback: Fallback,

  /**
   * @see {@link DecodeOptions.removeBom}
   */
  removeBom: boolean,
};

/**
 * 未設定を許可しない文字符号化の符号化オプション
 */
type ResolvedEncodeOptions = {
  /**
   * @see {@link EncodeOptions.fallback}
   */
  fallback: Fallback,

  /**
   * @see {@link EncodeOptions.addBom}
   */
  addBom: boolean,
};

/**
 * 文字符号化の復号オプションを補正したコピーを返却
 * 
 * @param oprions 文字符号化の復号オプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めた文字符号化の復号オプション
 */
function resolveDecodeOptions(oprions: DecodeOptions = {}): ResolvedDecodeOptions {
  const fallback = (oprions.fallback !== undefined) ? oprions.fallback : Fallback.EXCEPTION;
  const removeBom = (typeof oprions.removeBom === "boolean") ? oprions.removeBom : false;

  return  {
    fallback,
    removeBom,
  };
}

/**
 * 文字符号化の符号化オプションを補正したコピーを返却
 * 
 * @param oprions 文字符号化の符号化オプション
 * @returns 未設定の項目や不正値が設定された項目をデフォルト値で埋めた文字符号化の符号化オプション
 */
function resolveEncodeOptions(oprions: EncodeOptions = {}): ResolvedEncodeOptions {
  const fallback = (oprions.fallback !== undefined) ? oprions.fallback : Fallback.EXCEPTION;
  const addBom = (typeof oprions.addBom === "boolean") ? oprions.addBom : false;

  return  {
    fallback,
    addBom,
  };
}

/**
 * BOM
 */
const BOM = "\u{FEFF}";

/**
 * 文字符号化方式
 */
interface TextEncodingImplementation {
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
  ResolvedDecodeOptions,
  ResolvedEncodeOptions,
  resolveDecodeOptions,
  resolveEncodeOptions,
  BOM,
  TextEncodingImplementation,
};
