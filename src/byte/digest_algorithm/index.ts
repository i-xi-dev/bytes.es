//

import { Exception } from "../../_.js";
import { DigestAlgorithmImplementation } from "./_.js";
import { Sha256 } from "./sha_256.js";
import { Sha384 } from "./sha_384.js";
import { Sha512 } from "./sha_512.js";

const registry = new Map<string, DigestAlgorithmImplementation>();

function register(name: string, implementation: DigestAlgorithmImplementation): void {
  registry.set(name.toLowerCase(), implementation);
}

register("SHA-256".toLowerCase(), Sha256);
register("SHA-384".toLowerCase(), Sha384);
register("SHA-512".toLowerCase(), Sha512);

function getImplementation(name: string): DigestAlgorithmImplementation {
  const normalizedName = name.toLowerCase();
  if (registry.has(normalizedName)) {
    return registry.get(normalizedName) as DigestAlgorithmImplementation;
  }
  throw new Exception("NotFoundError", "name:" + name);
}

export { DigestAlgorithmImplementation };

export const DigestAlgorithm = Object.freeze({
  register,
  /**
   * Returns the digest algorithm associated with the specified name.
   * @param name The algorithm name.
   * @returns The digest algorithm associated with the specified name.
   */
  for: getImplementation,
});
