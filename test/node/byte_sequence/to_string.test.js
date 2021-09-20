import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toString", () => {
  const bs0 = ByteSequence.create(0);
  const bs1 = ByteSequence.of(0x41, 0x3C, 0xA, 0x20, 0xA9);

  it("toString()", () => {
    assert.strictEqual(bs0.toString(), "");
    assert.strictEqual(bs1.toString(), "413c0a20a9");

  });

});
