import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence", () => {
  test("ByteSequence(ArrayBuffer)", () => {
    const bytes0 = new Uint8Array(0);
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs0 = new ByteSequence(bytes0.buffer);
    const bs1 = new ByteSequence(bytes1.buffer);  

    expect(bs0 instanceof ByteSequence).toBe(true);
    expect(bs0.count).toBe(0);
    expect(bs1.count).toBe(5);
  });

  test("コンストラクターに渡したArrayBufferへの操作は、自身に影響する", () => {
    const bytes1 = Uint8Array.of(255, 254, 1, 0, 100);

    const bs1 = new ByteSequence(bytes1.buffer);
    const a1 = bytes1.buffer;
    const nb1 = new Uint8Array(a1);
    nb1.set([1,2,3,4]);

    const bs1v = bs1.view();
    expect(bs1v[0]).toBe(1);
    expect(bs1v[1]).toBe(2);
    expect(bs1v[2]).toBe(3);
    expect(bs1v[3]).toBe(4);
    expect(bs1v[4]).toBe(100);
  });

});
