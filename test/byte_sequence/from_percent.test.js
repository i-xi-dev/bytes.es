import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromPercent", () => {
  test("fromPercent(string)", () => {
    const bs1 = ByteSequence.fromPercent("");
    expect(bs1.count).toBe(0);

    const bs2 = ByteSequence.fromPercent("%03");
    expect(bs2.view()[0]).toBe(0x03);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("fromPercent(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromPercent("", {});
    expect(bs0.count).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
