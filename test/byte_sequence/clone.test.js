import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.clone", () => {
  it("clone()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    assert.strictEqual(bs0.clone().count, 0);
    assert.notStrictEqual(bs0.clone().buffer, bs0.buffer);
    assert.strictEqual(bs0.clone().toString(), bs0.toString());

    assert.strictEqual(bs1.clone().count, 1000);
    assert.notStrictEqual(bs1.clone().buffer, bs1.buffer);
    assert.strictEqual(bs1.clone().toString(), bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2), JSON.stringify(bs2.clone().toArray()));

  });

});
