import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.format", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  it("format()", () => {
    assert.strictEqual(bs0.format(), "");
    assert.strictEqual(bs1.format(), "413C0A20A9");

  });

  it("format({radix:number})", () => {
    assert.strictEqual(bs1.format({radix:16}), "413C0A20A9");
    assert.strictEqual(bs1.format({radix:10}), "065060010032169");

  });

  it("format(FormatOptions)", () => {
    assert.strictEqual(bs1.format({radix:16,upperCase:false}), "413c0a20a9");
    assert.strictEqual(bs1.format({radix:16,paddedLength:3,upperCase:false}), "04103c00a0200a9");
    assert.strictEqual(bs1.format({radix:10,paddedLength:4}), "00650060001000320169");

  });

});
