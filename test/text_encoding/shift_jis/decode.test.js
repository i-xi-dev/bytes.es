import { ShiftJis } from "../../../dist/text_encoding/shift_jis.js";

describe("ShiftJis.decode", () => {
  test("decode(Uint8Array)", () => {
    expect(ShiftJis.decode(Uint8Array.of())).toBe("");
    expect(ShiftJis.decode(Uint8Array.of(0,1,2,3,4))).toBe("\u0000\u0001\u0002\u0003\u0004");
    expect(ShiftJis.decode(Uint8Array.of(135,96))).toBe("㌔");

    expect(() => {
      ShiftJis.decode(Uint8Array.of(0xA0));
    }).toThrow("decode error");
    //expect(ShiftJis.decode(Uint8Array.of(0x1A))).toBe("\u001A");// XXX [Nodeの問題]

  });

  test("decode(Uint8Array, Object)", () => {
    // fallback
    expect(() => {
      ShiftJis.decode(Uint8Array.of(0xA0), {fallback:"exception"});
    }).toThrow("decode error");
    expect(ShiftJis.decode(Uint8Array.of(0xA0), {fallback:"replacement"})).toBe("\u001A");// XXX [Nodeの問題] \uFFFDになるべき
    //expect(ShiftJis.decode(Uint8Array.of(0x1A), {fallback:"exception"})).toBe("\u001A");// XXX [Nodeの問題]

  });

});
