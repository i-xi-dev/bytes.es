import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.create(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  test("format()", () => {
    expect(bs0.format()).toBe("");
    expect(bs1.format()).toBe("413c0a20a9");

  });

  test("format(ByteFormatName)", () => {
    expect(bs1.format("hexadecimal")).toBe("413c0a20a9");
    expect(bs1.format("decimal")).toBe("065060010032169");

  });

  test("format(ByteFormatName, ByteFormatOptions)", () => {
    expect(bs1.format("hexadecimal", {upperCase:true})).toBe("413C0A20A9");
    expect(bs1.format("hexadecimal", {zeroPaddedLength:3})).toBe("04103c00a0200a9");
    expect(bs1.format("decimal", {zeroPaddedLength:4, upperCase:true})).toBe("00650060001000320169");

  });

});
