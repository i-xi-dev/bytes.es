import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.segmentedSequences", () => {
  test("segmentedSequences(number)", () => {
    const bs1 = ByteSequence.generateRandom(1000);

    const i1 = bs1.segmentedSequences(100);
    let i = 0;
    for (const i1i of i1) {
      expect(i1i.count).toBe(100);
      expect(JSON.stringify(i1i.toArray())).toBe(JSON.stringify([...bs1.view(i, 100)]));
      i = i + 100;
    }
    expect(i).toBe(1000);

    const i1b = bs1.segmentedSequences(150);
    let ib = 0;
    for (const i1i of i1b) {
      if (ib < 900) {
        expect(i1i.count).toBe(150);
        expect(JSON.stringify(i1i.toArray())).toBe(JSON.stringify([...bs1.view(ib, 150)]));
      }
      else {
        expect(i1i.count).toBe(100);
        expect(JSON.stringify(i1i.toArray())).toBe(JSON.stringify([...bs1.view(ib, 100)]));
      }
      ib = ib + 150;
    }
    expect(ib).toBe(1050);

  });

});
