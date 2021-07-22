import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.prototype.subsequence", () => {
  const bs0 = ByteSequence.create(0);

  test("subsequence()", () => {
    expect(bs0.subsequence().count).toBe(0);
    const bs1 = ByteSequence.generateRandom(1000);
    expect(bs1.subsequence().count).toBe(1000);
    expect(bs1.subsequence().toString()).toBe(bs1.toString());

  });

  test("subsequence(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    expect(bs0.subsequence(0).count).toBe(0);
    expect(bs0.subsequence(0).buffer).not.toBe(bs0.buffer);
    expect(bs0.subsequence(0).toString()).toBe(bs0.toString());

    expect(bs1.subsequence(0).count).toBe(1000);
    expect(bs1.subsequence(999).count).toBe(1);
    expect(bs1.subsequence(1000).count).toBe(0);
    expect(bs1.subsequence(0).buffer).not.toBe(bs1.buffer);
    expect(bs1.subsequence(0).toString()).toBe(bs1.toString());

    const a2 = [1,2,3,4,5];
    const bs2 = ByteSequence.from(a2);
    expect(JSON.stringify(a2)).toBe(JSON.stringify(bs2.subsequence(0).toArray()));

    expect(() => {
      bs0.subsequence(1);
    }).toThrow("start");

    expect(() => {
      bs1.subsequence(1001);
    }).toThrow("start");

  });

  test("subsequence(number, number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    expect(bs0.subsequence(0, 0).count).toBe(0);
    expect(bs0.subsequence(0, 1).count).toBe(0);
    expect(bs0.subsequence(0, 0).buffer).not.toBe(bs0.buffer);
    expect(bs0.subsequence(0, 0).toString()).toBe(bs0.toString());

    expect(bs1.subsequence(0, 1000).count).toBe(1000);
    expect(bs1.subsequence(999, 1000).count).toBe(1);
    expect(bs1.subsequence(1000, 1000).count).toBe(0);
    expect(bs1.subsequence(1000, 1001).count).toBe(0);
    expect(bs1.subsequence(0, 1000).buffer).not.toBe(bs1.buffer);
    expect(bs1.subsequence(0, 1000).toString()).toBe(bs1.toString());
    expect(bs1.subsequence(0, 1001).toString()).toBe(bs1.toString());

    expect(bs1.subsequence(100, 200).toString()).toBe(ByteSequence.from(bs1.view(100, 100)).toString());

  });

});
