import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toPercentEncoded", () => {
  const bs0 = ByteSequence.create(0);

  test("toPercentEncoded()", () => {
    const s1 = bs0.toPercentEncoded();
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("toPercentEncoded(ByteEncodingOptions)", () => {
    const s1 = bs0.toPercentEncoded({});
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
