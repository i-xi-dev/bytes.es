import { Utf8 } from "../../../dist/text_encoding/utf_8.js";

describe("Utf8.decode", () => {
  test("decode(Uint8Array)", () => {
    expect(Utf8.decode(Uint8Array.of())).toBe("");
    expect(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169,10,240,160,128,139,97,98,99,10,97))).toBe("1あ3\u{A9}\n\u{2000B}abc\na");
    expect(Utf8.decode(Uint8Array.of(239,187,191,49,51))).toBe("\uFEFF\u0031\u0033");
    expect(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169))).toBe("1あ3\u{A9}");
    expect(Utf8.decode(Uint8Array.of(0x31, 0x82, 0xA0, 0x33))).toBe("1\uFFFD\uFFFD3");

    expect(Utf8.decode(Uint8Array.of(0xEF,0xBB,0xBF,49,227,129,130,51,194,169))).toBe("\uFEFF1あ3\u{A9}");

  });

  test("decode(Uint8Array, Object)", () => {
    // fallback
    expect(Utf8.decode(Uint8Array.of(), {fallback:"exception"})).toBe("");
    expect(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169,10,240,160,128,139,97,98,99,10,97), {fallback:"exception"})).toBe("1あ3\u{A9}\n\u{2000B}abc\na");
    expect(Utf8.decode(Uint8Array.of(239,187,191,49,51), {fallback:"exception"})).toBe("\uFEFF\u0031\u0033");
    expect(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169), {fallback:"exception"})).toBe("1あ3\u{A9}");

    expect(() => {
      Utf8.decode(Uint8Array.of(0x31, 0x82, 0xA0, 0x33), {fallback:"exception"});
    }).toThrow("decode error");

    // removeBom
    expect(Utf8.decode(Uint8Array.of(0xEF,0xBB,0xBF,49,227,129,130,51,194,169), {removeBom:true})).toBe("1あ3\u{A9}");

  });

});
