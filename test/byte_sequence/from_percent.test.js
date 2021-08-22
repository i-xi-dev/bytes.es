import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromPercent", () => {
  it("fromPercent(string)", () => {
    const bs1 = ByteSequence.fromPercent("");
    assert.strictEqual(bs1.count, 0);

    const bs2 = ByteSequence.fromPercent("%03");
    assert.strictEqual(bs2.view()[0], 0x03);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  it("fromPercent(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercent("", {});
    assert.strictEqual(bs0.count, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
