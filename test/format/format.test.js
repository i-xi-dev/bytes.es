import { ByteFormat } from "../../dist/format/index.js";

describe("ByteFormat.prototype.format", () => {
  test("format(Uint8Array)", () => {
    const i1 = ByteFormat.for("hexadecimal");
    const formatted10 = i1.format(Uint8Array.of());
    expect(formatted10).toBe("");
    const formatted11 = i1.format(Uint8Array.of(0));
    expect(formatted11).toBe("00");
    const formatted12 = i1.format(Uint8Array.of(0,255,1));
    expect(formatted12).toBe("00ff01");

    const i2 = ByteFormat.for("decimal");
    const formatted21 = i2.format(Uint8Array.of(0));
    expect(formatted21).toBe("000");
    const formatted22 = i2.format(Uint8Array.of(0,255,1));
    expect(formatted22).toBe("000255001");

    const i2b = ByteFormat.for("binary");
    const formatted21b = i2b.format(Uint8Array.of(0));
    expect(formatted21b).toBe("00000000");
    const formatted22b = i2b.format(Uint8Array.of(0,255,1));
    expect(formatted22b).toBe("000000001111111100000001");

    const i2c = ByteFormat.for("octal");
    const formatted21c = i2c.format(Uint8Array.of(0));
    expect(formatted21c).toBe("000");
    const formatted22c = i2c.format(Uint8Array.of(0,255,1));
    expect(formatted22c).toBe("000377001");

    const i3 = ByteFormat.for("hexadecimal", {zeroPaddedLength:3});
    const formatted31 = i3.format(Uint8Array.of(0));
    expect(formatted31).toBe("000");
    const formatted32 = i3.format(Uint8Array.of(0,255,1));
    expect(formatted32).toBe("0000ff001");

    const i4 = ByteFormat.for("hexadecimal", {upperCase:true});
    const formatted41 = i4.format(Uint8Array.of(0));
    expect(formatted41).toBe("00");
    const formatted42 = i4.format(Uint8Array.of(0,255,1));
    expect(formatted42).toBe("00FF01");

    const i5 = ByteFormat.for("hexadecimal", {prefix:"-"});
    const formatted51 = i5.format(Uint8Array.of(0));
    expect(formatted51).toBe("-00");
    const formatted52 = i5.format(Uint8Array.of(0,255,1));
    expect(formatted52).toBe("-00-ff-01");

    const i6 = ByteFormat.for("hexadecimal", {suffix:"-"});
    const formatted61 = i6.format(Uint8Array.of(0));
    expect(formatted61).toBe("00-");
    const formatted62 = i6.format(Uint8Array.of(0,255,1));
    expect(formatted62).toBe("00-ff-01-");

    const i7 = ByteFormat.for("hexadecimal", {zeroPaddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    const formatted71 = i7.format(Uint8Array.of(0));
    expect(formatted71).toBe("-000-");
    const formatted72 = i7.format(Uint8Array.of(0,255,1));
    expect(formatted72).toBe("-000--0FF--001-");

    const i8 = ByteFormat.for("decimal", {zeroPaddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    const formatted81 = i8.format(Uint8Array.of(0));
    expect(formatted81).toBe("-000-");
    const formatted82 = i8.format(Uint8Array.of(0,255,1));
    expect(formatted82).toBe("-000--255--001-");

  });
});
