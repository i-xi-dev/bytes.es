import { ByteSequence } from "../../../dist/data/byte_sequence.js";

describe("ByteSequence.prototype.toSha256", () => {
  const bs0 = ByteSequence.create(0);

  test("toSha256()", async () => {
    const s1 = await bs0.toSha256();
    expect(s1.format()).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
