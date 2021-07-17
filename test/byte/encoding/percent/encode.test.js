import { PercentEncoding } from "../../../../dist/byte/index.js";

describe("PercentEncoding.prototype.encode", () => {
  test("encode(Uint8Array)", () => {
    // const utf8 = new TextEncoder();
    // const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    // const i1 = new PercentEncoding();
    // expect(i1.encode(Uint8Array.of())).toBe("");
    // expect(i1.encode(Uint8Array.of(3,2,1,0,0xFF,0xFE,0xFD,0xFC))).toBe("%03%02%01%00%FF%FE%FD%FC");
    // expect(i1.encode(utf8Bytes1)).toBe("1%00 !~%7F%E3%81%82+");
    // expect(i1.encode(Uint8Array.of(255))).toBe("%FF");
    // expect(i1.encode(Uint8Array.of(0))).toBe("%00");
    // expect(i1.encode(Uint8Array.of(0,32,65))).toBe("%00 A");

    // const i3bp = new PercentEncoding({inclusions:[32,65]});
    // expect(i3bp.encode(Uint8Array.of(0,32,65))).toBe("%00%20%41");
    // expect(i3bp.encode(Uint8Array.of(255))).toBe("%FF");

    // const i2 = new PercentEncoding({inclusions:[32]});
    // expect(i2.encode(utf8Bytes1)).toBe("1%00%20!~%7F%E3%81%82+");

    // const i3 = new PercentEncoding({inclusions:[32,0x2B],spaceAsPlus:true});
    // expect(i3.encode(utf8Bytes1)).toBe("1%00+!~%7F%E3%81%82%2B");
    // expect(i3.encode(Uint8Array.of(0,32,65))).toBe("%00+A");
    // expect(i3.encode(Uint8Array.of(255))).toBe("%FF");

    // const i4 = new PercentEncoding({inclusions:[32,0x2B]});
    // expect(i4.encode(utf8Bytes1)).toBe(globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"));

    // const i5 = new PercentEncoding({strict:false});
    // expect(i5.encode(Uint8Array.of())).toBe("");
    // expect(i5.encode(Uint8Array.of(3,2,1,0,0xFF,0xFE,0xFD,0xFC))).toBe("%03%02%01%00%FF%FE%FD%FC");
    // expect(i5.encode(utf8Bytes1)).toBe("1%00 !~%7F%E3%81%82+");

    // const i5p = new PercentEncoding({strict:true});
    // expect(i5p.encode(Uint8Array.of(0,32,65))).toBe("%00 A");
    // expect(i5p.encode(Uint8Array.of(255))).toBe("%FF");

    // expect(() => {
    //   const t = [-1];
    //   new PercentEncoding({inclusions:t});
    // }).toThrow("options.inclusions");

    // expect(() => {
    //   new PercentEncoding({inclusions:[32],spaceAsPlus:true});
    // }).toThrow("options.inclusions, options.spaceAsPlus");

  });

});
