import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toSha256", () => {
  const bs0 = ByteSequence.create(0);

  it("toSha256()", async () => {
    const s1 = await bs0.toSha256();
    assert.strictEqual(s1.format(), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
