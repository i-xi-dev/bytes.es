import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toArray", () => {
  it("toArray()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.toArray().length, 0);
    assert.strictEqual(bs1.toArray().length, 1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.toArray()));

  });

});
