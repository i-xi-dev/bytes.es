import { Percent } from "../../../../dist/byte/index.js";

describe("Percent.encode", () => {
  test("encode(Uint8Array)", () => {
    const utf8 = new TextEncoder();
    const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    expect(Percent.encode(Uint8Array.of())).toBe("");
    expect(Percent.encode(Uint8Array.of(3,2,1,0,0xFF,0xFE,0xFD,0xFC))).toBe("%03%02%01%00%FF%FE%FD%FC");
    expect(Percent.encode(utf8Bytes1)).toBe("1%00 !~%7F%E3%81%82+");
    expect(Percent.encode(Uint8Array.of(255))).toBe("%FF");
    expect(Percent.encode(Uint8Array.of(0))).toBe("%00");
    expect(Percent.encode(Uint8Array.of(0,32,65))).toBe("%00 A");

    expect(Percent.encode(Uint8Array.of(0,32,65), {inclusions:[32,65]})).toBe("%00%20%41");
    expect(Percent.encode(Uint8Array.of(255), {inclusions:[32,65]})).toBe("%FF");

    expect(Percent.encode(utf8Bytes1, {inclusions:[32]})).toBe("1%00%20!~%7F%E3%81%82+");

    expect(Percent.encode(utf8Bytes1, {inclusions:[32,0x2B],spaceAsPlus:true})).toBe("1%00+!~%7F%E3%81%82%2B");
    expect(Percent.encode(Uint8Array.of(0,32,65), {inclusions:[32,0x2B],spaceAsPlus:true})).toBe("%00+A");
    expect(Percent.encode(Uint8Array.of(255), {inclusions:[32,0x2B],spaceAsPlus:true})).toBe("%FF");

    expect(Percent.encode(utf8Bytes1, {inclusions:[32,0x2B]})).toBe(globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"));

    expect(() => {
      const t = [-1];
      Percent.encode(Uint8Array.of(), {inclusions:t})
    }).toThrow("options.inclusions");

    expect(() => {
      Percent.encode(Uint8Array.of(), {inclusions:[32],spaceAsPlus:true});
    }).toThrow("options.inclusions, options.spaceAsPlus");

  });

});
