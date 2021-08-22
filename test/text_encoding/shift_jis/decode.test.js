import assert from "node:assert";
import { ShiftJis } from "../../../dist/text_encoding/shift_jis.js";

describe("ShiftJis.decode", () => {
  it("decode(Uint8Array)", () => {
    assert.strictEqual(ShiftJis.decode(Uint8Array.of()), "");
    assert.strictEqual(ShiftJis.decode(Uint8Array.of(0,1,2,3,4)), "\u0000\u0001\u0002\u0003\u0004");
    assert.strictEqual(ShiftJis.decode(Uint8Array.of(135,96)), "㌔");

    assert.throws(() => {
      ShiftJis.decode(Uint8Array.of(0xA0));
    }, {
      message: "decode error",
    });
    //assert.strictEqual(ShiftJis.decode(Uint8Array.of(0x1A)), "\u001A");// XXX [Nodeの問題]

  });

  it("decode(Uint8Array, Object)", () => {
    // fallback
    assert.throws(() => {
      ShiftJis.decode(Uint8Array.of(0xA0), {fallback:"exception"});
    }, {
      message: "decode error",
    });
    assert.strictEqual(ShiftJis.decode(Uint8Array.of(0xA0), {fallback:"replacement"}), "\u001A");// XXX [Nodeの問題] \uFFFDになるべき
    //assert.strictEqual(ShiftJis.decode(Uint8Array.of(0x1A), {fallback:"exception"}), "\u001A");// XXX [Nodeの問題]

  });

});
