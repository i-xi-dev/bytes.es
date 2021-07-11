import { Byte } from "../../../dist/byte/index.js";
import { Sha256Algorithm } from "../../../dist/byte/digest_algorithm/sha_256.js";

describe("DigestAlgorithm.for", () => {
  test("for(string)", () => {
    expect(Byte.DigestAlgorithm.for("sha-256") instanceof Sha256Algorithm).toBe(true);

    expect(() => {
      Byte.DigestAlgorithm.for("md5");
    }).toThrow("unknown algorithmName");
  });
});
