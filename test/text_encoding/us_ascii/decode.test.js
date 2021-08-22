import assert from "node:assert";
import { UsAscii } from "../../../dist/text_encoding/us_ascii.js";

describe("UsAscii.decode", () => {
  it("decode(Uint8Array)", () => {
    assert.strictEqual(UsAscii.decode(Uint8Array.of()), "");
    assert.strictEqual(UsAscii.decode(Uint8Array.of(0x00,0x7F)), "\u0000\u007F");

    assert.throws(() => {
      UsAscii.decode(Uint8Array.of(0x80));
    }, {
      message: "decode error",
    });
    assert.throws(() => {
      UsAscii.decode(Uint8Array.of(0xFF));
    }, {
      message: "decode error",
    });

    assert.throws(() => {
      UsAscii.decode(Uint8Array.of(0xEF,0xBB,0xBF,49));
    }, {
      message: "decode error",
    });

  });

  it("decode(Uint8Array, Object)", () => {
    // fallback
    assert.throws(() => {
      UsAscii.decode(Uint8Array.of(0x80), {fallback:"exception"});
    }, {
      message: "decode error",
    });
    assert.strictEqual(UsAscii.decode(Uint8Array.of(0x80), {fallback:"replacement"}), "\u{FFFD}");

  });

});
