//

import { Exception } from "../../_";
import { DigestAlgorithmImplementation } from "./_";
import { Sha256 } from "./sha_256";
import { Sha384 } from "./sha_384";
import { Sha512 } from "./sha_512";

const registry = new Map<string, DigestAlgorithmImplementation>();

registry.set("SHA-256".toLowerCase(), Sha256);
registry.set("SHA-384".toLowerCase(), Sha384);
registry.set("SHA-512".toLowerCase(), Sha512);

function getImplementation(name: string): DigestAlgorithmImplementation {
  const normalizedName = name.toLowerCase();
  if (registry.has(normalizedName)) {
    return registry.get(normalizedName) as DigestAlgorithmImplementation;
  }
  throw new Exception("NotFoundError", "name:" + name);
}

export { DigestAlgorithmImplementation };

export const DigestAlgorithm = {
  /**
   * Returns the digest algorithm associated with the specified name.
   * @param name The algorithm name.
   * @returns The digest algorithm associated with the specified name.
   */
  for: getImplementation,
};
