//

import { getCrypto } from "../../_.js";
import { DigestAlgorithmImplementation } from "./_.js";

/**
 * Computes the SHA-512 digest for the byte sequence.
 * 
 * @see {@link DigestAlgorithmImplementation.compute}
 */
async function compute(input: Uint8Array): Promise<Uint8Array> {
  const digestBuffer = await getCrypto().subtle.digest("SHA-512", input);
  return new Uint8Array(digestBuffer);
}

/**
 * SHA-512 digest algorithm
 */
export const Sha512: DigestAlgorithmImplementation = {
  compute,
};
