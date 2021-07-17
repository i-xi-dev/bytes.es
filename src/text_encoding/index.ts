import { Exception } from "../_";

/**
 * 文字符号化方式の実装のインスタンス
 */
export interface TextEncodingImpl {
  /**
   * バイト列を文字列に復号し、結果のバイト列を返却
   * @param encoded 符号化されたバイト列
   * @returns 復号した文字列
   */
  decode(encoded: Uint8Array): string;

  /**
   * 文字列をバイト列に符号化し、結果のバイト列を返却
   * @param toEncode 文字列
   * @returns 符号化したバイト列
   */
  encode(toEncode: string): Uint8Array;
}

/**
 * 文字符号化方式の実装
 */
interface TextEncodingImplConstructor {
  /**
   * @param options 文字符号化方式オプション
   */
  new(options?: TextEncodingOptions): TextEncodingImpl;
}

/**
 * 符号化方式オプション
 */
export type TextEncodingOptions = {
};

/**
 * 文字符号化方式
 */
class TextEncoding {
  /**
   * 文字符号化方式の実装登録簿
   */
  static readonly #registry: Map<string, TextEncodingImplConstructor> = new Map<string, TextEncodingImplConstructor>();

  private constructor() {
    throw new Exception("NotSupportedError", "not constructible");
  }

  /**
   * 名称からTextEncodingImplのインスタンスを生成し返却
   * @param encodingName 符号化方式の名称（実装登録簿に登録した名前）
   * @param options 符号化方式オプション
   * @returns TextEncodingImplのインスタンス
   * @throws 実装登録簿に存在しない場合NotFoundErrorをスロー
   */
  static for(encodingName: string, options?: TextEncodingOptions): TextEncodingImpl {
    const normalizedName = encodingName.toLowerCase();

    const impl = TextEncoding.#registry.get(normalizedName);
    if (impl === undefined) {
      throw new Exception("NotFoundError", "unknown encodingName");
    }
    return new impl(options);
  }

  /**
   * 符号化方式を実装登録簿に登録する
   * @param encodingName 符号化方式の名称
   * @param implConstructor TextEncodingImplのコンストラクター
   */
  static register(encodingName: string, implConstructor: TextEncodingImplConstructor): void {
    TextEncoding.#registry.set(encodingName.toLowerCase(), implConstructor);
  }

  /**
   * 符号化方式が実装登録簿に登録済か否かを返却
   * @param encodingName 符号化方式の名称
   * @returns 符号化方式が実装登録簿に登録済か否か
   */
  static isRegistered(encodingName: string): boolean {
    return [ ...TextEncoding.#registry.keys() ].includes(encodingName.toLowerCase());
  }
}
Object.freeze(TextEncoding);

export { TextEncoding };
