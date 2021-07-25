import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromBase64", () => {
  test("fromBase64(string)", () => {
    const bs0 = ByteSequence.fromBase64("");
    expect(bs0.count).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("fromBase64(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromBase64("", {});
    expect(bs0.count).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
