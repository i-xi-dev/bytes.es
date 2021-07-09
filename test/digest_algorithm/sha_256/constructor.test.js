import { Sha256Algorithm } from "../../../dist/digest_algorithm/sha_256.js";

describe("Sha256Algorithm", () => {
  test("Sha256Algorithm()", () => {
    const i1 = new Sha256Algorithm();
    expect(i1 instanceof Sha256Algorithm).toBe(true);
  });

  test("Sha256Algorithm(DigestAlgorithmOptions)", () => {
    const i1 = new Sha256Algorithm({});
    expect(i1 instanceof Sha256Algorithm).toBe(true);
  });

});
