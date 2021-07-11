import { ByteFormat, DigestAlgorithm } from "../../../../dist/byte/index.js";

describe("Sha256Algorithm.prototype.compute", () => {
  test("compute(Uint8Array)", async () => {
    const bf = ByteFormat.for("hexadecimal");
    const d0 = DigestAlgorithm.for("sha-256");

    expect(bf.format(await d0.compute(Uint8Array.of()))).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

  });

});
