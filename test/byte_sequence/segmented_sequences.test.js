import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.segmentedSequences", () => {
  it("segmentedSequences(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    const i1 = bs1.segmentedSequences(100);
    let i = 0;
    for (const i1i of i1) {
      assert.strictEqual(i1i.count, 100);
      assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.view(i, 100)]));
      i = i + 100;
    }
    assert.strictEqual(i, 1000);

    const i1b = bs1.segmentedSequences(150);
    let ib = 0;
    for (const i1i of i1b) {
      if (ib < 900) {
        assert.strictEqual(i1i.count, 150);
        assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.view(ib, 150)]));
      }
      else {
        assert.strictEqual(i1i.count, 100);
        assert.strictEqual(JSON.stringify(i1i.toArray()), JSON.stringify([...bs1.view(ib, 100)]));
      }
      ib = ib + 150;
    }
    assert.strictEqual(ib, 1050);

  });

});
