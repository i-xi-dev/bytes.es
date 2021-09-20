import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence", () => {
  it("ByteSequence(ArrayBuffer)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = new ByteSequence(bytes0.buffer);
    const bs1 = new ByteSequence(bytes1.buffer);  

    assert.strictEqual(bs0 instanceof ByteSequence, true);
    assert.strictEqual(bs0.count, 0);
    assert.strictEqual(bs1.count, 5);
  });

  it("コンストラクターに渡したArrayBufferへの操作は、自身に影響する", () => {
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs1 = new ByteSequence(bytes1.buffer);
    const a1 = bytes1.buffer;
    const nb1 = new Uint8Array(a1);
    nb1.set([1,2,3,4]);

    const bs1v = bs1.view();
    assert.strictEqual(bs1v[0], 1);
    assert.strictEqual(bs1v[1], 2);
    assert.strictEqual(bs1v[2], 3);
    assert.strictEqual(bs1v[3], 4);
    assert.strictEqual(bs1v[4], 100);
  });

});
