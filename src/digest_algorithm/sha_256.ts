
import { DigestAlgorithmOptions, DigestAlgorithmImpl } from "./index";

/**
 * SHA-256ハッシュアルゴリズム
 */
class Sha256Algorithm implements DigestAlgorithmImpl {
  /**
   * @param options ハッシュアルゴリズムオプション
   */
  constructor(options: DigestAlgorithmOptions = {}) {
    console.debug(options);
    Object.freeze(this);
  }

  /**
   * Cryptoオブジェクトを返却
   * @returns Cryptoオブジェクト
   */
  static async #getCrypto(): Promise<Crypto> {
    if (globalThis.crypto && (globalThis.crypto instanceof globalThis.Crypto)) {
      // ブラウザー, Deno
      return globalThis.crypto;
    }
    else if (globalThis.process) {
      // Node.js 条件不十分？
      return ((await import("crypto")).webcrypto as unknown) as Crypto;
    }
    throw new Error("Crypto unsupported");
  }

  /**
   * バイト列のSHA-256ハッシュを生成し、ハッシュのバイト列を返却
   * @param toCompute バイト列
   */
  async compute(toCompute: Uint8Array): Promise<Uint8Array> {
    const crypto = await Sha256Algorithm.#getCrypto();
    const digestBuffer = await crypto.subtle.digest("SHA-256", toCompute);
    return new Uint8Array(digestBuffer);
  }
}
Object.freeze(Sha256Algorithm);

export { Sha256Algorithm };
