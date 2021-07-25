import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toUint8Array", () => {
  test("toUint8Array()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    expect(bs0.toUint8Array().length).toBe(0);
    expect(bs1.toUint8Array().length).toBe(1000);

    const a2s = [1,2,3,4,5];
    const a2 = Uint8Array.from(a2s);
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2s)).toBe(JSON.stringify([...bs2.toUint8Array()]));

  });

  test("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const a0 = Uint8Array.of(0,255);
    const bs0 = ByteSequence.from(a0);
    expect(bs0.toUint8Array()).not.toBe(a0);

  });

  test("返却値への操作は、自身に影響しない", () => {
    const bs0 = ByteSequence.of(0,255);
    const a0 = bs0.toUint8Array();

    expect(a0[1]).toBe(255);
    a0[1] = 1;
    expect(bs0.view()[1]).toBe(255);

  });

});
