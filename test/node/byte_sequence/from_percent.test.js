import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.fromPercent", () => {
  it("fromPercent(string)", () => {
    const bs1 = ByteSequence.fromPercent("");
    assert.strictEqual(bs1.count, 0);

    const bs2 = ByteSequence.fromPercent("%03");
    assert.strictEqual(bs2.view()[0], 0x03);

  });

  it("fromPercent(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercent("", {});
    assert.strictEqual(bs0.count, 0);

  });

});
