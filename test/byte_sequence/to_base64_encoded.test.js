import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toBase64Encoded", () => {
  const bs0 = ByteSequence.create(0);

  test("toBase64Encoded()", () => {
    const s1 = bs0.toBase64Encoded();
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("toBase64Encoded(ByteEncodingOptions)", () => {
    const s1 = bs0.toBase64Encoded({});
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
