import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.startsWith", () => {
  const bs0 = ByteSequence.create(0);
  const bs0b = ByteSequence.create(0);

  const bs1 =  ByteSequence.from(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.of(255, 0, 127, 1);

  test("startsWith(ByteSequence)", () => {
    expect(bs0.startsWith(bs0)).toBe(true);
    expect(bs0.startsWith(bs0b)).toBe(true);

    expect(bs1.startsWith(bs1)).toBe(true);
    expect(bs1.startsWith(bs1b)).toBe(true);
    expect(bs1.startsWith(bs0)).toBe(true);
    expect(bs0.startsWith(bs1)).toBe(false);

  });

  test("startsWith(Uint8Array)", () => {
    expect(bs0.startsWith(new Uint8Array(0))).toBe(true);
    expect(bs1.startsWith(bs1.toUint8Array())).toBe(true);
    expect(bs1.startsWith(Uint8Array.of(255, 0, 127, 1))).toBe(true);

    expect(bs1.startsWith(Uint8Array.of(255, 0, 123, 1))).toBe(false);
    expect(bs1.startsWith(Uint8Array.of(255, 0, 127, 1, 5))).toBe(false);
    expect(bs1.startsWith(Uint8Array.of(255, 0, 127))).toBe(true);

    expect(bs1.startsWith([255, 0, 127, 2])).toBe(false);
    expect(bs1.startsWith([255, 0, 127, 1, 2])).toBe(false);
    expect(bs1.startsWith([255, 0, 127])).toBe(true);
    expect(bs1.startsWith([255, 0])).toBe(true);
    expect(bs1.startsWith([255])).toBe(true);
    expect(bs1.startsWith([])).toBe(true);

  });

  test("startsWith(Array<number>)", () => {
    expect(bs0.startsWith([])).toBe(true);
    expect(bs1.startsWith(bs1.toArray())).toBe(true);
    expect(bs1.startsWith([255, 0, 127, 1])).toBe(true);

    expect(bs1.startsWith([255, 0, 127, 2])).toBe(false);
    expect(bs1.startsWith([255, 0, 127, 1, 2])).toBe(false);
    expect(bs1.startsWith([255, 0, 127])).toBe(true);

  });

});
