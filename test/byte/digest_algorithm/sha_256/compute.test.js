import assert from "node:assert";
import { Format, DigestAlgorithm } from "../../../../dist/byte/index.js";

describe("Sha256.compute", () => {
  const sha256 = DigestAlgorithm.for("SHA-256");

  it("compute(Uint8Array)", async () => {
    const digest = await sha256.compute(Uint8Array.of());
    assert.strictEqual(Format.format(digest, 16), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

  });

});
