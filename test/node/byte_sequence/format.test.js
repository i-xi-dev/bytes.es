import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.create(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  it("format()", () => {
    assert.strictEqual(bs0.format(), "");
    assert.strictEqual(bs1.format(), "413c0a20a9");

  });

  it("format(number)", () => {
    assert.strictEqual(bs1.format(16), "413c0a20a9");
    assert.strictEqual(bs1.format(10), "065060010032169");

  });

  it("format(number, FormatOptions)", () => {
    assert.strictEqual(bs1.format(16, {upperCase:true}), "413C0A20A9");
    assert.strictEqual(bs1.format(16, {paddedLength:3}), "04103c00a0200a9");
    assert.strictEqual(bs1.format(10, {paddedLength:4, upperCase:true}), "00650060001000320169");

  });

});
