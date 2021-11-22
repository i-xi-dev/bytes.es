//

import { DigestAlgorithmImplementation } from "./_";

/**
 * Computes the SHA-256 digest for the byte sequence.
 * 
 * @see {@link DigestAlgorithmImplementation.compute}
 */
async function compute(input: Uint8Array): Promise<Uint8Array> {
  const digestBuffer = await globalThis.crypto.subtle.digest("SHA-256", input);
  return new Uint8Array(digestBuffer);
}

/**
 * SHA-256 digest algorithm
 */
export const Sha256: DigestAlgorithmImplementation = Object.freeze({
  compute,
});
