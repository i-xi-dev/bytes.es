import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromBinaryString", () => {
  test("fromBinaryString(string)", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    const bsa = bsbs.toArray();

    expect(bsa[0]).toBe(65);
    expect(bsa[1]).toBe(66);
    expect(bsa[2]).toBe(67);
    expect(bsa[3]).toBe(68);

    expect(ByteSequence.fromBinaryString("").count).toBe(0);

    expect(() => {
      ByteSequence.fromBinaryString("あ");
    }).toThrow("binaryString");

    expect(() => {
      ByteSequence.fromBinaryString("\u0100");
    }).toThrow("binaryString");

  });

});
