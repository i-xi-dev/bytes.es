import assert from "node:assert";
import { ByteSequence } from "../../../node.mjs";

describe("ByteSequence.prototype.toBase64", () => {
  const bs0 = ByteSequence.create(0);

  it("toBase64()", () => {
    const s1 = bs0.toBase64();
    assert.strictEqual(s1.length, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  it("toBase64(ByteEncodingOptions)", () => {
    const s1 = bs0.toBase64({});
    assert.strictEqual(s1.length, 0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
