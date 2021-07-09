import { Byte } from "../../../src/index";

describe("Sha256Algorithm.prototype.compute", (): void => {
  test("compute(Uint8Array)", async (): Promise<void> => {
    const bf = new Byte.Format();
    const d0 = Byte.DigestAlgorithm.for("sha-256");

    expect(bf.format(await d0.compute(Uint8Array.of()))).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

  });

});
