//

/**
 * Digest algorithm
 */
interface DigestAlgorithmImplementation {
  /**
   * Computes the digest for the byte sequence.
   * @param input The input to compute the digest.
   * @returns The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise Promise} that
   *     fulfills with a computed digest.
   */
  compute: (input: Uint8Array) => Promise<Uint8Array>;
}

export { DigestAlgorithmImplementation };
