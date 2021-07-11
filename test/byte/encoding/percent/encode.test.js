import { ByteEncoding } from "../../../../dist/byte/index.js";

describe("PercentEncoding.prototype.encode", () => {
  test("encode(Uint8Array)", () => {
    const utf8 = new TextEncoder();
    const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    const i1 = ByteEncoding.for("percent");
    expect(i1.encode(Uint8Array.of())).toBe("");
    expect(i1.encode(Uint8Array.of(3,2,1,0,0xFF,0xFE,0xFD,0xFC))).toBe("%03%02%01%00%FF%FE%FD%FC");
    expect(i1.encode(utf8Bytes1)).toBe("1%00 !~%7F%E3%81%82+");

    const i2 = ByteEncoding.for("percent", {inclusions:[32]});
    expect(i2.encode(utf8Bytes1)).toBe("1%00%20!~%7F%E3%81%82+");

    const i3 = ByteEncoding.for("percent", {inclusions:[32,0x2B],spaceAsPlus:true});
    expect(i3.encode(utf8Bytes1)).toBe("1%00+!~%7F%E3%81%82%2B");

    const i4 = ByteEncoding.for("percent", {inclusions:[32,0x2B]});
    expect(i4.encode(utf8Bytes1)).toBe(globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"));

    const i5 = ByteEncoding.for("percent", {strict:false});
    expect(i5.encode(Uint8Array.of())).toBe("");
    expect(i5.encode(Uint8Array.of(3,2,1,0,0xFF,0xFE,0xFD,0xFC))).toBe("%03%02%01%00%FF%FE%FD%FC");
    expect(i5.encode(utf8Bytes1)).toBe("1%00 !~%7F%E3%81%82+");
  });

});
