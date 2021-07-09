import { Byte } from "../../src/index";
import { Sha256Algorithm } from "../../src/digest_algorithm/sha_256";

describe("DigestAlgorithm.for", (): void => {
  test("for(string)", (): void => {
    expect(Byte.DigestAlgorithm.for("sha-256") instanceof Sha256Algorithm).toBe(true);

    expect(() => {
      Byte.DigestAlgorithm.for("md5");
    }).toThrow("unknown algorithmName");
  });
});
