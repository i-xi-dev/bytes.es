import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.of", () => {
  test("of(Array<number>)", () => {
    const bs0 = ByteSequence.of(1,2,3,4,5);
    expect(bs0.buffer.byteLength).toBe(5);

    const a1 = [1,2,3,4,5,6];
    const bs1 = ByteSequence.of(...a1);
    expect(bs1.buffer.byteLength).toBe(6);

    expect(bs1.view()[2]).toBe(3);

  });

});
