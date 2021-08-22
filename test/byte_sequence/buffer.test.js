import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.buffer", () => {
  it("buffer", () => {
    const a0 = new ArrayBuffer(0);
    const bs0 = new ByteSequence(a0);
    const bs0b = new ByteSequence(a0);
    const a1 = new ArrayBuffer(100);
    const b1 = new Uint8Array(a1);
    const bs1 = ByteSequence.from(b1);
    const bs1b = ByteSequence.from(b1);

    assert.strictEqual(bs0.buffer, a0);
    assert.strictEqual(bs0.buffer, bs0b.buffer);
    assert.notStrictEqual(bs1.buffer, a1);
    assert.notStrictEqual(bs1.buffer, bs1b.buffer);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = new ByteSequence(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.buffer);
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 255);

  });

});
