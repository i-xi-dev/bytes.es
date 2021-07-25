import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.generateRandom", () => {
  test("generateRandom(number)", () => {
    const bs0 = ByteSequence.generateRandom(0);
    const bs1 = ByteSequence.generateRandom(65536);

    expect(bs0.buffer.byteLength).toBe(0);
    expect(bs1.buffer.byteLength).toBe(65536);

    expect(() => {
      ByteSequence.generateRandom(-1);
    }).toThrow("byteCount");

    expect(() => {
      ByteSequence.generateRandom(1.5);
    }).toThrow("byteCount");

    expect(() => {
      ByteSequence.generateRandom(Number.NaN);
    }).toThrow("byteCount");

    expect(() => {
      ByteSequence.generateRandom(65537);
    }).toThrow("byteCount");

  });

});
