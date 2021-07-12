import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.clone", () => {
  test("clone()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.create(1000);

    expect(bs0.clone().count).toBe(0);
    expect(bs0.clone().buffer).not.toBe(bs0.buffer);
    expect(bs0.clone().toString()).toBe(bs0.toString());

    expect(bs1.clone().count).toBe(1000);
    expect(bs1.clone().buffer).not.toBe(bs1.buffer);
    expect(bs1.clone().toString()).toBe(bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2)).toBe(JSON.stringify(bs2.clone().toArray()));

  });

});
