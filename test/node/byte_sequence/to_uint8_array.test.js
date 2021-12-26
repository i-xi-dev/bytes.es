import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toUint8Array", () => {
  it("toUint8Array()", () => {
    const bs0 = ByteSequence.allocate(0);
    const bs1 = ByteSequence.allocate(1000);

    assert.strictEqual(bs0.toUint8Array().length, 0);
    assert.strictEqual(bs1.toUint8Array().length, 1000);

    const a2s = [1,2,3,4,5];
    const a2 = Uint8Array.from(a2s);
    const bs2 = ByteSequence.from(a2);
    assert.strictEqual(JSON.stringify(a2s), JSON.stringify([...bs2.toUint8Array()]));

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const a0 = Uint8Array.of(0,255);
    const bs0 = ByteSequence.from(a0);
    assert.notStrictEqual(bs0.toUint8Array(), a0);

  });

  it("返却値への操作は、自身に影響しない", () => {
    const bs0 = ByteSequence.of(0,255);
    const a0 = bs0.toUint8Array();

    assert.strictEqual(a0[1], 255);
    a0[1] = 1;
    assert.strictEqual(bs0.view()[1], 255);

  });

});
