import assert from "node:assert";
import { ByteSequence } from "../../../node.mjs";

describe("ByteSequence.prototype.toPercent", () => {
  const bs0 = ByteSequence.create(0);

  it("toPercent()", () => {
    const s1 = bs0.toPercent();
    assert.strictEqual(s1.length, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  it("toPercent(ByteEncodingOptions)", () => {
    const s1 = bs0.toPercent({});
    assert.strictEqual(s1.length, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
