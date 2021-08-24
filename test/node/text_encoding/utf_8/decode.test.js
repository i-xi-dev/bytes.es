import assert from "node:assert";
import { Utf8 } from "../../../../dist/text_encoding/utf_8.js";

describe("Utf8.decode", () => {
  it("decode(Uint8Array)", () => {
    assert.strictEqual(Utf8.decode(Uint8Array.of()), "");
    assert.strictEqual(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169,10,240,160,128,139,97,98,99,10,97)), "1あ3\u{A9}\n\u{2000B}abc\na");
    assert.strictEqual(Utf8.decode(Uint8Array.of(239,187,191,49,51)), "\uFEFF\u0031\u0033");
    assert.strictEqual(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169)), "1あ3\u{A9}");

    assert.throws(() => {
      Utf8.decode(Uint8Array.of(0x31, 0x82, 0xA0, 0x33));
    }, {
      message: "decode error",
    });

    assert.strictEqual(Utf8.decode(Uint8Array.of(0xEF,0xBB,0xBF,49,227,129,130,51,194,169)), "\uFEFF1あ3\u{A9}");

  });

  it("decode(Uint8Array, Object)", () => {
    // fallback
    assert.strictEqual(Utf8.decode(Uint8Array.of(), {fallback:"exception"}), "");
    assert.strictEqual(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169,10,240,160,128,139,97,98,99,10,97), {fallback:"exception"}), "1あ3\u{A9}\n\u{2000B}abc\na");
    assert.strictEqual(Utf8.decode(Uint8Array.of(239,187,191,49,51), {fallback:"exception"}), "\uFEFF\u0031\u0033");
    assert.strictEqual(Utf8.decode(Uint8Array.of(49,227,129,130,51,194,169), {fallback:"exception"}), "1あ3\u{A9}");

    assert.throws(() => {
      Utf8.decode(Uint8Array.of(0x31, 0x82, 0xA0, 0x33), {fallback:"exception"});
    }, {
      message: "decode error",
    });
    assert.strictEqual(Utf8.decode(Uint8Array.of(0x31, 0x82, 0xA0, 0x33), {fallback:"replacement"}), "1\u{FFFD}\u{FFFD}3");

    // removeBom
    assert.strictEqual(Utf8.decode(Uint8Array.of(0xEF,0xBB,0xBF,49,227,129,130,51,194,169), {removeBom:true}), "1あ3\u{A9}");

  });

});
