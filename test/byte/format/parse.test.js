import { Format } from "../../../dist/byte/index.js";

describe("Format.parse", () => {
  test("parse(string)", () => {
    const parsed10 = Format.parse("", 16);
    expect(parsed10.length).toBe(0);
    const parsed11 = Format.parse("00", 16);
    expect(parsed11.length).toBe(1);
    expect(parsed11[0]).toBe(0);
    const parsed12 = Format.parse("00ff01", 16);
    expect(parsed12.length).toBe(3);
    expect(parsed12[0]).toBe(0);
    expect(parsed12[1]).toBe(255);
    expect(parsed12[2]).toBe(1);

    const parsed21 = Format.parse("000", 10);
    expect(parsed21.length).toBe(1);
    expect(parsed21[0]).toBe(0);
    const parsed22 = Format.parse("000255001", 10);
    expect(parsed22.length).toBe(3);
    expect(parsed22[0]).toBe(0);
    expect(parsed22[1]).toBe(255);
    expect(parsed22[2]).toBe(1);

    const parsed21b = Format.parse("00000000", 2);
    expect(parsed21b.length).toBe(1);
    expect(parsed21b[0]).toBe(0);
    const parsed22b = Format.parse("000000001111111100000001", 2);
    expect(parsed22b.length).toBe(3);
    expect(parsed22b[0]).toBe(0);
    expect(parsed22b[1]).toBe(255);
    expect(parsed22b[2]).toBe(1);

    const parsed21c = Format.parse("000", 8);
    expect(parsed21c.length).toBe(1);
    expect(parsed21c[0]).toBe(0);
    const parsed22c = Format.parse("000377001", 8);
    expect(parsed22c.length).toBe(3);
    expect(parsed22c[0]).toBe(0);
    expect(parsed22c[1]).toBe(255);
    expect(parsed22c[2]).toBe(1);

    const parsed31 = Format.parse("000", 16, {paddedLength:3});
    expect(parsed31.length).toBe(1);
    expect(parsed31[0]).toBe(0);
    const parsed32 = Format.parse("0000ff001", 16, {paddedLength:3});
    expect(parsed32.length).toBe(3);
    expect(parsed32[0]).toBe(0);
    expect(parsed32[1]).toBe(255);
    expect(parsed32[2]).toBe(1);

    const parsed41 = Format.parse("00", 16, {upperCase:true});
    expect(parsed41.length).toBe(1);
    expect(parsed41[0]).toBe(0);
    const parsed42 = Format.parse("00FF01", 16, {upperCase:true});
    expect(parsed42.length).toBe(3);
    expect(parsed42[0]).toBe(0);
    expect(parsed42[1]).toBe(255);
    expect(parsed42[2]).toBe(1);

    const parsed51 = Format.parse("-00", 16, {prefix:"-"});
    expect(parsed51.length).toBe(1);
    expect(parsed51[0]).toBe(0);
    const parsed52 = Format.parse("-00-ff-01", 16, {prefix:"-"});
    expect(parsed52.length).toBe(3);
    expect(parsed52[0]).toBe(0);
    expect(parsed52[1]).toBe(255);
    expect(parsed52[2]).toBe(1);

    const parsed61 = Format.parse("00-", 16, {suffix:"-"});
    expect(parsed61.length).toBe(1);
    expect(parsed61[0]).toBe(0);
    const parsed62 = Format.parse("00-ff-01-", 16, {suffix:"-"});
    expect(parsed62.length).toBe(3);
    expect(parsed62[0]).toBe(0);
    expect(parsed62[1]).toBe(255);
    expect(parsed62[2]).toBe(1);

    const parsed71 = Format.parse("-000-", 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(parsed71.length).toBe(1);
    expect(parsed71[0]).toBe(0);
    const parsed72 = Format.parse("-000--0FF--001-", 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(parsed72.length).toBe(3);
    expect(parsed72[0]).toBe(0);
    expect(parsed72[1]).toBe(255);
    expect(parsed72[2]).toBe(1);

    const parsed81 = Format.parse("-000-", 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(parsed81.length).toBe(1);
    expect(parsed81[0]).toBe(0);
    const parsed82 = Format.parse("-000--255--001-", 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(parsed82.length).toBe(3);
    expect(parsed82[0]).toBe(0);
    expect(parsed82[1]).toBe(255);
    expect(parsed82[2]).toBe(1);

  });

  test("DataError", () => {
    expect(() => {
      Format.parse("a", 16);
    }).toThrow("parse error");
    expect(() => {
      Format.parse("000", 16);
    }).toThrow("parse error");
  });

  test("InvalidCharacterError - upperCase", () => {
    expect(() => {
      Format.parse("ff", 16, {upperCase:true});
    }).toThrow("parse error");
    expect(() => {
      Format.parse("FF", 16, {upperCase:false});
    }).toThrow("parse error");
  });

  test("InvalidCharacterError - caseInsensitive", () => {
    expect(Format.parse("ff", 16, {upperCase:true,caseInsensitive:true}).join(",")).toBe("255");
    expect(Format.parse("FF", 16, {upperCase:false,caseInsensitive:true}).join(",")).toBe("255");
  });

  test("InvalidCharacterError - prefix", () => {
    expect(() => {
      Format.parse("#00", 16, {prefix:"-"});
    }).toThrow("unprefixed");
    expect(() => {
      Format.parse("000", 16, {prefix:"-"});
    }).toThrow("unprefixed");
  });

  test("InvalidCharacterError - suffix", () => {
    expect(() => {
      Format.parse("00#", 16, {suffix:"-"});
    }).toThrow("unsuffixed");
    expect(() => {
      Format.parse("000", 16, {suffix:"-"});
    }).toThrow("unsuffixed");
  });
});
