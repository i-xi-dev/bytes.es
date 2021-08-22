import assert from "node:assert";
import { Format, DigestAlgorithm } from "../../../../dist/byte/index.js";

describe("Sha512.compute", () => {
  const sha512 = DigestAlgorithm.for("SHA-512");

  it("compute(Uint8Array)", async () => {
    const digest = await sha512.compute(Uint8Array.of());
    assert.strictEqual(Format.format(digest, 16), "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e");

  });

});
