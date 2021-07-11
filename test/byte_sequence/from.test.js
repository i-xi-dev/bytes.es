import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.from", () => {
  test("from(Array<number>)", () => {
    const a0 = [9,8,7,6,5,4,3,2,0,255];
    const bs0 = ByteSequence.from(a0);

    expect(bs0.count).toBe(10);
    const bs0a = bs0.view();
    expect(bs0a[8]).toBe(0);
    expect(bs0a[9]).toBe(255);

    const a1 = [];
    const bs1 = ByteSequence.from(a1);

    expect(bs1.count).toBe(0);

  });

  test("from(Uint8Array)", () => {
    const a0 = Uint8Array.of(9,8,7,6,5,4,3,2,1,0);
    const bs0 = ByteSequence.from(a0);

    expect(bs0.count).toBe(10);
    const bs0a = bs0.view();
    expect(bs0a[0]).toBe(9);
    expect(bs0a[9]).toBe(0);

    const a1 = new Uint8Array(0);
    const bs1 = ByteSequence.from(a1);

    expect(bs1.count).toBe(0);

  });

  test("from(ByteSequence)", () => {
    const bs1 = ByteSequence.generateRandom(256);
    const bs1c = ByteSequence.from(bs1);

    expect(bs1).not.toBe(bs1c);
    expect(JSON.stringify(bs1.toArray())).toBe(JSON.stringify(bs1c.toArray()));

  });

  test("fromに渡したUint8Arrayへの操作は、自身に影響しない", () => {
    const a0 = Uint8Array.of(255,254,253,252,251);
    const bs0 = ByteSequence.from(a0);

    const bs0v = bs0.view();
    expect(bs0v[0]).toBe(255);
    expect(bs0v[1]).toBe(254);
    expect(bs0v[2]).toBe(253);
    expect(bs0v[3]).toBe(252);
    expect(bs0v[4]).toBe(251);

    a0[0] = 1;

    const bs0v2 = bs0.view();
    expect(bs0v2[0]).toBe(255);

  });

});
