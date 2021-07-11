import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.buffer", () => {
  test("buffer", () => {
    const a0 = new ArrayBuffer(0);
    const bs0 = new ByteSequence(a0);
    const bs0b = new ByteSequence(a0);
    const a1 = new ArrayBuffer(100);
    const b1 = new Uint8Array(a1);
    const bs1 = ByteSequence.from(b1);
    const bs1b = ByteSequence.from(b1);

    expect(bs0.buffer).toBe(a0);
    expect(bs0.buffer).toBe(bs0b.buffer);
    expect(bs1.buffer).not.toBe(a1);
    expect(bs1.buffer).not.toBe(bs1b.buffer);

  });

  test("返却値への操作は自身に影響する", () => {
    const bs1 = new ByteSequence(new ArrayBuffer(100));

    const x = new Uint8Array(bs1.buffer);
    expect(x[0]).toBe(0);

    x[0] = 255;
    expect(x[0]).toBe(255);
    expect(new Uint8Array(bs1.buffer)[0]).toBe(255);

  });

});
