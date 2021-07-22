import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.create", () => {
  test("create(number)", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1024 * 1024 * 1);

    expect(bs0.buffer.byteLength).toBe(0);
    expect(bs1.buffer.byteLength).toBe(1024 * 1024 * 1);

    expect(() => {
      ByteSequence.create(-1);
    }).toThrow("byteCount");

    expect(() => {
      ByteSequence.create(1.5);
    }).toThrow("byteCount");

    expect(() => {
      ByteSequence.create(Number.NaN);
    }).toThrow("byteCount");

  });

});
