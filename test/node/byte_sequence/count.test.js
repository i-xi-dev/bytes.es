import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.count", () => {
  it("count", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.count, 0);
    assert.strictEqual(bs1.count, 1000);

  });

});
