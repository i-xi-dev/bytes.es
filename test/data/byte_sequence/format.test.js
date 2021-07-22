import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.create(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  test("format()", () => {
    expect(bs0.format()).toBe("");
    expect(bs1.format()).toBe("413c0a20a9");

  });

  test("format(number)", () => {
    expect(bs1.format(16)).toBe("413c0a20a9");
    expect(bs1.format(10)).toBe("065060010032169");

  });

  test("format(number, FormatOptions)", () => {
    expect(bs1.format(16, {upperCase:true})).toBe("413C0A20A9");
    expect(bs1.format(16, {paddedLength:3})).toBe("04103c00a0200a9");
    expect(bs1.format(10, {paddedLength:4, upperCase:true})).toBe("00650060001000320169");

  });

});
