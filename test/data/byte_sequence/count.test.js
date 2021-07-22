import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.prototype.count", () => {
  test("count", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    expect(bs0.count).toBe(0);
    expect(bs1.count).toBe(1000);

  });

});
