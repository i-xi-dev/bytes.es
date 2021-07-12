import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.equals", () => {
  const bs0 = ByteSequence.create(0);
  const bs0b = ByteSequence.create(0);

  const bs1 =  ByteSequence.from(Uint8Array.of(255, 0, 127, 1));
  const bs1b =  ByteSequence.of(255, 0, 127, 1);

  test("equals(ByteSequence)", () => {
    expect(bs0.equals(bs0)).toBe(true);
    expect(bs0.equals(bs0b)).toBe(true);

    expect(bs1.equals(bs1)).toBe(true);
    expect(bs1.equals(bs1b)).toBe(true);
    expect(bs1.equals(bs0)).toBe(false);
    expect(bs0.equals(bs1)).toBe(false);

  });

  test("equals(Uint8Array)", () => {
    expect(bs0.equals(new Uint8Array(0))).toBe(true);
    expect(bs1.equals(bs1.toUint8Array())).toBe(true);
    expect(bs1.equals(Uint8Array.of(255, 0, 127, 1))).toBe(true);

    expect(bs1.equals(Uint8Array.of(255, 0, 123, 1))).toBe(false);
    expect(bs1.equals(Uint8Array.of(255, 0, 127, 1, 5))).toBe(false);
    expect(bs1.equals(Uint8Array.of(255, 0, 127))).toBe(false);

  });

  test("equals(Array<number>)", () => {
    expect(bs0.equals([])).toBe(true);
    expect(bs1.equals(bs1.toArray())).toBe(true);
    expect(bs1.equals([255, 0, 127, 1])).toBe(true);

    expect(bs1.equals([255, 0, 127, 2])).toBe(false);
    expect(bs1.equals([255, 0, 127, 1, 2])).toBe(false);
    expect(bs1.equals([255, 0, 127])).toBe(false);

  });

});
