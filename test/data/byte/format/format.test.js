import { Format } from "../../../../dist/data/byte/index.js";

describe("Format.format", () => {
  test("format(Uint8Array)", () => {
    const formatted10 = Format.format(Uint8Array.of(), 16);
    expect(formatted10).toBe("");
    const formatted11 = Format.format(Uint8Array.of(0), 16);
    expect(formatted11).toBe("00");
    const formatted12 = Format.format(Uint8Array.of(0,255,1), 16);
    expect(formatted12).toBe("00ff01");

    const formatted21 = Format.format(Uint8Array.of(0), 10);
    expect(formatted21).toBe("000");
    const formatted22 = Format.format(Uint8Array.of(0,255,1), 10);
    expect(formatted22).toBe("000255001");

    const formatted21b = Format.format(Uint8Array.of(0), 2);
    expect(formatted21b).toBe("00000000");
    const formatted22b = Format.format(Uint8Array.of(0,255,1), 2);
    expect(formatted22b).toBe("000000001111111100000001");

    const formatted21c = Format.format(Uint8Array.of(0), 8);
    expect(formatted21c).toBe("000");
    const formatted22c = Format.format(Uint8Array.of(0,255,1), 8);
    expect(formatted22c).toBe("000377001");

    const formatted31 = Format.format(Uint8Array.of(0), 16, {paddedLength:3});
    expect(formatted31).toBe("000");
    const formatted32 = Format.format(Uint8Array.of(0,255,1), 16, {paddedLength:3});
    expect(formatted32).toBe("0000ff001");

    const formatted41 = Format.format(Uint8Array.of(0), 16, {upperCase:true});
    expect(formatted41).toBe("00");
    const formatted42 = Format.format(Uint8Array.of(0,255,1), 16, {upperCase:true});
    expect(formatted42).toBe("00FF01");

    const formatted51 = Format.format(Uint8Array.of(0), 16, {prefix:"-"});
    expect(formatted51).toBe("-00");
    const formatted52 = Format.format(Uint8Array.of(0,255,1), 16, {prefix:"-"});
    expect(formatted52).toBe("-00-ff-01");

    const formatted61 = Format.format(Uint8Array.of(0), 16, {suffix:"-"});
    expect(formatted61).toBe("00-");
    const formatted62 = Format.format(Uint8Array.of(0,255,1), 16, {suffix:"-"});
    expect(formatted62).toBe("00-ff-01-");

    const formatted71 = Format.format(Uint8Array.of(0), 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(formatted71).toBe("-000-");
    const formatted72 = Format.format(Uint8Array.of(0,255,1), 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(formatted72).toBe("-000--0FF--001-");

    const formatted81 = Format.format(Uint8Array.of(0), 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(formatted81).toBe("-000-");
    const formatted82 = Format.format(Uint8Array.of(0,255,1), 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    expect(formatted82).toBe("-000--255--001-");

  });
});
