import assert from "node:assert";
import crypto from "node:crypto";
import { DigestAlgorithm } from "../../../../../node/index.mjs";

describe("DigestAlgorithm.register", () => {

  it("register(string, Object)", async () => {
    DigestAlgorithm.register("md5", {
      async compute(input) {
        const md5 = crypto.createHash("md5");
        md5.update(input);
        return md5.digest();
      }
    });
    const md5 = DigestAlgorithm.for("md5");

    const md5Digest = await md5.compute(Uint8Array.of());
    assert.strictEqual([...md5Digest].map(b=>b.toString(16).padStart(2,"0")).join(""), "d41d8cd98f00b204e9800998ecf8427e");

  });

});
