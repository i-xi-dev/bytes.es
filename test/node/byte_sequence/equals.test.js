import assert from "node:assert";
import { ByteSequence } from "../../../node.mjs";

describe("ByteSequence.prototype.equals", () => {
  const bs0 = ByteSequence.create(0);
  const bs0b = ByteSequence.create(0);

  const bs1 =  ByteSequence.from(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.of(255, 0, 127, 1);

  it("equals(ByteSequence)", () => {
    assert.strictEqual(bs0.equals(bs0), true);
    assert.strictEqual(bs0.equals(bs0b), true);

    assert.strictEqual(bs1.equals(bs1), true);
    assert.strictEqual(bs1.equals(bs1b), true);
    assert.strictEqual(bs1.equals(bs0), false);
    assert.strictEqual(bs0.equals(bs1), false);

  });

  it("equals(Uint8Array)", () => {
    assert.strictEqual(bs0.equals(new Uint8Array(0)), true);
    assert.strictEqual(bs1.equals(bs1.toUint8Array()), true);
    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 127, 1)), true);

    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 123, 1)), false);
    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 127, 1, 5)), false);
    assert.strictEqual(bs1.equals(Uint8Array.of(255, 0, 127)), false);

  });

  it("equals(Array<number>)", () => {
    assert.strictEqual(bs0.equals([]), true);
    assert.strictEqual(bs1.equals(bs1.toArray()), true);
    assert.strictEqual(bs1.equals([255, 0, 127, 1]), true);

    assert.strictEqual(bs1.equals([255, 0, 127, 2]), false);
    assert.strictEqual(bs1.equals([255, 0, 127, 1, 2]), false);
    assert.strictEqual(bs1.equals([255, 0, 127]), false);

  });

});
