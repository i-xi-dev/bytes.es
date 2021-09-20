import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toBinaryString", () => {
  it("toBinaryString()", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    assert.strictEqual(bsbs.toBinaryString(), binStr);

  });

});
