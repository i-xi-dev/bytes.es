import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.create", () => {
  it("create(number)", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1024 * 1024 * 1);

    assert.strictEqual(bs0.buffer.byteLength, 0);
    assert.strictEqual(bs1.buffer.byteLength, 1024 * 1024 * 1);

    assert.throws(() => {
      ByteSequence.create(-1);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.create(1.5);
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      ByteSequence.create(Number.NaN);
    }, {
      message: "byteCount"
    });

  });

});
