//

import {
  type DigestAlgorithm,
} from "@i-xi-dev/fundamental";

/**
 * SHA-256 digest algorithm
 */
const Sha256: DigestAlgorithm = Object.freeze({
  /**
   * Computes the SHA-256 digest for the byte sequence.
   * 
   * @see {@link DigestAlgorithm.compute}
   */
  async compute(input: Uint8Array): Promise<Uint8Array> {
    const digestBuffer = await globalThis.crypto.subtle.digest("SHA-256", input);
    return new Uint8Array(digestBuffer);
  },
});

/**
 * SHA-384 digest algorithm
 */
const Sha384: DigestAlgorithm = Object.freeze({
  /**
   * Computes the SHA-384 digest for the byte sequence.
   * 
   * @see {@link DigestAlgorithm.compute}
   */
  async compute(input: Uint8Array): Promise<Uint8Array> {
    const digestBuffer = await globalThis.crypto.subtle.digest("SHA-384", input);
    return new Uint8Array(digestBuffer);
  },
});

/**
 * SHA-512 digest algorithm
 */
const Sha512: DigestAlgorithm = Object.freeze({
  /**
   * Computes the SHA-512 digest for the byte sequence.
   * 
   * @see {@link DigestAlgorithm.compute}
   */
  async compute(input: Uint8Array): Promise<Uint8Array> {
    const digestBuffer = await globalThis.crypto.subtle.digest("SHA-512", input);
    return new Uint8Array(digestBuffer);
  },
});

export {
  type DigestAlgorithm,
  Sha256,
  Sha384,
  Sha512,
};
