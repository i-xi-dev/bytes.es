import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.count", () => {
  it("count", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    assert.strictEqual(bs0.count, 0);
    assert.strictEqual(bs1.count, 1000);

  });

});
