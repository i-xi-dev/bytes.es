import assert from "node:assert";
import { Percent } from "../../../../dist/byte/index.js";

describe("Percent.encode", () => {
  it("encode(Uint8Array)", () => {
    const utf8 = new TextEncoder();
    const utf8Bytes1 = utf8.encode("1\u{0} !~\u{7F}あ+");

    assert.strictEqual(Percent.encode(Uint8Array.of()), "");
    assert.strictEqual(Percent.encode(Uint8Array.of(3,2,1,0,0xFF,0xFE,0xFD,0xFC)), "%03%02%01%00%FF%FE%FD%FC");
    assert.strictEqual(Percent.encode(utf8Bytes1), "%31%00%20%21%7E%7F%E3%81%82%2B");
    assert.strictEqual(Percent.encode(Uint8Array.of(255)), "%FF");
    assert.strictEqual(Percent.encode(Uint8Array.of(0)), "%00");
    assert.strictEqual(Percent.encode(Uint8Array.of(0,32,65)), "%00%20%41");

    assert.strictEqual(Percent.encode(Uint8Array.of(0,32,65), {encodeSet:[32,65]}), "%00%20%41");
    assert.strictEqual(Percent.encode(Uint8Array.of(255), {encodeSet:[32,65]}), "%FF");

    assert.strictEqual(Percent.encode(utf8Bytes1, {encodeSet:[]}), "1%00 !~%7F%E3%81%82+");
    assert.strictEqual(Percent.encode(utf8Bytes1, {encodeSet:[32]}), "1%00%20!~%7F%E3%81%82+");

    assert.strictEqual(Percent.encode(utf8Bytes1, {encodeSet:[32,0x2B],spaceAsPlus:true}), "1%00+!~%7F%E3%81%82%2B");
    assert.strictEqual(Percent.encode(Uint8Array.of(0,32,65), {encodeSet:[32,0x2B],spaceAsPlus:true}), "%00+A");
    assert.strictEqual(Percent.encode(Uint8Array.of(255), {encodeSet:[32,0x2B],spaceAsPlus:true}), "%FF");

    assert.strictEqual(Percent.encode(utf8Bytes1, {encodeSet:[32,0x2B]}), globalThis.encodeURIComponent("1\u{0} !~\u{7F}あ+"));

    assert.throws(() => {
      const t = [-1];
      Percent.encode(Uint8Array.of(), {encodeSet:t})
    }, {
      message: "encodeSet"
    });

    assert.throws(() => {
      Percent.encode(Uint8Array.of(), {encodeSet:[32],spaceAsPlus:true});
    }, {
      message: "options.encodeSet, options.spaceAsPlus"
    });

  });

});
