import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.generateRandom", () => {
  it("generateRandom(number)", () => {
    const bs0 = ByteSequence.generateRandom(0);
    const bs1 = ByteSequence.generateRandom(65536);

    assert.strictEqual(bs0.buffer.byteLength, 0);
    assert.strictEqual(bs1.buffer.byteLength, 65536);

    assert.throws(() => {
      ByteSequence.generateRandom(-1);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(1.5);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(Number.NaN);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.generateRandom(65537);
    }, {
      message: "byteCount"
    });

  });

});
