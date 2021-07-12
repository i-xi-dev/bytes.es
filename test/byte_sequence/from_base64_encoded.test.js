import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromBase64Encoded", () => {
  test("fromBase64Encoded(string)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("");
    expect(bs0.count).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("fromBase64Encoded(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromBase64Encoded("", {});
    expect(bs0.count).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
