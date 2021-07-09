import { Sha256Algorithm } from "../../../src/digest_algorithm/sha_256";

describe("Sha256Algorithm", (): void => {
  test("Sha256Algorithm()", (): void => {
    const i1 = new Sha256Algorithm();
    expect(i1 instanceof Sha256Algorithm).toBe(true);
  });

  test("Sha256Algorithm(DigestAlgorithmOptions)", (): void => {
    const i1 = new Sha256Algorithm({});
    expect(i1 instanceof Sha256Algorithm).toBe(true);
  });

});
