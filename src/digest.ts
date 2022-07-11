import { _crypto } from "./deps.ts";

namespace _DigestImpl {
  /**
   * SHA-256 digest algorithm
   */
  export const Sha256 = Object.freeze({
    /**
     * Computes the SHA-256 digest for the byte sequence.
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await _crypto.subtle.digest("SHA-256", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha256);

  /**
   * SHA-384 digest algorithm
   */
  export const Sha384 = Object.freeze({
    /**
     * Computes the SHA-384 digest for the byte sequence.
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await _crypto.subtle.digest("SHA-384", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha384);

  /**
   * SHA-512 digest algorithm
   */
  export const Sha512 = Object.freeze({
    /**
     * Computes the SHA-512 digest for the byte sequence.
     *
     * @see {@link Algorithm.compute}
     */
    async compute(input: Uint8Array): Promise<Uint8Array> {
      const bytes = await _crypto.subtle.digest("SHA-512", input);
      return new Uint8Array(bytes);
    },
  });
  Object.freeze(Sha512);
}
Object.freeze(_DigestImpl);

export { _DigestImpl };
