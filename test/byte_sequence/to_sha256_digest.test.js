import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toSha256Digest", () => {
  const bs0 = ByteSequence.create(0);

  test("toSha256Digest()", async () => {
    const s1 = await bs0.toSha256Digest();
    expect(s1.format()).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
