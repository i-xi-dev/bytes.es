import { ByteEncoding } from "../../../dist/byte/index.js";

describe("ByteEncoding.for", () => {
  test("for(string)", () => {
    const i1 = ByteEncoding.for("base64");
    expect(i1.encode(Uint8Array.of(255))).toBe("/w==");
    expect(i1.encode(Uint8Array.of(251))).toBe("+w==");

    const i1p = ByteEncoding.for("percent");
    expect(i1p.encode(Uint8Array.of(255))).toBe("%FF");

    expect(() => {
      ByteEncoding.for("hoge");
    }).toThrow("unknown encodingName");

  });

  test("for(string)", () => {
    const i2 = ByteEncoding.for("base64", {});
    expect(i2.encode(Uint8Array.of(255))).toBe("/w==");
    expect(i2.encode(Uint8Array.of(251))).toBe("+w==");

    const i3 = ByteEncoding.for("base64", {_62ndChar:"-"});
    expect(i3.encode(Uint8Array.of(251))).toBe("-w==");

    const i4 = ByteEncoding.for("base64", {_63rdChar:"_"});
    expect(i4.encode(Uint8Array.of(255))).toBe("_w==");

    const i5 = ByteEncoding.for("base64", {usePadding:false});
    expect(i5.encode(Uint8Array.of(255))).toBe("/w");

    const i5b = ByteEncoding.for("base64", {usePadding:undefined});
    expect(i5b.encode(Uint8Array.of(255))).toBe("/w==");

    const i1p = ByteEncoding.for("percent");
    expect(i1p.encode(Uint8Array.of(0))).toBe("%00");
    expect(i1p.encode(Uint8Array.of(255))).toBe("%FF");

    const i2p = ByteEncoding.for("percent", {});
    expect(i2p.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    expect(i2p.encode(Uint8Array.of(255))).toBe("%FF");

    const i3p = ByteEncoding.for("percent", {inclusions:[]});
    expect(i3p.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    expect(i3p.encode(Uint8Array.of(255))).toBe("%FF");

    const i3bp = ByteEncoding.for("percent", {inclusions:[32,65]});
    expect(i3bp.encode(Uint8Array.of(0,32,65))).toBe("%00%20%41");
    expect(i3bp.encode(Uint8Array.of(255))).toBe("%FF");

    const i4p = ByteEncoding.for("percent", {inclusions:[32,0x2B],spaceAsPlus:true});
    expect(i4p.encode(Uint8Array.of(0,32,65))).toBe("%00+A");
    expect(i4p.encode(Uint8Array.of(255))).toBe("%FF");

    const i5p = ByteEncoding.for("percent", {strict:true});
    expect(i5p.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    expect(i5p.encode(Uint8Array.of(255))).toBe("%FF");

    expect(() => {
      const t = [-1];
      ByteEncoding.for("percent", {inclusions:t});
    }).toThrow("options.inclusions");

    expect(() => {
      ByteEncoding.for("percent", {inclusions:[32],spaceAsPlus:true});
    }).toThrow("options.inclusions, options.spaceAsPlus");

  });

});
