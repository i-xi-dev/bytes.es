import assert from "node:assert";
import { UsAscii } from "../../../../dist/text_encoding/us_ascii.js";

describe("UsAscii.encode", () => {
  it("UsAscii(string)", () => {
    assert.strictEqual([...UsAscii.encode("")].join(","), "");
    assert.strictEqual([...UsAscii.encode("\u0000\u007F")].join(","), "0,127");

    assert.throws(() => {
      UsAscii.encode("\u0080");
    }, {
      message: "encode error",
    });

  });

  it("UsAscii(string, Object)", () => {
    // fallback
    assert.throws(() => {
      UsAscii.encode("\u0080", {fallback: "exception"});
    }, {
      message: "encode error",
    });
    assert.strictEqual([...UsAscii.encode("\u0080", {fallback: "replacement"})].join(","), "63");

  });

});
