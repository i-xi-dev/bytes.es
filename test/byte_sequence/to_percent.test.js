import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toPercent", () => {
  const bs0 = ByteSequence.create(0);

  test("toPercent()", () => {
    const s1 = bs0.toPercent();
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("toPercent(ByteEncodingOptions)", () => {
    const s1 = bs0.toPercent({});
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
