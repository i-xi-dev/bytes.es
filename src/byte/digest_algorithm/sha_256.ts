
import { getCrypto } from "../../_";
import { DigestAlgorithmImpl, DigestAlgorithmOptions } from "./index";

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
   * バイト列のSHA-256ハッシュを生成し、ハッシュのバイト列を返却
   * @param toCompute バイト列
   */
  async compute(toCompute: Uint8Array): Promise<Uint8Array> {
    const digestBuffer = await getCrypto().subtle.digest("SHA-256", toCompute);
    return new Uint8Array(digestBuffer);
  }
}
Object.freeze(Sha256Algorithm);

export { Sha256Algorithm };
