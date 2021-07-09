
import { Exception } from "../_";
import { DigestAlgorithmOptions, DigestAlgorithmImpl } from "./index";

/**
 * SHA-256ハッシュアルゴリズム
 */
class Sha256Algorithm implements DigestAlgorithmImpl {
  /**
   * @param options ハッシュアルゴリズムオプション
   */
  constructor(options: DigestAlgorithmOptions = {}) {
    void options;
    Object.freeze(this);
  }

  /**
   * Cryptoオブジェクトを返却
   * @returns Cryptoオブジェクト
   */
  static async #getCrypto(): Promise<Crypto> {
    if (globalThis.crypto?.subtle) { //XXX globalThis.cryptoがCrypto型かどうかでは判定できない（Node, Jest環境）Cryptoが値扱いの為
      // ブラウザー, Deno
      return globalThis.crypto;
    }
    else if (globalThis.process) {
      // Node.js 条件不十分？
      return ((await import("crypto")).webcrypto as unknown) as Crypto;
    }
    throw new Exception("NotSupportedError", "Crypto unsupported");
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
