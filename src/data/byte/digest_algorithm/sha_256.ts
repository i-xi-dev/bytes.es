
/**
 * @fileoverview SHA-256ハッシュアルゴリズム
 */

import { getCrypto } from "../../../_";

/**
 * バイト列のSHA-256ハッシュを生成し、ハッシュのバイト列を返却
 * @param toCompute バイト列
 * @returns SHA-256ハッシュのバイト列で解決されるPromise
 */
async function compute(toCompute: Uint8Array): Promise<Uint8Array> {
  const digestBuffer = await getCrypto().subtle.digest("SHA-256", toCompute);
  return new Uint8Array(digestBuffer);
}

export const Sha256 = {
  compute,
};
