import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toBase64", () => {
  const bs0 = ByteSequence.create(0);

  test("toBase64()", () => {
    const s1 = bs0.toBase64();
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("toBase64(ByteEncodingOptions)", () => {
    const s1 = bs0.toBase64({});
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
