import { ByteFormat } from "../../src/format";

describe("ByteFormat.prototype.parse", (): void => {
  test("parse(string)", (): void => {
    const i1 = new ByteFormat();
    const parsed10 = i1.parse("");
    expect(parsed10.length).toBe(0);
    const parsed11 = i1.parse("00");
    expect(parsed11.length).toBe(1);
    expect(parsed11[0]).toBe(0);
    const parsed12 = i1.parse("00ff01");
    expect(parsed12.length).toBe(3);
    expect(parsed12[0]).toBe(0);
    expect(parsed12[1]).toBe(255);
    expect(parsed12[2]).toBe(1);

    const i2 = new ByteFormat({radix:10});
    const parsed21 = i2.parse("000");
    expect(parsed21.length).toBe(1);
    expect(parsed21[0]).toBe(0);
    const parsed22 = i2.parse("000255001");
    expect(parsed22.length).toBe(3);
    expect(parsed22[0]).toBe(0);
    expect(parsed22[1]).toBe(255);
    expect(parsed22[2]).toBe(1);

    const i2b = new ByteFormat({radix:2});
    const parsed21b = i2b.parse("00000000");
    expect(parsed21b.length).toBe(1);
    expect(parsed21b[0]).toBe(0);
    const parsed22b = i2b.parse("000000001111111100000001");
    expect(parsed22b.length).toBe(3);
    expect(parsed22b[0]).toBe(0);
    expect(parsed22b[1]).toBe(255);
    expect(parsed22b[2]).toBe(1);

    const i2c = new ByteFormat({radix:8});
    const parsed21c = i2c.parse("000");
    expect(parsed21c.length).toBe(1);
    expect(parsed21c[0]).toBe(0);
    const parsed22c = i2c.parse("000377001");
    expect(parsed22c.length).toBe(3);
    expect(parsed22c[0]).toBe(0);
    expect(parsed22c[1]).toBe(255);
    expect(parsed22c[2]).toBe(1);

    const i3 = new ByteFormat({zeroPaddedLength:3});
    const parsed31 = i3.parse("000");
    expect(parsed31.length).toBe(1);
    expect(parsed31[0]).toBe(0);
    const parsed32 = i3.parse("0000ff001");
    expect(parsed32.length).toBe(3);
    expect(parsed32[0]).toBe(0);
    expect(parsed32[1]).toBe(255);
    expect(parsed32[2]).toBe(1);

    const i4 = new ByteFormat({upperCase:true});
    const parsed41 = i4.parse("00");
    expect(parsed41.length).toBe(1);
    expect(parsed41[0]).toBe(0);
    const parsed42 = i4.parse("00FF01");
    expect(parsed42.length).toBe(3);
    expect(parsed42[0]).toBe(0);
    expect(parsed42[1]).toBe(255);
    expect(parsed42[2]).toBe(1);

    const i5 = new ByteFormat({prefix:"-"});
    const parsed51 = i5.parse("-00");
    expect(parsed51.length).toBe(1);
    expect(parsed51[0]).toBe(0);
    const parsed52 = i5.parse("-00-ff-01");
    expect(parsed52.length).toBe(3);
    expect(parsed52[0]).toBe(0);
    expect(parsed52[1]).toBe(255);
    expect(parsed52[2]).toBe(1);

    const i6 = new ByteFormat({suffix:"-"});
    const parsed61 = i6.parse("00-");
    expect(parsed61.length).toBe(1);
    expect(parsed61[0]).toBe(0);
    const parsed62 = i6.parse("00-ff-01-");
    expect(parsed62.length).toBe(3);
    expect(parsed62[0]).toBe(0);
    expect(parsed62[1]).toBe(255);
    expect(parsed62[2]).toBe(1);

    const i7 = new ByteFormat({zeroPaddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    const parsed71 = i7.parse("-000-");
    expect(parsed71.length).toBe(1);
    expect(parsed71[0]).toBe(0);
    const parsed72 = i7.parse("-000--0FF--001-");
    expect(parsed72.length).toBe(3);
    expect(parsed72[0]).toBe(0);
    expect(parsed72[1]).toBe(255);
    expect(parsed72[2]).toBe(1);

    const i8 = new ByteFormat({radix:10,zeroPaddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    const parsed81 = i8.parse("-000-");
    expect(parsed81.length).toBe(1);
    expect(parsed81[0]).toBe(0);
    const parsed82 = i8.parse("-000--255--001-");
    expect(parsed82.length).toBe(3);
    expect(parsed82[0]).toBe(0);
    expect(parsed82[1]).toBe(255);
    expect(parsed82[2]).toBe(1);

  });

  test("DataError", (): void => {
    const i0 = new ByteFormat();
    expect(() => {
      i0.parse("a");
    }).toThrow("parse error");
    expect(() => {
      i0.parse("000");
    }).toThrow("parse error");
  });

  test("InvalidCharacterError - prefix", (): void => {
    const i0 = new ByteFormat({prefix:"-"});
    expect(() => {
      i0.parse("#00");
    }).toThrow("unprefixed");
    expect(() => {
      i0.parse("000");
    }).toThrow("unprefixed");
  });

  test("InvalidCharacterError - suffix", (): void => {
    const i0 = new ByteFormat({suffix:"-"});
    expect(() => {
      i0.parse("00#");
    }).toThrow("unsuffixed");
    expect(() => {
      i0.parse("000");
    }).toThrow("unsuffixed");
  });
});
