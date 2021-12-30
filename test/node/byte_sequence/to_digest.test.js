import assert from "node:assert";
import { createHash } from "node:crypto";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toDigest", () => {
  const bs0 = ByteSequence.allocate(0);

  const MD5 = {
    async compute(input) {
      const md5 = createHash("md5");
      md5.update(input);
      return md5.digest();
    }
  };

  it("toDigest(string)", async () => {
    const s1 = await bs0.toDigest(MD5);
    assert.strictEqual(s1.format(), "D41D8CD98F00B204E9800998ECF8427E");

  });

});
