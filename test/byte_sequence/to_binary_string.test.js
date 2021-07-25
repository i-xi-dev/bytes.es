import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toBinaryString", () => {
  test("toBinaryString()", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    expect(bsbs.toBinaryString()).toBe(binStr);

  });

});
