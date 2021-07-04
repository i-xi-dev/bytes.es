import { uint8 } from "../../../src/type";
import { PercentEncoding } from "../../../src/encoding/percent";

describe("PercentEncoding", (): void => {
  test("PercentEncoding()", (): void => {
    const i1 = new PercentEncoding();
    expect(i1.encode(Uint8Array.of(255))).toBe("%FF");
  });

  test("PercentEncoding(PercentEncodingOptions)", (): void => {
    const i1 = new PercentEncoding();
    expect(i1.encode(Uint8Array.of(0))).toBe("%00");
    expect(i1.encode(Uint8Array.of(255))).toBe("%FF");

    const i2 = new PercentEncoding({});
    expect(i2.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    expect(i2.encode(Uint8Array.of(255))).toBe("%FF");

    const i3 = new PercentEncoding({inclusions:[]});
    expect(i3.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    expect(i3.encode(Uint8Array.of(255))).toBe("%FF");

    const i3b = new PercentEncoding({inclusions:[32,65]});
    expect(i3b.encode(Uint8Array.of(0,32,65))).toBe("%00%20%41");
    expect(i3b.encode(Uint8Array.of(255))).toBe("%FF");

    const i4 = new PercentEncoding({inclusions:[32,0x2B],spaceAsPlus:true});
    expect(i4.encode(Uint8Array.of(0,32,65))).toBe("%00+A");
    expect(i4.encode(Uint8Array.of(255))).toBe("%FF");

    const i5 = new PercentEncoding({strict:true});
    expect(i5.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    expect(i5.encode(Uint8Array.of(255))).toBe("%FF");

    expect(() => {
      const t: Array<number> = [-1];
      new PercentEncoding({inclusions:t as Array<uint8>});
    }).toThrow("options.inclusions");




    expect(() => {
      new PercentEncoding({inclusions:[32],spaceAsPlus:true});
    }).toThrow("options.inclusions, options.spaceAsPlus");

  });

});
