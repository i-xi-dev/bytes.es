import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.prototype.toArray", () => {
  test("toArray()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    expect(bs0.toArray().length).toBe(0);
    expect(bs1.toArray().length).toBe(1000);

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2)).toBe(JSON.stringify(bs2.toArray()));

  });

});
