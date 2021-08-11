//

import { getCrypto } from "../../_/compat.js";
import { DigestAlgorithmImplementation } from "./_.js";

/**
 * Computes the SHA-384 digest for the byte sequence.
 * 
 * @see {@link DigestAlgorithmImplementation.compute}
 */
async function compute(input: Uint8Array): Promise<Uint8Array> {
  const digestBuffer = await getCrypto().subtle.digest("SHA-384", input);
  return new Uint8Array(digestBuffer);
}

/**
 * SHA-384 digest algorithm
 */
export const Sha384: DigestAlgorithmImplementation = Object.freeze({
  compute,
});
