import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toJSON", () => {
  it("toJSON()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    assert.strictEqual(bs0.toJSON().length, 0);
    assert.strictEqual(bs1.toJSON().length, 1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.toJSON()));

  });

});
