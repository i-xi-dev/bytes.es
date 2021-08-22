import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromBase64", () => {
  it("fromBase64(string)", () => {
    const bs0 = ByteSequence.fromBase64("");
    assert.strictEqual(bs0.count, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  it("fromBase64(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromBase64("", {});
    assert.strictEqual(bs0.count, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
