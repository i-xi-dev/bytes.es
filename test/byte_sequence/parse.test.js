import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.parse", () => {
  test("parse(string)", () => {
    const bs0 = ByteSequence.parse("41424344");
    expect(bs0.toString()).toBe("41424344");
    expect(ByteSequence.parse("").toString()).toBe("");

    expect(() => {
      ByteSequence.parse("あ");
    }).toThrow("parse error");

    expect(() => {
      ByteSequence.parse("GG");
    }).toThrow("parse error");

  });

  test("parse(string, ByteFormatName)", () => {
    const bs0 = ByteSequence.parse("41424344", "hexadecimal");
    expect(bs0.toString()).toBe("41424344");

    const bs1 = ByteSequence.parse("065066067068", "decimal");
    expect(bs1.toString()).toBe("41424344");

    const bs2 = ByteSequence.parse("101102103104", "octal");
    expect(bs2.toString()).toBe("41424344");

    const bs3 = ByteSequence.parse("01000001010000100100001101000100", "binary");
    expect(bs3.toString()).toBe("41424344");

  });

  test("parse(string, ByteFormatName, ByteFormatOptions)", () => {
    const bs0 = ByteSequence.parse("0041004200430044", "hexadecimal", {zeroPaddedLength:4, upperCase:true});
    expect(bs0.toString()).toBe("41424344");

  });

});
