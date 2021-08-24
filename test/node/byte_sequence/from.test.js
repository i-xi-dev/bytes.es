import assert from "node:assert";
import { ByteSequence } from "../../../node.mjs";

describe("ByteSequence.from", () => {
  it("from(Array<number>)", () => {
    const a0 = [9,8,7,6,5,4,3,2,0,255];
    const bs0 = ByteSequence.from(a0);

    assert.strictEqual(bs0.count, 10);
    const bs0a = bs0.view();
    assert.strictEqual(bs0a[8], 0);
    assert.strictEqual(bs0a[9], 255);

    const a1 = [];
    const bs1 = ByteSequence.from(a1);

    assert.strictEqual(bs1.count, 0);

  });

  it("from(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.from(a0);

    assert.strictEqual(bs0.count, 10);
    const bs0a = bs0.view();
    assert.strictEqual(bs0a[0], 9);
    assert.strictEqual(bs0a[9], 0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.from(a1);

    assert.strictEqual(bs1.count, 0);

  });

  it("from(ByteSequence)", () => {
    const bs1 = ByteSequence.generateRandom(256);
    const bs1c = ByteSequence.from(bs1);

    assert.notStrictEqual(bs1, bs1c);
    assert.strictEqual(JSON.stringify(bs1.toArray()), JSON.stringify(bs1c.toArray()));

  });

  it("fromに渡したUint8Arrayへの操作は、自身に影響しない", () => {
    const a0 = Uint8Array.of(255,254,253,252,251);
    const bs0 = ByteSequence.from(a0);

    const bs0v = bs0.view();
    assert.strictEqual(bs0v[0], 255);
    assert.strictEqual(bs0v[1], 254);
    assert.strictEqual(bs0v[2], 253);
    assert.strictEqual(bs0v[3], 252);
    assert.strictEqual(bs0v[4], 251);

    a0[0] = 1;

    const bs0v2 = bs0.view();
    assert.strictEqual(bs0v2[0], 255);

  });

});
