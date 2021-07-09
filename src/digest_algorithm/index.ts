import { Exception } from "../_";

/**
 * ハッシュアルゴリズムの実装のインスタンス
 */
export interface DigestAlgorithmImpl {
  /**
   * バイト列のハッシュを生成し、ハッシュのバイト列を返却
   * @param toCompute バイト列
   */
  compute(toCompute: Uint8Array): Promise<Uint8Array>;
}

/**
 * ハッシュアルゴリズムの実装
 */
interface DigestAlgorithmImplConstructor {
  /**
   * @param options ハッシュアルゴリズムオプション
   */
  new(options?: DigestAlgorithmOptions): DigestAlgorithmImpl;
}

/**
 * ハッシュアルゴリズムオプション
 */
export type DigestAlgorithmOptions = {
};

/**
 * ハッシュアルゴリズム
 */
class DigestAlgorithm {
  /**
   * バイト符号化方式の実装登録簿
   */
  static readonly #registry: Map<string, DigestAlgorithmImplConstructor> = new Map();

  private constructor() {
    throw new Error();
  }

  /**
   * 名称からDigestAlgorithmImplのインスタンスを生成し返却
   * @param algorithmName ハッシュアルゴリズムの名称（実装登録簿に登録した名前）
   * @param options ハッシュアルゴリズムオプション
   * @returns DigestAlgorithmImplのインスタンス
   * @throws 実装登録簿に存在しない場合NotFoundErrorをスロー
   */
  static for(algorithmName: string, options?: DigestAlgorithmOptions): DigestAlgorithmImpl {
    const normalizedName = algorithmName.toLowerCase();

    const impl = DigestAlgorithm.#registry.get(normalizedName);
    if (impl === undefined) {
      throw new Exception("NotFoundError", "unknown algorithmName");
    }
    return new impl(options);
  }

  /**
   * 符号化方式を実装登録簿に登録する
   * @param algorithmName 符号化方式の名称
   * @param implConstructor DigestAlgorithmImplのコンストラクター
   */
  static register(algorithmName: string, implConstructor: DigestAlgorithmImplConstructor): void {
    DigestAlgorithm.#registry.set(algorithmName.toLowerCase(), implConstructor);
  }
}
Object.freeze(DigestAlgorithm);

export { DigestAlgorithm };
