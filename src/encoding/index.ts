import { Exception } from "../_";

/**
 * バイト符号化方式の実装のインスタンス
 */
export interface ByteEncodingImpl {
  /**
   * 文字列をバイト列に復号し、結果のバイト列を返却
   * @param encoded 符号化された文字列
   */
  decode(encoded: string): Uint8Array;

  /**
   * バイト列を文字列に符号化し、結果の文字列を返却
   * @param toEncode バイト列
   */
  encode(toEncode: Uint8Array): string;
}

/**
 * バイト符号化方式の実装
 */
interface ByteEncodingImplConstructor {
  /**
   * @param options バイト符号化方式オプション
   */
  new(options?: ByteEncodingOptions): ByteEncodingImpl;
}

/**
 * バイト符号化方式オプション
 */
export type ByteEncodingOptions = {
};

/**
 * バイト符号化方式
 */
class ByteEncoding {
  /**
   * バイト符号化方式の実装登録簿
   */
  static readonly #registry: Map<string, ByteEncodingImplConstructor> = new Map();

  private constructor() {
    throw new Error();
  }

  /**
   * 名称からByteEncodingImplのインスタンスを生成し返却
   * @param encodingName 符号化方式の名称（実装登録簿に登録した名前）
   * @param options バイト符号化方式オプション
   * @returns ByteEncodingImplのインスタンス
   * @throws 実装登録簿に存在しない場合NotFoundErrorをスロー
   */
  static for(encodingName: string, options?: ByteEncodingOptions): ByteEncodingImpl {
    const normalizedName = encodingName.toLowerCase();

    const impl = ByteEncoding.#registry.get(normalizedName);
    if (impl === undefined) {
      throw new Exception("NotFoundError", "unknown encodingName");
    }
    return new impl(options);
  }

  /**
   * 符号化方式を実装登録簿に登録する
   * @param encodingName 符号化方式の名称
   * @param implConstructor ByteEncodingImplのコンストラクター
   */
  static register(encodingName: string, implConstructor: ByteEncodingImplConstructor): void {
    ByteEncoding.#registry.set(encodingName.toLowerCase(), implConstructor);
  }
}
Object.freeze(ByteEncoding);

export { ByteEncoding };
