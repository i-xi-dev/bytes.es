import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.allocate", () => {
  it("allocate(number)", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1024 * 1024 * 1);

    assert.strictEqual(bs0.buffer.byteLength, 0);
    assert.strictEqual(bs1.buffer.byteLength, 1024 * 1024 * 1);

    assert.throws(() => {
      ByteSequence.allocate(-1);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.allocate(1.5);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.allocate(Number.NaN);
    }, {
      message: "byteCount"
    });

  });

});
