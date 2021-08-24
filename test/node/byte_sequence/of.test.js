import assert from "node:assert";
import { ByteSequence } from "../../../node.mjs";

describe("ByteSequence.of", () => {
  it("of(Array<number>)", () => {
    const bs0 = ByteSequence.of(1,2,3,4,5);
    assert.strictEqual(bs0.buffer.byteLength, 5);

    const a1 = [1,2,3,4,5,6];
    const bs1 = ByteSequence.of(...a1);
    assert.strictEqual(bs1.buffer.byteLength, 6);

    assert.strictEqual(bs1.view()[2], 3);

  });

});
