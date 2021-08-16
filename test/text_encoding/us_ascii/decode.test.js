import { UsAscii } from "../../../dist/text_encoding/us_ascii.js";

describe("UsAscii.decode", () => {
  test("decode(Uint8Array)", () => {
    expect(UsAscii.decode(Uint8Array.of())).toBe("");
    expect(UsAscii.decode(Uint8Array.of(0x00,0x7F))).toBe("\u0000\u007F");

    expect(() => {
      UsAscii.decode(Uint8Array.of(0x80));
    }).toThrow("decode error");
    expect(() => {
      UsAscii.decode(Uint8Array.of(0xFF));
    }).toThrow("decode error");

    expect(() => {
      UsAscii.decode(Uint8Array.of(0xEF,0xBB,0xBF,49));
    }).toThrow("decode error");

  });

  test("decode(Uint8Array, Object)", () => {
    // fallback
    expect(() => {
      UsAscii.decode(Uint8Array.of(0x80), {fallback:"exception"});
    }).toThrow("decode error");
    expect(UsAscii.decode(Uint8Array.of(0x80), {fallback:"replacement"})).toBe("\u{FFFD}");

  });

});